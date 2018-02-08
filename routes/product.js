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
  let {
    title,
    description,
    inventory,
    price
  } = req.body;
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

router.put('/:product_id', (req, res) => {
  let {
    title,
    description,
    inventory,
    price
  } = req.body;
  let id = req.params.product_id;
  console.log(id);
  if (!id) {
    return res.status(400).json({
      message: 'Missing ID'
    })
  }
  return knex.raw('SELECT * FROM products WHERE id = ?', [id])
    .then(result => {
      console.log(result.rows.length)
      if (result.rows.length) {
        return result;
      } else {
        throw new Error('product id not found');
      }
    })
    .then(result => {
      return knex.raw('UPDATE products SET title = ?, description = ?, inventory = ?, price = ?', [title, description, inventory, price]);
    })
    .then(result => {
      res.status(200).json(`message: Product_id: ${id} has been updated`);
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      })
    })
})

router.delete('/:product_id', (req, res) => {
  let id = req.params.product_id;
  return knex.raw('SELECT * FROM products WHERE products.id = ?', [id])
    .then(result => {
      if (result.rows.length) {
        return result;
      } else {
        throw new Error('Product ID not found');
      }
    })
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: `Product id: ${id} sucessfully deleted`
      })
      return knex.raw('DELETE FROM products WHERE products.id = ?', [id])
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      })
    })
})

















module.exports = router