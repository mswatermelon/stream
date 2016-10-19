'use strict';

const fs = require("fs");
const crypto = require('crypto');
const stream = require('stream');

const hash = crypto.createHash('md5');

const input = fs.createReadStream("data.txt");
const output = fs.createWriteStream("copy.txt");

class HashAndTransform {
	constructor(hash) {
		const transform = new stream.Transform({
		  transform(chunk, encoding, callback) {
				hash.setEncoding('hex');
		    hash.update(chunk, encoding);
		    callback();
		  },
		});

		return transform;
	}
}

input.on("end", () => {
	hash.end();
	console.log(hash.read());
});

hash.on('finish', () => hash.pipe(output));

let hashAndTransform = new HashAndTransform(hash);
input.pipe(hashAndTransform);
