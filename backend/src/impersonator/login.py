#!/usr/bin/env python

import sys
from pathlib import Path
sys.path.append(Path(sys.path[0]).resolve().parent.as_posix())
from utilities.io.shell import UserProcess
venv = None

if len(sys.argv) > 2:
    username = sys.argv[1]
    password = sys.argv[2]
else:
    raise ValueError("Credentials have to be provided.")

if len(sys.argv) > 3:
    venv = sys.argv[3]

try:
    process = UserProcess(username, password)
    if venv:
        out = process.run_command(f"source {venv}")
    process.close()
except Exception as err:
    print(err)
            
print(0)
