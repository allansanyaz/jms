from django.urls import include, re_path
from django.contrib import admin
admin.autodiscover()

urlpatterns = [
	re_path(r'^api/jms/', include('jobs.urls')),
	re_path(r'^api/users/', include('users.urls')),
	re_path(r'^files/', include('filemanager.urls')),
	re_path(r'^admin/?', admin.site.urls),
	re_path(r'^', include('interface.urls')),
]
