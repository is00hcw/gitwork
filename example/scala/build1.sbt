name := "Casbah Tutorial"

version := "0.1"

scalaVersion := "2.11.4"

resolvers += "rediscala" at "http://dl.bintray.com/etaty/maven"

resolvers += "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/"

libraryDependencies += "org.mongodb" %% "casbah" % "2.8.1"

libraryDependencies += "net.debasishg" %% "redisclient" % "3.0"

libraryDependencies += "com.etaty.rediscala" %% "rediscala" % "1.4.0"

libraryDependencies += "org.slf4j" % "slf4j-api" % "1.7.5"

libraryDependencies ++= Seq(
                            "ch.qos.logback" % "logback-core" % "1.0.13",
                            "ch.qos.logback" % "logback-classic" % "1.0.13"
                            )