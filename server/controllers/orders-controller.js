import HttpError from "../models/http-error.js";
import orderModel from "../models/orderModel.js";
import bookModel from "../models/bookModel.js";

const createOrder = async (request, response, next) => {
  const { items, email, totalAmount, orderTime } = request.body;

  try {
    // throw an error when any of the fields is missing
    if (!items || !email || !totalAmount || !orderTime) {
      return next(new HttpError("Missing inputs.", 400));
    }

    // create a new order document
    const newOrder = new orderModel({
      items,
      email,
      totalAmount,
      orderTime,
    });

    // save the new document to the Db
    await newOrder.save();

    // update the quantity of each book in the books collection
    const updatePromises = items.map((item) =>
      bookModel.findByIdAndUpdate(
        item._id,
        { $inc: { qty: -item.quantity } }, // Decrease quantity by the ordered amount
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    response.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Creating order failed, please try again later.", 500)
    );
  }
};

const updateOrderById = async (request, response, next) => {
  const orderId = request.params.id;
  const { email, totalAmount, ...orderItems } = request.body;

  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return next(new HttpError("The book is not found.", 404));
    }

    const updatedItems = order.items.map((item) => {
      // Update quantity if it exists in the request body
      if (orderItems[item._id]) {
        return {
          _id: item._id,
          quantity: bookQuantities[item._id],
        };
      }
      return item;
    });

    // Filter out items that should be added or removed
    const newItems = Object.keys(orderItems).map((bookId) => ({
      _id: bookId,
      quantity: orderItems[bookId],
    }));

    // Merge the existing items with the new ones, replacing quantities
    const allItems = [...updatedItems, ...newItems];
    const uniqueItems = allItems.reduce((acc, item) => {
      const existingItem = acc.find(
        (i) => i._id.toString() === item._id.toString()
      );
      if (existingItem) {
        existingItem.quantity = item.quantity;
      } else {
        acc.push(item);
      }
      return acc;
    }, []);

    // Update the order
    order.items = uniqueItems;
    order.totalAmount = totalAmount;
    order.email = email;

    const updatedOrder = await order.save();

    // Populate item details and include quantities
    const populatedOrder = await Order.findById(updatedOrder._id).populate({
      path: "items._id", // Reference field in `items` array
      select: "title price", // Fields to include from the `Item` model
    });

    const formattedOrder = {
      ...populatedOrder.toObject(), // Convert to plain object
      items: populatedOrder.items.map((item) => ({
        ...item._id.toObject(), // Spread item details
        quantity: item.quantity, // Include quantity
      })),
    };

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Updating order failed, please try again later.", 500)
    );
  }
};

const deleteOrderById = async (request, response, next) => {
  const orderId = request.params.id;

  try {
    const order = await orderModel.findOneAndDelete({ _id: orderId });
    if (!order) {
      return next(new HttpError("Order not found.", 404));
    }
    response.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Deleting order failed, please try again later.", 500)
    );
  }
};

const getOrders = async (request, response, next) => {
  const { email, startDate, endDate, orderId } = request.query;

  try {
    let filter = {};

    if (orderId) {
      const order = await orderModel.findById(orderId).populate({
        path: "items._id",
        select: "title price",
      });

      if (!order) {
        return next(new HttpError("Order ID not found.", 404));
      }

      // Format and return the single order
      const formattedOrder = {
        ...order.toObject(),
        items: order.items.map((item) => ({
          ...item._id.toObject(),
          quantity: item.quantity,
        })),
      };

      return response.status(200).json(formattedOrder);
    }

    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Convert local dates to UTC
      const startUTC = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0));
      const endUTC = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999));

      filter.orderTime = { $gte: startUTC, $lte: endUTC };
    }

    const orders = await orderModel
      .find(filter)
      .populate({
        path: "items._id",
        select: "title price",
      })
      .sort({ orderTime: -1 }); // Sort in reverse chronological order

    if (!orders.length) {
      return next(new HttpError("Orders not found.", 404));
    }

    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.map((item) => ({
        ...item._id.toObject(),
        quantity: item.quantity,
      })),
    }));

    response.status(200).json(formattedOrders);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Fetching orders failed, please try again later.", 500)
    );
  }
};


export default {
  createOrder,
  updateOrderById,
  deleteOrderById,
  getOrders,
};
