const Dealer = require('../models/Dealer');

const getDealers = async (req, res) => {
  try {
    const { name, city, country, region, stockLevel, minRating } = req.query;
    let filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (country) filter.country = { $regex: country, $options: 'i' };
    if (region) filter.region = region;
    if (stockLevel) filter.stockLevel = stockLevel;
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    const dealers = await Dealer.find(filter);
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDealerById = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' });
    res.json(dealer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createDealer = async (req, res) => {
  try {
    const dealer = new Dealer(req.body);
    const saved = await dealer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateDealer = async (req, res) => {
  try {
    const updated = await Dealer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Dealer not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDealer = async (req, res) => {
  try {
    const deleted = await Dealer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Dealer not found' });
    res.json({ message: 'Dealer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDealers, getDealerById, createDealer, updateDealer, deleteDealer };