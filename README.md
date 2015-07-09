workspace
=========
使用命令 ssh -v git@github.com测试 
查看我的密钥, ls ~/.ssh/ 可以使用如下命令查看密钥列表：ssh-add -l

键入命令：ssh-keygen -t rsa -C "email@email.com" "email@email.com"是github账号
 用记事本打开id_rsa.pub文件，复制内容，在https://github.com/settings/ssh页面，添加新公钥，随便取个名字

git config --global user.name "Your Real Name" 
git config --global user.email you@email.address 
git add README //更新README文件 
git commit -m "first commit"//提交更新，并注释信息“first commit”，注意是双引号，而非单引号 
git remote add origin git@github.com:defnngj/hello-world.git //连接远程github项目 
git push -u origin master //将本地项目更新到github项目上去 
http://blog.sina.com.cn/s/blog_700aa8830101kdp3.html

maven
http://maven.oschina.net/help.html
http://maven.oschina.net
http://maven.oschina.net/static/xml/settings.xml
http://www.cnblogs.com/fengbeihong/archive/2013/03/06/2946909.html
http://www.cnblogs.com/dingyingsi/p/3687077.html
mvn archetype:generate -DgroupId=com.mkyong -DartifactId=CounterWebApp -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false
mvn eclipse:eclipse -Dwtpversion=2.0
mvn help:effective-pom
http://www.mkyong.com/maven/how-to-create-a-web-application-project-with-maven/

change apache2 prot
http://blog.csdn.net/yeqishi/article/details/6867033

gitlab omnibus
http://demo.gitlab.com/gitlab/gitlab-shell/wikis/home
http://www.cnblogs.com/wintersun/p/3930900.html
https://bitnami.com/stack/gitlab/installer
默认用户名是 root , 密码是 5iveL!fe . 
http://bubbyroom.com/2014/07/05/Migrate-Gitlab-to-New-Server-and-add-https/  集中在 /var/opt/gitlab 和 /opt/gitlb postgresql nginx
http://www.tuicool.com/articles/v2iiQb
http://my.oschina.net/jingdor/blog/291096
backup  sudo gitlab-rake gitlab:backup:create
restore  sudo gitlab-rake gitlab:backup:restore
backups are stored in /var/opt/gitlab/backups
http://www.tuicool.com/articles/bYbi2mJ

Phabircator
http://www.blogjava.net/weiwei/articles/402664.html

sonar
http://www.tuicool.com/articles/YZ3aEj
/etc/apache2/ports.conf
/etc/apache2/sites-enabled/000-default/etc/apache2


activemq
http://www.cnblogs.com/xwdreamer/archive/2012/02/21/2360818.html


kafa
http://colobu.com/2014/08/06/kafka-quickstart/
http://colobu.com/2014/11/19/kafka-spring-integration-in-practice/

zookeeper
http://colobu.com/2014/09/11/curator-doc-about/
http://colobu.com/2014/09/11/curator-doc-recipes/
http://macrochen.iteye.com/blog/1366136
http://supben.iteye.com/blog/2094077
http://www.cnblogs.com/xguo/archive/2013/06/10/3130589.html
