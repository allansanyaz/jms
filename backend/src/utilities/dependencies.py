"""
This is a library for checking dependencies
"""
import sys
import subprocess

def CheckOpenpbs():
    """
    Checks if openpbs is accessible
    """
    status, output = subprocess.getstatusoutput("qstat")
    if status != 0:
        print(f"ERROR: {output}. Exiting.")
        print("Is OpenPBS loaded correctly?")
        sys.exit(status)
