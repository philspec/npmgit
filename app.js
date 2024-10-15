const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())
app.get('/:searchTerm/:size/:ranking', async (req, res) => {
  try {
    const { searchTerm, size = 10 } = req.params;
    
    // Fetch NPM package data
    const npmResponse = await fetch(`http://registry.npmjs.com/-/v1/search?text=${searchTerm}&size=${size}`);
    if (!npmResponse.ok) throw new Error('NPM API request failed');
    const npmData = npmResponse.json();
    return npmData
    }
   catch (error) {
    console.error('Error:', error.message);
  }})


// listen to port on render

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});