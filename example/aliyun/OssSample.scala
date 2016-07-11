/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.aliyun.emr.examples

import org.apache.spark.aliyun.oss.OssOps
import org.apache.spark.{SparkConf, SparkContext}

object OssSample {

  def main(args: Array[String]): Unit = {

    val accessKeyId = args(0)
    val accessKeySecret = args(1)
	val endpoint = args(2)
	val bucket = args(3)
    val inPath = args(4)
    val outPath = args(5)
    val numPartition = 2    
	
	val conf = new SparkConf().setAppName("OssSample")
    val sc = new SparkContext(conf)

    val pathIn = s"oss://$accessKeyId:$accessKeySecret@$bucket.$endpoint/$inPath"
    val inputData = sc.textFile(pathIn)
    val cnt = inputData.count
    println(s"count: $cnt")

    val outputPath = s"oss://$accessKeyId:$accessKeySecret@$bucket.$endpoint/$outPath"
    val outpuData = inputData.map(e => s"$e has been processed.")
    outpuData.saveAsTextFile(outputPath)
  }
}