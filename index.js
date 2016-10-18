const fs = require("fs");
const crypto = require('crypto');

const hash = crypto.createHash('md5');
hash.setEncoding('hex');

const input = fs.createReadStream("data.txt");
const output = fs.createWriteStream("copy.txt");

input.on("end", () => {
	hash.end();

	console.log(hash.read());
});

hash.on("finish", () => {
	hash.pipe(output);
})

input.pipe(hash);
