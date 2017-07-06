docker build -t drill:1.10.0 .
docker run -p 8047:8047 --rm -it -e DRILL_HEAP=1G drill:1.10.0 /drill-scripts/bootstrap.sh

打开web界面
http://192.168.99.100:8047/

https://segmentfault.com/a/1190000009516498