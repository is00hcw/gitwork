package com.wanke.basic;

/**
 * Created by Chuwei on 2017/1/18.
 */
public class Singleton {
    static {
        System.out.println("static block");  // 1
    }

    private Singleton(){
        System.out.println("Singleton");  // 3
    }

    private static class Holder{
        private static Singleton instance = new Singleton();  // 用到才会初始化,不会立即调用
    }

    public static Singleton getInstance(){
        return Holder.instance;
    }

    public static void main(String[] args) {
        System.out.println("main");  // 2
        Singleton obj = Singleton.getInstance();
    }

}
