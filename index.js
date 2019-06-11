
const express = require('express');
const app = express();
const coins = require('./routes/coins')

app.use(express.json());
app.use('/api/coins/', coins);

app.listen(3000, () => console.log("Listining on port 3000"));

