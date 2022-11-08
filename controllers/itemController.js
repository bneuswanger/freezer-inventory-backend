const asyncHandler = require('express-async-handler');

const Item = require('../models/itemModel');
const User = require('../models/userModel');

// @desc    Get items
// @route   GET /api/items
// @access  Private

const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user.id });
  res.status(200).json(items);
});

// @desc    Create item
// @route   POST /api/items
// @access  Private

const createItem = asyncHandler(async (req, res) => {
  if (!req.body.description) {
    res.status(400);
    throw new Error('Please add a description field (eg. chicken thigh)');
  }
  if (!req.body.location) {
    res.status(400);
    throw new Error('Please specify freezer location (boathouse or downstairs)');
  }
  if (!req.body.category) {
    res.status(400);
    throw new Error('Please specify category (eg. meat, vegetable, fruit, mushroom');
  }
  if (!req.body.quantity) {
    res.status(400);
    throw new Error('Please specify the quantity');
  }
  if (!req.body.mealsperquantity) {
    res.status(400);
    throw new Error('Please specify the meals per quantity');
  }
  if (!req.body.year) {
    res.status(400);
    throw new Error('Please specify the year of harvest');
  }
  const item = await Item.create({
    description: req.body.description.toLowerCase(),
    location: req.body.location,
    category: req.body.category,
    quantity: req.body.quantity,
    mealsperquantity: req.body.mealsperquantity,
    year: req.body.year,
    notes: req.body.notes,
    user: req.user.id,
  });
  res.status(200).json(item);
});

// @desc  Update item
// @route   PUT /api/items/:id
// @access  Private

const updateItem = asyncHandler(async (req, res) => {

  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(400);
    throw new Error('Item not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }
  // Make sure the logged in user matches the item user
  if (item.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedItem);
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private

const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(400);
    throw new Error('Item not found');
  }
  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }
  // Make sure the logged in user matches the item user
  if (item.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await item.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
};
