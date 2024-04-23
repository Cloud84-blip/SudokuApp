const fs = require('fs');


function getStream(path){
    return fs.createReadStream(path);
}

const stream = getStream(process.argv[2]);
console.log(stream)

stream.on('data', function(chunk){
    //console.log(chunk.toString());
})