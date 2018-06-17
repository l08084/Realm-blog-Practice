'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    Realm = require('realm');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

let PostSchema = {
    name: 'Post',
    properties: {
        timestamp: 'date',
        title: 'string',
        content: 'string'
    }
};

var blogRealm = new Realm({
    path: 'blog.realm',
    schema: [PostSchema]
});

app.get('/write', function(req, res) {
    res.sendfile(__dirname + "/write.html");
});

app.post('/write', function(req, res) {
    let title = req.body['title'],
        content = req.body['content'],
        timestamp = new Date();
    blogRealm.write(() => {
        blogRealm.create('Post', {title: title, content: content, timestamp});
    });
    res.sendFile(__dirname + "/write-complete.html");
});

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    let posts = blogRealm.objects('Post').sorted('timestamp', true);
    res.render('index.ejs', {posts: posts});
});

app.listen(3000, function() {
    console.log('Go!!');
});