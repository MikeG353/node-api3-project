const express = require('express');

const router = express.Router();
const users = require('./userDb.js')
const posts = require('../posts/postDb.js');
const e = require('express');

router.post('/', validateUser, (req, res) => {
  users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message: 'error adding the user'
    })
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const postInfo = { ...req.body, user_id: req.params.id }
  posts.insert(postInfo)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message:'error adding post'
    })
  })
});

router.get('/', (req, res) => {
  users.get(req.query)
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message:'server error getting users list'
    })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  const user = req.user
  try {
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({
        message: 'user not found'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error retrieving the users"
    })
  }
});

router.get('/:id/posts', validateUserId, (req, res) => {
  users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message:`error finding posts by user id ${req.params.id}`
    })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // i feel like the delete function already performs an id check by nature, since it returns a count of records deleted. No recrod would be deleted if the id didnt match. I prefer the if count > 0 method from before
  try {
    users.remove(req.user.id)
    .then(success => {
      res.status(200).json({ message:'user deleted' })
    })
  } catch {
    res.status(500).json({ message: 'error remoging user'})
  }
  
});

router.put('/:id', validateUserId, (req, res) => {
  users.update(req.params.id, req.body)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message:`${count} records updated`})
    } else {
      res.status(404).json({ message:'user not found' })
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message:`error updating user id: ${req.params.id}`})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;
  users.getById(id)
  .then(user => {
    if (user) {
      req.user = user;
      next()
    } else {
      res.status(404).json({
        message:"user not found"
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

function validateUser(req, res, next) {  
  // - `validateUser` validates the `body` on a request to create a new user
  // - if the request `body` is missing, respond with status `400` and `{ message: "missing user data" }`
  // - if the request `body` lacks the required `name` field, respond with status `400` and `{ message: "missing required name field" }`
  const body = req.body
  console.log(body)
  if (!body || body === {}) {
    res.status(400).json({
      message: 'missing user data'
      // I am unable to get this to fire
    })
  } else {
    if(!body.name) {
      res.status(400).json({
        message: 'missing required name field'
      })
    } else {
      next()
    }
  } 
}

function validatePost(req, res, next) {
  // - `validatePost()`
  // - `validatePost` validates the `body` on a request to create a new post
  // - if the request `body` is missing, respond with status `400` and `{ message: "missing post data" }`
  // - if the request `body` lacks the required `text` field, respond with status `400` and `{ message: "missing required text field" }`
  const body = req.body
  console.log(body)
  if (!body || body === {}) {
    res.status(400).json({
      message: 'missing post data'
      // I am unable to get this to fire
    })
  } else {
    if(!body.text) {
      res.status(400).json({
        message: 'missing required text field'
      })
    } else {
      next()
    }
  }
}

module.exports = router;
