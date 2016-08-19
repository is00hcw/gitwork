package com.atsmart;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelHandler.Sharable;
/**
 * Sharable表示此对象在channel间共享
 * handler类是我们的具体业务类
 * */
@Sharable//注解@Sharable可以让它在channels间共享
public class EchoServerHandler extends ChannelInboundHandlerAdapter{
	public void channelRead(ChannelHandlerContext ctx, Object msg) {
		System.out.println("server received data :" + msg); 
		ctx.write(msg);//写回数据，
	} 
	public void channelReadComplete(ChannelHandlerContext ctx) { 
		ctx.writeAndFlush(Unpooled.EMPTY_BUFFER) //flush掉所有写回的数据
		.addListener(ChannelFutureListener.CLOSE); //当flush完成后关闭channel
	} 
	public void exceptionCaught(ChannelHandlerContext ctx,Throwable cause) { 
		cause.printStackTrace();//捕捉异常信息
		ctx.close();//出现异常时关闭channel 
	} 	
}