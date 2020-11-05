const express = require('express');

const router = express.Router();

const posts = require('./postDb.js')

router.get('/', (req, res) => {
  posts.get(req.query) // still not sure if this does what I think it does
  // query should allow for sorting and the like via the url?
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    consolelog(err)
    res.status(500).json({
      message: "server error getting posts"
    })
  })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  const {id} = req.params;
  posts.getById(id)
  .then(post => {
    if (post) {
      req.post = post;
      next()
    } else {
      res.status(404).json({
        message:"post not found"
      })
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message:"a database error occured"
    })
  })
}

module.exports = router;
