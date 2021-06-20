import express from 'express';
import dotenv from 'dotenv';
import milter from 'multer';
import { nanoid } from 'nanoid';
import cors from 'cors';

dotenv.config({
  path: 'server/.env',
});

import './core/db';

import { passport } from './core/passport';
import multer from 'multer';

const app = express();
const uploader = multer({
  storage: milter.diskStorage({
    destination: function (_, __, cb) {
      cb(null, 'public/avatars');
    },
    filename: function (_, file, cb) {
      cb(null, file.fieldname + '-' + nanoid(6) + '.' + file.mimetype.split('/').pop());
    }
  })
})

app.use(cors());

app.use(passport.initialize());

app.post('/upload', uploader.single('photo'), (req, res) => {
  res.json(req.file);
});

app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user,
      )}', '*');window.close();</script>`,
    );
  },
);

app.listen(3001, () => {
  console.log('SERVER RUNNED!');
});
