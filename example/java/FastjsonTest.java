package com.atsmart.dubbo_rpc;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
  <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>fastjson</artifactId>
      <version>1.1.33</version>
  </dependency>
 * Unit test for simple App.
 */
public class FastjsonTest extends TestCase {
  /**
   * Create the test case
   *
   * @param testName name of the test case
   */
  public FastjsonTest(String testName) {
    super(testName);
  }

  /**
   * @return the suite of tests being tested
   */
  public static Test suite() {
    return new TestSuite(FastjsonTest.class);
  }

  /**
   * Rigourous Test :-)
   */
  public void testApp() {
    System.out.println(JSON.parseObject("{'a':1}"));
    System.out.println(JSON.parseArray("[1,2,3]"));
    System.out.println(JSON.parse("[1,2,3]"));
    Map a = new HashMap();
    a.put("key", 1);
    System.out.println(JSON.toJSON(a));
    System.out.println(JSON.toJSONString(a));
    String jsonStr =
        "[{\"JACKIE_ZHANG\":\"张学友\"},{\"ANDY_LAU\":\"刘德华\"},{\"LIMING\":\"黎明\"},{\"Aaron_Kwok\":\"郭富城\"}]";
    List<Map<String, Object>> listMap =
        JSON.parseObject(jsonStr, new TypeReference<List<Map<String, Object>>>() {});
    System.out.println(listMap);
  }
}
