const express = require('express');
const app = express();

app.get('/api/data', (req, res) => {
  res.json({ message: "Secure data from backend ✅" });
});

app.listen(3000, () => console.log('Backend running on port 3000'));
