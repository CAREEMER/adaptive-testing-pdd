const express = require('express');
import { findUserByUsername, createUserByUsernameAndPassword, createSessionToken, checkPassword } from "../../../utils/user";
import { authWithToken, createDeeplinkToken } from "../../../utils/auth";


const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('You must provide an username and a password.');
    }

    const existingUser = await findUserByUsername(username);

    if (existingUser) {
      res.status(400);
      throw new Error('Username already in use.');
    }

    const user = await createUserByUsernameAndPassword(username, password);

    const serializeUser = (user) => {
      const { password, telegramID, createdAt, ...response } = user
      return response
    }

    res.json(serializeUser(user));
  } catch (err) {
    next(err);
  }
})


router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400);
      throw new Error('You must provide an username and a password.');
    }

    if (!checkPassword(username, password)) {
      res.status(403);
      throw new Error('Username or password is invalid.');
    }

    const sessionToken = await createSessionToken(username);

    res.json({
      token: sessionToken.id
    })

  } catch (err) {
    next(err)
  }
})


router.post('/deeplink-telegram', async (req, res, next) => {
  try {
    const user = await authWithToken(req, res)

    const token = await createDeeplinkToken(user)

    // https://t.me/my_telegram_bot?start=my_action

    const deeplink = 'https://t.me/' + ( process.env.BOT_USERNAME || 'staging_adaptive_pdd_bot' ) + '?start=DEEPLINK_TOKEN#' + token

    res.json({
      deeplink
    })

  } catch(err) {
    next(err)
  }
})

module.exports = router;
