const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();

const PUBLIC_KEY = fs.readFileSync('./keys/public.pem', 'utf8');

app.use(express.json());

app.post('/authorize', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('No token provided');

  try {
    jwt.verify(token, PUBLIC_KEY);
    console.log('✅ JWT verified');
    res.status(200).send(); // OK
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    res.status(403).send('Forbidden');
  }
});

app.listen(3001, () => console.log('Auth service on port 3001'));
