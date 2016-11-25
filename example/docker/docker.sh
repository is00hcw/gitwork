#!/bin/bash -e

DOCKER_COMPOSE_VERSION="1.8.0"
DOCKER_MACHINE_VERSION="0.8.1"

command_exists() {
  command -v "$@" > /dev/null 2>&1
}

install_docker() {
  curl -sSL http://acs-public-mirror.oss-cn-hangzhou.aliyuncs.com/docker-engine/internet | sh -
}

install_docker_compose() {
  curl -sSL http://mirrors.aliyun.com/docker-toolbox/linux/compose/$DOCKER_COMPOSE_VERSION/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose && \
  chmod +x /usr/local/bin/docker-compose
}

install_docker_machine() {
  curl -L http://mirrors.aliyun.com/docker-toolbox/linux/machine/$DOCKER_MACHINE_VERSION/docker-machine-`uname -s`-`uname -m` > /usr/local/bin/docker-machine && \
  chmod +x /usr/local/bin/docker-machine
}

setup_docker() {
  echo "DOCKER_OPTS=\"\$DOCKER_OPTS --dns 114.114.114.114\"" | sudo tee -a /etc/default/docker
  echo "DOCKER_OPTS=\"\$DOCKER_OPTS --registry-mirror=https://ieao2zab.mirror.aliyuncs.com\"" | sudo tee -a /etc/default/docker

  groupadd docker
  gpasswd -a ${USER} docker
  service docker restart
  newgrp - docker
}

if ! command_exists docker ; then
  install_docker
fi

setup_docker

if ! command_exists docker-machine ; then
  install_docker_machine
fi

if ! command_exists docker-compose ; then
  install_docker_compose
fi
