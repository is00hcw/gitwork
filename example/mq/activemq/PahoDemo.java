package com.atsmart.mqtest;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;


//<dependency>
//<groupId>org.eclipse.paho</groupId>
//<artifactId>mqtt-client</artifactId>
//<version>0.4.0</version>
//</dependency>
public class PahoDemo {

  MqttClient client;
  
  public PahoDemo() {}

  public static void main(String[] args) {
    new PahoDemo().doDemo();
  }

  public void doDemo() {
    try {
      client = new MqttClient("tcp://115.28.225.5:1883", "pahomqttpublish1");
      client.connect();
      MqttMessage message = new MqttMessage();
      message.setPayload("A single message".getBytes());
      client.publish("pahodemo", message);
      client.disconnect();
      
      
      MqttConnectOptions options = new MqttConnectOptions();
      options.setCleanSession(true);

//      client = new MqttClient("tcp://115.28.225.5:1883", "pahomqtt2");
//      client.setCallback(new MqttCallback() {
//        
//        public void messageArrived(String topic, MqttMessage msg) throws Exception {
//          System.out.println("get topic : " + topic + " , msg: " + msg);
//        }
//        
//        public void deliveryComplete(IMqttDeliveryToken arg0) {
//          // TODO Auto-generated method stub
//          
//        }
//        
//        public void connectionLost(Throwable arg0) {
//          // TODO Auto-generated method stub
//          
//        }
//      });
//      client.connect(options);
//      client.subscribe(new String[]{"pahodemo"});  
//      Thread.sleep(3000);
//      client.disconnect();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}