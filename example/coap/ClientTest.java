package com.atsmart.coap;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapHandler;
import org.eclipse.californium.core.CoapObserveRelation;
import org.eclipse.californium.core.CoapResponse;
import org.eclipse.californium.core.coap.Request;

public class ClientTest {

  public static void main(String[] args) {
    final CoapClient client = new CoapClient("coap://localhost:5683/hello");
    Request get = Request.newGet().setURI(client.getURI());
    get.getOptions().addUriQuery("param=abc");
    String content1 = client.advanced(get).getResponseText();
    System.out.println("RESPONSE 1: " + content1);

    System.out.println(client.discover());
    final AtomicInteger count = new AtomicInteger(0);
    final List<CoapObserveRelation> obs = new ArrayList<CoapObserveRelation>();
    final CoapObserveRelation rel = client.observe(new CoapHandler() {
      @Override
      public void onLoad(CoapResponse response) {
        String content = response.getResponseText();
        System.out.println("NOTIFICATION: " + content);
        int c = count.incrementAndGet();
        
        if(c > 5 && obs.size() > 0)
          obs.get(0).reactiveCancel();
      }

      @Override
      public void onError() {
        System.err.println("OBSERVING FAILED (press enter to exit)");
      }
    });
    obs.add(rel);
    
    try {
      Thread.sleep(1000000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

  }

}
