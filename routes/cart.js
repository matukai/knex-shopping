//MODULES
const express = require('express');
const router = express.Router();
const knex = require('../knex/knex');

router.get('/:user_id', (req, res) => {
  console.log(req)
})

router.post('/:user_id/:product_id', (req, res) => {
  let userId = req.params.user_id;
  let productId = req.params.product_id;
  console.log(userId)
  console.log(productId)


  if (!userId || !productId) {
    return res.status(400).json({
      message: 'User/Product does not exists'
    })
  }

  return knex.raw('SELECT * FROM users WHERE id = ?', [userId])
    .then(result => {
      if (result.rows.length) {
        console.log('USER CHECK' + result.rows)
        return result;
      } else {
        throw new Error('User ID not found');
      }
    })
    .then(result => {
      if (result.rows.length) {
        knex.raw('SELECT * FROM products WHERE id = ?', [productId])
        console.log('PRODUCTS CHECK' + result)
        return result;
      } else {
        console.log('product not found')
        throw new Error('Product ID not found');
      }
    })
    .then(result => {
      return knex.raw('INSERT INTO cart (user_id, products_id) VALUES (?,?) RETURNING *', [userId, productId])
    })
    .then(result => {
      res.status(200).json({
        message: `Product ID: ${productId} has been added to User ID: ${userId}'s cart`
      })
    })
    .catch(err => {
      return res.status(500).json({
        message: err.message
      })
    })
})





module.exports = router