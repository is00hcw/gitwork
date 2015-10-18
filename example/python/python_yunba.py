# coding=utf-8
#  http://yunba.io/docs/#例子


from socketIO_client import SocketIO
import logging
logging.basicConfig(level=logging.INFO)

def on_socket_connect_ack(args):
    print 'on_socket_connect_ack', args
    socketIO.emit('connect', {'appkey': '52fcc04c4dc903d66d6f8f92'})

def on_connack(args):
    print 'on_connack', args
    socketIO.emit('subscribe', {'topic': 'testtopic2'})  #########


def on_puback(args):
    print 'on_puback', args
    if args['messageId'] == '11833652203486491112':
        print '  [OK] publish with given messageId'

def on_suback(args):
    print 'on_suback', args
    socketIO.emit('publish', {'topic': 'testtopic2', 'msg': 'from python', 'qos': 1})

    # socketIO.emit('publish', {
    #     'topic': 'testtopic2',
    #     'msg': 'from python with given messageId',
    #     'qos': 1,
    #     'messageId': '11833652203486491112'
    # })



def on_message(args):
    print 'on_message', args


def on_publish2_ack(args):
    print 'on_publish2_ack', args
    if args['messageId'] == '11833652203486491113':
        print '  [OK] publish2 with given messageId'

def on_publish2_recvack(args):
    print 'on_publish2_recvack', args

def on_get_state_ack(args):
    print 'on_get_state_ack', args

socketIO = SocketIO('sock.yunba.io', 3000)
socketIO.on('socketconnectack', on_socket_connect_ack)
socketIO.on('connack', on_connack)
socketIO.on('puback', on_puback)
socketIO.on('suback', on_suback)
socketIO.on('message', on_message)
# socketIO.on('set_alias_ack', on_set_alias)
# socketIO.on('get_topic_list_ack', on_get_topic_list_ack)
# socketIO.on('get_alias_list_ack', on_get_alias_list_ack)
socketIO.on('publish2_ack', on_publish2_ack)
socketIO.on('publish2_recvack', on_publish2_recvack)
# socketIO.on('get_state_ack', on_get_state_ack)
# socketIO.on('alias', on_alias)              # get alias callback

socketIO.wait()