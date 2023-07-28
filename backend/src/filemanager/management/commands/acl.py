from django.core.management.base import BaseCommand
from django.conf import settings

import os, json, mimetypes, platform, shutil, traceback, sys, getpass

from filemanager.objects import *
from filemanager.models import *

class Command(BaseCommand):
    args = '<operation [param_1 param_2 ...]>'
    help = 'Parameters are specific to the operation being performed'

    def add_arguments(self, parser):
        parser.add_argument('operation', nargs="+", type=str)
    
    def handle(self, *args, **options):
        options = options["operation"]
        operation = options[0]
        params = options[1:]
        output = ""
        root = os.path.join(settings.FILEMANAGER_SETTINGS["root_url"], getpass.getuser())
        root = os.path.join(root, "jobs/")
        
        try:
            if operation == "GET_DIR":
                root = params[0]
                path = params[1]
                if path.endswith(":"):
                    path += "\\"    
                
                directory = Directory(path, root)
                
                output = directory.to_JSON()
            elif operation == "CREATE_TEMP_FILE":                    
                path = params[0]
                output = params[1]
                
                if os.path.exists(output):
                    os.remove(output)
                    
                shutil.copyfile(path, output)
                os.chmod(output, 0o755)             
            elif operation == "CREATE":            
                dir_obj = DirectoryObject(params[0], params[1], params[2], root)
                dir_obj.create()            
            elif operation == "RENAME":
                dir_obj = DirectoryObject(params[0], params[1], params[2], root)
                dir_obj.rename()
            elif operation == "MOVE":
                dir_obj = DirectoryObject(params[0], params[1], params[2], root)
                dir_obj.move(params[4])
            elif operation == "COPY":
                dir_obj = DirectoryObject(params[0], params[1], params[2], root)
                dir_obj.copy(params[4])
            elif operation == "DELETE":
                dir_obj = DirectoryObject(params[0], params[1], params[2], root)
                dir_obj.delete()
            elif operation == "OVERWRITE_FILE":                
                path = os.path.join(root, params[0].lstrip("/"))
                tmp_file = params[1]
                shutil.copyfile(tmp_file, path)   
                os.remove(tmp_file)             
            else:
                output = "ERROR:\n\nInvalid operation"
        except Exception as err:
            output = "ERROR:\n\n%s" % str(err)
        
        return output
