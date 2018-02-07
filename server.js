// MODULES
const express = require('express');
const knex = require('./knex/knex');
const app = express();
const bodyParser = require('body-parser');


//CONSTANTS
const PORT = process.env.PORT || 3000;
const cartRoutes = require('./routes/cart');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');


//APPLICATIONS
app.use(bodyParser.urlencoded({extended: true}));
app.use('/cart', cartRoutes);
app.use('/product', productRoutes);
app.use('/user', userRoutes);


app.listen(PORT, () => {
  console.log(`LISTENING ON PORT: ${PORT}`);
});