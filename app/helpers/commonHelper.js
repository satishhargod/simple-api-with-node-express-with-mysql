const url = require('url');
const { Console } = require('winston/lib/winston/transports');
const fs = require('fs');
const config = require('../config/config');
const _ = require('lodash');

const saveResponse = (path, data) => {
  try {
    // path = project_dir + '/storage/response.json';
    // CommonHelper.saveResponse(path, { walmart: new Date });

    //fs.appendFile(path, data, 'utf8', { mode: 0755 });
    //fs.createWriteStream(path + '/node.error.log', { flags: 'a' });

    fs.appendFile(path, JSON.stringify(data), { encoding: 'utf8', mode: 0755 }, (err) => {
      if (err) return console.error(err);
      console.log('Data store successfully', path);
    });
  } catch (err) {
    console.log("---------Error--------", err);
  }
}

module.exports = {
  saveResponse
}
