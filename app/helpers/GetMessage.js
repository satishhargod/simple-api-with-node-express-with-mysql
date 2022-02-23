const fs = require('fs');


async function prepareMessage(fileName, key) {

  let content = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  let msg = content[key];
  return msg;
}
module.exports = {
  prepareMessage
}
