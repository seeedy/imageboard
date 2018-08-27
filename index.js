const express = require('express');
const app = express();
const db = require('./db');

app.use(express.static('./public'));
app.listen(8080, () => console.log('listening...'));

app.get('/images', (req, res) => {
    db.getImages()
        .then(response => {
            res.json(response);
        })
        .catch(err => console.log(err));
});
