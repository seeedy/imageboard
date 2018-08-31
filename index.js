const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const config = require('./config.json');


const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("body-parser").json());
app.use(express.static('./public'));

app.listen(8080, () => console.log('listening...'));

// **************** ROUTES ************************************

app.get('/images', (req, res) => {
    Promise.all([
        db.getImages(),
        db.getLastImageId(),
    ])
        .then(response => {
            res.json(response);
        })
        .catch(err => console.log(err));
});

app.get('/more/:id', (req, res) => {
    console.log('more req: ', req.params.id);
    Promise.all([
        db.getMoreImages(req.params.id),
        db.getLastImageId(),
    ])
        .then(response => {
            console.log(response);
            res.json(response);
        })
        .catch(err => console.log(err));
});

// uploader is used as middleware to handle uploads on post route
app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    console.log('POST /upload in server', req.body);
    // save to (local) server db
    db.saveFile(
        config.s3Url + req.file.filename,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then((response) => {
            console.log('succesfully uploaded! response: ', response.rows[0]);
            // send back from db to vue to render
            res.json(response.rows[0]);
        })
        .catch(() => {
            res.status(500).json({
                success: false
            });
        });
});


app.get('/image/:id', (req, res) => {
    db.getImageById(req.params.id).then(response => {
        console.log('getting image data for: ', req.params.id);
        res.json(response.rows[0]);
    }
    );
});


app.get('/comments/:id', (req, res) => {
    db.getComments(req.params.id).then(response => {
        res.json(response.rows);
    });
});

app.post('/comments', (req, res) => {
    db.saveComment(req.body.imageId, req.body.comment, req.body.username).then((response) => {
        res.json(response.rows[0]);
    });
});
