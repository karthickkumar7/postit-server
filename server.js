require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });
const mongoose = require('mongoose');

app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', require('./routes/authRoute'));
app.use('/post', require('./routes/postRoute'));
app.use('/comment', require('./routes/commentRoute'));

// error
app.use((err, req, res, next) => {
    return res.status(500).json({ error: err.message });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    server.listen(5000, () => console.log('server started!'));
});
