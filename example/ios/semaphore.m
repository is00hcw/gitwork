// http://www.cnblogs.com/kenshincui/p/3983982.html  iOS开发系列--并行开发其实很容易
// http://www.jianshu.com/p/098328f17ff6
// 使用 Dispatch Semaphore 控制并发线程数量
/*
无论什么队列和什么任务，线程的创建和回收不需要程序员参与，由队列来负责，程序员只需要面对队列和任务。
GCD在后端管理这一个线程池，GCD不仅决定着Block代码块将在哪个线程中被执行，
而且还可以根据可用的系统资源对这些线程进行管理，从而让开发者从线程管理的工作中解放出来，
通过GCD这种集中的管理线程，缓解了大量的线程被创建的问题。
http://blog.csdn.net/liu537192/article/details/44858087
*/
 void dispatch_async_limit(dispatch_queue_t queue,NSUInteger limitSemaphoreCount, dispatch_block_t block) {
//控制并发数的信号量
    static dispatch_semaphore_t limitSemaphore;

    //专门控制并发等待的线程
    static dispatch_queue_t receiverQueue;

    //使用 dispatch_once而非 lazy 模式，防止可能的多线程抢占问题
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        limitSemaphore = dispatch_semaphore_create(limitSemaphoreCount);
        receiverQueue = dispatch_queue_create("receiver", DISPATCH_QUEUE_SERIAL);
    });

    // 如不加 receiverQueue 放在主线程会阻塞主线程
    dispatch_async(receiverQueue, ^{
        //可用信号量后才能继续，否则等待
        dispatch_semaphore_wait(limitSemaphore, DISPATCH_TIME_FOREVER);
        dispatch_async(queue, ^{
            !block ? : block();
            //在该工作线程执行完成后释放信号量
            dispatch_semaphore_signal(limitSemaphore);
        });
    });
}