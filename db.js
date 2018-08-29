const spicedPg = require('spiced-pg');
const db = spicedPg('postgres:postgres:postgres@localhost:5432/imageboard');

module.exports.getImages = () => {
    return db.query(`
                    SELECT * FROM images
                    ORDER BY id DESC
                    `
    );
};

// !!!!!!!!!!!!!!! FIX NO DESC IN DB !!!!!!!!!!!!!!!!!!!!
module.exports.saveFile = (url, title, user, desc) => {
    return db.query(`
                    INSERT INTO images (url, title, username, description)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *
                    `, [url || null, title || null, user || null, desc]
    );
};

module.exports.getImageById = (id) => {
    return db.query(`
                    SELECT * FROM Images
                    WHERE id = $1
                    `, [id || null]
    );
};
