package com.demo.demo;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;





public class App
{
  public static void main(String[] args)
    throws Exception
  {
    Server server = new Server();
    
    ServerConnector connector = new ServerConnector(server);
    connector.setPort(7080);
    server.setConnectors(new Connector[] { connector });
    
    ServletContextHandler webApiContext = new ServletContextHandler();
    webApiContext.setContextPath("/");
    
    webApiContext.addServlet(new ServletHolder(AppTokenServer.class), "/sts/*");
    webApiContext.addServlet(new ServletHolder(CallbackServer.class), "/callback/*");
    webApiContext.addServlet(new ServletHolder(PostObjectPolicy.class), "/get-post-policy/*");
   
//    webApiContext.addServlet(new ServletHolder(STSToken.class), "/2/*");
//    webApiContext.addServlet(new ServletHolder(CallbackServer.class), "/3/*");
//    webApiContext.addServlet(new ServletHolder(DownloadApi.class), "/download/*");
    webApiContext.setSessionHandler(new SessionHandler());
    
    HandlerList handlers = new HandlerList();
    handlers.setHandlers(new Handler[] { webApiContext, new DefaultHandler() });
    
    server.setHandler(handlers);
    server.start();
    server.join();
  }
}
