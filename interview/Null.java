package com.atsmart.music;

public class Null {
  public static void hello() {
    System.out.println("hello");
  }


  private static class HelloA {
    public HelloA() {
      System.out.println("HelloA");
    }

    {
      System.out.println("I'm A class");
    }

    static {
      System.out.println("static A");
    }
  }
  private static class HelloB extends HelloA {
    public HelloB() {
      System.out.println("HelloB");
    }

    {
      System.out.println("I'm B class");
    }

    static {
      System.out.println("static B");
    }

    public static void main(String[] args) {
      // ((NULL)null).hello();
      // NULL _null = (NULL)null;
      // _null.hello();
      System.out.println("main start");
      new HelloB();
      new HelloB();
      System.out.println("main end");
    }
  }
}
