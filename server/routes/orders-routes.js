import express from 'express';
import OrdersController from '../controllers/orders-controller.js';
import checkAdmin from '../firebase/checkAdmin.js';

const ordersRouter = express.Router();

ordersRouter.post('/create', OrdersController.createOrder);
ordersRouter.patch('/:id', checkAdmin, OrdersController.updateOrderById);
ordersRouter.delete('/:id', checkAdmin, OrdersController.deleteOrderById);
ordersRouter.get('/', checkAdmin, OrdersController.getOrders);

export default ordersRouter;