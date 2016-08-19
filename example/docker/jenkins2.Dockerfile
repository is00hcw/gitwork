FROM maven:3.3.9-jdk-8

ADD http://mirrors.jenkins-ci.org/war/2.18/jenkins.war /opt/jenkins.war
RUN chmod 644 /opt/jenkins.war
ENV JENKINS_HOME /jenkins


 

VOLUME /root/.m2
VOLUME /jenkins


ENTRYPOINT ["java", "-jar", "/opt/jenkins.war"]
EXPOSE 8080
CMD [""]