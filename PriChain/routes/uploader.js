var express = require('express');
var router = express.Router();
var multer  =   require('multer');
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
var PDFImage = require("pdf-image").PDFImage;

var publishStorage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/pdfs/');
    },
    filename: function(req, file, callback){
    	filename = Date.now() + '.pdf';
        callback(null, filename); 
    }
});

var pictureStorage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/images/');
    },
    filename: function(req, file, callback){
    	filename = Date.now() + '.png';
        callback(null, filename); 
    }
});

var uploadPublish = multer({storage: publishStorage,
    fileFilter: function (req, file, callback) {
        console.log(file.mimetype);
        if(file.mimetype !== 'application/pdf') {
            return callback("only pdfs")
        }
        callback(null, true)
    }
});

var uploadPicture = multer({storage: pictureStorage,
    fileFilter: function (req, file, callback) {
        console.log(file.mimetype);
        if(file.mimetype !== 'image/jpeg' && file.mimetype != "image/png") {
            return callback("only images")
        }
        callback(null, true)
    }
});

router.post('/upload', uploadPublish.single('publication-file' , function(err) {
    console.log(err , "nk");
    }),  (req, res) => {
    console.log(req.file.path);
    let myFile = fs.readFileSync(req.file.path);   
    let myFileBuffer = new Buffer.from(myFile );
    var pdfImage = new PDFImage(req.file.path,{
        graphicsMagick: true,
    });
    pdfImage.convertPage(0).then(function (imagePath) {
        ipfs.files.add(myFileBuffer, function (err, file) {
            if (!err) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        res.json({
                            success : false,
                            error: err
                        });
                    }else {
                        res.json({
                            success : true,
                            filepath: file[0].hash + "," + imagePath
                        });
                    }
                  });
            }else {   
                console.log(err);   
                res.json({
                    success : false,
                    error: err
                });
            }
        });
    }).catch(err =>{
        console.log(err);
        res.json({
            success : false,
            error: err
        });
    });  
});

router.post('/upload/picture', uploadPicture.single('profile-picture'),  (req, res) => {
    res.json({
        success : true,
        filepath: req.file.path
    });  
});

module.exports = router;