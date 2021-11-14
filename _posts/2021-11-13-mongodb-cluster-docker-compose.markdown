---
layout: post
title:  "Docker-compose for MongoDB cluster"
description: A docker-compose to easily start a MongoDB cluster for development purposes
date:   2021-11-13 20:43:12 +0200
tag: docker docker-compose mongodb
categories: programming tutorial
published: true
---

In this post we'll explore how to start up a local MongoDB cluster using Docker and Docker Compose.

**TODO** check if key can be skipped

## Generate the node communication key

First, we'll need a key that the cluster nodes will use to communicate with each other.

A key's length must be between 6 and 1024 characters and may only contain characters in the base64 set. We can generate such a key using openssl:

{% highlight bash %}
openssl rand -base64 768 > mongo-replication.key
{% endhighlight %}

Then reduce the permissions on the key, else MongoDB will complain that the key is too open.  FIXME

{% highlight bash %}
chmod 400 mongo-replication.key
{% endhighlight %}

sudo chown 999:999 mongo-replication.key
TODO

## Starting the containers

This is the content of the docker-compose.yml file:

{% highlight yaml %}
version: '3.7'

services:

  mongodb_1:
    image: mongo:5
    hostname: mongodb_1
    command: --replSet rs1 --keyFile /etc/mongo-replication.key
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    ports:
      - 127.0.10.1:27017:27017
    volumes:
      - mongodb_data_1:/data/db
      - ./mongo-replication.key:/etc/mongo-replication.key

  mongodb_2:
    image: mongo:5
    hostname: mongodb_2
    command: --replSet rs1 --keyFile /etc/mongo-replication.key
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    ports:
      - 127.0.10.2:27017:27017
    volumes:
      - mongodb_data_2:/data/db
      - ./mongo-replication.key:/etc/mongo-replication.key
    depends_on:
      - mongodb_1

  mongodb_3:
    image: mongo:5
    hostname: mongodb_3
    command: --replSet rs1 --keyFile /etc/mongo-replication.key
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    ports:
      - 127.0.10.3:27017:27017
    volumes:
      - mongodb_data_3:/data/db
      - ./mongo-replication.key:/etc/mongo-replication.key
    depends_on:
      - mongodb_1

volumes:
  mongodb_data_1:
  mongodb_data_2:
  mongodb_data_3:
{% endhighlight %}

Start the services using:

{% highlight bash %}
docker-compose up -d
{% endhighlight %}

The cluster should be up within a few seconds:

{% highlight bash %}
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                         NAMES
86f9079c9586   mongo:5   "docker-entrypoint.s…"   41 minutes ago   Up 40 minutes   127.0.10.1:27017->27017/tcp   mongodb-mongodb_1-1
1642f00fb06e   mongo:5   "docker-entrypoint.s…"   40 minutes ago   Up 40 minutes   127.0.10.2:27017->27017/tcp   mongodb-mongodb_2-1
60b5a5adb75b   mongo:5   "docker-entrypoint.s…"   40 minutes ago   Up 40 minutes   127.0.10.3:27017->27017/tcp   mongodb-mongodb_3-1
{% endhighlight %}

## Initialize the replica set

With the nodes of the cluster up, we have to initialize the replica set next:

init-replica-set.js

{% highlight js %}
db.auth('admin', 'admin');
rs.initiate(
    {_id: "rs1", version: 1,
        members: [
            { _id: 0, host : "mongodb_1:27017" },
            { _id: 1, host : "mongodb_2:27017" },
            { _id: 2, host : "mongodb_3:27017" }
        ]
    }
);
{% endhighlight %}


docker run --rm --network mongodb_default mongo:5 mongo --username admin --password admin --host mongodb_1:27017  --authenticationDatabase admin admin  --eval "$(< init-replica-set.js)"

Inspect the replica set status

docker run --rm --network mongodb_default mongo:5 mongo --username admin --password admin --host mongodb_1:27017  --authenticationDatabase admin admin  --eval "rs.status()"

## Create a db and user

{% highlight js %}
db.auth('admin', 'admin');
db = db.getSiblingDB('my_database');
db.createUser({
  user: 'my_user',
  pwd: 'my_pass',
  roles: [
    {
      role: 'dbOwner',
      db: 'my_database',
    },
  ],
});
{% endhighlight %}


docker run --rm --network mongodb_default mongo:5 mongo --username admin --password admin --host mongodb_1:27017  --authenticationDatabase admin admin  --eval "$(< init-database.js)"

if error: Error: couldn't add user: not master
then

find the primary node
docker run --rm --network mongodb_default mongo:5 mongo --username admin --password admin --host mongodb_1:27017  --authenticationDatabase admin admin  --eval "rs.status()" | grep -B 3 PRIMARY


run REPL

docker run --rm -i -t --network mongodb_default mongo:5 mongosh --username admin --password admin --host mongodb_1,mongodb_2,mongodb_3 --authenticationDatabase admin admin

add the following hosts to your hosts file

{% highlight bash %}
127.0.10.1 mongodb_1
127.0.10.2 mongodb_2
127.0.10.3 mongodb_3
{% endhighlight %}

## Taking it all down

docker-compose down -v
