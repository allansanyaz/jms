import os
import sys
import json
import socket
import subprocess

from jobs.JMS.resource_managers.base import *
from jobs.JMS.resource_managers.objects import *
from utilities import deepgetattr
from utilities.io.filesystem import Directory



def GetAttr(obj, attr, default):
    try:
        return deepgetattr(obj, attr)
    except Exception as ex:
        return default

class torque(BaseResourceManager): # TODO: Make generic scheduler name
    
    def GetQueue(self):
        column_names = ["Job ID", "Username", "Queue", "Job Name",
                        "State", "Nodes", "Cores",
                        "Time Requested", "Time Used"]
        rows = []
        queue = JobQueue(column_names, rows)
        
        try:
            out = self.RunUserProcess("qstat -fxFjson")
            data = json.loads(out)
            jobs_dict = data["Jobs"]
        except Exception as e:
            return queue
        jobs_ordered = sorted(jobs_dict,
                              key=lambda x: int(x.split(".")[0]),
                              reverse=True)
        for job in jobs_ordered:
            cores = 1
            nodes = jobs_dict[job]["Resource_List"]["select"].split(":")
            if len(nodes) > 1:
                cores = int(nodes[1].split("=")[1])
            nodes = nodes[0]
            # resources used do not exist prior to job completion
            time_used = jobs_dict[job].get("resources_used", {}).get("walltime", "n/a")
            # Job state does not exit before a job has started
            state = jobs_dict[job].get("job_state", "Q")
            if state == "H":
                state = Status.Held
            elif state == "Q":
                state = Status.Queued
            elif state == "R":
                state = Status.Running
            elif state == "E" or state == "F":
                state = Status.Complete
            
            row = [
               jobs_dict[job]["Job_Owner"].split("@")[0],
               jobs_dict[job]["queue"],
               jobs_dict[job]["Job_Name"],
               jobs_dict[job]["job_state"],
               nodes,
               cores,
               jobs_dict[job].get("resources_used", {}).get("walltime", "n/a"),
               time_used
               ]
            #queue.rows.append(QueueRow(jobs_dict[job]["Job_Id"], state, row)) #Job_Id doesn't exist in OpenPBS.
            queue.rows.append(QueueRow(job, state, row))         
        return queue
    
    '''
    def GetDetailedQueue(self):
        process = subprocess.Popen("qstat -x", shell=True, stdout=subprocess.PIPE, close_fds=True)
        out, err = process.communicate()
        data = objectify.fromstring(out)
        
        jobs = []
        for job in data.Job:
            j = self._ParseJob(job)
            jobs.append(j)
        
        return jobs
    '''
    
    def GetJob(self, id):
        out = self.RunUserProcess(f"qstat -fxFjson {id}")
        data = json.loads(out)
        jobs = data.get("Jobs")
        output = self._ParseJob(jobs)
        return output

    def _ParseJob(self, job):
        #TODO: FIX parser to match json data.
        #TODO: restore "n\a" fallback values
        #get core details to update JobStage
        #print(job, file=open("/tmp/parsejob.txt","w"))
        #exit_code = str(GetAttr(job, 'exit_status', None))
        #job_id = str(GetAttr(job, 'Job_Id', 'Unknown'))
        job_id = list(job.keys())[0]
        exit_code = job[job_id].get("Exit_status", None)
        #state = str(GetAttr(job, 'job_state', Status.Held)) #TODO: Check GetAttr's  "Status.Held" and set as fallback
        state = job[job_id].get("job_state", Status.Held)
        if state == 'H':
            state = Status.Held
        elif state == 'Q':
            state = Status.Queued
        elif state == 'R':
            state = Status.Running
        elif state in ['E', 'C', 'F']:
            state = Status.Complete

        output_path = job[job_id].get("Output_Path", "n/a")
        error_path = job[job_id].get("Error_Path", "n/a")
        
        if len(output_path.split(":")) == 2:
            output_path = output_path.split(":")[1]
        if len(error_path.split(":")) == 2:
            error_path = error_path.split(":")[1]
        
        env = job[job_id].get("Variable_List", "n/a") #TODO: env is a dict, so split has to be corrected
        variable_list = env
        
#        working_dir = "~"
#        for v in vars:
#            kv = v.split("=")
#            if kv[0] == "PBS_O_WORKDIR":
#                working_dir = kv[1]
#                flag = True
#                break
        # Not sure about the initial logic here. Maybe loop can be replaced with dict key access
        working_dir = "~"
        for variable in variable_list.keys():
            value = variable_list[variable]
            if variable == "PBS_O_WORKDIR":
                working_dir = value
                flag = True
                break
        
        name = job[job_id].get("Job_Name", "Unknown")
        user = job[job_id].get("Job_Owner", "Unknown")

        c = ClusterJob(job_id, name, user, state, output_path, error_path, 
            working_dir, exit_code, [])
        #TODO: convert all deepgetattr to simple dict
        #get resource manager specific details 
        resources_allocated = DataSection("Allocated Resources", [
            DataField(Key='mem', Label="Allocated Memory", ValueType=4, 
                      #DefaultValue=job[job_id]["resources_used"]["mem"]
                      DefaultValue=job[job_id].get("resources_used", {}).get("mem", "n/a")
            ),
            DataField(Key='nodes', Label="Allocated Nodes", ValueType=4, 
                      DefaultValue=job[job_id].get("Resource_List", {}).get("nodect", "n/a")
            ),
            DataField(Key='walltime', Label="Allocated Walltime", ValueType=4,
                      DefaultValue=job[job_id].get("resources_used",{}).get("walltime", "n/a")
            ),
            DataField(Key='queue', Label="Queue", ValueType=4, 
                      DefaultValue=job[job_id].get("queue","n/a")
            ),
        ])
        
        resources_used = DataSection("Resources Used", [
            DataField(Key='cput', Label="CPU Time", ValueType=4, 
                      DefaultValue=job[job_id].get("resources_used", {}).get("cput", "n/a")
            ),
            DataField(Key='mem_used', Label="Memory Used", ValueType=4, 
                      DefaultValue=job[job_id].get("resources_used", {}).get("mem", "n/a")
            ),
            DataField(Key='vmem', Label="Virtual Memory Used", ValueType=4, 
                      DefaultValue=job[job_id].get("resources_used", {}).get("vmem", "n/a")
            ),
            DataField(Key='walltime_used', Label="Walltime Used", ValueType=4, 
                      DefaultValue=job[job_id].get("resources_used", {}).get("walltime", "n/a")
            ),
            DataField(Key='exec_host', Label="Execution Node", ValueType=4, 
                      DefaultValue=job[job_id].get("exec_host", "n/a").split("/")[0]
            )
        ])
        
        #print(job[job_id]["Resource_List"]["nodect"], file=open("/tmp/nodect", "w"))
        other = DataSection("Other", [
            DataField(Key='server', Label="Server", ValueType=4, 
                      DefaultValue=job[job_id].get("server", "n/a")
            ),
            DataField(Key='submit_args', Label="Submit Args", ValueType=4, 
                      DefaultValue=job[job_id].get('Submit_arguments', 'n/a')
            ),
            DataField(Key='Output_Path', Label="Output Log", ValueType=4, 
                      DefaultValue=output_path
            ),
            DataField(Key='Error_Path', Label="Error Log", ValueType=4, 
                      DefaultValue=error_path
            ),
            DataField(Key='Priority', Label="Priority", ValueType=4, 
                      DefaultValue=job[job_id].get("Priority", "n/a")
            ),
            DataField(Key='Variable_List', Label="Environmental Variables", ValueType=4,
                      DefaultValue="\n".join([":".join([k,v]) for k,v in job[job_id]["Variable_List"].items()])
            ),
            DataField(Key='comment', Label="Comment", ValueType=4, 
                      DefaultValue=job[job_id].get("comment", "n/a")
            )
        ])
        
        time = DataSection("Time", [
            DataField(Key='ctime', Label="Created Time", ValueType=4, 
                DefaultValue=job[job_id].get("ctime", "n/a")
            ),
            DataField(Key='qtime', Label="Time Entered Queue", ValueType=4, 
                DefaultValue=job[job_id].get("qtime", "n/a")
            ),
            DataField(Key='etime', Label="Time Eligible to Run", ValueType=4, 
                DefaultValue=job[job_id].get("etime", "n/a")
            ),
            DataField(Key='mtime', Label="Last Modified", ValueType=4, 
                DefaultValue=job[job_id].get("mtime", "n/a")
            ),
            DataField(Key='start_time', Label="Start Time", ValueType=4, 
                DefaultValue=job[job_id].get('stime', 'n/a')
            ),
            DataField(Key='comp_time', Label="Completed Time", ValueType=4, 
                DefaultValue=job[job_id].get("resources_used", {}).get("walltime", "n/a")
            ),
        ])
        
        c.DataSections.append(resources_allocated)
        c.DataSections.append(resources_used)
        c.DataSections.append(time)
        c.DataSections.append(other)
        
        return c
    
    
    def GetSettings(self):
        output = self.RunUserProcess('qmgr -c "print server"', expect=self.user.username + "@%s:" % socket.gethostname())
        
        data_sections = [
                DataSection(
                    #SectionHeader = "Torque Settings",
                    SectionHeader = "Scheduler Settings",
                    DataFields = [
                        DataField("acl_hosts", "Server name", ValueType.Label, "", True),
                        DataField("default_queue", "Default queue", ValueType.Text, ""),
                        DataField("scheduler_iteration", "Scheduler iteration (ms)", ValueType.Number, False),
                        DataField("node_check_rate", "Node check rate (ms)", ValueType.Number, False),
                        DataField("tcp_timeout", "TCP timeout (ms)", ValueType.Number, False),
                        DataField("job_stat_rate", "Job stat rate (ms)", ValueType.Number, False),
                        DataField("keep_completed", "Keep completed time (s)", ValueType.Number, False),
                        DataField("scheduling", "Scheduling?", ValueType.Checkbox, False),
                        DataField("mom_job_sync", "Sync server with MOM jobs?", ValueType.Checkbox, False),
                        DataField("query_other_jobs", "View other users' jobs in queue?", ValueType.Checkbox, False),
                        DataField("moab_array_compatible", "Moab array compatible?", ValueType.Checkbox, False),
                    ]
                )
            ]
        
        #settings_section = SettingsSection("Torque Settings", [])
        settings_section = SettingsSection("Scheduler Settings", [])
        
        for line in output.split('\n'):
            
            #server details 
            if line.startswith("set server"):
                setting_line = line[11:].split("=")
                
                setting = setting_line[0].strip()
                value = setting_line[1].strip()
                
                #if the setting is a true or false value, convert the string to an actual boolean 
                if setting in ["scheduling", "query_other_jobs", "mom_job_sync", 
                    "moab_array_compatible"]:
                    value = value.lower() == "true"
                
                if setting in ["scheduling", "query_other_jobs", "mom_job_sync", 
                    "moab_array_compatible", "acl_hosts", "default_queue", 
                    "scheduler_iteration", "node_check_rate", "tcp_timeout",
                    "job_stat_rate", "keep_completed"]:
                    s = Setting(Name=setting, Value=value)
                    settings_section.Settings.append(s)
        
        settings = Data(data_sections, [settings_section])
        
        return settings
    
    
    def UpdateSettings(self, settings_sections):
        output = ""
        for section in settings_sections:
            for setting in section.Settings:
                output += self.RunUserProcess('qmgr -c "set server %s = %s"' % (setting.Name, str(setting.Value)))
        return output
    
    
    def GetQueues(self):
        output = self.RunUserProcess('qmgr -c "print server"', expect=self.user.username + "@%s:" % socket.gethostname())
        
        queue_dict = {}
        
        #set up the data structure
        data_sections = [
                DataSection(
                    SectionHeader = "General",
                    DataFields = [
                        DataField("queue_type", "Queue type", ValueType.Text, "Execution"),
                        DataField("max_queuable", "Max jobs queuable at a time", ValueType.Number, 10),
                        DataField("max_running", "Max jobs running at a time", ValueType.Number, 5),
                        DataField("enabled", "Enabled?", ValueType.Checkbox, False),
                        DataField("started", "Started?", ValueType.Checkbox, False),
                    ]
                ), DataSection(
                    SectionHeader = "User Settings",
                    DataFields = [
                        DataField("max_user_queuable", "Max jobs queuable per user", ValueType.Number, 5),
                        DataField("max_user_run", "Max jobs running per user", ValueType.Number, 1),
                    ]
                ), DataSection(
                    SectionHeader = "Resources",
                    DataFields = [
                        DataField("resources_max.mem", "Max memory", ValueType.Text, "1gb"),
                        DataField("resources_max.ncpus", "Max cores", ValueType.Number, 1),
                        DataField("resources_max.nodes", "Max nodes", ValueType.Number, 1),
                        DataField("resources_max.walltime", "Max walltime", ValueType.Text, "01:00:00"),
                        DataField("resources_default.mem", "Default memory", ValueType.Text, "1gb"),
                        DataField("resources_default.ncpus", "Default cores", ValueType.Number, 1),
                        DataField("resources_default.nodes", "Default nodes", ValueType.Number, 1),
                        DataField("resources_default.walltime", "Default walltime", ValueType.Text, "01:00:00"),
                    ]
                ), DataSection(
                    SectionHeader = "Access Control",
                    DataFields = [
                        DataField("acl_group_enable", "Enable group-based access control?", ValueType.Checkbox, False),
                        DataField("acl_user_enable", "Enable user-based access control?", ValueType.Checkbox, False),
                        DataField("acl_groups", "Groups with access", ValueType.Text, ""),
                        DataField("acl_users", "Users with access", ValueType.Text, "")
                    ]
                )
            ]
        
        acl = {}
        
        #parse the queue data
        for line in output.split('\n'):
            
            #queue details
            if line.startswith("create queue"):
                #create a queue with 3 settings sections
                queue_name = line[13:].strip()
                queue = Queue(QueueName=queue_name, SettingsSections=[
                    SettingsSection("General", []), 
                    SettingsSection("User Settings", []), 
                    SettingsSection("Resources", []), 
                    SettingsSection("Access Control", [])
                ])
                
                queue_dict[queue_name] = queue
                acl[queue_name] = {
                    "groups": "",
                    "users": ""
                }
                
            elif line.startswith("set queue"):
                setting_line = line[10:].split("=")
                
                queue_name = setting_line[0].split(" ")[0]
                queue = queue_dict[queue_name]
                
                setting = setting_line[0].split(" ")[1].strip()
                value = "=".join(setting_line[1:]).strip()
                
                if setting in ["enabled", "started", "acl_group_enable", "acl_user_enable"]:
                    value = value.lower() == "true"
                
                #groups with access   
                if setting in ["acl_groups", "acl_groups +"]:
                    acl[queue_name]["groups"] += value + ","
                
                #users with access
                elif setting in ["acl_users", "acl_users +"]:
                    acl[queue_name]["users"] += value + ","
                
                #all other settings
                else:
                    s = Setting(Name=setting, Value=value)
                
                    if setting in ["queue_type", "max_queuable","max_running", "enabled", "started"]:
                        queue.SettingsSections[0].Settings.append(s)
                    
                    elif setting in ["max_user_queuable", "max_user_run"]:
                        queue.SettingsSections[1].Settings.append(s)
                        
                    elif setting in ["resources_max.mem", "resources_max.walltime", 
                        "resources_default.mem", "resources_default.walltime"]:
                        queue.SettingsSections[2].Settings.append(s)
                        
                    elif setting == "resources_max.nodes":
                        new_values = value.split(":")
                        
                        if len(new_values) > 1:
                            s.Value = new_values[0]
                            queue.SettingsSections[2].Settings.append(s)
                            queue.SettingsSections[2].Settings.append(Setting(
                                Name="resources_max.ncpus", 
                                Value=new_values[1].split("=")[1]
                            ))
                        else:
                            queue.SettingsSections[2].Settings.append(s)
                            queue.SettingsSections[2].Settings.append(Setting(
                                Name="resources_max.ncpus", 
                                Value=1
                            ))
                        
                    elif setting == "resources_default.nodes":
                        new_values = value.split(":ppn=")
                        if len(new_values) > 1:
                            s.Value = new_values[0]
                            queue.SettingsSections[2].Settings.append(s)
                            queue.SettingsSections[2].Settings.append(Setting(
                                Name="resources_default.ncpus", 
                                Value=new_values[1]
                            ))
                        else:
                            queue.SettingsSections[2].Settings.append(s)
                            queue.SettingsSections[2].Settings.append(Setting(
                                Name="resources_default.ncpus", 
                                Value=1
                            ))
                    
                    elif setting in ["acl_group_enable", "acl_user_enable"]:
                        queue.SettingsSections[3].Settings.append(s)
        
        #add data sections and queue data to Data object
        queues = Data(data_sections, [])
        for queue_name in queue_dict:
            queue = queue_dict[queue_name]
            
            group_access = Setting(Name="acl_groups", Value=acl[queue_name]["groups"].strip(","))
            queue.SettingsSections[3].Settings.append(group_access)
            
            user_access = Setting(Name="acl_users", Value=acl[queue_name]["users"].strip(","))
            queue.SettingsSections[3].Settings.append(user_access)
            
            queues.Data.append(queue)
            
        return queues

    
    def AddQueue(self, queue_name):
        output = self.RunUserProcess('qmgr -c "create queue %s"' % queue_name)
    
    
    def UpdateQueue(self, queue):
        output = ""
        max_nodes = 1
        max_procs = 1
        def_nodes = 1
        def_procs = 1
        
        for section in queue.SettingsSections:
            for setting in section.Settings:
                print(setting.Name, setting.Value, file=f) #TODO: Seems to be a bug from before. f may not be in scope
                #set access controls - values come as csv
                if setting.Name in ["acl_groups", "acl_users"]:
                    values = setting.Value.split(",")
                    if len(values) == 1 and values[0] == "":
                        #remove all users
                        output += self.RunUserProcess('qmgr -c "set queue %s %s = temp"' % (queue.QueueName, setting.Name))
                        output += self.RunUserProcess('qmgr -c "set queue %s %s -= temp"' % (queue.QueueName, setting.Name))
                    else:
                        for index, value in enumerate(values):
                            value = value.strip()
                            if index == 0:
                                output += self.RunUserProcess('qmgr -c "set queue %s %s = %s"' % (queue.QueueName, setting.Name, value))
                            else:
                                output += self.RunUserProcess('qmgr -c "set queue %s %s += %s"' % (queue.QueueName, setting.Name, value))
                elif setting.Name == "resources_max.nodes":
                    max_nodes = setting.Value
                elif setting.Name == "resources_max.ncpus":
                    max_procs = setting.Value
                elif setting.Name == "resources_default.nodes":
                    def_nodes = setting.Value
                elif setting.Name == "resources_default.ncpus":
                    def_procs = setting.Value
                
                output += self.RunUserProcess('qmgr -c "set queue %s %s = %s"' % (queue.QueueName, setting.Name, str(setting.Value)))
        
        output += self.RunUserProcess('qmgr -c "set queue %s resources_max.nodes = %s:ppn=%s"' % (queue.QueueName, str(max_nodes), str(max_procs)))
        output += self.RunUserProcess('qmgr -c "set queue %s resources_default.nodes = %s:ppn=%s"' % (queue.QueueName, def_nodes, def_procs))
        
        return output
    
    
    def DeleteQueue(self, queue_name):       
        output = self.RunUserProcess('qmgr -c "delete queue %s"' % queue_name)
    
    
    def GetAdministrators(self):
        output = self.RunUserProcess('qmgr -c "print server"', expect=self.user.username + "@%s:" % socket.gethostname())
        
        data_sections = [
                DataSection(
                    SectionHeader = "Privileges",
                    DataFields = [
                        DataField("managers", "Manager?", ValueType.Checkbox, False),
                        DataField("operators", "Operator?", ValueType.Checkbox, False)
                    ]
                )
            ]
        
        admins = {}
        
        for line in output.split('\n'):
            
            #server details 
            if line.startswith("set server"):
                setting_line = line[11:].split("=")
                
                setting = setting_line[0].strip().strip(" +")
                value = setting_line[1].strip()
                
                
                #the managers setting forms part of the admin object
                if setting == "managers" or setting == "managers +":
                    setting = Setting(Name=setting, Value=True)
                    if value in admins:
                        admins[value].SettingsSections[0].Settings.append(setting)
                    else:
                        Section = SettingsSection(SectionHeader="Privileges", Settings=[setting])
                        admins[value] = Administrator(AdministratorName=value, SettingsSections=[Section]) 
                #the operators setting also forms part of the admin object
                elif setting == "operators" or setting == "operators +":
                    setting = Setting(Name=setting, Value=True)
                    if value in admins:
                        admins[value].SettingsSections[0].Settings.append(setting)
                    else:
                        Section = SettingsSection(SectionHeader="Privileges", Settings=[setting])
                        admins[value] = Administrator(AdministratorName=value, SettingsSections=[Section])
        
        administrators = Data(data_sections, [])
        for k in admins:
            administrators.Data.append(admins[k])
        
        return administrators
    
    
    def AddAdministrator(self, administrator_name):
        output = self.RunUserProcess('qmgr -c "set server managers += %s"' % (administrator_name))
        output += self.RunUserProcess('qmgr -c "set server operators += %s"' % (administrator_name))
        return output
    
    
    def UpdateAdministrator(self, administrator):
        output = ""
        for section in administrator.SettingsSections:
            for setting in section.Settings:
                if setting.Value:
                    output += "\n" + self.RunUserProcess('qmgr -c "set server %s += %s"' % (setting.Name, administrator.AdministratorName))
                else:
                    output += "\n" + self.RunUserProcess('qmgr -c "set server %s -= %s"' % (setting.Name, administrator.AdministratorName))
        return output
    
    
    def DeleteAdministrator(self, administrator_name):
        output = "\n" + self.RunUserProcess('qmgr -c "set server managers -= %s"' % administrator_name)
        output += "\n" + self.RunUserProcess('qmgr -c "set server operators -= %s"' % administrator_name)
        return output
    
    
    def GetNodes(self):
        """Get node information from scheduler"""
        nodes = []
        
        try:
            # Torque command was "qnodes_x" and generated XML data
            #TODO: Fix below for JSON. Responsible for missing dashboard node data
            out = self.RunUserProcess("pbsnodes -aFjson") # TODO: Fix this. Not producing any output
            data = json.loads(out)
            
            node_dict = data["nodes"]

            for node in node_dict:

                name = node
                state = node_dict[node]["state"]
                num_cores = int(node_dict[node]["pcpus"])
                properties = node_dict[node]["resources_available"].get("arch", '') #NOTE: may not be the best substitute
                busy_cores = 0;            
                
                # Container of job IDs 
                job_dict = dict()
               
               # jobs: a list of job IDs
                jobs = node_dict[node].get('jobs', None)
                if jobs:
                    for job in jobs:
                        job_cores = job
                        busy_cores += 1

                        if job_cores[1] in job_dict:
                            job_dict[job] += 1
                        else:
                            job_dict[job] = 1
                
                #free_cores = num_cores - busy_cores
                free_cores = num_cores - busy_cores
                # TODO: Get busy and free cores
                n = Node(name, state, num_cores, busy_cores, free_cores, properties)
               
               # Iterate through job names (k)
                for k in job_dict:
                    j = Job(k, job_dict[k])                
                    n.jobs.append(j)
                
                nodes.append(n)
        
        except Exception as ex:
            print("An error occurred while getting nodes")
            f = open('/tmp/nodes.txt', 'w')
            print(str(ex), file=f)
            f.close()

        return nodes
    
    
    def AddNode(self, node):
        output = self.RunUserProcess('qmgr -c "create node %s"' % node.name)   
        self.UpdateNode(node)
    
    
    def UpdateNode(self, node):    
        output = self.RunUserProcess('qmgr -c "set node %s np = %s"' % (node.name, str(node.num_cores)))
        output += self.RunUserProcess('qmgr -c "set node %s properties = %s"' % (node.name, node.other))
    
    
    def DeleteNode(self, id):
        output = self.RunUserProcess('qmgr -c "delete node %s"' % id) 
    
    
    def Stop(self):
        return self.RunUserProcess("qterm -t quick")
    
    
    def Start(self):
        return self.RunUserProcess("qserverd", sudo=True) # TODO: not sure what this does
    
    
    def Restart(self):
        output = self.Stop()
        output += self.Start()
        return output
    
    
    def GetDefaultResources(self):
        return DataSection("torque", [ # TODO: verify that all torq cases are replced by open PBS (or generalised)
            DataField(
                Key = "nodes",
                Label = "Nodes",
                ValueType = ValueType.Number,
                DefaultValue = 1,
                Disabled = False
            ), DataField(
                Key = "ppn",
                Label = "Cores",
                ValueType = ValueType.Number,
                DefaultValue = 1,
                Disabled = False
            ), DataField(
                Key = "mem",
                Label = "Memory (GB)",
                ValueType = ValueType.Number,
                DefaultValue = 1,
                Disabled = False
            ), DataField(
                Key = "walltime",
                Label = "Walltime (h:m:s)",
                ValueType = ValueType.Text,
                DefaultValue = "01:00:00",
                Disabled = False
            ), DataField(
                Key = "queue",
                Label = "Queue",
                ValueType = ValueType.Text,
                DefaultValue = "batch",
                Disabled = False
            ), DataField(
                Key = "variables",
                Label = "Environmental Variables",
                ValueType = ValueType.Text,
                DefaultValue = "",
                Disabled = False
            )
        ])

    
    def CreateJobScript(self, job_name, job_dir, script_name,
                        output_log, error_log, settings,
                        has_dependencies, commands):
        """
        Creates the job script for submission
        """
        script = os.path.join(job_dir, script_name)
        with open(script, 'w') as job_script:
            job_script.write("#!/bin/sh\n")
            job_script.write(f"#PBS -o localhost:{output_log}\n")
            job_script.write(f"#PBS -e localhost:{error_log}\n")
            job_script.write(f"#PBS -N {job_name}\n")
            job_script.write("#PBS -W umask=022\n")
            job_script.write(f"cd {job_dir}\n")
            
            nodes = ""
            for setting in settings:
                if setting.Name == "nodes":
                    nodes += f"#PBS -l nodes={setting.Value}"
                elif setting.Name == "ppn":
                    nodes += f":ppn={setting.Value}"
                elif setting.Name == "mem":
                    job_script.write(f"#PBS -l mem={setting.Value}gb\n")
                elif setting.Name == "walltime":
                    job_script.write(f"#PBS -l walltime={setting.Value}\n")
                elif setting.Name == "queue":
                    job_script.write(f"#PBS -q {setting.Value}\n")
                elif setting.Name == "variables":
                    if setting.Value.strip() != "":
                        job_script.write(f"#PBS -v {setting.Value}\n")
                    else:
                        job_script.write("#PBS -V\n")
            job_script.write(nodes)
            #has_dependencies?
            if has_dependencies:
                job_script.write("#PBS -h\n")
            job_script.write("\n")
            job_script.write(commands)
        return script
    
    def ExecuteJobScript(self, script):
        return self.RunUserProcess(f"qsub {script}")
    
    def HoldJob(self, id):
        return self.RunUserProcess(f"qhold {id}")
    
    def ReleaseJob(self, id):
        return self.RunUserProcess(f"qrls {id}")
    
    def KillJob(self, id):
        return self.RunUserProcess(f"qdel {id}")
    
    def AlterJob(self, Key, Value):
        raise NotImplementedError  
