```shell
cd 7_engine_hub/api_platform/
cd api-platform
mvn package
java -jar target/api-platform-0.1.0.jar

strings /usr/lib64/libstdc++.so.6 | grep 'CXXAB'
sudo yum install libstdc++

sudo docker run -ti --volume="$(pwd)":/app --rm openjdk:8-jre bash
cd /app
java -jar target/api-platform-0.1.0.jar

sudo docker exec -it 76768d8d698b bash
ls /root/.djl.ai/
apt-get update
apt-get install gcc -y
```