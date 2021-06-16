const fs = require('fs');
const path = require('path');
const date = require('silly-datetime');

function writeLog(writeStream, logs){
    writeStream.write(logs+'\n');
}

//创建writeStream 写入流
function createWriteStream(fileName){
    const fullFileName = path.join(__dirname, '../logs',fileName);
    const writeStream = fs.createWriteStream(fullFileName,{
        flags:'a'
    })
    return writeStream
}

//访问日志
let tName=date.format(Date.now(),'YYYYMMDD');
const accessWriteStream = createWriteStream(tName+'.log');

function access(log) {
    writeLog(accessWriteStream,log)
}

module.exports = {
    access
}

