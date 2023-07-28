from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import User

from jobs.JMS.resource_managers.objects import Setting
from jobs.JMS.CRUD import JobStages
from utilities.io.filesystem import Directory, File
from importlib import import_module

import getpass, os

#dynamically import the resource manager module
module_name = settings.JMS_SETTINGS["resource_manager"]["name"]
#module = __import__(f'jobs.JMS.resource_managers.{module_name}', 
#    fromlist=[module_name])
module = import_module(f"jobs.JMS.resource_managers.{module_name}")
#get the resource manager class from the module
ResourceManager = getattr(module, "torque") # torque may need to be renamed to openpbs when all is working

class Command(BaseCommand):
    #args = '<action [param_1 param_2 ...]>'
    help = 'Parameters are specific to the action being performed'

    def add_arguments(self, parser):
        """Argument parser"""
        parser.add_argument('setup', type=str)
        parser.add_argument('jobstage_id', type=int)
        parser.add_argument('stage_id', type=str)
    
    def handle(self, *args, **options):
        """
        Note: options is of type <dict>
        """
        temp_dir = os.path.join(settings.JMS_SETTINGS["JMS_shared_directory"], 
            "tmp/")
            
        user = User.objects.get(username=getpass.getuser())
        try:
            action = options["setup"]
            if action == "setup":
                job_stage_id = options["jobstage_id"]
                stage_index = options["stage_id"].split()[0]
                
                jobstage = JobStages.GetJobStageByID(user, job_stage_id)
                
                temp_job_dir = os.path.join(temp_dir, f".{user}/{job_stage_id}")
                
                job_name = jobstage.Job.JobName
                script_name = "job.sh"
                
                parsed_settings = []
                for resource in jobstage.JobStageResources.all():
                    s = Setting(resource.Key, resource.Value)
                    parsed_settings.append(s)
                
                Directory.copy_directory(temp_job_dir, jobstage.WorkingDirectory)
                Directory.create_directory(os.path.dirname(jobstage.OutputLog))
                Directory.create_directory(os.path.dirname(jobstage.ErrorLog))
                
                #get dependencies
                has_dependencies = False
                if jobstage.Job.JobTypeID == 3:
                    has_dependencies = len(jobstage.Stage.StageDependencies.all()) > 0
                
                #create job script
                r = ResourceManager(user)
                script = r.CreateJobScript(job_name.replace(' ', '_'), 
                    jobstage.WorkingDirectory, script_name, jobstage.OutputLog, 
                    jobstage.ErrorLog, parsed_settings, has_dependencies, 
                    jobstage.Commands)
                
                return script
        
        except Exception as ex:
            File.print_to_file("/tmp/%s_acl.log" % user.username, str(ex))
