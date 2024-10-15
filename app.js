const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());                       // Allow Cross-Origin requests

// Route for fetching NPM package data
app.get('/:searchTerm/:size', async (req, res) => {
  try {
    const { searchTerm, size = 10 } = req.params;

    // Fetch NPM package data
    const npmResponse = await fetch(`https://registry.npmjs.com/-/v1/search?text=${searchTerm}&size=${size}`);
    
    if (!npmResponse.ok) throw new Error('NPM API request failed');
    
    const npmData = await npmResponse.json();
    
    // Send the parsed data to the client
    res.json(npmData,npmResponse);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
});

// Listen to port on render
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
