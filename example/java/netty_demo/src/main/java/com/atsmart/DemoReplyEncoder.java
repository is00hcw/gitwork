package com.atsmart;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;

/**
 * Created by hcw on 2015/10/3.
 */
public class DemoReplyEncoder extends MessageToByteEncoder<Reply> {
    byte[] CRLF = new byte[] { '\r', '\n' };
    byte[] SEP = new byte[] {' '};

    @Override
    protected void encode(ChannelHandlerContext ctx, Reply msg, ByteBuf out) throws Exception {
        out.writeInt(msg.code);
        out.writeBytes(SEP);
        out.writeBytes(msg.msg.getBytes("UTF-8"));
        out.writeBytes(CRLF);

    }
}
