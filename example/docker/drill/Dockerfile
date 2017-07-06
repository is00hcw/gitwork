FROM java:8
RUN     mkdir -p /drill-scripts && \
        mkdir -p /opt/drill
RUN curl -o apache-drill-1.10.0.tar.gz http://mirror.bit.edu.cn/apache/drill/drill-1.10.0/apache-drill-1.10.0.tar.gz
#COPY apache-drill-1.10.0.tar.gz apache-drill-1.10.0.tar.gz
RUN tar zxpf apache-drill-1.10.0.tar.gz -C /opt/drill

ADD bootstrap.sh /drill-scripts/bootstrap.sh
RUN chown root:root /drill-scripts/bootstrap.sh && \
    chmod 700 /drill-scripts/bootstrap.sh
ENV BOOTSTRAP /drill-scripts/bootstrap.sh


#
# Expose the Apache Drill Web UI
# https://drill.apache.org/docs/storage-plugin-registration/
#
EXPOSE 8047