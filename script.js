const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// const { aboutSchema, validation } = require('./validation');

app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
const otherRoutes = require('./routes/otherRoutes');
app.use('/', authRoutes);
app.use('/', otherRoutes);


app.listen(5000, () => {
    console.log("Server connected! Listen port 5000");
});
