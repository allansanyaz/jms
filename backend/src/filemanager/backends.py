from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.conf import settings

from utilities.security.cryptography import PubPvtKey
from filemanager.models import FileManagerSettings

import os, pexpect, base64, requests

class LinuxBackend(ModelBackend):
    
    key_file = settings.JMS_SETTINGS["impersonator"]["key"]
    port = settings.JMS_SETTINGS["impersonator"]["port"]
    imp_url = f"http://127.0.0.1:{port}/impersonate" 

    def authenticate(self, request, username=None, password=None):
        # get the user if it exists; if it doesn't exist, create the user
        user = None
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = User.objects.create(username=username, email="", password="")
        
        # encrypt and encode password for transmission and to store in DB
        encoded = ""
        with open(self.key_file, "r") as key_fd:
            # key is the public key (string)
            key = key_fd.read()
            # Encode the user credentials, for encryption
            cred = f"{username}:{password}".encode()
            encrypted = PubPvtKey.encrypt(key, cred)
            #encoded = base64.b64encode(encrypted)  #?? 
            encoded = encrypted  #??            
        # send encoded, encrypted password to impersonator server for authentication   
        if self.linux_auth(encoded):
            fm_settings, created = FileManagerSettings.objects.get_or_create(User=user)
            #fm_settings.ServerPass = base64.b64encode(encrypted)
            fm_settings.ServerPass = encrypted
            fm_settings.save()                
            
            return user
        else:
            return None
    
    def get_user(self, user_id):
        # get the user if it exists, else return None
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
       
    def linux_auth(self, encoded):
        data = "%s\n%s\nprompt" % (encoded, "whoami")
        #data = "%s\n%s\nprompt" % (encoded, os.getlogin())
        r = requests.post(self.imp_url, data=data)
        # Debugging
        with open("/tmp/request.log", "w") as f:
            #print(help(r))
            f.write(r.text)
        return r.status_code == requests.codes.ok
