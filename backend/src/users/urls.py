from django.urls import re_path, path
from users import views

urlpatterns = [
    
    re_path(r'login/?', views.Login.as_view()), 
    re_path(r'logout/?', views.Logout.as_view()),  
    re_path(r'profile/?', views.Profile.as_view()), 
    re_path(r'password/?', views.Password.as_view()), 
    re_path(r'contacts/(?P<contact_id>[^/]+)/?', views.Contacts.as_view()),
    re_path(r'contacts/?', views.Contacts.as_view()), 
    re_path(r'groups/(?P<group_id>[^/]+)/?', views.GroupDetail.as_view()),
    re_path(r'groups/?', views.Groups.as_view()),
    re_path(r'conversations/(?P<message_id>[^/]+)/?', views.Conversations.as_view()),
    re_path(r'conversations/?', views.Conversations.as_view()),
    re_path(r'messages/(?P<conversation_id>[^/]+)/?', views.Messages.as_view()),  
    re_path(r'', views.Register.as_view()),    
]
