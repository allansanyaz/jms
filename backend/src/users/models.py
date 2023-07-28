from django.db import models
from django.contrib.auth.models import User, Group
from django.db.models.signals import post_save

class Country(models.Model):
	CountryCode = models.CharField(primary_key=True, max_length=2)
	CountryName = models.CharField(max_length=50)
	
	class Meta:
		db_table = 'Countries'



class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.RESTRICT)
	Company = models.CharField(null=True, blank=True, max_length=50)
	Country = models.ForeignKey(Country, null=True, blank=True, on_delete=models.RESTRICT)
	Blurb = models.TextField(null=True, blank=True)
	DoB = models.DateField(null=True, blank=True)
	Code = models.TextField(null=True, blank=True)
	
	class Meta:
		db_table = 'UserProfiles'



class Contact(models.Model):
	ContactID = models.AutoField(primary_key=True)
	UserProfileID = models.IntegerField()
	ContactProfile = models.ForeignKey(UserProfile, related_name="Contacts", db_column="ContactProfileID", on_delete=models.RESTRICT)
	DateConnected = models.DateField()
	
	class Meta:
		db_table = 'Contacts'



class Conversation(models.Model):
	ConversationID = models.AutoField(primary_key=True)
	Subject = models.CharField(max_length=30)
	LastMessage = models.DateTimeField()
	
	class Meta:
		db_table = 'Conversations'



class Message(models.Model):
	MessageID = models.AutoField(primary_key=True)
	Content = models.TextField()
	Conversation = models.ForeignKey(Conversation, related_name="Messages", db_column="ConversationID", on_delete=models.RESTRICT)
	Date = models.DateTimeField()
	UserProfile = models.ForeignKey(UserProfile, related_name="Messages", db_column="UserProfileID", on_delete=models.RESTRICT)
	
	class Meta:
		db_table = 'Messages'
	


class UserConversation(models.Model):
	UserConversationID = models.AutoField(primary_key=True)
	UserProfile = models.ForeignKey(UserProfile, related_name="UserConversations", db_column="UserProfileID", on_delete=models.RESTRICT)
	Conversation = models.ForeignKey(Conversation, related_name="UserConversations", db_column="ConversationID", on_delete=models.RESTRICT)
	DateJoined = models.DateTimeField()
	LastViewed = models.DateTimeField(null=True, blank=True)
	
	class Meta:
		db_table = 'UserConversations'


class GroupConversation(models.Model):
	Group = models.OneToOneField(Group, on_delete=models.RESTRICT)
	Conversation = models.OneToOneField(Conversation, on_delete=models.RESTRICT)
	
	class Meta:
		db_table = 'GroupConversations'


class NotificationType(models.Model):
	NotificationTypeID = models.AutoField(primary_key=True)
	NotificationTypeName = models.CharField(max_length=30)
	
	class Meta:
		db_table = 'NotificationTypes'



class Notification(models.Model):
	NotificationID = models.AutoField(primary_key=True)
	UserProfile = models.ForeignKey(UserProfile, related_name="Notifications", db_column="UserProfileID", on_delete=models.RESTRICT)
	Content = models.TextField()
	NotificationDate = models.DateTimeField()
	ViewedInd = models.BooleanField(default=False)
	NotificationType = models.ForeignKey(NotificationType, related_name="Notifications", db_column="NotificationTypeID", on_delete=models.RESTRICT)
	
	class Meta:
		db_table = 'Notifications'
	
	

def create_user_profile(sender, instance, created, **kwargs):  
    if created:  
       profile, created = UserProfile.objects.get_or_create(user=instance) 
			

post_save.connect(create_user_profile, sender=User) 
