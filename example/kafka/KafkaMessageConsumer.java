import kafka.consumer.Consumer;
import kafka.consumer.ConsumerIterator;
import kafka.consumer.KafkaStream;
import kafka.javaapi.consumer.ConsumerConnector;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 http://www.ashishpaliwal.com/blog/2015/06/kafka-cookbook-simple-consumer/
 * Simple Consumer
 */
public class KafkaMessageConsumer {
  public static void main(String[] args) {
    Properties config = new Properties();
    config.put("zookeeper.connect", "localhost:2181");
    config.put("group.id", "default");
    config.put("partition.assignment.strategy", "roundrobin");
    config.put("bootstrap.servers", "localhost:9092");
    config.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
    config.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
    kafka.consumer.ConsumerConfig consumerConfig = new kafka.consumer.ConsumerConfig(config);

    ConsumerConnector consumerConnector = Consumer.createJavaConsumerConnector(consumerConfig);

    Map<String, Integer> topicCountMap = new HashMap<String, Integer>();
    topicCountMap.put("testTopic", 1);

    Map<String, List<KafkaStream<byte[], byte[]>>> consumerMap = consumerConnector.createMessageStreams(topicCountMap);

    List<KafkaStream<byte[], byte[]>> streamList = consumerMap.get("testTopic");

    KafkaStream<byte[], byte[]> stream = streamList.get(0);

    ConsumerIterator<byte[], byte[]> iterator = stream.iterator();
    while(iterator.hasNext()) {
      System.out.println(new String(iterator.next().message()));
    }

  }

  public static void processRecords(Map<String, ConsumerRecords<String, String>> records) {
    List<ConsumerRecord<String, String>> messages = records.get("testTopic").records();
    if(messages != null) {
      for (ConsumerRecord<String, String> next : messages) {
        try {
          System.out.println(next.value());
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    } else {
      System.out.println("No messages");
    }
  }
}