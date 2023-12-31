from django.shortcuts import render, redirect
from django.template.context_processors import csrf

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required

from django.http import HttpResponse

@login_required(login_url="/account/login")
def index(request):
	c = {}
	c.update(csrf(request))
	
	return render(request, 'custom/JMS/dashboard.html', c)


@login_required(login_url="/account/login")
def tools(request):
	c = {}
	c.update(csrf(request))
	
	return render(request, 'custom/JMS/tools.html', c)


@login_required(login_url="/account/login")
def workflows(request):
	c = {}
	c.update(csrf(request))
	
	return render(request, 'custom/JMS/workflows.html', c)


@login_required(login_url="/account/login")
def workflow_visualizer(request):
	c = {}
	c.update(csrf(request))
	
	return render(request, 'custom/JMS/workflow_visualizer.html', c)


@login_required(login_url="/account/login")
def jobs(request):
	c = {}
	c.update(csrf(request))
	
	return render(request, 'custom/JMS/jobs.html', c)


@login_required(login_url="/account/login")
def settings(request):
	c = {}
	c.update(csrf(request))
	
	return render(request, 'custom/JMS/settings.html', c)
	
	
def sign_in(request):
	if request.method == 'GET':
		return render(request, 'layout/login.html')
	elif request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']
		next = request.GET.get('next', '/')
		user = authenticate(username=username, password=password)	
		#print(user, username, password, type(username), type(password))
		if user is not None:
			if user.is_active:
				login(request, user)				
				return redirect(next)
			else:
				return render(request,  'layout/login.html', { "error": "Login attempt failed. Please try again." })
		else:
			return render(request,  'layout/login.html', { "error": "Login attempt failed. Incorrect username or password." })
			

@login_required(login_url="/account/login")			
def sign_out(request):
	logout(request)
	return redirect('/account/login')
