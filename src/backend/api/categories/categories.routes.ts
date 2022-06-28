const express = require('express');
import { listAllCategories } from "../../../utils/categories";

const router = express.Router();

router.get('/list', async (req, res, next) => {
  try {
    const categories = await listAllCategories();

    res.json(categories);
  } catch (err) {
    next(err);
  }
})

module.exports = router;
