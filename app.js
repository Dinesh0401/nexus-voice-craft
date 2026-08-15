const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');

// Middleware
app.use(bodyParser.json());
app.use('/api', routes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});