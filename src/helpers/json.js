const fs = require('fs');

const read = (path) => {
    return JSON.parse(fs.readFileSync(path));
}

const write = (path, data) => {
    fs.writeFile(path, JSON.stringify(data), (err) => { if (err) throw err });
}

module.exports = {read, write};