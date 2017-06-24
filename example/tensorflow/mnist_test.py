#!/usr/bin/env python
# -*- coding:utf-8 -*-

# 导入mnist数据库
from tensorflow.examples.tutorials.mnist import input_data
mnist=input_data.read_data_sets("MNIST_data",one_hot=True)

import tensorflow as tf

# 创建会话
sess = tf.Session()

# 定义输入变量
x = tf.placeholder(tf.float32, [None, 784])

# 定义参数
W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.zeros([10]))

# 定义模型和激励函数
y = tf.nn.softmax(tf.matmul(x, W) + b)

# 定义模型保存对象
saver = tf.train.Saver([W, b])

# 恢复模型
saver.restore(sess, "mnist/ckp")

print("恢复模型成功！")

# 取出一个测试图片
idx=0
img = mnist.test.images[idx]

# 根据模型计算结果
ret = sess.run(y, feed_dict = {x : img.reshape(1, 784)})

print("计算模型结果成功！")

# 显示测试结果
print("预测结果:%d"%(ret.argmax()))
print("实际结果:%d"%(mnist.test.labels[idx].argmax()))
