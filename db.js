const spicedPg = require('spiced-pg');
const db = spicedPg('postgres:postgres:postgres@localhost:5432/imageboard');

module.exports.getImages = () => {
    return db.query(`
                    SELECT * FROM images
                    ORDER BY id DESC
                    `
    );
};

module.exports.saveFile = (url, title, desc, user) => {
    return db.query(`
                    INSERT INTO images (url, title, description, username)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *
                    `, [url || null, title, desc, user]
    );
};
