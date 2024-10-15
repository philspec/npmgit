const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())
app.get('/:searchTerm/:size/:ranking', async (req, res) => {
  try {
    const { searchTerm, size = 10 , ranking = 'popularity' } = req.params;
    
    // Fetch NPM package data
    const npmResponse = await fetch(`http://registry.npmjs.com/-/v1/search?text=${searchTerm}&size=${size}&ranking=${ranking}`);
    if (!npmResponse.ok) throw new Error('NPM API request failed');
    const npmData = await npmResponse.json();
    return npmData
    }
   catch (error) {
    console.error('Error:', error.message);
  }})


app.listen(3000, () => {
console.log(`Server is running`);
})