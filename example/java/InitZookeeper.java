package com.dangdang.config.service.easyzk.demo;

import java.util.Map;
import java.util.Map.Entry;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.ExponentialBackoffRetry;
import org.apache.zookeeper.data.Stat;

import com.google.common.collect.Maps;
import com.google.common.hash.Hashing;

/**
 * 先运行我
 * 
 * @author <a href="mailto:wangyuxuan@jiuxian.com">Yuxuan Wang</a>
 *
 */
public class InitZookeeper {

  /**
   * Change This To Your Zk Address
   */
  private static final String ZK = "localhost:2181";

  private static final Map<String, String> data = Maps.newHashMap();

  static {
    data.put("/config_test", sha1Digest("abcd"));
    data.put("/config_test/1.0/property-group1/string_property_key", "Config-Toolkit");
    data.put("/config_test/1.0/property-group1/int_property_key", "1123");
    data.put("/config_test/1.0/property-group1/cool", "true");
    data.put("/config_test/1.0/property-group2/cool", "false");
  }

  private static String sha1Digest(String text) {
    return Hashing.sha1().hashBytes(text.getBytes()).toString();
  }

  public static void main(String[] args) throws Exception {
    CuratorFramework client =
        CuratorFrameworkFactory.newClient(ZK, new ExponentialBackoffRetry(100, 2));
    client.start();

    for (Entry<String, String> item : data.entrySet()) {
      Stat stat = client.checkExists().forPath(item.getKey());
      if (stat == null) 
      {
        client.create().creatingParentsIfNeeded()
            .forPath(item.getKey(), item.getValue().getBytes());
      }else{
        client.setData().forPath(item.getKey(), item.getValue().getBytes());
      }
    }
  }

}
