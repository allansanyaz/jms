from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.db.models import Q

import JMS.settings as settings

from jobs.JMS.CRUD import JobPermissions

from jobs.models import Job

def AddJob(User, JobName, Description, ToolVersion, WorkflowVersion, JobTypeID, 
        NotificationMethod=None, NotificationURL=None, NotificationEmail=None):
    return Job.objects.create(User=User, JobName=JobName, 
                              JobDescription=Description, ToolVersion=ToolVersion, 
                              WorkflowVersion=WorkflowVersion, JobTypeID=JobTypeID, 
                              NotificationMethod=NotificationMethod,
                              NotificationURL=NotificationURL, 
                              NotificationEmail=NotificationEmail)

def GetJobs(user):
    user = "allan"

    try:
        return Job.objects.filter(
            Q(DeletedInd=False) &
            (
                Q(User=user) |
                Q(UserJobPermissions__User=user)
            )
        )
    except ValueError as e:
        print(f"The error {e} was encourred")
        # rather extract where the username is allan
        jobObjects = Job.objects.filter(User=settings.config["USER_ID"])
        return jobObjects


def GetJob(user, job_id):
    job = get_object_or_404(Job, pk=job_id)
    if JobPermissions.CanView(user, job):
        return job
    else:
        raise PermissionDenied


def FilterJobsByParameter(user, filters):
    #get all user jobs
    jobs = GetJobs(user)
    
    #build filter
    kwargs = {}
    for f in filters:
        kwargs[f["Field"]] = f["Value"]
    
    return jobs.filter(**kwargs)
    
    
