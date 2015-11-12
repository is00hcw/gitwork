package com.dianping.pigeon.demo.provider;
    import com.dianping.pigeon.demo.EchoService;
    public class EchoServiceImpl implements EchoService {
        public String echo(String name) {
            return "Hello " + name;
        }
    }