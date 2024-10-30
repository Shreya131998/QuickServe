const express = require('express');
const app = express();
const port = 8000;

app.get('/api/data', (req, res) => {
  // Simulate a 2-second delay
  setTimeout(() => {
    res.json({ message: "This is data from the API", timestamp: new Date().toISOString() });
  }, 2000);
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
