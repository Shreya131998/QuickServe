const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache (TTL of 10 minutes)
const cache = new NodeCache({ stdTTL: 30 });
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

// Main route to proxy requests
app.get('/proxy/*', async (req, res) => {
  const originalUrl = req.originalUrl.replace('/proxy/', '');

  // Check if the response is cached
  const cachedResponse = cache.get(originalUrl);
  if (cachedResponse) {
    res.set('X-Cache', 'HIT');
    return res.send(cachedResponse);
  }

  try {
    // If not cached, forward request to the original server
    const fullUrl = `http://${originalUrl}`;
    const response = await axios.get(fullUrl);
    cache.set(originalUrl, response.data); // Cache the response
    res.set('X-Cache', 'MISS');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

// Clear cache route
app.get('/clear-cache', (req, res) => {
  cache.flushAll();
  res.send('Cache cleared');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
