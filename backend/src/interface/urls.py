from django.urls import re_path, include
from interface import views

urlpatterns = [
	re_path(r'^account/login/?', views.sign_in),	
	re_path(r'^account/logout/?', views.sign_out),	
	re_path(r'^workflows/visualize', views.workflow_visualizer),	
	re_path(r'^workflows', views.workflows),
	re_path(r'^tools', views.tools),
	re_path(r'^jobs/?', views.jobs),
	re_path(r'^settings/?', views.settings),
	re_path(r'^', views.index),	
]
