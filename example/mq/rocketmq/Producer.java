package com.atsmart.rocketmq_test;

import com.alibaba.rocketmq.client.producer.DefaultMQProducer;
import com.alibaba.rocketmq.client.producer.SendResult;
import com.alibaba.rocketmq.common.message.Message;

// http://blog.csdn.net/a19881029/article/details/34446629
public class Producer {
  public static void main(String[] args) {
    DefaultMQProducer producer = new DefaultMQProducer("Producer");
    producer.setNamesrvAddr("xxxx:9876");
    try {
      producer.start();

      Message msg = new Message("PushTopic", "push", "1", "Just for test.".getBytes());

      SendResult result = producer.send(msg);
      System.out.println("id:" + result.getMsgId() + " result:" + result.getSendStatus());

      msg = new Message("PushTopic", "push", "2", "Just for test.".getBytes());

      result = producer.send(msg);
      System.out.println("id:" + result.getMsgId() + " result:" + result.getSendStatus());

      msg = new Message("PullTopic", "pull", "1", "Just for test.".getBytes());

      result = producer.send(msg);
      System.out.println("id:" + result.getMsgId() + " result:" + result.getSendStatus());
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      producer.shutdown();
    }
  }
}
