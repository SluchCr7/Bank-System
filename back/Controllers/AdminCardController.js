const Card = require("../models/Card");
const asyncHandler = require("express-async-handler");

const getAllCards = asyncHandler(async (req, res) => {
    const cards = await Card.find().populate("user" , "name email").sort({ createdAt: -1 });
    res.json(cards);
});

module.exports = {
    getAllCards
}