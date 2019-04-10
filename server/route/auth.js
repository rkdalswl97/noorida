const express = require('express');
const joinService = require('../service/join');
const loginService = require('../service/login');
const findService = require('../service/find');
const PostOffice = require('./../mail-config/mail-password');
const tokenBuilder = require('uuid/v4');
const secret = require('../secret/index');
const uuid = require('uuid/v4');
const key = 'thisiskdkdk';

let mapper = {};


const router = express.Router();

/**
 * 회원가입
 */
router.post('/join', async (req, res) => {
  const result = await joinService.insertUser({
    realName: secret.hashing(req.body.realName),
    nickName: req.body.nickName,
    password: secret.salting(req.body.password),
    email: secret.hashing(req.body.email),
  })
    .then(results => results)
    .catch(err => err);
  if (result) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});


/**
 * 로그인
 */


router.get('/login', async (req, res) => {
  const { session } = req;
  if (mapper[session.key]) {
    const { nickName, password } = mapper[session.key];
    const results = await loginService.login({ nickName, password })
      .then(result => ({
        userId: result[0].userId,
        realName: secret.hashing(result[0].realName),
        nickname: result[0].nickname,
        email: secret.hashing(result[0].email),
        avatar: result[0].avatar,
        description: result[0].description,
      }))
      .catch(err => err);

    res.json({
      data: results,
      loginStatus: true,
    });
  } else {
    res.json({
      data: {},
      loginStatus: false,
    });
  }
})


router.delete('/login', async (req, res) => {
  const { session } = req;
  delete mapper[session.key];
  res.json('ok');
});

router.post('/login', async (req, res) => {
  const { nickName, password } = req.body;

  const correct = await loginService.getPasswordByNickname({ nickName })
    .then(result => secret.checkHashword(result[0].password, password))
    .catch(err => err);

  if (correct) {
    const results = await loginService.getUserDataByNickname({ nickName })
      .then(result => ({
        userId: result[0].userId,
        realName: secret.hashing(result[0].realName),
        nickname: result[0].nickname,
        email: secret.hashing(result[0].email),
        avatar: result[0].avatar,
        description: result[0].description,
      }))
      .catch(err => err);

    if (results) {
      const key = uuid();
      req.session.key = key;
      mapper[key] = { nickName };
    }

    res.json({
      data: results,
      loginStatus: !!results,
    });
  }
});


router.post('/find-id', async (req, res) => {
  const { realName, email } = req.body;
  const result = await findService.findId({ realName, email })
    .then(results => results)
    .catch(err => err);

  if (result.length !== 0) {
    res.json(result[0]);
  } else {
    res.json(false);
  }
});

router.post('/find-password', async (req, res) => {
  const { realName, nickName, email } = req.body;
  const result = await findService.findPassword({ realName, nickName, email })
    .then(results => results)
    .catch(err => err);

  if (result.length !== 0) {
    res.json(result[0]);
  } else {
    res.json(false);
  }
});

router.put('/find-password', async (req, res) => {
  const email = req.body.email;
  const tmpPassword = tokenBuilder();

  const result = await findService.insertTmpPassword({ email, tmpPassword })
    .then(results => results)
    .catch(err => err);

  PostOffice.transporter.sendMail(
    PostOffice.mailOptionBuilder(email, tmpPassword), (err, info) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        console.log(`EMAIL SENT ${ info.response }`);
        res.sendStatus(200);
      }
    });
});

module.exports = router;

