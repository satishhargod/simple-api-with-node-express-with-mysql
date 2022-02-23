
const multer = require('multer');
const path = require('path');
const Config = require('../config/config');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');


const s3 = new aws.S3(Config.AWS_CONFIG);

const singleAwsImageUpload = (field_name, dirName) => {
  const storage = {
    storage: multerS3({
      s3: s3,
      bucket: Config.AWS_BUCKET_NAME,
      acl: 'public-read',
      key: function (req, file, cb) {
        let imageBaseName = `${field_name}-${Date.now() + path.extname(file.originalname)}`;
        if (dirName) {
          imageBaseName = `${dirName}/${field_name}-${Date.now() + path.extname(file.originalname)}`;
        }
        cb(null, imageBaseName);
      }
    }),
    limits: { fileSize: 2000000 },
  };
  const upload = multer(storage).array(field_name, 20);
  return upload;
}

const deleteOnAws = (url, dirName) => {
  let key = url.split('/');
  key = (dirName) ? `${dirName}/${key[key.length - 1]}` : `${key[key.length - 1]}`;
  console.log("key", key);
  s3.deleteObject({
    Bucket: Config.AWS_BUCKET_NAME,
    Key: key
  }, function (err, data) {
    if (err) console.log("err", err);
    console.log("success", data);
  });
  return true;
}

const multipleFieldImage = (field_1, field_2, dirName) => {
  const storage = {
    storage: multerS3({
      s3: s3,
      bucket: Config.AWS_BUCKET_NAME,
      acl: 'public-read',
      key: function (req, file, cb) {
        console.log("----", file);
        let imageBaseName = `${file.fieldname}-${Date.now() + path.extname(file.originalname)}`;
        if (dirName) {
          imageBaseName = `${dirName}/${file.fieldname}-${Date.now() + path.extname(file.originalname)}`;
        }
        cb(null, imageBaseName);
      }
    }),
    limits: { fileSize: 2000000 },
  };
  // const upload = multer(storage).array(field_1, 20);
  const upload = multer(storage).fields([{ name: field_1, maxCount: 1 }, { name: field_2, maxCount: 1 }]);

  return upload;
}

const deleteMultipleImages = (urlsData, dirName) => {
  const params = {
    Bucket: Config.AWS_BUCKET_NAME,
    Delete: {
      Objects: [],
      Quiet: false
    }
  };

  urlsData.map((val) => {
    console.log("val", val);
    const key = val.split('/');
    params.Delete.Objects = [...params.Delete.Objects, {
      Key: (dirName) ? `${dirName}/${key[key.length - 1]}` : `${key[key.length - 1]}`
    }];
  });

  console.log("key", params);
  s3.deleteObjects(params, function (err, data) {
    if (err) console.log("err", err);
    console.log("success888888", data);
  });
  return true;
}


module.exports = {
  singleAwsImageUpload,
  deleteOnAws,
  deleteMultipleImages,
  multipleFieldImage
}
