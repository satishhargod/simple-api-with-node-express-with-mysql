const multer = require('multer');
const mime = require('mime');
const fs = require('fs');
const config = require('../config/config');
const _ = require('lodash');
const jimp = require('jimp');
const catchAsync = require('../utils/catchAsync');


const singleUpload = (foldername, field_name) => {
    //console.log("file", file);
    const uploadPath = `${config.storage_path}${foldername}/`;

    const storage = {
        storage: multer.diskStorage({ //multers disk storage settings
            destination: function (req, file, cb) {
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath);
                }
                cb(null, uploadPath)
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '.' + mime.getExtension(file.mimetype));
                //cb(null, Date.now() + '.csv');
            }
        })
    };
    const upload = multer(storage).array(field_name, 20);
    return upload;
};

function deleteFile(imageList) {
    _.map(imageList, function (x) {
        const imagepath = x.replace(config.FILE_URL, `${filePath}/`);

        if (fs.existsSync(imagepath)) {
            fs.unlink(imagepath, (fileErr) => {
                if (fileErr) {
                    console.log(fileErr)
                } else {
                    console.log('-- FILE DELETED --');
                }
            });
        }
    });
    return imageList;
}


async function compressFile(Path, fileName, fileType) {
    return new Promise((resolve, reject) => {
        const oldPath = fileName.replace(config.FILE_URL, `${filePath}/`);
        const route = (Path.status === 1) ? Path.imgpath : Path;
        const fileEx = (fileType == 'image/jpeg') ? '.jpg' : '.png';
        //const newFileName = (Path.status === 1) ? `logo${fileEx}` : `${new Date().getTime() + hat()}${fileEx}`;
        const newPath = `${config.FILE_PATH}/` + `${route}/` + newFileName;
        // eslint-disable-next-line consistent-return
        fs.rename(oldPath, newPath, (fsErr) => {
            console.log('oldPath: ', oldPath);
            console.log('newPath: ', newPath);
            if (fsErr) {
                resolve({
                    success: false,
                    mesg: fsErr
                });
            } else {
                jimp.read(newPath)
                    .then((lenna) => {
                        lenna
                            .resize(jimp.AUTO, 125)
                            .write(`${config.FILE_PATH}/${`${route}/thumbnail_${newFileName}`}`); // save

                        jimp.read(newPath)
                            .then((lenna) => {
                                lenna
                                    .resize(jimp.AUTO, 450)
                                    .write(`${config.FILE_PATH}/${`${route}/img_450_${newFileName}`}`); // save

                                const originalImage = newPath.replace(filePath, config.FILE_URL);

                                deleteFile([originalImage]);

                                resolve({
                                    success: true,
                                    image: `${config.FILE_URL}${`${route}/img_450_${newFileName}`}`,
                                    thumbnailImg: `${config.FILE_URL}${route}/thumbnail_${newFileName}`
                                });
                            })
                            .catch((e) => {
                                resolve(e);
                            });
                    })
                    .catch((e) => {
                        resolve(e);
                    });
            }
        });
    });
}

module.exports = {
    singleUpload,
    deleteFile,
    compressFile
}
