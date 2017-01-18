package com.wanke;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Created by Chuwei on 2017/1/18.
 */
public class LockCondition {
    static final ReentrantLock lock = new ReentrantLock();
    static final Condition cond = lock.newCondition();

    public static class WaitTask implements Runnable{

        @Override
        public void run() {
//            lock.lock();
            try {
                lock.lockInterruptibly();//获取响应中断锁
                System.out.println("before wait....");
                cond.await();
                System.out.println("after wait....");
            } catch (InterruptedException e) {
                System.out.println("interrupt wait...");
            } finally {
                lock.unlock();
            }
        }
    }

    public static class NotifyTask implements Runnable{

        @Override
        public void run() {
            lock.lock();
            try {
                System.out.println("before notify....");
                Thread.sleep(1000);
                cond.signalAll();
               // Thread.yield();
                Thread.sleep(2000);
                System.out.println("after notify....");
            } catch (InterruptedException e) {
                System.out.println("interrupt notify...");
            } finally {
                lock.unlock();
            }
        }
    }

    public static void main(String[] args) {
        Thread w = new Thread(new JavaWaitNotify.WaitTask());
        Thread n = new Thread(new JavaWaitNotify.NotifyTask());
        w.start();
        n.start();
        System.out.println("thread start...");
    }
}
