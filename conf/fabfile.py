#!/usr/bin/env python
# encoding: utf-8

from fabric.api import local,cd,run,env,hosts,put,get
from os import path
from time import sleep
from fabric.colors import *

env.hosts=['wuwenqian@wyx.atsmart.net'] #ssh要用到的参数
env.password = 'wuwenqian!@#'

def hello():
    print(green("Hello world!"))

def clear():
    run('rm -vrf ~/upload/')

def js():
    put('./target/js/', '~/upload')

def classes():
    put('src/main/webapp/WEB-INF/classes/net', '~/upload')

def update():
    local('cd')
    # with cd('/data/www/webapp.atsmart.io/app/m5/logs'):   
    #    run('ls -al')  #远程操作用run
    with cd('~'):
        run('ls -al')  #远程操作用run

    js()
    classes()
        
     