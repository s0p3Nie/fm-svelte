const fs = require('fs');

export const read = (path) => {
    return JSON.parse(fs.readFileSync(path));
}

export const write = (path, data) => {
    fs.writeFile(path, JSON.stringify(data), (err) => { if (err) throw err });
}