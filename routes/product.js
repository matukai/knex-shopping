//MODULES
const express = require('express');
const router = express.Router();
const knex = require('../knex/knex');


router.get('/', (req, res) => {
  console.log(req)
  return knex.raw('SELECT * FROM products')
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      return res.status(400).json({
        message: 'Bad Request'
      })
    })
})

router.get('/:product_id', (req, res) => {
  let id = req.params.product_id;
  console.log(id)
  return knex.raw('SELECT * FROM products WHERE id = ?', [id])
    .then(result => {
      res.json(result.rows);
    })
})

router.post('/new', (req, res) => {
  let {title, description, inventory, price} = req.body;
  if (!title || !description || !inventory || !price) {
    return res.status(400).json({
      message: 'Must POST all product fields'
    });
  }
  return knex.raw(`INSERT INTO products (title, description, inventory, price) VALUES (?,?,?,?) RETURNING *`, [title, description, inventory, price])
    .then((result) => {
      return res.json(result.rows[0])
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      })
    })
});


module.exports = router