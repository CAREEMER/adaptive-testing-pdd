const express = require('express');

// import { router as auth } from './auth/auth';
const auth = require('./auth/auth')

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

console.log(auth)
router.use('/auth', auth);

export { router }