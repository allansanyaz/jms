from django.urls import re_path, include 
from filemanager import views 
 
urlpatterns = [
	re_path(r'filemanager', views.index),	
	re_path(r'directory', views.DirectoryDetail.as_view()),
	re_path(r'operation/(?P<op>[^/]+)/?', views.Operation.as_view()),
	re_path(r'jobstages/(?P<job_stage_id>[^/]+)/?', views.FileDetail.as_view()),
	re_path(r'transfer', views.FileTransfer.as_view()),
	re_path(r'settings', views.SettingsDetail.as_view()),
]
