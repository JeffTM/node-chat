"use strict";

//--- Module imports ---
const express = require('express');
const fs = require('fs');
const mustache = require('mustache');
const mysql = require('mysql');
const session = require('express-session');
const util = require('util');

//promisify stuff
fs.readFile = util.promisify(fs.readFile);

//--- App config ---
const app = express();
const port = 3000;
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'node chat 5619616131',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true } //ToDo: use HTTPS to we can have secure cookies
}));

//Mustache config
app.engine('html', async (path, options, callback) => {
    try {
        let fileBuffer = await fs.readFile(path);
        let rendered = mustache.render(fileBuffer.toString(), options);
        return callback(null, rendered);
    }
    catch (err) {
        return callback(err);
    }
});
app.set('views', './views');
app.set('view engine', 'html');

//MySQL connection pool config
const dbpool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'nodechat',
    password: 'nodechat',
    database: 'nodechat'
});
dbpool.query = util.promisify(dbpool.query);

//--- App routing ---
//Logs the error and serves the error page. ToDo: serve an actual page lol
function generalError(error, response) {
    console.log(error);
    response.send("Internal error occured :(");
}

function serveRawView(fileName, response) {
    response.sendFile(fileName, { root: __dirname + '/views' });
}

app.get('/', (req, res) => serveRawView('index.html', res)); //serve index directly for performance

app.post('/login', async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let sql = "select UserID from User where Username = ? and Password = ?";
        let result = await dbpool.query(sql, [username, password]);
        if (result.length > 0) {
            req.session.userID = result[0].UserID;
            res.redirect('/groups');
            console.log(req.session);
        } 
        else res.send('invalid');
    }
    catch(err) {
        generalError(err, res);
    }
});

app.get('/groups', (req, res) => {
    console.log(req.session);
    res.send(req.session.userID.toString());
})

//--- Start the app ---
app.listen(port, () => {
    console.log(`NodeChat started on port ${port}`)
    console.log('http://localhost:3000/');
});
