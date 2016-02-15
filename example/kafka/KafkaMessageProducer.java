package com.soyatec;

import org.apache.kafka.clients.producer.*;

import java.util.HashMap;
import java.util.Map;

/**
http://www.ashishpaliwal.com/blog/2015/06/kafka-cookboook-simple-producer/
<dependency>
      <groupId>org.apache.kafka</groupId>
      <artifactId>kafka-clients</artifactId>
      <version>0.8.2.1</version>
    </dependency>
    <dependency>
      <groupId>org.apache.kafka</groupId>
      <artifactId>kafka_2.10</artifactId>
      <version>0.8.2.1</version>
    </dependency>
    
 * Simple Producer
 */
public class KafkaMessageProducer {

  public static void main(String[] args) {
    Map<String, Object> config = new HashMap<String, Object>();
    config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    config.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
    config.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
    KafkaProducer<String, String> producer = new KafkaProducer<String, String>(config);

    int maxMessages = 1000;

    int count = 0;
    while(count < maxMessages) {
        ProducerRecord<String, String> record = new ProducerRecord<String, String>("testTopic", "msg", "message --- #" + count++);
        producer.send(record, new Callback() {

            public void onCompletion(RecordMetadata recordMetadata, Exception e) {
                System.out.println("Received ack for partition=" + recordMetadata.partition() +
                        " offset = " + recordMetadata.offset()) ;
            }
        });
      System.out.println("Message send.."+count);
    }
  }

}