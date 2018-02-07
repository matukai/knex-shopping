//MODULES
const express = require('express');
const router = express.Router();
const knex = require('../knex/knex');


router.get('/:user_id', (req, res) => {
  let id = req.params.user_id
  return knex.raw('SELECT * FROM users WHERE id = ?', [id])
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      return res.status(400).json({
        message: 'User not found'
      });
    })
})

router.post('/register', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!(email && password)) { //  OR !(email || password)
    return res.status(400).json({
      message: 'invalid credentials'
    })
  }
  email = email.toLowerCase();
  return knex.raw('SELECT users.email FROM users WHERE users.email = ?', [email])
    .then(result => {
      // if email exists
      if (result.rows.length > 0) {
        throw new Error('email exists');
      } else {
        return result;
      }
    })
    .then(result => {
      return knex.raw(`INSERT INTO users (email, password) VALUES (?,?)
  RETURNING *`, [email, password]);
    })
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => {
      return res.status(400).json({
        message: 'user already exists'
      });
    })
})

router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if(!(email || password)) {
    return res.status(400).json({
      message: 'must enter valid email & password'
    })
  }
  email = email.toLowerCase();
  return knex.raw(`SELECT users.email, users.password FROM users WHERE users.email = ?`, [email])
    .then((result) => {
      if (!(result.rows.length)) {
        throw new Error('email not found');
      }
      return result.rows[0];
    })
    .then(user => {
      if (password !== user.password) {
        throw new Error('incorrect login credentials')
      } else {
        res.json(user)
      }
    })
    .catch(err => {
      return res.status(400).json({
        message: err.message
      })
    })
})



module.exports = router



//you can have multiple knex.raw statements one knex.raw to sql if email exists
//break everything down to very basic
//knex.raw returns object that have properties that are rows