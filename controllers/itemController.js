const asyncHandler = require('express-async-handler')
const { cloudinary } = require('../utils/cloudinary')

const Item = require('../models/itemModel')
const User = require('../models/userModel')

// @desc    Get items
// @route   GET /api/items
// @access  Private
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user.id })
  res.status(200).json(items)
})

// @desc    Create item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  if (!req.body.image_data) {
    res.status(400)
    throw new Error('Please add a picture')
  }
  if (!req.body.description) {
    res.status(400)
    throw new Error('Please add a description field (eg. chicken thigh)')
  }
  if (!req.body.location) {
    res.status(400)
    throw new Error('Please specify freezer location (boathouse or downstairs)')
  }
  if (!req.body.category) {
    res.status(400)
    throw new Error('Please specify category (eg. meat, vegetable, fruit, mushroom')
  }
  if (!req.body.quantity) {
    res.status(400)
    throw new Error('Please specify the quantity')
  }
  if (!req.body.mealsperquantity) {
    res.status(400)
    throw new Error('Please specify the meals per quantity')
  }
  if (!req.body.year) {
    res.status(400)
    throw new Error('Please specify the year of harvest')
  }

  let cloudinaryUrl
  const fileStr = req.body.image_data
  if (fileStr.includes('cloudinary')) {
    const cloudinaryResponse = await cloudinary.uploader.explicit(req.body.public_id, {
      type: 'upload',
      eager: [{ width: 250, aspect_ratio: 1, crop: 'fill', gravity: 'food', format: 'webp', quality: 90 }],
    })
    cloudinaryUrl = cloudinaryResponse.eager[0].secure_url
  } else {
    const cloudinaryResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'freezer-inventory',
      eager: [{ width: 250, aspect_ratio: 1, crop: 'fill', gravity: 'food', format: 'webp', quality: 90 }],
    })
    cloudinaryUrl = cloudinaryResponse.eager[0].secure_url
  }

  const item = await Item.create({
    description: req.body.description,
    location: req.body.location,
    category: req.body.category,
    quantity: req.body.quantity,
    mealsperquantity: req.body.mealsperquantity,
    year: req.body.year,
    notes: req.body.notes,
    user: req.user.id,
    url: cloudinaryUrl,
  })
  res.status(200).json(item)
})

// @desc  Update item
// @route   PUT /api/items/:id
// @access  Private

const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id)
  if (!item) {
    res.status(400)
    throw new Error('Item not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }
  // Make sure the logged in user matches the item user
  if (item.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  let cloudinaryUrl
  const incomingImage = req.body.image_data

  //Handle case: Image from Cloudinary is already resized.  No additional requests needed
  if (incomingImage.includes('ar_1,c_fill')) {
    cloudinaryUrl = req.body.url
  }
  //Handle case: Image from Cloudinary is not yet resized.  Request transformation from cloudinary.
  if (incomingImage.includes('cloudinary') && !incomingImage.includes('ar_1,c_fill')) {
    const cloudinaryResponse = await cloudinary.uploader.explicit(req.body.public_id, {
      type: 'upload',
      eager: [{ width: 250, aspect_ratio: 1, crop: 'fill', gravity: 'food', format: 'webp', quality: 90 }],
    })
    cloudinaryUrl = cloudinaryResponse.eager[0].secure_url
  }
  //Handle case: Image is from local source
  if (incomingImage.includes('data:image') && incomingImage.includes('base64')) {
    const cloudinaryResponse = await cloudinary.uploader.upload(incomingImage, {
      folder: 'freezer-inventory',
      eager: [{ width: 250, aspect_ratio: 1, crop: 'fill', gravity: 'food', format: 'webp', quality: 90 }],
    })
    cloudinaryUrl = cloudinaryResponse.eager[0].secure_url
  }

  const editedItem = { ...req.body, url: cloudinaryUrl }
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, editedItem, { new: true })
  res.status(200).json(updatedItem)
})

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private

const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id)

  if (!item) {
    res.status(400)
    throw new Error('Item not found')
  }
  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }
  // Make sure the logged in user matches the item user
  if (item.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await item.deleteOne()
  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
}
