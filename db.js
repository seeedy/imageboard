const spicedPg = require('spiced-pg');
const db = spicedPg('postgres:postgres:postgres@localhost:5432/imageboard');

module.exports.getImages = () => {
    return db.query(`
                    SELECT * FROM images
                    ORDER BY id DESC LIMIT 6
                    `
    );
};

module.exports.getMoreImages = (id) => {
    return db.query(`
                    SELECT * FROM images
                    WHERE id < $1
                    ORDER BY id DESC LIMIT 3
                    `, [id]
    );
};

module.exports.getLastImageId = () => {
    return db.query(`
                    SELECT id FROM images
                    ORDER BY id ASC
                    LIMIT 1
                    `
    );
};

module.exports.saveFile = (url, user, title, desc) => {
    return db.query(`
                    INSERT INTO images (url, username, title, description)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *
                    `, [url || null, user || null, title || null, desc]
    );
};

module.exports.getImageById = (id) => {
    return db.query(`
                    SELECT * FROM Images
                    WHERE id = $1
                    `, [id || null]
    );
};

exports.saveComment = function(imageId, comment, username) {
    return db.query(`
                    INSERT INTO comments (image_id, comment, username)
                    VALUES ($1, $2, $3)
                    RETURNING *
                    `, [imageId, comment, username]
    );
};

exports.getComments = function(imageId) {
    return db.query(`
                    SELECT * FROM comments
                    WHERE image_id = $1
                    `, [imageId]
    );
};
