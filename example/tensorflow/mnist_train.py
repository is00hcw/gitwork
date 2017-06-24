#!/usr/bin/env python
# -*- coding:utf-8 -*-

# 导入mnist数据库
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

import tensorflow as tf
import os

# 定义输入变量
x = tf.placeholder(tf.float32, [None, 784])

# 定义参数
W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.zeros([10]))

# 定义激励函数
y = tf.nn.softmax(tf.matmul(x, W) + b)

# 定义输出变量
y_ = tf.placeholder(tf.float32, [None, 10])

# 定义成本函数
cross_entropy = tf.reduce_mean(-tf.reduce_sum(y_ * tf.log(y), reduction_indices=[1]))

# 定义优化函数
train_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entropy)

# 初始化变量
init = tf.global_variables_initializer()

# 定义会话
sess = tf.Session()

# 运行初始化
sess.run(init)

# 定义模型保存对象
saver = tf.train.Saver()

# 循环训练1000次
for i in range(1000):
    batch_xs, batch_ys = mnist.train.next_batch(100)
    sess.run(train_step, feed_dict={x: batch_xs, y_:batch_ys})

print("训练完成！")

# 创建模型保存目录
model_dir = "mnist"
model_name = "ckp"
if not os.path.exists(model_dir):
    os.mkdir(model_dir)

# 保存模型
saver.save(sess, os.path.join(model_dir, model_name))

print("保存模型成功！")
