//
//  PluginTest.m
//  HBuilder-Hello
//
//  Created by Mac Pro on 14-9-3.
//  Copyright (c) 2014年 DCloud. All rights reserved.
//

#import "PluginTest.h"
@implementation PGPluginTest

- (void)PluginTestFunction:(PGMethod*)commands
{
	if ( commands ) {
    
        // CallBackid 异步方法的回调id，H5+ 会根据回调ID通知JS层运行结果成功或者失败
        NSString* cbId = [commands.arguments objectAtIndex:0];
        
        // 用户的参数会在第二个参数传回
        NSString* pArgument1 = [commands.arguments objectAtIndex:1];
        NSString* pArgument2 = [commands.arguments objectAtIndex:2];
        NSString* pArgument3 = [commands.arguments objectAtIndex:3];
        NSString* pArgument4 = [commands.arguments objectAtIndex:4];
        
        // 如果使用Array方式传递参数
        NSArray* pResultString = [NSArray arrayWithObjects:pArgument1, pArgument2, pArgument3, pArgument4, nil];
        
        // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
        PDRPluginResult *result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsArray: pResultString];

        // 如果Native代码运行结果和预期不同，需要通过回调通知JS层出现错误，并返回错误提示
        //PDRPluginResult *result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"惨了! 出错了！ 咋(wu)整(liao)"];

        // 通知JS层Native层运行结果
        [self toCallback:cbId withReslut:[result toJSONString]];
    }
}

- (void)PluginTestFunctionArrayArgu:(PGMethod*)commands
{
    if ( commands ) {
        
        // CallBackid 异步方法的回调id，H5+ 会根据回调ID通知JS层运行结果成功或者失败
        NSString* cbId = [commands.arguments objectAtIndex:0];
        
        // 用户的参数会在第二个参数传回，可以按照Array方式传入，
        NSArray* pArray = [commands.arguments objectAtIndex:1];
        
        // 如果使用Array方式传递参数
        NSString* pResultString = [NSString stringWithFormat:@"%@ %@ %@ %@",[pArray objectAtIndex:0], [pArray objectAtIndex:1], [pArray objectAtIndex:2], [pArray objectAtIndex:3]];
        
        // 运行Native代码结果和预期相同，调用回调通知JS层运行成功并返回结果
        PDRPluginResult *result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsString:pResultString];
        
        // 如果Native代码运行结果和预期不同，需要通过回调通知JS层出现错误，并返回错误提示
        //PDRPluginResult *result = [PDRPluginResult resultWithStatus:PDRCommandStatusError messageAsString:@"惨了! 出错了！ 咋(wu)整(liao)"];
        
        // 通知JS层Native层运行结果
        [self toCallback:cbId withReslut:[result toJSONString]];
    }
}


- (NSData*)PluginTestFunctionSync:(PGMethod*)command
{
    // 根据传入获取参数
    NSString* pArgument1 = [command.arguments objectAtIndex:0];
    NSString* pArgument2 = [command.arguments objectAtIndex:1];
    NSString* pArgument3 = [command.arguments objectAtIndex:2];
    NSString* pArgument4 = [command.arguments objectAtIndex:3];
    
    // 拼接成字符串
    NSString* pResultString = [NSString stringWithFormat:@"%@ %@ %@ %@", pArgument1, pArgument2, pArgument3, pArgument4];

    // 按照字符串方式返回结果
    return [self resultWithString: pResultString];
}


- (NSData*)PluginTestFunctionSyncArrayArgu:(PGMethod*)command
{
    // 根据传入参数获取一个Array，可以从中获取参数
    NSArray* pArray = [command.arguments objectAtIndex:0];
    
    // 创建一个作为返回值的NSDictionary
    NSDictionary* pResultDic = [NSDictionary dictionaryWithObjects:pArray forKeys:[NSArray arrayWithObjects:@"RetArgu1",@"RetArgu2",@"RetArgu3", @"RetArgu4", nil]];

    // 返回类型为JSON，JS层在取值是需要按照JSON进行获取
    return [self resultWithJSON: pResultDic];
}

@end
