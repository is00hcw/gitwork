/*
 * Copyright 1999-2012 Alibaba Group.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
package com.atsmart.dubbo_rpc;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.atsmart.dubbo_rpc.api.CacheService;


/**
 * CacheConsumer
 * 
 * @author william.liangf
 */
public class CacheConsumer {

  public static void main(String[] args) throws Exception {
    String config =
        CacheConsumer.class.getPackage().getName().replace('.', '/') + "/cache-consumer.xml";
    ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(config);
    context.start();

    CacheService cacheService = (CacheService) context.getBean("cacheService");

    // 测试缓存生效，多次调用返回同样的结果。(服务器端自增长返回值)
    for (int i = 0; i < 3; i++) {
      String result = cacheService.findCache("0");
      System.out.println("OK: " + result);
      Thread.sleep(500);
    }

  }

}
