# -*- coding:utf-8 -*-

__author__ = 'chapter'

# from __future__ import absolute_import
# from __future__ import division
# from __future__ import print_function

import tensorflow as tf
import numpy as np
from tensorflow.examples.tutorials.mnist import input_data
import sys
from PIL import Image,ImageFilter

def imageprepare(argv):
    """
    This function returns the pixel values.
    The imput is a png file location.
    """
    im = Image.open(argv).convert('L')
    width = float(im.size[0])
    height = float(im.size[1])
    newImage = Image.new('L', (28, 28), (255)) #creates white canvas of 28x28 pixels
    
    if width > height: #check which dimension is bigger
        #Width is bigger. Width becomes 20 pixels.
        nheight = int(round((20.0/width*height),0)) #resize height according to ratio width
        if (nheigth == 0): #rare case but minimum is 1 pixel
            nheigth = 1  
        # resize and sharpen
        img = im.resize((20,nheight), Image.ANTIALIAS).filter(ImageFilter.SHARPEN)
        wtop = int(round(((28 - nheight)/2),0)) #caculate horizontal pozition
        newImage.paste(img, (4, wtop)) #paste resized image on white canvas
    else:
        #Height is bigger. Heigth becomes 20 pixels. 
        nwidth = int(round((20.0/height*width),0)) #resize width according to ratio height
        if (nwidth == 0): #rare case but minimum is 1 pixel
            nwidth = 1
         # resize and sharpen
        img = im.resize((nwidth,20), Image.ANTIALIAS).filter(ImageFilter.SHARPEN)
        wleft = int(round(((28 - nwidth)/2),0)) #caculate vertical pozition
        newImage.paste(img, (wleft, 4)) #paste resized image on white canvas
    
    #newImage.save("sample.png")

    tv = list(newImage.getdata()) #get pixel values
    
    #normalize pixels to 0 and 1. 0 is pure white, 1 is pure black.
    tva = [ (255-x)*1.0/255.0 for x in tv] 
    return [tva]


def load_images(files, batch_size):
    imgs = []
    for i in range(batch_size):
      im = Image.open(files[i]).resize((28, 28)).convert('L')
      im = np.array(im)
      im = im.reshape(784)
      im = im.astype(np.float32)
      im = np.multiply(im, 1.0 / 255.0)
      imgs.append(im)

    imgs = np.array(imgs)
    return imgs


def weight_varible(shape):
    initial = tf.truncated_normal(shape, stddev=0.1)
    return tf.Variable(initial)

def bias_variable(shape):
    initial = tf.constant(0.1, shape=shape)
    return tf.Variable(initial)

def conv2d(x, W):
    return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')

def max_pool_2x2(x):
    return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)
print("Download Done!")

# paras
W_conv1 = weight_varible([5, 5, 1, 32])
b_conv1 = bias_variable([32])

# conv layer-1
x = tf.placeholder(tf.float32, [None, 784])
x_image = tf.reshape(x, [-1, 28, 28, 1])

h_conv1 = tf.nn.relu(conv2d(x_image, W_conv1) + b_conv1)
h_pool1 = max_pool_2x2(h_conv1)

# conv layer-2
W_conv2 = weight_varible([5, 5, 32, 64])
b_conv2 = bias_variable([64])

h_conv2 = tf.nn.relu(conv2d(h_pool1, W_conv2) + b_conv2)
h_pool2 = max_pool_2x2(h_conv2)

# full connection
W_fc1 = weight_varible([7 * 7 * 64, 1024])
b_fc1 = bias_variable([1024])

h_pool2_flat = tf.reshape(h_pool2, [-1, 7 * 7 * 64])
h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

# dropout
keep_prob = tf.placeholder(tf.float32)
h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

# output layer: softmax
W_fc2 = weight_varible([1024, 10])
b_fc2 = bias_variable([10])

y_conv = tf.nn.softmax(tf.matmul(h_fc1_drop, W_fc2) + b_fc2)
y_ = tf.placeholder(tf.float32, [None, 10])

# model training
cross_entropy = -tf.reduce_sum(y_ * tf.log(y_conv))
train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)

correct_prediction = tf.equal(tf.arg_max(y_conv, 1), tf.arg_max(y_, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

#sess = tf.InteractiveSession()
init = tf.global_variables_initializer()
sess = tf.Session()
sess.run(init)

# model saver
saver = tf.train.Saver()
saver.restore(sess, "./model/minist_cnn.ckpt")
print("model restore " )

# 取出一个测试图片
def test_mnist_one():
    # idx=0
    # img = mnist.test.images[idx]
    # ret = sess.run(y_conv, feed_dict = {x : img.reshape(1, 784), keep_prob: 1.0})
    # print("计算模型结果成功！")
    # print("预测结果:%d"%(ret.argmax()))
    # print("实际结果:%d"%(mnist.test.labels[idx].argmax()))

    batch_x, batch_y = mnist.test.next_batch(1)   #取一组训练数据
    #batch_x 为（1，784）数组（保存图像信息） batch_y 为（1,10）（保存图像标签，第几位数是1，就表示几）
    # print(sess.run(accuracy, feed_dict={x: batch_x, y_: batch_y, keep_prob: 1.0}))  #验证训练数据的准确性
    ret = sess.run(y_conv, feed_dict = {x : batch_x, keep_prob: 1.0})
    print("预测结果:%d"%(ret.argmax()))

    im = np.reshape(batch_x,(28,28))   #将一维数组转化为28*28的图像数组  float32 （0-1）
    #此时通过观察数组中数字部分，能大致的看出图像表示的数字
    #为了直观的看到，可以将数组转化为图像
    imag = Image.fromarray(np.uint8(im*255))  #这里读入的数组是 float32 型的，范围是 0-1，而 PIL.Image 数据是 uinit8 型的，范围是0-255，要进行转换
    imag.show()
    imag.save('./test.png')


# accuacy on all mnist test image set
def test_mnist_all():
    test_result = sess.run(accuracy, feed_dict={x: mnist.test.images, y_: mnist.test.labels, keep_prob: 1.0})
    print("test accuracy %g"%test_result )

# read 28*28 image from files
def test_local_image():
    imgs = load_images(["./2.jpg"],1)
    predict_values = sess.run(y_conv, feed_dict = {x : imgs, keep_prob: 1.0})
    print("predict_values %s" % predict_values)
    ret = []
    for val in predict_values:
        ret_val = np.array_str(np.argmax(val)) + '\n'
        ret.append(ret_val)
    print("ret %s" % ret)

# test_local_image()


def test_file(filepath) :
    img = Image.open(filepath).convert('L');
    img.show()
    mm = np.array(img) #打开图片，转化为灰度并转化为数组size（n,m） 值0-255    
    imm = imm/255           #将值转化为0-1   
    imm_3 = Image.fromarray(imm)    #转化为图像
    imm_4 = imm_3.resize([28,28])   #压缩    
    im_array = np.array(imm_4)     #转化为数组
    fs = im_array.reshape((1,784))  #转化为符合验证一维的数组
    print(sess.run(tf.argmax(y_conv,1), feed_dict={x: fs, keep_prob: 1.0})) #输出模型的识别值 

# img = imageprepare("./5.png");
# predict_values = sess.run(y_conv, feed_dict = {x : img, keep_prob: 1.0})
# print("predict_values %s" % predict_values)
# for val in predict_values:
#     print(np.array_str(np.argmax(val)) + '\n')


# img = imageprepare("./5.png");
# prediction = tf.argmax(y_conv,1)
# predict_values = sess.run(prediction, feed_dict={x : img, keep_prob: 1.0})
# print (predict_values)

# test_mnist_one();

test_file("./test.png")