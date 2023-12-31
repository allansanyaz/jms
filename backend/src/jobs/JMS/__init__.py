from django.conf import settings
from django.db import transaction
from pathlib import Path
from importlib import import_module

import sys
import django
django.setup()

from django.contrib.auth.models import User, Group
from jobs.models import *

sys.path.append("..")
from jobs.JMS.CRUD import Tools, ToolVersions, Categories, Parameters
from jobs.JMS.CRUD import ParameterOptions, FileTypes, ExpectedOutputs, Resources
from jobs.JMS.CRUD import Workflows, WorkflowVersions, Stages, StageParameters
from jobs.JMS.CRUD import StageDependencies, Jobs, JobStages, JobStageDataSections
from jobs.JMS.CRUD import JobStageDataFields, JobPermissions

from jobs.JMS.helpers import *
from jobs.JMS.resource_managers import objects

from utilities.io.filesystem import *
 
from multiprocessing.pool import ThreadPool
import shutil, json, requests, traceback, sys

import shutil, json, requests, traceback, sys

#dynamically import the resource manager module
module_name = settings.JMS_SETTINGS["resource_manager"]["name"]
module = import_module(f"jobs.JMS.resource_managers.{module_name}")
#module = __import__('jobs.JMS.resource_managers.openpbs',  fromlist=[module_name])
#get the resource manager class from the module
#ResourceManager = getattr(module, module_name)

ResourceManager = module.torque #TODO: generalise name for scheduler, then replace with previous line
print(ResourceManager)

class JobManager:
    
    def __init__(self, user=None):
        self.user = user
        # BASE_DIR is the JMS project src directory
        self.project_dir = settings.BASE_DIR
        # base_dir is a shared directory creaded for all users
        self.base_dir = settings.JMS_SETTINGS["JMS_shared_directory"]
        self.temp_dir = os.path.join(self.base_dir, "tmp/")
        
        if self.user:
            # The following job directory strings are prepared if the user exists
            self.users_dir = os.path.join(self.base_dir, "users/")
            self.user_dir = os.path.join(self.users_dir, self.user.username)
            self.jobs_dir = os.path.join(self.user_dir, "jobs/")
    
    def RunUserProcess(self, cmd, expect="prompt",
                       sudo=False, user=None):
        """
        Makes a POST request to run a user process
        Inputs:
            cmd: A string containing a bash command
            expect: ?
            sudo: Does the user have sudo proviliges
            user: A string in the form "user:password"
        Returns:
            The command STDOUT as a text response from the POST request
        """
        if not user:
            user = self.user
        
        payload = "%s\n%s\n%s\n%s" % (user.filemanagersettings.ServerPass, cmd, expect, str(sudo))
        #File.print_to_file("/tmp/files.txt", payload, permissions=0777)
        port = settings.JMS_SETTINGS["impersonator"]["port"]
        r = requests.post(f"http://127.0.0.1:{port}/impersonate", data=payload)
        #File.print_to_file("/tmp/files.txt", payload, mode="a", permissions=0777)
        return r.text
    
    
    #with web server permissions
    def make_tool_directory(self, tool_id, version):
        tool_dir = os.path.join(self.base_dir, "tools/")
        path = os.path.join(tool_dir, f"{tool_id}/{version}")
        Directory.create_directory(path, permissions=0o700)
        return path
    
    
    #with web server permissions
    def make_workflow_directory(self, workflow_id, version):
        workflow_dir = os.path.join(self.base_dir, "workflows/")
        path = os.path.join(workflow_dir, f"{workflow_id}/{version}")
        Directory.create_directory(path, permissions=0o775)
        return path
    
    
    #with user permissions
    def make_data_directory(self):
        data_dir = os.path.join(self.user_dir, "data")
        cmd = f"mkdir -p {data_dir}"
        self.RunUserProcess(cmd)
        return data_dir
    
    
    #with user permissions
    def make_job_directory(self, job_id):
        path = os.path.join(self.jobs_dir, str(job_id))
        cmd = f"mkdir -p {path}"
        self.RunUserProcess(cmd)
        return path
    
    
    #with web server permissions
    def make_tmp_directory(self , job_id=""):
        path = os.path.join(self.temp_dir, f".{self.user.username}", str(job_id))
        Directory.create_directory(path, permissions=0o777)
        return path
    
    
    def get_job_output(self, job_stage_id):
        stage = JobStages.GetJobStageByID(self.user, job_stage_id)
        if stage.OutputLog != '':
            data = self.RunUserProcess(f"cat {stage.OutputLog}", 
                user=stage.Job.User)
            return data
        else:
            return "Output not available"
    
    
    def get_job_error(self, job_stage_id):
        stage = JobStages.GetJobStageByID(self.user, job_stage_id)
        if stage.ErrorLog != '':
            data = self.RunUserProcess(f"cat {stage.ErrorLog}", 
                user=stage.Job.User)
            return data
        else:
            return "Output not available"
    
    
    def get_tmp_job_file(self, job_stage_id, path):
        #create a tmp file in an accessible area and return the path
        filename = os.path.basename(path)
        tmp_dir = self.make_tmp_directory()
        tmp_path = os.path.join(tmp_dir, filename)
        
        stage = JobStages.GetJobStageByID(self.user, job_stage_id)
        filepath = path.lstrip("/")
        
        if not filepath.startswith("/"):
            
            abspath = os.path.join(stage.WorkingDirectory, filepath)
            
            cmd = "%s/venv/bin/python %s/manage.py acl CREATE_TEMP_FILE %s %s" % (
                self.project_dir, self.project_dir, abspath, tmp_path) 
            
            out = self.RunUserProcess(cmd, user=stage.Job.User)
            
            if not out.startswith("ERROR:\n\n"):
                return tmp_path
            else:
                raise Exception(out)
        else:
            raise Exception("Bad path.")
    
    def get_job_directory_listing(self, job_stage_id, directory):
        stage = JobStages.GetJobStageByID(self.user, job_stage_id)
        pd = self.project_dir
        swd = stage.WorkingDirectory
        dc = directory
        command = f"{pd}/venv/bin/python {pd}/manage.py acl GET_DIR {swd} {dc}" 
        return self.RunUserProcess(command, user=stage.Job.User)
    
    def GetDashboard(self):
        r = ResourceManager(self.user)
        return r.GetDashboard()
    
    def GetSettings(self):
        r = ResourceManager(self.user)
        return r.GetSettings()
    
    def UpdateSettings(self, settings_sections_dict):
        r = ResourceManager(self.user)
        settings_sections = parse_settings_sections_dict(settings_sections_dict)
        r.UpdateSettings(settings_sections)
        return r.GetSettings()
    
    def GetNodes(self):
        r = ResourceManager(self.user)
        return r.GetNodes()
    
    def AddNode(self, node_dict):
        r = ResourceManager(self.user)
        node = parse_node_dict(node_dict)
        r.AddNode(node)
        return r.GetNodes()
    
    def UpdateNode(self, node_dict):
        r = ResourceManager(self.user)
        node = parse_node_dict(node_dict)
        r.UpdateNode(node)
        return r.GetNodes()
    
    def DeleteNode(self, id):
        r = ResourceManager(self.user)
        r.DeleteNode(id)
        return r.GetNodes()
    
    def GetAdministrators(self):
        r = ResourceManager(self.user)
        return r.GetAdministrators()
    
    def AddAdministrator(self, admin_dict):
        r = ResourceManager(self.user)
        r.AddAdministrator(admin_dict["AdministratorName"])
    
    def UpdateAdministrator(self, admin_dict):
        r = ResourceManager(self.user)
        administrator = parse_admin_dict(admin_dict)
        r.UpdateAdministrator(administrator)
    
    def DeleteAdministrator(self, admin_name):
        r = ResourceManager(self.user)
        r.DeleteAdministrator(admin_name)
    
    def GetQueues(self):
        r = ResourceManager(self.user)
        return r.GetQueues()
    
    def AddQueue(self, queue_name):
        r = ResourceManager(self.user)
        r.AddQueue(queue_name)
    
    def DeleteQueue(self, queue_name):
        r = ResourceManager(self.user)
        r.DeleteQueue(queue_name)
    
    def UpdateQueue(self, queue_dict):
        r = ResourceManager(self.user)
        queue = parse_queue_dict(queue_dict)
        r.UpdateQueue(queue)
    
    def GetDefaultResources(self):
        r = ResourceManager(self.user)
        return r.GetDefaultResources()
    
    def GetCategories(self):
        categories = Categories.GetCategories()
        return categories
    
    def AddCategory(self, category_name):
        category = Categories.AddCategory(self.user, category_name)
        return category
    
    def DeleteCategory(self, category_id):
        Categories.DeleteCategory(self.user, category_id)
    
    def UpdateCategory(self, category_id, category_name):
        category = Categories.UpdateCategory(self.user, category_id, 
            category_name)
        return category
    
    def GetTools(self):
        tools = Tools.GetTools(self.user)
        return tools
    
    def GetTool(self, tool_id):
        return Tools.GetTool(self.user, tool_id)
    
    def AddTool(self, tool):
        with transaction.atomic():
            #create the tool
            tool = Tools.AddTool(self.user, tool["ToolName"], 
                tool["Category"], tool["ToolDescription"], False)
            
            #create the development tool version
            toolversion = ToolVersions.AddToolVersion(self.user, tool, "dev", 
                tool.ToolDescription, "")
            
            self.make_tool_directory(tool.ToolID, toolversion.ToolVersionNum)
        
        return toolversion
    
    def DeleteTool(self, tool_id):
        Tools.DeleteTool(self.user, tool_id)
    
    def UpdateTool(self, tool_id, version):
        tool = self.GetTool(tool_id)
        with transaction.atomic():
            #update tool details
            tool_details = version["Tool"]
            tool = Tools.UpdateTool(self.user, tool, 
                ToolName=tool_details["ToolName"], 
                CategoryID=tool_details["CategoryID"],
                ToolDescription=version["ShortDescription"]
            )
            
            #update version details
            tool_version = self.GetToolVersion(tool, "dev")
            tool_version = ToolVersions.UpdateToolVersion(self.user,
                tool_version, version["ShortDescription"], 
                version["LongDescription"], version["Command"]
            )
            
            #update parameters
            for i, p in enumerate(version["Parameters"]):
                parameter = self.UpdateParameter(p, i)
            
            #update/add expected outputs
            for o in version["ExpectedOutputs"]:
                if o["ExpectedOutputID"]:
                    self.UpdateExpectedOutput(o)
                else:
                    self.AddExpectedOutput(tool, o)
            
            #update/add default resources
            Resources.UpdateResources(self.user, tool_version, 
                settings.JMS_SETTINGS["resource_manager"]["name"],
                version["Resources"]
            )
            
        return tool
    
    def UpdateToolAvailability(self, tool_id, publicInd):
        tool = self.GetTool(tool_id)
        return Tools.UpdateAvailability(self.user, tool, publicInd)
    
    def GetToolVersions(self, tool_id):
        tool = self.GetTool(tool_id)
        return ToolVersions.GetToolVersions(tool)
    
    def GetToolVersion(self, tool, version_num):
        return ToolVersions.GetToolVersion(tool, version_num)
    
    def GetToolVersionByID(self, version_id):
        return ToolVersions.GetToolVersionByID(self.user, version_id)

    def PublishTool(self, tool_id, version_nums):
        tool = self.GetTool(tool_id)
        
        version_num = "%s.%s.%s" % (version_nums['Major'],version_nums['Minor'],
            version_nums['Patch'])
            
        with transaction.atomic():
            #copy the development tool version
            dev = ToolVersions.GetDevelopmentVersion(tool)
            new = ToolVersions.PublishToolVersion(self.user, dev, version_num)
            
            #copy dev scripts and files to new version
            dev_dir = os.path.join(self.base_dir, "tools/%s/dev" % str(tool_id))
            new_dir = os.path.join(self.base_dir, "tools/%s/%s" % (str(tool_id),
                new.ToolVersionNum))
            Directory.copy_directory(dev_dir, new_dir, 0o755)
            
            #copy parameters
            Parameters.CopyParameters(self.user, dev, new)
            
            #copy outputs
            ExpectedOutputs.CopyOutputs(self.user, dev, new)
            
            #copy default resources
            Resources.CopyResources(self.user, dev, new)
        
        return new
    
    def RevertToolVersion(self, tool_id, version_num):
        tool = self.GetTool(tool_id)
            
        with transaction.atomic():
            dev = ToolVersions.GetDevelopmentVersion(tool)
            ver = ToolVersions.GetToolVersion(tool, version_num)
            
            #set development version details to old details
            dev.ShortDescription = ver.ShortDescription
            dev.LongDescription = ver.LongDescription
            dev.save()
            
            #delete development parameters and replace with old parameters
            Parameters.DeleteParameters(self.user, dev)
            Parameters.CopyParameters(self.user, ver, dev)
            
            #delete development outputs and replace with old outputs
            ExpectedOutputs.DeleteOutputs(self.user, dev)
            ExpectedOutputs.CopyOutputs(self.user, ver, dev)
            
            #delete development outputs and replace with old outputs
            Resources.DeleteResources(self.user, dev)
            Resources.CopyResources(self.user, ver, dev)
            
            #delete development scripts and files and replace with old
            dev_dir = os.path.join(self.base_dir, "tools/%s/dev" % str(tool_id))
            ver_dir = os.path.join(self.base_dir, "tools/%s/%s" % (str(tool_id),
                ver.ToolVersionNum))
            
            shutil.rmtree(dev_dir)
            Directory.copy_directory(ver_dir, dev_dir, 0o755)
        
        return dev
    
    def GetRootParameters(self, tool_id):
        tool = self.GetTool(tool_id)
        return Parameters.GetRootParameters(tool)
    
    def GetParameter(self, parameter_id, with_children=True):
        if with_children:
            return Parameters.GetParameterAndChildren(self.user, parameter_id)
        else:
            return Parameters.GetParameter(self.user, parameter_id)
    
    def AddParameter(self, tool_id, parameter_name, parent_id=None):
        tool = Tools.GetTool(self.user, tool_id)
        return Parameters.AddParameter(self.user, tool, parameter_name, parent_id)
    
    def DeleteParameter(self, parameter_id):
        Parameters.DeleteParameter(self.user, parameter_id)
    
    def UpdateParameter(self, parameter, index):
        if parameter["DeleteInd"]:
            self.DeleteParameter(parameter["ParameterID"])
        else:
            param = self.GetParameter(parameter["ParameterID"], with_children=False)
            
            Parameters.UpdateParameter(self.user, param, parameter["ParameterName"], 
                parameter["Context"], parameter["InputBy"], parameter["Value"],
                parameter["Multiple"], parameter["ParameterType"], 
                parameter["Delimiter"], parameter["Optional"], index)
            
            #update parameter options
            for option in parameter["ParameterOptions"]:
                option_id = option["ParameterOptionID"]
                
                if option_id == 0:
                    #this is a new option
                    ParameterOptions.AddParameterOption(self.user, param,
                        option["ParameterOptionText"], 
                        option["ParameterOptionValue"]
                    )
                else:
                    #this is an existing option
                    if option["DeleteInd"]:
                        ParameterOptions.DeleteParameterOption(self.user, param,
                            option_id)
                    else:
                        ParameterOptions.UpdateParameterOption(self.user, param, 
                            option_id, option["ParameterOptionText"], 
                            option["ParameterOptionValue"]
                        )
            
            #update sub parameters
            for i, p in enumerate(parameter["parameters"]):
                if not p["ParameterID"]:
                    #this is a new parameter
                    sub_param = self.AddParameter(param.ToolVersion.Tool.ToolID, 
                        p["ParameterName"], param.ParameterID)
                    
                    p["ParameterID"] = sub_param.ParameterID
                
                self.UpdateParameter(p, i)
            
            return param
    
    def UpdateExpectedOutput(self, output):
        if output["DeleteInd"]:
            ExpectedOutputs.DeleteExpectedOutput(self.user, 
                output["ExpectedOutputID"])
        else:
            ExpectedOutputs.UpdateExpectedOutput(self.user, 
                output["ExpectedOutputID"], output["OutputName"],
                output["FileName"], output["FileTypeID"])
    
    def AddExpectedOutput(self, tool, output):
        ExpectedOutputs.AddExpectedOutput(self.user, tool, output["OutputName"],
            output["FileName"], output["FileTypeID"])

    def GetFileTypes(self):
        return FileTypes.GetFileTypes()
    
    def AddFileType(self, name):
        return FileTypes.AddFileType(self.user, name)
    
    def GetToolFiles(self, tool_id):
        path = self.make_tool_directory(int(tool_id), "dev")
        return Tools.GetFileList(self.user, tool_id, path)
    
    def UploadToolFiles(self, tool_id, file_dict):
        path = self.make_tool_directory(int(tool_id), "dev")
        return Tools.UploadFiles(self.user, tool_id, path, file_dict)
    
    def SaveToolFile(self, tool_id, filename, content):
        tool_dir = self.make_tool_directory(int(tool_id), "dev")
        path = os.path.join(tool_dir, filename)
        Tools.SaveFile(self.user, tool_id, path, content)
    
    def CreateToolFile(self, tool_id, filename):
        path = os.path.join(self.base_dir, "tools/%s/dev/%s" % (tool_id, filename))
        Tools.CreateFile(self.user, tool_id, path)
    
    def ReadToolFile(self, tool_id, filename):
        path = os.path.join(self.base_dir, "tools/%s/dev/%s" % (tool_id, filename))
        return Tools.ReadFile(self.user, tool_id, path)
    
    def DeleteToolFile(self, tool_id, filename):
        path = os.path.join(self.base_dir, "tools/%s/dev/%s" % (tool_id, filename))
        Tools.DeleteFile(self.user, tool_id, path)
    
    def ShareTool(self, tool_id, user_name, permissions):
        tool = self.GetTool(tool_id)
        user = User.objects.get(username=user_name)
        
        Tools.ShareTool(self.user, tool, user, Run=permissions["Run"], 
            Export=permissions["Export"], Publish=permissions["Publish"], 
            Edit=permissions["Edit"], Admin=permissions["Admin"]
        )
    
    def UnshareTool(self, tool_id, user_name):
        tool = self.GetTool(tool_id)
        user = User.objects.get(username=user_name)
        Tools.UnshareTool(self.user, tool, user)
    
    def GetWorkflows(self, ):
        return Workflows.GetWorkflows(self.user)
    
    def GetWorkflow(self, workflow_id):
        return Workflows.GetWorkflow(self.user, workflow_id)
    
    def AddWorkflow(self, workflow):
        with transaction.atomic():
            #create the workflow
            w = Workflows.AddWorkflow(self.user, workflow["WorkflowName"], 
                workflow["Category"], workflow["Description"], False)
            
            #create the development workflow version
            version = WorkflowVersions.AddWorkflowVersion(self.user, w, 
                "dev",  workflow["Description"], "")
        
        return version
    
    def DeleteWorkflow(self, workflow_id):
        Workflows.DeleteWorkflow(self.user, workflow_id)
    
    def UpdateWorkflow(self, workflow_id, workflow):
        with transaction.atomic():
            w = Workflows.UpdateWorkflow(self.user, workflow_id, workflow["WorkflowName"], 
                workflow["Category"], workflow["ShortDescription"])
            
            version = self.GetWorkflowVersion(w, 'dev')
            version = WorkflowVersions.UpdateWorkflowVersion(self.user, version, 
                workflow["ShortDescription"], workflow["LongDescription"])
        
        return w
    
    def PublishWorkflow(self, workflow_id, version_nums):
        workflow = self.GetWorkflow(workflow_id)
        
        version_num = "%s.%s.%s" % (version_nums['Major'],version_nums['Minor'],
            version_nums['Patch'])
        '''    
        with transaction.atomic():
            #copy the development tool version
            dev = ToolVersions.GetDevelopmentVersion(tool)
            new = ToolVersions.PublishToolVersion(self.user, dev, version_num)
            
            #copy dev scripts and files to new version
            dev_dir = os.path.join(self.base_dir, "tools/%s/dev" % str(tool_id))
            new_dir = os.path.join(self.base_dir, "tools/%s/%s" % (str(tool_id),
                new.ToolVersionNum))
            Directory.copy_directory(dev_dir, new_dir, 0755)
            
            #copy parameters
            Parameters.CopyParameters(self.user, dev, new)
            
            #copy outputs
            ExpectedOutputs.CopyOutputs(self.user, dev, new)
            
            #copy default resources
            Resources.CopyResources(self.user, dev, new)
        '''
        return new
    
    
    def RevertWorkflowVersion(self, workflow_id, version_nums):
        pass
    
    def GetWorkflowVersions(self, workflow_id):
        workflow = self.GetWorkflow(workflow_id)
        return WorkflowVersions.GetWorkflowVersions(workflow)
    
    def GetWorkflowVersion(self, workflow, version_num):
        return WorkflowVersions.GetWorkflowVersion(workflow, version_num)
    
    def GetWorkflowVersionByID(self, version_id):
        return WorkflowVersions.GetWorkflowVersionByID(self.user, version_id)
    
    def ShareWorkflow(self, workflow_id, user_name, permissions):
        workflow = self.GetWorkflow(workflow_id)
        user = User.objects.get(username=user_name)
        
        Workflows.ShareWorkflow(self.user, workflow, user, Run=permissions["Run"], 
            Export=permissions["Export"], Publish=permissions["Publish"], 
            Edit=permissions["Edit"], Admin=permissions["Admin"]
        )
    
    def UnshareWorkflow(self, workflow_id, user_name):
        workflow = self.GetWorkflow(workflow_id)
        user = User.objects.get(username=user_name)
        Workflows.UnshareWorkflow(self.user, workflow, user)
    
    def UpdateWorkflowAvailability(self, worfklow_id, publicInd):
        workflow = self.GetWorkflow(worfklow_id)
        return Workflows.UpdateAvailability(self.user, workflow, publicInd)
    
    def GetStages(self, workflow_id, version_num):
        workflow = self.GetWorkflow(workflow_id)
        version = self.GetWorkflowVersion(workflow, version_num)
        return Stages.GetStages(version)
    
    def AddStage(self, workflow_id, stage):
        workflow = self.GetWorkflow(workflow_id)
        version = self.GetWorkflowVersion(workflow, "dev")
        
        tool = self.GetTool(stage["ID"])
        tool_version = self.GetToolVersion(tool, stage["VersionNum"])
        
        return Stages.AddStage(self.user, version, tool_version, None, False,
            stage["Left"], stage["Top"])
    
    def GetStage(self, stage_id):
        return Stages.GetStage(self.user, stage_id)
    
    def MoveStage(self, stage_id, stage_pos):
        stage = self.GetStage(stage_id)
        
        return Stages.MoveStage(self.user, stage, stage_pos['Left'], 
            stage_pos['Top'])
    
    def DeleteStage(self, stage_id):
        stage = self.GetStage(stage_id)
        Stages.DeleteStage(self.user, stage)
    
    def UpdateStage(self, stage_id, stage_details):
        with transaction.atomic():
            stage = self.GetStage(stage_id)
            tool = stage.ToolVersion.Tool
            version = self.GetToolVersion(tool, stage_details["VersionNum"])
            
            stage = Stages.UpdateStage(self.user, stage, version, None,
                stage_details["Checkpoint"])
            
            StageParameters.UpdateStageParameters(self.user, stage,
                stage_details["StageParameters"])
        return stage
    
    def AddStageDependency(self, stage_id, dependency):
        with transaction.atomic():
            stage = self.GetStage(stage_id)
        
            stage_dependency = StageDependencies.AddStageDependency(self.user, 
                stage, dependency['DependantOn'], dependency['Condition'], 
                dependency['ExitCodeValue'])
            
            Stages.UpdateStageLevel(stage)
        return stage_dependency
    
    def UpdateStageDependency(self, dependency_id, dependency):
        dep = StageDependencies.GetStageDependency(self.user, dependency_id)
        
        return StageDependencies.UpdateStageDependency(self.user, dep,
            dependency["Condition"], dependency["ExitCodeValue"])
    
    def DeleteStageDependency(self, dependency_id):
        with transaction.atomic():
            dep = StageDependencies.GetStageDependency(self.user, dependency_id)
            StageDependencies.DeleteStageDependency(self.user, dep)
            
            Stages.UpdateStageLevel(dep.StageOI)
        return self.GetStages(dep.StageOI.WorkflowVersion.Workflow.WorkflowID, 
            "dev")
    
    def SetupJobDirectory(self, jobstage, files, sid):
        """
        Sets up the job directory for a user
        Inputs:
            self: The <JobManager> object
            jobstage: <JobStage> object
            files: A list of files attached to the job
            sid: Stage ID <int>
        Returns:
            The absolute path to the job script <string>
        """
        print("SETUPJOBDIR") 
        job = jobstage.Job
        basedir = self.project_dir
        jsid = jobstage.JobStageID
        
        #create temp job stage directory
        tmp_dir = self.make_tmp_directory(jsid)
        
        with open("/tmp/dirs.txt", "w") as f:
            print(tmp_dir, file=f)
            print(jobstage.WorkingDirectory, file=f)
        
        #upload files to temp directory
        for f in files:
            with open(os.path.join(tmp_dir, f.name), 'wb+') as destination:
                for chunk in f.chunks():
                    destination.write(chunk)
            os.chmod(os.path.join(tmp_dir, f.name), 0o775)
        
        #copy tool files to temp directory
        if job.JobTypeID == 2:
            tool_directory = os.path.join(self.base_dir, "tools/%s/%s" % (
                job.ToolVersion.Tool.ToolID, job.ToolVersion.ToolVersionNum ))
            Directory.copy_directory(tool_directory, tmp_dir)
        elif job.JobTypeID == 3:
            tool_directory = os.path.join(self.base_dir, "tools/%s/%s" % (
                jobstage.Stage.ToolVersion.Tool.ToolID, 
                jobstage.Stage.ToolVersion.ToolVersionNum 
            ))
            Directory.copy_directory(tool_directory, tmp_dir)
        #spawn process as user to create job directory with correct permissions
        #command = f"{basedir}/venv/bin/python {basedir}/manage.py jobs_acl setup_job {jsid} {sid}" 
        command = f"cd {basedir} && ./venv/bin/python manage.py jobs_acl setup {jsid} {sid}"
        # job_dir = self.RunUserProcess(command)
        job_file = self.RunUserProcess(command)
        
        #return path to job script
        # return os.path.join(job_dir, 'job.sh')
        return job_file
    
    def CreateJob(self, job_name, description, JobTypeID,
                  ToolVersion=None, WorkflowVersion=None,
                  NotificationMethod=None,
                  NotificationURL=None,
                  NotificationEmail=None):
        return Jobs.AddJob(User=self.user,
                JobName=job_name, 
                Description=description,
                ToolVersion=ToolVersion, 
                WorkflowVersion=WorkflowVersion,
                JobTypeID=JobTypeID, 
                NotificationMethod=NotificationMethod,
                NotificationURL=NotificationURL,
                NotificationEmail=NotificationEmail)
    
    def RunCustomJob(self, job, commands, parsed_settings, files):
        with transaction.atomic():
            jobstage = JobStages.AddJobStage(self.user, job,
                                             Commands=commands)
            
            #determine job directory
            job_dir = os.path.join(settings.JMS_SETTINGS["JMS_shared_directory"],
                f"users/{self.user}/jobs/{jobstage.Job.JobID}"
            )
            
            jobstage.WorkingDirectory = job_dir
            jobstage.OutputLog = os.path.join(job_dir, "logs/output.log")
            jobstage.ErrorLog = os.path.join(job_dir, "logs/error.log")
                
            # parsed_settings is a collection of dictionaries
            for s in parsed_settings:
                #move to data layer
                jsr = JobStageResource.objects.create(
                    ResourceManager=module_name, JobStage=jobstage, Key=s["Key"], 
                    Value=s["Value"], Label=s["Label"]
                )
            
            jobstage.save()
            
        #create job directory
        job_script = self.SetupJobDirectory(jobstage, files, 0)
        r = ResourceManager(self.user)
        cluster_id = r.ExecuteJobScript(job_script)
        with open("/tmp/cluster_id.txt", 'w') as f:
            print(cluster_id, file=f)

        jobstage.ClusterJobID = cluster_id.strip()
        jobstage.save()
        
        j = r.GetJob(jobstage.ClusterJobID)
        JobData = json.dumps(j.DataSections, default=lambda o: o.__dict__, 
            sort_keys=True)
        jobstage = JobStages.UpdateJobStage(jobstage, j.Status, 
            j.ExitCode, j.OutputLog, j.ErrorLog, 
            j.WorkingDir, JobData)
            
        return jobstage
    
    def RunToolJob(self, job, user_parameters, files=[], stage=None, 
        stage_index=0):
        
        with transaction.atomic():
            #create db entries
            jobstage = JobStages.AddJobStage(self.user, job, Stage=stage)
            
            stage_dir = ""
            
            if job.JobTypeID == 2:
                version = job.ToolVersion
            elif job.JobTypeID == 3:
                version = stage.ToolVersion
                stage_dir = str(stage.StageID)
                stage_parameters = stage.StageParameters.all()
            
            #determine job directory
            job_dir = os.path.join(settings.JMS_SETTINGS["JMS_shared_directory"],
                "users/%s/jobs/%d/%s" % (self.user, jobstage.Job.JobID, stage_dir)
            )
            
            jobstage.WorkingDirectory = job_dir
            jobstage.OutputLog = os.path.join(job_dir, "logs/output.log")
            jobstage.ErrorLog = os.path.join(job_dir, "logs/error.log")
            
            #generate command for tool script
            command = version.Command
            
            #append parameters to command
            #TODO: move database call to bottom tier
            parameters = version.ToolParameters.all()
            
            params = ""
            for param in parameters:
                #only add root parameters
                if param.ParentParameter == None:
                    p = param.Context
                    val = param.Value
                    
                    if param.InputBy == "user":
                        for up in user_parameters:
                            if up["ParameterID"] == param.ParameterID:
                                val = up["Value"]
                    
                    #If parameter value comes from a previous stage, fetch the value
                    if jobstage.Stage != None:
                        try:
                            stage_parameter = stage_parameters.get(
                                Parameter__ParameterID=param.ParameterID
                            )
                            
                            if stage_parameter.StageParameterType == 1:
                                val = stage_parameter.Value
                            elif stage_parameter.StageParameterType == 2:
                                try:
                                    val = JobStageParameter.objects.get(JobStage__Job=job, Parameter_id=stage_parameter.Value).Value
                                except Exception as ex:
                                    with open("/tmp/jobstageparameter.txt", 'w') as f:
                                        print(traceback.format_exc(), file=f)
                                    
                            elif stage_parameter.StageParameterType == 3:
                                val = ExpectedOutput.objects.get(ExpectedOutputID=stage_parameter.Value).FileName
                                
                        except Exception as ex:
                            pass
                    if val:
                        JobStageParameter.objects.create(JobStage=jobstage, Parameter=param,
                            ParameterName=param.ParameterName, Value=val)
                    
                    if param.ParameterType.ParameterTypeID != 3 and len(str(val)) > 0:
                        try:
                            #check if the ${VALUE} variable is located in the string
                            num = p.index("${VALUE}")
                            p = p.replace("${VALUE}", str(val))
                        except Exception as e:
                            #if the ${VALUE} variable is not located in the string, append the value to the end
                            #File.print_to_file("/tmp/file.txt", str(e) + ": " + p)
                            p += " %s" % val                
                        
                        params += ' %s' % p
                    
                    elif param.ParameterType.ParameterTypeID == 3:
                        params += ' %s' % p
                
            command += params
            
            jobstage.Commands = command
            
            #Get resources for tool version
            #TODO: user customized resources
            resources = Resources.GetResources(self.user, version, module_name)
            for resource in resources:
                #move to data layer
                jsr = JobStageResource.objects.create(ResourceManager=module_name, 
                    JobStage=jobstage, Key=resource.Key, Value=resource.Value,
                    Label=resource.Label)
            
            jobstage.save()
            
        job_script = self.SetupJobDirectory(jobstage, files, stage_index)
        
        r = ResourceManager(self.user)
        cluster_id = r.ExecuteJobScript(job_script)
        with open("/tmp/job_id.txt", 'w') as f:
            print(job_script, file=f) 
            print(cluster_id, file=f)
        
        jobstage.ClusterJobID = cluster_id.strip()
        jobstage.save()
        
        j = r.GetJob(jobstage.ClusterJobID)
        JobData = json.dumps(j.DataSections, default=lambda o: o.__dict__, 
            sort_keys=True)
        jobstage = JobStages.UpdateJobStage(jobstage, j.Status, 
            j.ExitCode, j.OutputLog, j.ErrorLog, 
            j.WorkingDir, JobData)
        
        return jobstage
    
    def RunWorkflowJob(self, job, stages, files):
        stage_levels = {}
        executed_stages = {}
        
        #create job stages
        for i, s in enumerate(stages):
            stage = Stages.GetStage(self.user, s["StageID"])
            
            if not stage_levels.get(stage.StageLevel):
                stage_levels[stage.StageLevel] = []
            
            stage_obj = { "stage": stage, "parameters": s["Parameters"] }
            stage_levels[stage.StageLevel].append(stage_obj)
        
        for stages in sorted(stage_levels):
            for s in stage_levels[stages]:
                stage = s["stage"]
                parameters = s["parameters"]
                
                jobstage = self.RunToolJob(job, parameters, files.get("stage_%d" % stage.StageID, []), stage, i)
                
                executed_stages[stage.StageID] = jobstage.JobStageID
            
                for dep in jobstage.Stage.StageDependencies.all():
                    JobStageDependency.objects.create(
                        JobStageOI=jobstage,
                        DependantOn_id=executed_stages[dep.DependantOn.StageID],
                        Condition_id=dep.Condition.ConditionID,
                        ExitCodeValue=dep.ExitCodeValue
                    )

    def GetClusterJob(self, id):
        r = ResourceManager(self.user)
        return r.GetJob(id)
    
    def GetJobs(self, start=0, end=300):
        return Jobs.GetJobs(self.user)[start:end]
    
    def GetJob(self, job_id):
        return Jobs.GetJob(self.user, job_id)
    
    def GetJobByClusterJobID(self, id):
        return JobStages.GetJobStageByClusterID(self.user, id).Job
    
    def FilterJobsByParameter(self, filters):
        return Jobs.FilterJobsByParameter(self.user, filters)
    
    def StopJob(self, job):
        if JobPermissions.CanAdministrate(self.user, job):
            for s in job.JobStages.all():
                self.StopClusterJob(s.ClusterJobID, job.User)
        else:
            raise PermissionDenied
    
    def StopClusterJob(self, cluster_job_id, user=None):
        if not user:
            user = self.user
        
        r = ResourceManager(user)
        r.KillJob(cluster_job_id)
    
    def DeleteJob(self, job):
        if JobPermissions.CanAdministrate(self.user, job):
            self.StopJob(job)
            Jobs.DeleteJob(job)
        else:
            raise PermissionDenied
    
    def RepeatJob(self, job):
        pass
    
    def Share(self, job, user_name):
        user = User.objects.get(username=user_name)
        
        Jobs.Share(self.user, job, user, 
            Repeat=permissions["Repeat"], 
            Admin=permissions["Admin"]
        )
    
    def UpdateJobStatus(self, job):
        
        #if job.JobStages.filter(Status_id__lt=4).count() == 0:
            #if there are no jobstages in job with status < 4, the job must be complete
            
                
        #elif job.JobStages.filter(Status_id=3).count() > 0:
            #else if atleast one jobstage is in a running state, the job is still running
            
            
        #elif job.JobStages.filter(Status_id=3).count() == 0 and jobstage.Job.JobStages.filter(Status_id__lt=3).count() > 0:
            #else if there are no jobstages running, but there are still jobs in the queued or created states, the job is queued
            
        
        #send notifications
        if jobstage.Job.NotificationEmail is not None:
            emails.append(jobstage.Job)
        
        if jobstage.Job.NotificationURL is not None:
            http.append(jobstage.Job)
        
    
    def UpdateJobHistory(self):
        f = open("/tmp/continue1.txt", 'w')
        print("HERE 2", file=open("/tmp/testing","a"))
        r = ResourceManager(self.user)
        queue = r.GetQueue()
        new_status = None
        print(queue.rows, file=f)
        emails = []
        http = []
        for row in queue.rows:
            try:
                #update or create JobStage
                jobstage = JobStages.GetJobStage(row.job_id)
                print(f"Working on {row.job_id}", file=f)
                # if the job exists in the database and the status has changed
                if jobstage: 
                    new_status = row.state
                    old_status = jobstage.Status.StatusID
                    print(old_status, file=f)
                    if new_status == 4 and jobstage.RequiresEditInd:
                        new_status = 5
                    print(new_status, file=f)
                    #if the job status has changed or the job is held
                    if old_status != new_status or new_status == 1:
                        #if the status is held and the job is a workflow
                        #release job if dependencies have been satisfied.
                        #This should only happen if an error has occured 
                        #when continuing the job
                        print("Job type:", jobstage.Job.JobTypeID, file=f)
                        if new_status == 1 and jobstage.Job.JobTypeID < 4:
                            self.ReleaseJob(jobstage)
                        #if status has changed to a completed state
                        if new_status >= 4:
                            #get job accounting data
                            job = r.GetJob(row.job_id)
                            data = json.dumps(job.DataSections, 
                                default=lambda o: o.__dict__, sort_keys=True)
                            #get status
                            if new_status == 4 and job.ExitCode == None:
                                new_status = 6
                            #update job stage
                            jobstage = JobStages.UpdateJobStage(jobstage, new_status, 
                                job.ExitCode, job.OutputLog, job.ErrorLog, 
                                job.WorkingDir, data)
                    print(jobstage.Job.NotificationEmail, file=f)
                    print(jobstage.Job.NotificationURL, file=f)
                    print(jobstage.Job.JobStages.filter(Status_id__lt=4).count(), file=f)
                    #send notifications if there are no jobstages in job with status < 4, i.e. if the job must be complete
                    if new_status >= 4 and (jobstage.Job.NotificationEmail is not None or jobstage.Job.NotificationURL is not None) and jobstage.Job.JobStages.filter(Status_id__lt=4).count() == 0:
                        print("notify", jobstage.Job.HttpStatusID, file=f)
                        if jobstage.Job.NotificationEmail is not None and jobstage.Job.EmailStatusID != 1:
                            emails.append(jobstage.Job)
                        
                        if jobstage.Job.NotificationURL is not None and jobstage.Job.HttpStatusID != 1:
                            print(jobstage.ClusterJobID, file=f)
                            http.append(jobstage.Job)
                        
                else: # if the job doesnt exist in the database, add it
                    
                    job = r.GetJob(row.job_id)
                    data = json.dumps(job.DataSections, 
                        default=lambda o: o.__dict__, sort_keys=True)
                        
                    with transaction.atomic():
                        user, created = User.objects.get_or_create(
                            username=job.User.split("@")[0]
                        )
                        
                        j = Jobs.AddJob(User=user, JobName=job.JobName, 
                            Description="External submission - job was not submitted via JMS", 
                            ToolVersion=None, WorkflowVersion=None, JobTypeID=4)
                        
                        jobstage = JobStages.AddJobStage(user, j, StatusID=job.Status, 
                            ClusterJobID=job.JobID, ExitCode=job.ExitCode, 
                            ErrorLog=job.ErrorLog, OutputLog=job.OutputLog, 
                            PWD=job.WorkingDir, JobData=data)
                
            except Exception as ex:
                File.print_to_file("/tmp/continue.txt", traceback.format_exc())
                pass
        f.close()
        return emails, http

###
    def ContinueJob(self, jobstage):
        #set status to complete
        jobstage.Status_id = 4
        jobstage.RequiresEditInd = False
        jobstage.save()
        
        #loop through reliant jobs and release them if conditions are met
        for dep in jobstage.ReliantJobStages.all():
            js = dep.JobStageOI
            if self.ReleaseJob(js):
                js.Status_id = 3
                js.save()
    
    def ReleaseJob(self, jobstage):
        with open(f"/tmp/stage_{jobstage.Stage.StageID}.txt", "w") as f:
            print(f"Attempting to release stage {jobstage.Stage.StageID}", file=f)
            if self.JobStageDependenciesSatisfied(jobstage):
                print("Releasing...", file=f)
                self.CopyRequiredFiles(jobstage)
                r = ResourceManager(jobstage.Job.User)
                out = r.ReleaseJob(jobstage.ClusterJobID)
                return True
            else:
                print("Held...", file=f)
                return False
    
    def JobStageDependenciesSatisfied(self, js):
        #check stage dependencies
        for dep in js.JobStageDependencies.all():
            dep_js = dep.DependantOn
            
            if int(dep_js.Status.StatusID) in [4, 6, 7]:
                if dep.Condition.ConditionID == 1 and dep_js.Status.StatusID != 4:
                    return False
                elif dep.Condition.ConditionID == 2 and dep_js.Status.StatusID != 7:
                    return False
                elif dep.Condition.ConditionID == 3 and dep_js.Status.StatusID == 6:
                    return False
                elif dep.Condition.ConditionID == 4 and dep_js.ExitCode != dep.ExitCodeValue:
                    return False
            else:
                return False
        return True
    
    def CopyRequiredFiles(self, js):
        for dep in js.JobStageDependencies.all():
            dep_js = dep.DependantOn
            if int(dep_js.Status.StatusID) in [4, 6, 7]:
                Directory.copy_directory(dep_js.WorkingDirectory, 
                    js.WorkingDirectory, permissions=0o777, replace=False,
                    exclude=[os.path.join(dep_js.WorkingDirectory, "logs")])
