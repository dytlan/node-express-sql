const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then( product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then( products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {

  req.user
    //Get All Cart item for specific user
    .getCart()
    .then(cart => {
      //Retrieve data by Cart and send the file to view html
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch( err => console.log(err));
    })
    .catch( err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQty  = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({where:{id: prodId}})
        .then(products => {
          let product;
          if(products.length > 0){
            product = products[0];
          }
          if(product){
            const oldQty  = product.cartItem.quantity;
            newQty  = oldQty + 1;
            return product
          }
          //else product not exist
          return Product.findByPk(prodId);
        })
        .then(product => {
          return fetchedCart.addProduct(product,{through: {quantity: newQty}})
        })
        .then( () => {
          res.redirect('/cart');
        })
        .catch( err => console.log(err));
    })
    .catch( err => console.log(err));
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then( cart => {
      return cart.getProducts({where:{id: prodId}});
    })
    .then( products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then( () => {
      res.redirect('/cart')
    })
    .catch( err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req,res,next) => {
  req.user
    .getCart()
    .then( cart => {
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          order.addProducts(products.map(product => {
            product.orderItem = {quantity: product.cartItem.quantity};
            return product;
          }));
        })
        .catch(err => console.log(err));
    })
    .then (()=> {
      res.redirect('/orders');
    })
    .catch();
}
