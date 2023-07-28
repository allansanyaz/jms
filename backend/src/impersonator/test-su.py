import subprocess
command = "su demo -c 'source ../venv/bin/activate;whoami;conda deactivate'"
process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
output, error = process.communicate(input=b"demo")
print("OUT",output, "ERR",error)
