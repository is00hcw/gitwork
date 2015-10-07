package com.atsmart;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;



/**
 * mvn exec:java -Dexec.mainClass="com.atsmart.App"
 */
public class App {
    public static void main(String[] args) {

        try {
            new App().start(9090);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void start(int port) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap()
                    .group(group)
                    .channel(NioServerSocketChannel.class)
                    .localAddress(port)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) throws Exception {
                            ch.pipeline()
                                    .addLast(new DemoCommandDecoder())
                                    .addLast(new DemoReplyEncoder())
                                    .addLast(new DemoCommandHandler());
                        }
                    });

            // Bind and start to accept incoming connections.
            ChannelFuture f = b.bind(port).sync();
            System.out.println("bind " + port);
            // Wait until the server socket is closed.
            f.channel().closeFuture().sync();
            System.out.println("close");
        } finally {
            // Shutdown the EventLoopGroup, which releases all resources.
            group.shutdownGracefully();
        }
    }

}

