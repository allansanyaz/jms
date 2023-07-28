import subprocess

command = "./test-input.py"
#process = subprocess.Popen(command, shell=True, stdin=subprocess.PIPE, stderr=subprocess.PIPE,
#                           stdout=subprocess.PIPE, universal_newlines=True)
process = subprocess.Popen(command, stdin="this is a test", shell=True)
output, error = process.communicate()

print("You entered: ", dir(output))
