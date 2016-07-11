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

import com.aliyun.openservices.ons.api.Message
import org.apache.hadoop.hbase.{HConstants, HBaseConfiguration}
import org.apache.hadoop.hbase.client.ConnectionFactory
import org.apache.hadoop.hbase.client.Connection
import org.apache.hadoop.hbase.TableName
import org.apache.hadoop.hbase.util.Bytes
import org.apache.hadoop.hbase.client.Put
import org.apache.spark.SparkConf
import org.apache.spark.storage.StorageLevel
import org.apache.spark.streaming.aliyun.ons.OnsUtils
import org.apache.spark.streaming.{StreamingContext, Milliseconds}

import scala.collection.JavaConversions._

object ConnectionUtil extends Serializable {
  private val conf = HBaseConfiguration.create()
  conf.set(HConstants.ZOOKEEPER_QUORUM,"ecs1,ecs2,ecs3")
  conf.set(HConstants.ZOOKEEPER_ZNODE_PARENT, "/hbase")
  private val connection = ConnectionFactory.createConnection(conf)

  def getDefaultConn: Connection = connection
}

object TestHbaseStreaming {
  def main(args: Array[String]): Unit = {
    val Array(cId, topic, subExpression, parallelism, interval, tname) = args

    val COLUMN_FAMILY_BYTES = Bytes.toBytes("count")
    val COLUMN_QUALIFIER_BYTES = Bytes.toBytes("count")
    val accessKeyId = "accessKeyId"
    val accessKeySecret = "accessKeySecret"

    val numStreams = parallelism.toInt
    val batchInterval = Milliseconds(interval.toInt)

    val conf = new SparkConf().setAppName("Test Hbase Streaming")
    val ssc = new StreamingContext(conf, batchInterval)
    def func: Message => Array[Byte] = msg => msg.getBody
    val onsStreams = (0 until numStreams).map { i =>
      println(s"starting stream $i")
      OnsUtils.createStream(
        ssc,
        cId,
        topic,
        subExpression,
        accessKeyId,
        accessKeySecret,
        StorageLevel.MEMORY_AND_DISK_2,
        func)
    }

    val unionStreams = ssc.union(onsStreams)
    unionStreams.foreachRDD(rdd => {
      rdd.map(bytes => new String(bytes))
        .flatMap(line => line.split(" "))
        .map(word => (word, 1))
        .reduceByKey(_ + _)
        .mapPartitions {words => {
          val conn = ConnectionUtil.getDefaultConn
          val tableName = TableName.valueOf(tname)
          val t = conn.getTable(tableName)
          try {
            words.sliding(100, 100).foreach(slice => {
              val puts = slice.map(word => {
                println(s"word: $word")
                val put = new Put(Bytes.toBytes(word._1 + System.currentTimeMillis()))
                put.addColumn(COLUMN_FAMILY_BYTES, COLUMN_QUALIFIER_BYTES,
                  System.currentTimeMillis(), Bytes.toBytes(word._2))
                put
              }).toList
              t.put(puts)
            })
          } finally {
            t.close()
          }

          Iterator.empty
        }}.count()
    })

    ssc.start()
    ssc.awaitTermination()
  }
}
