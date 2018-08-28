var knox = require('knox');
var fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
var client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'spicedling' // change name here!
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        res.status(500).json({
            success: false
        });
    }
    // uploading to AWS S3 here
    var s3Request = client.put(req.file.filename, {
        // telling S3 how to serve the file
        'Content-Type': req.file.mimetype, // header
        'Content-Length': req.file.size, // header
        'x-amz-acl': 'public-read' // public access
    });
    // read stream the data from file and pipe to request
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);
    // if we get 200 response means it worked
    s3Request.on('response', s3Response => {
        if (s3Response.statusCode == 200) {
            fs.unlink(req.file.path, () => {});
            return next();
        }
        console.log(s3Response.statusCode);
        res.status(500).json({
            success: false
        });
    });
    // ???????????????? why no req.end ???????????????????????
    // -> because readStream.pipe sends the req
};
