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
apt-get install g++
strings /usr/lib/gcc/x86_64-linux-gnu/10/libstdc++.so |grep 'CXXAB'
apt-get install net-tools
/root/.djl.ai

sudo docker cp docker/sources.list 76768d8d698b:/etc/apt/sources.list
```

```xml
<exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
```