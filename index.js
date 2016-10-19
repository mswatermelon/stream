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
				this.push(chunk);
		    callback();
		  }
		});

		return transform;
	}
}

class MyReadable extends stream.Readable {
  constructor(opt) {
    super(opt);
  }

  _read() {
    let str = '' + Math.floor(Math.random() * (9 + 1)) + 0;
    let buf = Buffer.from(str, 'ascii');
    this.push(buf);
  }
}

class MyWritable extends stream.Writable {
  constructor(opt) {
    super(opt);
  }

	_write(chunk, encoding, callback) {
		console.log(chunk.toString());
    callback();
  }
}

class MyTransform extends stream.Transform {
  constructor(opt) {
    super(opt);
  }

	_transform(chunk, encoding, callback) {
		for(var i=0;i<chunk.length;i++)
		{
			chunk[i] ^= 0xAB;
		}
		this.push(chunk);
    setTimeout(callback, 1000);
  }
}


let hashAndTransform = new HashAndTransform(hash);

input.on("end", () => {
	hash.end();
	console.log(hash.read());
});

hash.on('finish', () => hash.pipe(output));
input.pipe(hashAndTransform);
