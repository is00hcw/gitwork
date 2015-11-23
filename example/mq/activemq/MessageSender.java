package com.atsmart.mqtest;
import javax.jms.Connection;  
import javax.jms.Destination;  
import javax.jms.JMSException;  
import javax.jms.MessageProducer;  
import javax.jms.Session;  
import javax.jms.TextMessage;  
  
import org.apache.activemq.ActiveMQConnectionFactory;  
  
public class MessageSender {  
    private static String URL = "tcp://115.28.225.5:61616";  
    private static String QUEUE_NAME = "test_queue";  
      
    public void sendMsg() {  
        ActiveMQConnectionFactory factory =   
            new ActiveMQConnectionFactory(URL);  
        try {  
            Connection conn = factory.createConnection();  
            conn.start();  
            Session sess = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);  
            Destination dest = sess.createQueue(QUEUE_NAME);  
            MessageProducer producer = sess.createProducer(dest);  
            TextMessage msg = sess.createTextMessage("Just a test!");  
            producer.send(msg);  
               
            sess.close();  
            conn.close();  
        } catch (JMSException e) {  
            e.printStackTrace();  
        }  
    }  
      
    public static void main(String[] args) {  
        MessageSender sender = new MessageSender();  
        sender.sendMsg();  
    }  
}  