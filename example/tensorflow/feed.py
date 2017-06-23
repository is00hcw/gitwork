# -*- coding:utf-8 -*-

import tensorflow as tf
import numpy as np


# input1 = tf.placeholder(tf.float32)
# input2 = tf.placeholder(tf.float32)
# output = tf.multiply(input1, input2)
# with tf.Session() as sess:
#   print(sess.run([output], feed_dict={input1:[7.], input2:[2.]}))

x_data = np.random.rand(100).astype("float32")
y_data = x_data * 0.1 + 0.3

# 指定w和b变量的取值范围（注意我们要利用TensorFlow来得到w和b的值）
W = tf.Variable(tf.random_uniform([1], -1.0, 1.0))
b = tf.Variable(tf.zeros([1]))
y = W * x_data + b

# 最小化均方误差
loss = tf.reduce_mean(tf.square(y - y_data))
optimizer = tf.train.GradientDescentOptimizer(0.5)
train = optimizer.minimize(loss)

# 初始化TensorFlow参数
init = tf.initialize_all_variables()

# 运行数据流图（注意在这一步才开始执行计算过程）
sess = tf.Session()
sess.run(init)

# 观察多次迭代计算时，w和b的拟合值
for step in range(201):
    sess.run(train)
    if step % 20 == 0:
        print(step, sess.run(W), sess.run(b))