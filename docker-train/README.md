```shell
cd 7_engine_hub/training/
cd platform-train
mvn clean package
java -jar target/platform-train-0.1.0.jar

cd docker-train
cp ../7_engine_hub/training/platform-train/target/platform-train-0.1.0.jar platform-train/

sudo docker-compose build

sudo docker-compose up
sudo docker-compose up -d
sudo docker-compose stop
sudo docker-compose down

sudo docker-compose logs -f

http://49.232.6.131:8095

cd 7_engine_hub/training/platform-train-ui
"core-js": "^3.22.5",
cnpm install
npm run dev

https://git-lfs.github.com

git lfs pull origin main
git lfs pull
# git pull 忽略lfs
GIT_LFS_SKIP_SMUDGE=1 git pull
set GIT_LFS_SKIP_SMUDGE=1  
git clone SERVER-REPOSITORY
git config --global filter.lfs.smudge "git-lfs smudge --skip -- %f"
git config --global filter.lfs.process "git-lfs filter-process --skip"
    
git clone SERVER-REPOSITORY
git config --global filter.lfs.smudge "git-lfs smudge -- %f"
git config --global filter.lfs.process "git-lfs filter-process"

strings /usr/lib64/libstdc++.so.6 | grep 'CXXAB'
sudo yum install libstdc++

sudo docker run -ti --volume="$(pwd)":/app --rm openjdk:8-jre bash
cd /app
java -jar target/platform-train-0.1.0.jar

sudo docker exec -it 76768d8d698b bash
ls /root/.djl.ai/
apt-get update
apt-get install gcc -y
apt-get install g++ -y
strings /usr/lib/gcc/x86_64-linux-gnu/10/libstdc++.so |grep 'CXXAB'
apt-get install net-tools -y
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