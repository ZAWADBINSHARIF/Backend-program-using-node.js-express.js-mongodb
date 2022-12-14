'use strict';

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const connectDB = require('./config/dbConnection.js');
const PORT = process.env.PORT || 3500;
require('dotenv').config();

// Connect to Database
connectDB();

// custom middleware logger
app.use(logger); 

app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routers/root.js'));
app.use('/register', require('./routers/register.js'));
app.use('/authLogin', require('./routers/login.js'));
app.use('/refresh', require('./routers/refresh.js'));
app.use('/logout', require('./routers/logout.js'));
app.use(verifyJWT);
app.use('/employees', require('./routers/api/employees.js'));

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404!! Page Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log('connected to mongodb');
})
