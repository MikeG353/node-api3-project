const express = require('express');

const server = express();
const postsRouter = require('./posts/postRouter.js')
const usersRouter = require('./users/userRouter.js')

// middleware stack
server.use(express.json())
server.use(logger)
server.use('/api/users', usersRouter)
server.use('/api/posts', postsRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  const date = new Date()
  console.log(`${req.method} Request made to ${req.url} on ${date}`)
  next()
}

module.exports = server;
