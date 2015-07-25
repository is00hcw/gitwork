enablePlugins(JavaServerAppPackaging)

//EclipseKeys.createSrc := EclipseCreateSrc.Default + EclipseCreateSrc.Resource 

name := "first_scala"
 
version := "1.0"
 
scalaVersion := "2.11.6"
 
resolvers ++=
  Seq(Resolver.typesafeRepo("releases"),		// "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/"
      "Spray Repository"    at "http://repo.spray.io",
      "Maven Repository"     at "http://repo.maven.apache.org/maven2",  
      "Apache Repository"    at "https://repository.apache.org/content/repositories/releases",  
      "JBoss Repository"     at "https://repository.jboss.org/nexus/content/repositories/releases/",  
      "MQTT Repository"      at "https://repo.eclipse.org/content/repositories/paho-releases/",  
      "Cloudera Repository"  at "http://repository.cloudera.com/artifactory/cloudera-repos/",  
      // For Sonatype publishing  
      // "sonatype-snapshots"   at "https://oss.sonatype.org/content/repositories/snapshots",  
      // "sonatype-staging"     at "https://oss.sonatype.org/service/local/staging/deploy/maven2/",  
      // also check the local Maven repository ~/.m2  
      Resolver.mavenLocal)

libraryDependencies ++= {
  val akkaVersion       = "2.3.10"  
  val sprayVersion      = "1.3.3"
  Seq(
    "com.typesafe.akka" %% "akka-actor"      % akkaVersion  withSources (),  
    "io.spray"          %% "spray-can"       % sprayVersion withSources (),
    "io.spray"          %% "spray-routing"   % sprayVersion withSources (),
    "io.spray"          %% "spray-json"      % "1.3.1" withSources (),
    "com.typesafe.akka" %% "akka-slf4j"      % akkaVersion withSources (),
    "ch.qos.logback"    %  "logback-classic" % "1.1.3",
    "com.typesafe.akka" %% "akka-testkit"    % akkaVersion   % "test" withSources (),
    "org.scalatest"     %% "scalatest"       % "2.2.0"       % "test" withSources ()
  )
}      
 
// "com.typesafe.akka" % "akka-actor_2.10" % "2.3.11"