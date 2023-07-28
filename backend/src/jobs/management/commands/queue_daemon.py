import sys, time, subprocess, traceback, json
from threading import Thread
from django.core.management.base import BaseCommand  
from django.core.mail import EmailMessage
from django.conf import settings
from django import db
from requests import Request, Session
#from lxml import objectify

from jobs.JMS import JobManager
from utilities.services.daemon import Daemon
from utilities.io.filesystem import File
from utilities import dependencies
from queue import Queue
#from jobs.JMS.resource_managers.objects import Queue
#from jobs.objects import Queue

#def CheckOpenpbs():
#    """
#    Checks if openpbs is accessible
#    """
#    status, output = subprocess.getstatusoutput("qstat") 
#    if status != 0:
#        print(f"ERROR: {output}. Exiting.")
#        print("Is OpenPBS loaded correctly?")
#        sys.exit(status)

class NotificationStatus:
    Success = 1
    Error = 2

def SendEmailNotification(job, num_retries):
    if job.EmailStatusID != NotificationStatus.Success:
        status = NotificationStatus.Error
        
        for i in range(num_retries):
            try:
                email = EmailMessage('Job completed - %s' % job.JobName, "",
                    'jms.rubi@outlook.com', #from
                    [job.NotificationEmail], #to
                    ['davidbrownza@outlook.com',], #bcc 
                )
                
                job_report =  "JOB REPORT\n"
                job_report += "---------------------------------------------\n\n"
                job_report += "Job Name: %s\n" % job.JobName
                job_report += "Description: %s\n" % job.JobDescription
                
                if job.JobTypeID == 1:
                    job_report += "Job Type: Custom Job\n"
                elif job.JobTypeID == 2:
                    job_report += "Job Type: Tool\n"
                elif job.JobTypeID == 3:
                    job_report += "Job Type: Workflow\n"
                elif job.JobTypeID == 4:
                    job_report += "Job Type: External\n"
                
                if job.JobTypeID != 3:
                    jobstage = job.JobStages.all()[0]
                    job_report += "\nCluster Job ID: %s\n" % jobstage.ClusterJobID
                    job_report += "Status: %s\n" % jobstage.Status.StatusName
                    job_report += "Exit Code: %s\n" % jobstage.ExitCode
                    job_report += "Working Directory: %s\n" % jobstage.WorkingDirectory
                    job_report += "Output Log: %s (attached)\n" % jobstage.OutputLog
                    job_report += "Error Log: %s (attached)\n" % jobstage.ErrorLog
                    
                    email.attach_file(jobstage.OutputLog)
                    email.attach_file(jobstage.ErrorLog)
                
                else:
                    for jobstage in job.JobStages.all():
                        job_report += "STAGE: %s" % jobstage.Stage.ToolVersion.Tool.ToolName
                        job_report += "Cluster Job ID: %s\n" % jobstage.ClusterJobID
                        job_report += "Status: %s\n" % jobstage.Status.StatusName
                        job_report += "Exit Code: %s\n" % jobstage.ExitCode
                        job_report += "Working Directory: %s\n" % jobstage.WorkingDirectory
                        job_report += "Output Log: %s (attached)\n" % jobstage.OutputLog
                        job_report += "Error Log: %s (attached)\n" % jobstage.ErrorLog
                
                email.body = job_report
                
                #Send notification email
                email.send()
                status = NotificationStatus.Success
                break
            
            except Exception as ex:
                with open(f"/tmp/email_{job.JobName}.txt", 'w') as f:
                    print(f"No. of retries: { num_retries}", file=f)
                    print(f"Exception: {ex}", file=f)
                    print(traceback.format_exc(), file=f)
        
        job.EmailStatusID = status
        job.save()
        
    return 0

def SendHTTPNotification(job, num_retries):
    status = NotificationStatus.Error
    
    for i in range(num_retries):
        try:
            s = Session()
            
            if job.JobTypeID != 3:
                jobstage = job.JobStages.all()[0]
                status_id = jobstage.Status.StatusID
                exit_code = jobstage.ExitCode
                
            else:
                status_id = 4
                exit_code = 0
                for jobstage in job.JobStages.all():
                    if jobstage.Status.StatusID == 7:
                        status_id = 7
                        exit_code = 1
                        break
            
            data = { 
                "StatusID": status_id, 
                "ExitCode":  exit_code
            }            
                
                
            if job.NotificationMethod.upper() == "GET" or job.NotificationMethod.upper() == "DELETE":
                req = Request(job.NotificationMethod.upper(), job.NotificationURL,
                    params = data
                )
            else:
                req = Request(job.NotificationMethod.upper(), job.NotificationURL,
                    data = json.dumps(data)
                )
                
            prepped = req.prepare()
            
            response = s.send(prepped, verify=False)
            if response.status_code == 200:
                status = NotificationStatus.Success
                break
            else:
                with open(f"/tmp/http_{job.JobName}.txt", 'w') as f:
                    print(response.text, file=f)
            
        except Exception as ex:
            with open(f"/tmp/http_{job.JobName}.txt", 'w') as f:
                print(f"No. of retries: { num_retries}")
                print(f"Exception: {ex}")
                print(traceback.format_exc(), file=f)
            db.close_connection()
    job.HttpStatusID = status
    job.save()
    return 0

def email_worker(q):
    """
    The email worker:
     Input:
      An email Queue object
     Returns:
      None
    """
    while True:
        try:
            job = q.get()
            SendEmailNotification(job, 5)
            q.task_done()
        except Exception as ex:
            with open("/tmp/email.txt", 'w') as f:
                print(traceback.format_exc(), file=f)

def http_worker(q):
    """
    The http worker:
     Input:
      An http Queue object
     Returns:
      None
    """
    while True:
        try:
            job = q.get()
            SendHTTPNotification(job, 5)
            q.task_done()
        except Exception as ex:
            with open(f"/tmp/http_worker_{job.JobName}.txt", 'w') as f:
                print(f"No. of retries: { num_retries}", file=f)
                print(f"Exception: {ex}", file=f)
                print(traceback.format_exc(), file=f)
            db.close_connection()

class QueueDaemon(Daemon):

    def run(self):
        try:
            # Create notification queues
            email_queue = Queue(maxsize=0)
            http_queue = Queue(maxsize=0)
            # Spawn email notification threads
            email_thread = Thread(target=email_worker, args=(email_queue,))
            email_thread.setDaemon(True)
            email_thread.start()
            # Spawn http notification threads
            http_thread = Thread(target=http_worker, args=(http_queue,))
            http_thread.setDaemon(True)
            http_thread.start()
            count = 1
            jms = JobManager()
            while True:
                try:
                    # Reset database connection to avoid "MySQL has gone away" error after daemon has been running for a long time   
                    if count % 500 == 0: 
                        db.close_connection()
                    # Update job history and get notifications
                    count += 1
                    print("HERE 1", file=open("/tmp/testing","w"))    
                    emails, http = jms.UpdateJobHistory() # TODO: fix bug here
                    # Add notifications to respective queues
                    for e in emails:
                        email_queue.put(e)
                    for h in http:
                        http_queue.put(h)
                    with open("/tmp/count.txt", 'w') as f:
                        print(f"Count: {count}\nEmails: {len(emails)}\nHTTP: {len(http)}", file=f)
                except Exception as err: 
                    db.close_connection()
                    with open("/tmp/queue-daemon.in", 'w') as f:
                        f.write(traceback.format_exc())
                time.sleep(settings.JMS_SETTINGS["resource_manager"]["poll_interval"])
        except Exception as err:
            with open("/tmp/queue-daemon.out", 'w') as f:
                f.write(traceback.format_exc())
                       
class Command(BaseCommand):

    help = "Usage: python manage.py queue_daemon [start|restart|stop]"

    def add_arguments(self, parser):
        parser.add_argument('command', type=str)

    def handle(self, *args, **options):
        # Handle options given to "manage.py queue_daemon"
        dependencies.CheckOpenpbs()
        daemon = QueueDaemon('/tmp/queue-daemon.pid')
        if options["command"] == 'start':
            daemon.start()
        elif options["command"] == 'restart':
            daemon.restart()
        elif options["command"] == 'stop':
            daemon.stop()       
