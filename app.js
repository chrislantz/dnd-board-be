// import { createClient } from 'redis';
const redis = require('redis');
const express = require('express');
const { application } = require('express');
const app = express();
const port = process.env.PORT || 5000;
const password = process.env.REDIS_PASSWORD;

const redisClient = redis.createClient({
  socket: {
    host: 'redis-14507.c289.us-west-1-2.ec2.cloud.redislabs.com', 
    port: 14507
  },
  username: "admin",
  password,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port: ${port}`);
    //redisClient.HSET("regnom", "charaterName", "Regnom");
    //redisClient.HSET("regnom", "x", 0);
    //redisClient.HSET("regnom", "y", 0);
  });
});

app.get('/', (req, res) => {
  const regnomPromise = redisClient.HGETALL("regnom");
  return regnomPromise.then((regnom) => {
    return res.send(JSON.stringify(regnom));
  });
  
});

app.get('/move/:user/right', (req, res) => {
  const user = req.params.user;
  const userRightPromise = redisClient.HINCRBY(user,"x", 1);
  return userRightPromise.then((userX) => {
    return res.send(JSON.stringify(userX));
  });
});

app.get('/move/:user/left', (req, res) => {
  const user = req.params.user;
  const userLeftPromise = redisClient.HINCRBY(user,"x", -1);
  return userLeftPromise.then((userX) => {
    return res.send(JSON.stringify(userX));
  });
});

app.get('/move/:user/up', (req, res) => {
  const user = req.params.user;
  const userUpPromise = redisClient.HINCRBY(user,"y", 1);
  return userUpPromise.then((userY) => {
    return res.send(JSON.stringify(userY));
  });
});

app.get('/move/:user/down', (req, res) => {
  const user = req.params.user;
  const userDownPromise = redisClient.HINCRBY(user,"y", -1);
  return userDownPromise.then((userY) => {
    return res.send(JSON.stringify(userY));
  });
});

app.get('/reset/:user', (req, res) => {
  const user = req.params.user;
  const userResetYPromise = redisClient.HSET(user, "y", 0);
  const userResetXPromise = redisClient.HSET(user, "x", 0);
  return Promise.all([userResetXPromise, userResetYPromise]).then(([userX, userY]) => {
    return res.send(`x: ${userX}, y: ${userY}`);
  });
});