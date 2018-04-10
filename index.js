const express = require('express')
const app = express()
app.get('/', (req, res) => {
  res.send('HEY! PM2 NODE SERVER')
})
app.listen(3000, () => console.log('Server running on port 3000'))
