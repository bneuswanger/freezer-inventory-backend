const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please specify a description'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify a quantity'],
    },
    mealsperquantity: {
      type: Number,
      required: [true, 'Please specify meals per quantity'],
    },
    category: {
      type: String,
      required: [true, 'Please specify food category (vegetable, fruit, mushroom, meat, etc.)'],
    },
    location: {
      type: String,
      required: [true, 'Please specify location: boathouse or downstairs'],
    },
    year: {
      type: Number,
      required: [true, 'Please specify the year of harvest'],
    },
    notes: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    url: {
      type: String,
      required: [true, 'Need the image URL']
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);
