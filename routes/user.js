//MODULES
const express = require('express');
const router = express.Router();
const knex = require('../knex/knex');


router
//.get('/users/:user_id', function (req, res, next) {
//  let id = req.params.id.user_id;
//  knex.raw('SELECT * FROM users WHERE user.id = (?)',[id]);
// })


  .post('/register', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log(email)
    knex.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *`, [email, password])
    .then((result) => {
      res.json(result.rows[0])
    })
    .catch(error => {
      res.json({message: 'User already exists'});
    })
  });




module.exports = router