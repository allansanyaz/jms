# Django settings for JMS project.
import os
from pathlib import Path
import json

BASE = Path(__file__).resolve().parent.parent.parent
BASE_DIR = Path(__file__).resolve().parent.parent

print("************************")
print(BASE)
print(BASE_DIR)

config_json_file = f"{BASE_DIR}{os.sep}config.json"

# If these settings ever change Edit the below file with fixes
with open(config_json_file, encoding='utf-8') as config_file:
    config = json.load(config_file)

DEBUG = True
#TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
	# ("Olivier", "oliserand@gmail.com")
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': config["DATABASE_NAME"],                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': config["DATABASE_USER"],
        'PASSWORD': config["DATABASE_PASSWORD"],
        'HOST': config["DATABASE_HOST"],      
        'PORT': config["DATABASE_PORT"],                      # Set to empty string for default.
    }
}

#BASE = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
#BASE_DIR = os.path.dirname(os.path.dirname(__file__)) 

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ["146.231.130.35", "localhost", "127.0.0.1", "leia.rubi.ru.ac.za", "localhost"]

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Africa/Johannesburg'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = False

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = BASE / "media"

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
#STATIC_ROOT = os.path.join(BASE, "static")

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/assets/'

# Additional locations of static files
STATICFILES_DIRS = [
	BASE / "static"
]

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder'
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
]

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Make this unique, and don't share it with anybody.
SECRET_KEY = config["SECRET_KEY"]



TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
	# Insert templates here
        'DIRS': [
		 BASE / 'templates',
		 BASE / 'src/filemanager/templates'
		], 
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.static'
            ],
        },
    },
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'JMS.urls'
#APPEND_SLASH = True

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'JMS.wsgi.application'


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    #REST framework apps
    'rest_framework',
    #'rest_framework_swagger',
    #my apps
    'users.apps.UsersAppConfig',
    'jobs.apps.JobsAppConfig',
    'filemanager.apps.FilemanagerAppConfig',
    'interface.apps.InterfaceAppConfig',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
]

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.

#LOGGING = {
#    'version': 1,
#    'disable_existing_loggers': False,
#    'filters': {
#        'require_debug_false': {
#            '()': 'django.utils.log.RequireDebugFalse'
#        }
#    },
#    'handlers': {
#        'mail_admins': {
#            'level': 'ERROR',
#            'filters': ['require_debug_false'],
#            'class': 'django.utils.log.AdminEmailHandler',
#        }
#    },
#    'loggers': {
#        'django.request': {
#            'handlers': ['mail_admins'],
#            'level': 'ERROR',
#            'propagate': True,
#        },
#    }
#}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/srv/JMS-OpenPBS/logs/debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
	'rest_framework.renderers.JSONRenderer',
	)
}

SWAGGER_SETTINGS = {
	"exclude_namespaces": ['internal_urls'],
}

AUTHENTICATION_BACKENDS = (
    "filemanager.backends.LinuxBackend",
)

#AUTH_PROFILE_MODULE = 'users.UserProfile'  ## deprecated


shared_directory = "/mounts/r2d2/JMS"

JMS_SETTINGS = {
    "JMS_shared_directory": shared_directory,
    "resource_manager": {
        "name": "openpbs",
        "poll_interval": 30
    },
    "ansible": False,
    "modules": False,
    "impersonator": {
        "key": BASE_DIR / "impersonator/pub.key",
        "port": "8123"
    },
    "filemanager": {
        "root_url": os.path.join(shared_directory,  "users/"),
        "temp_dir": "/tmp/jms/"
    }
}


FILEMANAGER_SETTINGS = {
    "root_url": os.path.join(JMS_SETTINGS["JMS_shared_directory"], "users/"),
    "temp_dir": "/tmp/jms/"
}


EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.live.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = config["EMAIL_HOST_USER"]
EMAIL_HOST_PASSWORD = config["EMAIL_HOST_PASSWORD"]
 
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
SERVER_EMAIL = EMAIL_HOST_USER
