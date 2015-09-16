package com.eurotech.test;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.eclipse.paho.client.mqttv3.MqttSecurityException;
import org.eclipse.paho.client.mqttv3.persist.MqttDefaultFilePersistence;

public class MqttClientTest {

  private static final MqttDefaultFilePersistence DATA_STORE = new MqttDefaultFilePersistence(
      System.getProperty("java.io.tmpdir"));

  public static void main(String[] args) {
    MqttConnectOptions options = new MqttConnectOptions();
    options.setCleanSession(true);
    options.setKeepAliveInterval(5);
    try {
      MqttClient client = new MqttClient("tcp://115.28.72.210:1883", "client_id", DATA_STORE);
      client.setCallback(new MqttCallback() {

        public void connectionLost(Throwable cause) {
          System.err.println("Connection Lost");
        }

        public void messageArrived(String topic, MqttMessage message) throws Exception {
          System.err.println("Message Arrived on [" + topic + "] with "
              + new String(message.getPayload()));
        }

        public void deliveryComplete(IMqttDeliveryToken token) {
          System.err.println("Delivery Complete: " + token.getMessageId());
        }

      });


      client.connect(options);
      String expectedResult = "hello mqtt broker on QOS 0";
      client.subscribe("test");
      client.publish("test", expectedResult.getBytes(), 0, false);
//      if (client != null && client.isConnected()) {
//        client.disconnect();
//      }
    } catch (MqttSecurityException e) {
      e.printStackTrace();
    } catch (MqttPersistenceException e) {
      e.printStackTrace();
    } catch (MqttException e) {
      e.printStackTrace();
    }
  }

}
