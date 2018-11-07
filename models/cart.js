const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, filContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(filContent)
      }
      //find index of the existing product
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      //find product at index of "existingProductIndex"
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        //Copy old products
        cart.products = [...cart.products]
        //Update old product in cart.products
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          qty: 1
        }
        cart.products = [...cart.products, updatedProduct]
      }
      //Plus sign converts string to number
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find(prod => prod.id === id);
      console.log(product);
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty);
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      })
    })
  }
}