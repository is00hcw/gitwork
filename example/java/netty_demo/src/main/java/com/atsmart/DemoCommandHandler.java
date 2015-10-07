package com.atsmart;

import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

/**
 * Created by hcw on 2015/10/3.
 */
public class DemoCommandHandler extends SimpleChannelInboundHandler<Command> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, Command msg) throws Exception {
        System.out.println(msg.cmd + " " + msg.param);
        if(msg.cmd.equals("echo")) {
            Reply r = new Reply(0, msg.param);
            ctx.writeAndFlush(r);
        }
    }
}
