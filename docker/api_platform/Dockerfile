FROM openjdk:8-jre
RUN cp /etc/apt/sources.list /etc/apt/sources.list.bak
COPY sources.list /etc/apt/sources.list
RUN apt-get update
RUN apt-get install vim -y
RUN apt-get install gcc -y
RUN apt-get install g++ -y
RUN apt-get install net-tools -y
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone
COPY application.yml application.yml
COPY api-platform-0.1.0.jar api-platform-0.1.0.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","api-platform-0.1.0.jar"]