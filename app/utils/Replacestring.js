
const prepareMessage = async (content, varValues) => {
  const pattern = /\[\[([\s\S]*?)(?=\]\])/g;
  let result = '';
  if (content) {
    result = content.match(pattern);
  }

  const varList = [];
  let newContent = content;
  if (result != null) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < result.length; i++) {
      if (result[i].length > 1) {
        result[i] = result[i].substring(2, result[i].length);
        // if (!varList.includes(result[i])) { varList.push(result[i]); }
        varList.push(result[i]);
      }
    }
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < varList.length; j++) {
      if (varValues[varList[j]] == undefined || varValues[varList[j]] == null) {
        newContent = newContent.replace(`[[${varList[j]}]]`, '');
      } else {
        newContent = newContent.replace(`[[${varList[j]}]]`, varValues[varList[j]]);
      }
    }
  }

  return newContent;
}

module.exports = {
  prepareMessage
}
