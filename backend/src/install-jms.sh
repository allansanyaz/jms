#!/usr/bin/env bash
conda create -p ${PWD}/venv django=3.2 python=3.9
conda install -p ${PWD}/venv mysqlclient mysql-connector-c
conda install -p ${PWD}/venv -c conda-forge python-devtools djangorestframework django-cors-headers conda-build pylibmc 
conda install -p ${PWD}/venv -c anaconda twisted ecdsa lxml paramiko pexpect pycryptodome 
