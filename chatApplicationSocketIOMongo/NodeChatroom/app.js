﻿// Dependencies

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongo = require('mongodb').MongoClient;

var app = express();

// all environments

// sets
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uses
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// gets
app.get('/', routes.index);
app.get('/users', user.list);

// instantiate server

var server = http.createServer(app);
var io = require('socket.io')(server);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
})

io.on('connection', function (socket) {
    console.log('a user connected');
    
    mongo.connect("mongodb://localhost/test", function (err, db) {
        if (err) {
            console.warn(err.message);
        } else {
            var collection = db.collection('chat messages');
            var stream = collection.find().sort().limit(20).stream();
            stream.on('data', function (chat) {
                console.log('emitting chat');
                socket.emit('chat', chat.content);
            });
        }
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat', function (msg) {
        mongo.connect("mongodb://localhost/test", function (err, db) {
            if (err) {
                console.warn(err.message);
            }
            else {
                var collection = db.collection('chat messages');
                collection.insert({ content : msg }, function (err, o) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else {
                        console.log("chat message inserted into db: " + msg);
                    }
                });
            }
        });

        socket.broadcast.emit('chat', msg);
    });
});