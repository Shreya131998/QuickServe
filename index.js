const express = require('express');
const apicache = require('apicache');

const app = express();
const port = 3000;
let isCacheEnabled = true;
let cache = apicache.middleware;
apicache.options({ trackPerformance: true });
const cacheMiddleware = cache('30 seconds', (req, res) => isCacheEnabled);
app.use(cacheMiddleware);
// Enable or disable cache based on a variable

// Define a route and cache the response for 2 minutes if caching is enabled
app.get('/api/data', (req, res) => {
  // Simulate a 5-second delay before sending the response
  setTimeout(() => {
    res.json({
      message: "This is data from the API",
      timestamp: new Date().toISOString()
    });
  }, 5000); // 5000 milliseconds = 5 seconds
});


// API to clear the cache
app.get('/api/cache/clear', (req, res) => {
  apicache.clear();  // Clears all cache entries
  res.json({ message: 'Cache cleared successfully' });
});

// API to enable cache
app.get('/api/cache/enable', (req, res) => {
  isCacheEnabled = true;
  res.json({ message: 'Cache enabled' });
});

// API to disable cache
app.get('/api/cache/disable', (req, res) => {
  isCacheEnabled = false;
  res.json({ message: 'Cache disabled' });
});

// Start the server
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
