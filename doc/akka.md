>* https://github.com/sksamuel/akka-patterns 
>* https://github.com/PacktPublishing/Mastering-Akka
>* http://shiyanjun.cn/archives/1168.html
>* http://shiyanjun.cn/archives/1178.html
>* http://shiyanjun.cn/archives/1186.html
>* http://www.cnblogs.com/xinsheng/p/4391808.html   spray 是基于 akka 的轻量级 scala 库，可用于编写 REST API 服务。
>* http://www.cnblogs.com/xinsheng/p/4615515.html   akka cluster 初体验
>* https://www.toptal.com/scala/concurrency-and-fault-tolerance-made-easy-an-intro-to-akka
>* https://www.zybuluo.com/xtccc/note/411926
>* https://manuel.bernhardt.io/2014/04/23/a-handful-akka-techniques/   A handful Akka techniques
>* http://www.moye.me/2016/08/21/akka-in-action_let-it-crash/   
>* http://www.moye.me/2016/08/14/akka-in-action_actor-model/
>* https://dzone.com/articles/getting-started-with-actors-akka-in-a-nutshell
Monitoring is thus used to tie one actor to another so that it may react to the other actor’s termination, in contrast to supervision which reacts to failure.

>* http://www.zhyea.com/2016/11/09/hello-akka.html 

Inbox允许开发者创建一个“actor-in-a-box”。也就是说在Inbox中可以包含一个傀儡式的Actor，通过这个傀儡Actor可以向其他Actor发送消息并接收它们的回复。可以使用Inbox.create()方法创建一个Inbox实例，并使用inbox.send()方法从中发送消息。Inbox内置的傀儡Actor会把收到的所有消息放到一个队列里面，而后可以使用inbox.receive()方法将消息取出来。如果取消息的时候队列为空，那么调用的receive方法将会阻塞——直到有一条消息可以取出位置。

>* http://www.cnblogs.com/qingwen/p/5168923.html#_label0

dispatcher从actorRef取出一条消息放在目标actor邮箱中，然后放mailbox放在一个Thread上；当MailBox的run方法运行的时候，它会从队列中取出一条消息， 然后将它传给Actor去处理。在Actor的世界中，邮箱一有机会就会要求Actor去完成自己的任务。
EventStream的订阅者只能是一个Actor。DefaultLogger默认订阅这些消息并打印到标准输出。
import context.dispatcher这条语句非常重要。schedule方法需要一个非常重要的隐式参数——ExecutionContext。schedule方法只是把消息发送封装到了一个Runnable中，而它最终是由传进来的ExecutionContext来执行的。
Actor是纯粹的分层结构。你所创建出来的Actor必定是某个Actor的子Actor。actorRef.path可以获取到actor路径。
子Actor：当某个任务由一个或多个子任务所组成的时候通常就会创建子Actor。或者当某个任务由父Actor执行比较容易出错，而你希望将它进行隔离的时候
ActorContext.watch和ActorContext.unwatch就是监控与取消监控的方法了。进行了监控之后，监控者会收到已停止的Actor发来的一条Terminated消息，它们只需要把这个消息放到receive函数的处理逻辑里就好了。 
监督（Supervision）：只存在于父子关系的actor之间。

# Actors 核心操作
- CREATE： 一个Actor可以创建另一个Actor，由于Actors是分层的结构，被创建的Actor将成为创建者的子节点
- SEND： 发送消息，形如 actor ! message
- BECOME：Actor在运行时的行为可以动态的改变（即指定下一次接收消息时，Actor的消息接收决策）
- SUPERVISE：  Actor可以监督他的子节点，并决定子结点出错时的处理策略


```scala
val workers = context.actorOf(Props[ItemProcessingWorker].withRouter(RoundRobinRouter(100)))
batch foreach { item =>   workers ! item     } // distribute the work

var router = {
    val routees = Vector.fill(5) {
      val r = context.actorOf(Props[Worker])
      context watch r
      ActorRefRoutee(r)
    }
    Router(RoundRobinRoutingLogic(), routees)
  }

val props1 = Props[MyActor]
val props2 = Props(new ActorWithArgs(“args”))
val prop3 = Props(classOf[ActorWithArgs], “arg”)

override val supervisorStrategy =
    OneForOneStrategy(maxNrOfRetries = 10, withinTimeRange = 30 seconds) {
      case _: ArithmeticException      => Resume
      case _: NullPointerException     => Restart
      case _: IllegalArgumentException => Stop
      case _: Exception                => Escalate
    }
```

>* https://github.com/endymecy/akka-guide-zh/blob/master/actors/routing.md


>* https://blog.udemy.com/scala-tutorial-getting-started-with-scala/
>* http://www.slideshare.net/fujohnwang/scala-thegoodparts
>* http://danielwestheide.com/blog/2013/02/27/the-neophytes-guide-to-scala-part-14-the-actor-approach-to-concurrency.html
>* http://rerun.me/2014/10/06/akka-notes-actor-messaging-request-and-response-3/
>* https://github.com/arunma/AkkaNotes_Messaging
>* http://alvinalexander.com/scala/simple-scala-akka-actor-examples-hello-world-actors
>* https://windor.gitbooks.io/beginners-guide-to-scala/content/index.html
>* http://colobu.com/2015/02/26/simple-scala-akka-actor-examples/
>* http://ibruce.info/2014/05/20/hello-akka/
>* http://udn.yyuap.com/doc/akka-doc-cn/2.3.6/scala/book/chapter1/03_getting_started.html
>* http://www.jianshu.com/p/df5e53d068f4
>* http://www.jianshu.com/p/9895fda11123


>* http://www.soso.io/article/8721.html   >* https://github.com/agiledon/SprayExample
>* http://www.smartjava.org/content/first-steps-rest-spray-and-scala
>* https://github.com/oermolaev/simple-scala-rest-example
>* http://my.oschina.net/FengJ/blog/261224  spring scala
>* http://my.oschina.net/FengJ/blog/228912  websocket
>* https://blog.pivotal.io/pivotal-labs/labs/spring-4-mvc-scala   >* https://github.com/robb1e/scala-spring4
>* http://my.oschina.net/FengJ/blog/228272  spray rest

cluster
http://blog.kamkor.me/Akka-Cluster-Load-Balancing/

course
http://reed.cs.depaul.edu/lperkovic/csc536/
http://cecs.wright.edu/~pmateti/Courses/7370/Lectures/Actors+Akka+Scala/akka.html
http://cecs.wright.edu/~pmateti/Courses/7370/Lectures/Actors/actors.html
http://cecs.wright.edu/~pmateti/Courses/7370/Lectures/Akka/dining-philosophers-akka-fsm.html

akka stream
>* http://www.moye.me/2016/08/28/akka_streams-linear_pipelines/
>* http://www.moye.me/2016/09/10/akka-streams_integrating-actors/  Akka Streams: Integrating with Actors


colossus
>* http://tumblr.github.io/colossus/docs/quickstart/
