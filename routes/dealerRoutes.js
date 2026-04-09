const express = require('express');
const router = express.Router();

const {
  getDealers,
  getDealerById,
  createDealer,
  updateDealer,
  deleteDealer
} = require('../controllers/dealerController');

router.get('/', getDealers);
router.get('/:id', getDealerById);
router.post('/', createDealer);
router.put('/:id', updateDealer);
router.delete('/:id', deleteDealer);

module.exports = router;