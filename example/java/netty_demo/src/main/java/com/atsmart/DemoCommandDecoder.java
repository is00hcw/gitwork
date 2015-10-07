package com.atsmart;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandler;
import io.netty.handler.codec.ReplayingDecoder;

import java.util.List;

/**
 * Created by hcw on 2015/10/3.
 */
public class DemoCommandDecoder extends ReplayingDecoder<Void> implements ChannelInboundHandler {
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        String cmd = readString(in);
        System.out.println(cmd);
        String param = readString(in);
        System.out.println(param);
        out.add(new Command(cmd, param));
        checkpoint();
    }

    private String readString(ByteBuf in) {
        int len = 0;
        StringBuilder sb = new StringBuilder();
        while(true){
            byte b = in.readByte();
            if(b == ' ' || b == '\n' )
                break;

            if(b == '\r') {
                in.skipBytes(1);
                break;
            }
            sb.append((char)b);
            len ++;
            if(len > 30)
                break;

        }
        return sb.toString();
    }

}
