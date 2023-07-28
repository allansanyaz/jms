#!/usr/bin/env python
import os, sys, base64, subprocess
from pathlib import Path

from twisted.web.server import Site
from twisted.web.resource import Resource
from twisted.internet import reactor

sys.path.append(Path("__file__").resolve().parent.parent.as_posix())
from utilities.structures import TimeExpiredDict
from utilities.context_managers import cd
from utilities.security.cryptography import PubPvtKey
from utilities import dependencies

import json


class Impersonator(Resource):
    """User impersonation server, listening for TCP with root privilege""" 
    def __init__(self):
        self.path = Path(".").absolute().as_posix()
        self.path_src = Path(".").absolute().parent.as_posix()
        self.pyexec = os.environ["CONDA_PYTHON_EXE"]
        self.condaexec = os.environ["CONDA_EXE"]
        self.processes = TimeExpiredDict(600)
        with open("pvt.key", "r") as key_file:
            self.key = key_file.read()
    
    def authenticate(self, uname, password, venv=None):
        """Authenticate an existing user on the OS
        Inputs:
            uname: user name (string)
            password: self-evident
            venv: Not implemented
        Output:
            True or False
        """
        process = self.processes.get(uname)
        if process == None:
            command = f"su -l {uname} -c '{self.pyexec} {self.path}/login.py {uname} {password}'"
            process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE,
                                       stdin=subprocess.PIPE, stderr=subprocess.PIPE)
            output, error = process.communicate(input=password.encode()) #returns bytes string
            if output.endswith(b'0\n'):
                self.processes.add(uname, password)
            else: 
                return False
            
        elif process != password:
            self.process.expire(uname)
            return False
        
        return True
    
    def render_POST(self, request):
        """Render POST request and runs server commands from 
        an authenticated user
        Inputs:
            request: Request object from twisted.web.server
                     containing credentials and commands
        """
        try:
            # Parse request data from the intermediate byte string
            data = request.content.read() 
            data = data.decode().lstrip("b'").rstrip("'")
            #data = base64.b64decode(data) # NOTE: a byte string
            data_lines = data.split("\n")
            data_lines[0] = data_lines[0].rstrip("'")
            decoded = data_lines[0]
            # Get credentials
#            decoded = base64.b64decode(data_lines[0])
            decrypted = PubPvtKey.decrypt(self.key, decoded)
            credentials = decrypted.split(":")
            command = data_lines[1]
            prompt = "prompt" #legacy - should be phased out
            sudo = False
            
            if len(data_lines) > 2:
                prompt = data_lines[2] #legacy - should be phased out
                # probably inactive block
                if len(data_lines) > 3:
                    sudo = data_lines[3].lower() == "true"

            # Run as sudo? (likely never runs in production)
            if sudo: 
                command = f'sudo -S {command}'
            # Prepare the command to be run
            command = f'source {self.path_src}/venv/bin/activate;{command};conda deactivate'
            print("Authentication")
            
            if self.authenticate(credentials[0], credentials[1]):
                print("Authenticated")
                print("COMMAND: ", command)
                cmd = f"su -l {credentials[0]} -c '{command}'"
                process = subprocess.Popen(cmd, shell=True, 
                    stdout=subprocess.PIPE, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
                if sudo:# likely never runs in production server
                    output, error = process.communicate(credentials[1] + "\n")
                else:
                    output, error = process.communicate(input=credentials[1].encode())
                    #print("CHECK3 COMMAND:", cmd,", ERROR:", error) #TODO: Fix potential error here
                output = output.decode().strip("None").rstrip() #Not sure if strip functions are needed
                #print("CHECK4 DECODED: ", output) #TODO: Fix potential error here
                return output.encode()
            else:
                request.setResponseCode(403)
                return b"Permission denied"
            
        except Exception as err:
            print(str(err))
            request.setResponseCode(400)
            return b"Bad Request" 

resource = Impersonator()

path = os.path.dirname(os.path.realpath(__file__))
with cd(path):

    if __name__ == "__main__":
        
        port = 8124
        if len(sys.argv) > 1:
            port = int(sys.argv[1])
        # Check if openPBS is accessible
        dependencies.CheckOpenpbs()
        # Set up and run server for impersonating commands
        root = Resource()
        root.putChild(b"impersonate", resource)
        factory = Site(root)
        reactor.listenTCP(port, factory)
        #Twisted’s main event loop
        reactor.run() 
