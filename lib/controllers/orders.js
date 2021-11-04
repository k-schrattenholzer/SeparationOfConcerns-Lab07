const { Router } = require('express');
const Order = require('../models/Order.js');
const OrderService = require('../services/OrderService');

module.exports = Router()

  .post('/', async(req, res, next) => {
    try {

      const order = await OrderService.createOrder(req.body.quantity);

      res.send(order);
    } catch(err) {
      next(err);
    }
  })

  .get('/:id', async(req, res, next) => {
    try {
      const { id } = req.params;

      const order = await Order.findOrderById(id);
      res.send(order);
    } catch(err) {
      next(err);
    }
  })

  .get('/', async(req, res, next) => {
    try {
      const orderList = await Order.getAllOrders();
      res.send(orderList);
    } catch(err) {
      next(err);
    }
  })

  .patch('/:id', async(req, res, next) => {
    try {

      const { id } = req.params;
      const { quantity } = req.body;

      const updatedOrder = await OrderService.updateOrder(id, quantity);

      res.send(updatedOrder);

    } catch(err) {
      next(err);
    }
  })
  
;


