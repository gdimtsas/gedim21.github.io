---
title: Docker-compose for a local kafka cluster
layout: single
description: A docker-compose to easily start a Kafka cluster for development purposes
date: '2022-05-17 21:16:21 +0200'
tags:
  - docker
  - docker-compose
  - kafka
categories:
  - devops
  - tutorial
---

Let's check how to set up a local kafka cluster using Docker and Docker Compose.

## Starting the containers

We will startup three [kafka](https://kafka.apache.org/) instances, at ports 9091, 9092 and 9093; one instance of [zookeeper](https://zookeeper.apache.org/) at port 2181; and one instance of [kafdrop](https://github.com/obsidiandynamics/kafdrop) at port 9000.

This is the content of the ```docker-compose.yml``` file:

```yaml
version: "3"

networks:
  kafka-cluster:
    name: kafka-cluster
    driver: bridge

services:
  zookeeper:
    image: bitnami/zookeeper:3.6.2
    hostname: zookeeper
    ports:
      - '2181:2181'
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
    networks:
      - kafka-cluster
    healthcheck:
      test: nc -z localhost 2181 || exit -1
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  kafka-1:
    image: bitnami/kafka:2.7.0
    hostname: kafka-1
    ports:
      - '9093:9093'
    environment:
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CLIENT:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=CLIENT://:9092,EXTERNAL://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=CLIENT://kafka-1:9092,EXTERNAL://localhost:9093
      - KAFKA_INTER_BROKER_LISTENER_NAME=CLIENT
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
    depends_on:
      zookeeper:
        condition: service_healthy
    networks:
      - kafka-cluster

  kafka-2:
    image: bitnami/kafka:2.7.0
    hostname: kafka-2
    ports:
      - '9094:9094'
    environment:
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CLIENT:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=CLIENT://:9092,EXTERNAL://:9094
      - KAFKA_CFG_ADVERTISED_LISTENERS=CLIENT://kafka-2:9092,EXTERNAL://localhost:9094
      - KAFKA_INTER_BROKER_LISTENER_NAME=CLIENT
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
    depends_on:
      - zookeeper
    networks:
      - kafka-cluster
    depends_on:
      zookeeper:
        condition: service_healthy

  kafka-3:
    image: bitnami/kafka:2.7.0
    hostname: kafka-3
    ports:
      - '9095:9095'
    environment:
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CLIENT:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=CLIENT://:9092,EXTERNAL://:9095
      - KAFKA_CFG_ADVERTISED_LISTENERS=CLIENT://kafka-3:9092,EXTERNAL://localhost:9095
      - KAFKA_INTER_BROKER_LISTENER_NAME=CLIENT
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
    depends_on:
      - zookeeper
    networks:
      - kafka-cluster
    depends_on:
      zookeeper:
        condition: service_healthy

  kafdrop:
    image: obsidiandynamics/kafdrop:latest
    container_name: kafdrop
    ports:
      - 9000:9000
    environment:
      - KAFKA_BROKERCONNECT=kafka-1:9092,kafka-2:9092,kafka-3:9092
    depends_on:
      - kafka-1
      - kafka-2
      - kafka-3
    networks:
      - kafka-cluster

```

Start the services using:

```bash
docker-compose up -d
```

The containers should be up within a few seconds:

```bash
CONTAINER ID   IMAGE                             COMMAND                  CREATED       STATUS                    PORTS                                                  NAMES
cdcddee0b664   obsidiandynamics/kafdrop:latest   "/kafdrop.sh"            8 weeks ago   Up 6 seconds              0.0.0.0:9000->9000/tcp                                 kafdrop
c2e24673ae8e   bitnami/kafka:2.7.0               "/opt/bitnami/script…"   8 weeks ago   Up 7 seconds              9092/tcp, 0.0.0.0:9095->9095/tcp                       kafka-kafka-3-1
f15abb636885   bitnami/kafka:2.7.0               "/opt/bitnami/script…"   8 weeks ago   Up 7 seconds              9092/tcp, 0.0.0.0:9094->9094/tcp                       kafka-kafka-2-1
983c7065d4b7   bitnami/kafka:2.7.0               "/opt/bitnami/script…"   8 weeks ago   Up 7 seconds              9092/tcp, 0.0.0.0:9093->9093/tcp                       kafka-kafka-1-1
60d1ecb26d23   bitnami/zookeeper:3.6.2           "/opt/bitnami/script…"   8 weeks ago   Up 21 seconds (healthy)   2888/tcp, 3888/tcp, 0.0.0.0:2181->2181/tcp, 8080/tcp   kafka-zookeeper-1
```

To verify that everything is in order, point your browser to kafdrop at [http://localhost:9090](http://localhost:9090). You should see a list of brokers similar to this:

```bash
Brokers
  ID      Host      Port      Rack      Controller      Number of partitions (% of total)
1001      kafka-2   9092      -         No              18 (34%)
1003      kafka-1   9092      -         No              18 (34%)
1002      kafka-3   9092      -         Yes             17 (32%) 
```

## Taking it all down

Take down containers and delete their corresponding volumes:

```bash
docker-compose down -v
```
