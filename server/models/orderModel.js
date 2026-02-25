import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
        required: true,
      },
      quantity: { 
        type: Number, 
        required: true 
    },
    },
  ],
  email: { 
    type: String, 
    required: true, 
    trim: true 
},
  totalAmount: { 
    type: Number, 
    required: true 
},
  orderTime: { 
    type: Date, 
    default: Date.now 
},
});

export default mongoose.model("orders", orderSchema);
