package com.wanke;

/**
 * Created by Chuwei on 2017/1/18.
 */
public class WaitNotify {
    static final Object mutex = new Object();

    public static class WaitTask implements Runnable{

        @Override
        public void run() {
            synchronized (mutex){
                System.out.println("before wait....");
                try {
                    mutex.wait();
                } catch (InterruptedException e) {
                    System.out.println("interrupt wait...");
                }
                System.out.println("after wait....");
            }

        }
    }

    public static class NotifyTask implements Runnable{

        @Override
        public void run() {
            synchronized (mutex){
                System.out.println("before notify....");
                mutex.notifyAll();
                System.out.println("after notify....");
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("after sleep...");   // 只有离开synchronized才会释放锁,唤醒的线程才能继续操作
            }
        }
    }

    public static void main(String[] args) {
        Thread w = new Thread(new WaitTask());
        Thread n = new Thread(new NotifyTask());
        w.start();
        n.start();
        System.out.println("thread start...");
    }
}
