## Linux - 创建自建服务
!> 以打包自己开发的Java应用到Linux服务器，作为一个服务启动，并开启自启。 @pdai

### 文件准备
```shell
[root@docker opt]# tree -a
.
└── tech_doc
    ├── bin
    │   ├── logs
    │   │   └── service.2018-10-31.log
    │   └── tech_arch-0.0.1-RELEASE.jar
    └── tech_doc
```

### 创建启动文件
tech_doc

```shell
[root@docker opt]# cat tech_doc/tech_doc
#!/bin/sh

#------------------------------------------------
# function: services start
# author: pdai
# home: /opt/tech_doc/bin
# log: /var/log/tech_doc/process
#------------------------------------------------

HOME=/opt/tech_doc/bin
LOGHOME=/var/log/tech_doc/process


function serviceLoad()
{
  b=''
  i=0
  while [ $i -le  100 ]
  do
      printf "$1:[%-50s]%d%%\r" $b $i
      sleep 0.3
      i=`expr 2 + $i`
      b=#$b
  done
  echo
}

function svcStart()
{
  echo "Starting $2 ..."
  cd $1
  PID=$(ps -ef | grep "$4" | grep -v grep | awk '{print $2}')
  if [ -z "$PID" ]; then
          nohup java -jar $3  > $5 2> $6 &
    serviceLoad $SERVICE_NAME
          echo "$2 started ..."
  else
          echo "$2 is already running ..."
  fi
}

function svcStop()
{
  PID=$(ps -ef | grep "$1" | grep -v grep | awk '{print $2}')
  if [ -z "$PID" ]; then
          echo "$2 already stopped ..."
  else
    kill $PID
        echo "$2 is stoping ..."
  fi
}

function do_start()
{
  for FILE in `ls $HOME | grep jar`
  do
    FILE_NAME=$FILE
    SERVICE_JAR_PACKAGE_PATH=$HOME/$FILE
    SERVICE_NAME=${FILE_NAME%-[0-9]*}
    SERVICE_LOG_PATH="$LOGHOME/$SERVICE_NAME.log"
    SERVICE_ERR_LOG_PATH="$LOGHOME/$SERVICE_NAME.err"

    svcStart $HOME $SERVICE_NAME $SERVICE_JAR_PACKAGE_PATH $FILE_NAME $SERVICE_LOG_PATH $SERVICE_ERR_LOG_PATH
  done
}

function do_stop()
{
    for FILE in `ls $HOME | grep jar`
  do
    FILE_NAME=$FILE
    SERVICE_NAME=${FILE_NAME%-[0-9]*}
    SERVICE_PID_PATH="/tmp/$SERVICE_NAME.pid"

    svcStop $FILE_NAME $SERVICE_NAME
    sleep 1
  done
}

function do_check()
{
    for FILE in `ls $HOME | grep jar`
  do
    FILE_NAME=$FILE
    SERVICE_NAME=${FILE_NAME%-[0-9]*}
    PID=$(ps -ef | grep $FILE_NAME | grep -v grep | awk '{print $2}')
  if [ -z "$PID" ]; then
          echo "$SERVICE_NAME $PID is not running ..."
  else
        echo "$SERVICE_NAME $PID is running ..."
  fi

    sleep 1
  done
}

case "$1" in
    start)

        do_start
        echo start successful

    ;;
    stop)

        do_stop
        echo stop successful

    ;;
    restart)

        do_stop
              sleep 2
        do_start
        echo restart successful

    ;;
    status)

        do_check

    ;;
    *)
    echo "Usage: {start|stop|restart|status}" >&2
    exit 3
    ;;
esac
exit 0
```

### 制作服务
在init.d下创建服务

```shell
[root@docker init.d]# tree -a
.
├── functions
├── netconsole
├── network
├── README
└── tech-doc
```

tech-doc内容如下：

```shell
[root@docker opt]# cd /etc/init.d
[root@docker init.d]# ls
functions  netconsole  network  README  tech-doc
[root@docker init.d]# tree -a
.
├── functions
├── netconsole
├── network
├── README
└── tech-doc

0 directories, 5 files
[root@docker init.d]# ^C
[root@docker init.d]# cat tech-doc
#!/bin/sh
#
# /etc/init.d/tech-doc
# chkconfig: 2345 60 20
# description: ms.
# processname: tech-doc

SCRIPT_HOME=/opt/tech_doc

case $1 in
    start)
        sh $SCRIPT_HOME/tech_doc start
    ;;
    stop)
        sh $SCRIPT_HOME/tech_doc stop
    ;;
    restart)
        sh $SCRIPT_HOME/tech_doc stop
        sh $SCRIPT_HOME/tech_doc start
    ;;
    status)
        sh $SCRIPT_HOME/tech_doc status
    ;;
    *)
    echo "Usage: {start|stop|restart|status}" >&2
    exit 3
    ;;
esac
exit 0
```

### 赋予权限
```shell
chmod 777 /etc/init.d/tech-doc
```

### 开机自启
```shell
chkconfig --list
chkconfig tech-doc on
```

### 查看端口
```shell
netstat -nltp
```

### 查看防火墙
```shell
systemctl status firewalld
```


