//MODULES
const express = require('express');
const router = express.Router();
const knex = require('../knex/knex');


router








.post('/new', (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let inventory = req.body.inventory;
  let price = req.body.price;
  console.log(price)
  knex.raw(`INSERT INTO products (title, description, inventory, price) VALUES (?,?,?,?) RETURNING *`, [title, description, inventory, price])
  .then((result) => {
    res.json(result.rows[0])
  })
  .catch(error => {
    res.json({message: 'Product already exists'})
  })
});


module.exports = router