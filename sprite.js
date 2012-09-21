var gdlib = require("node-gd"), pathlib = require('path'), fs = require('fs');

module.exports = Sprite;

function Sprite(options) {

	options = options || {};

	this.source_description_file = options.source_description_file
			|| './icons/source.txt';

	this.destination_description_file = options.destination_description_file
			|| './icons/destination.txt';

	this.input_file = options.input_file || './icons/source-icons.png';

	this.input_format = this.input_file.split(".").pop().toLowerCase() || "png";
	this.output_format = options.output_format || this.input_format;

	this.output_dir = options.output_dir || pathlib.dirname(this.input_file);

	this.output_file = options.output_file || './icons/sprite.'
			+ this.output_format;

	if (["png", "jpeg", "jpg", "gif"].indexOf(this.input_format) < 0) {
		throw new Error("Invalid intput format '" + this.input_format + "'");
	}

	if (["png", "jpeg", "jpg", "gif"].indexOf(this.output_format) < 0) {
		throw new Error("Invalid output format '" + this.output_format + "'");
	}

};

Sprite.prototype.openImage = function(image, callback) {
	var func;
	switch (image.split(".").pop().toLowerCase()) {
		case "png" :
			func = "openPng";
			break;
		case "gif" :
			func = "openGif";
			break;
		case "jpg" :
		case "jpeg" :
			func = "openJpeg";
			break;
		default :
			throw new Error("Unknown file type");
	}
	gdlib[func](image, function(err, img, path) {

				if (err !== null) {
					throw new Error("Unable to open file '" + image + "'");
				}

				callback(err, img, path);
			});
};

Sprite.prototype.explode = function() {
	this.openImage(this.input_file, this.__processExplode.bind(this));
};

Sprite.prototype.createSprite = function(callback) {

	var x = 0, y = 0;
	var lines = fs.readFileSync(this.destination_description_file, 'utf-8')
			.trim().split('\n');

	var dest = this.createImage(16, (16 + 32) * (lines.length - 1) - 32,
			this.output_format)

	var pos = 0;

	lines.forEach(function(line) {

				this.openImage(this.input_file, function(err, img, path) {
							img.copyResampled(dest, 0, pos * (16 + 32), 0, 0,
									16, 16, 16, 16);
              
							if (pos == lines.length -1) {
								dest.savePng(dest_path, 0, function() {
                  callback("image saved '" + dest_path + "'")
                });
							}
							pos++;
						});

			}.bind(this))

};

Sprite.prototype.createImage = function(width, height, format) {
	format = format || "png";

	// the image can not be too small to have transparency
	width = Math.max(width, 5);
	height = Math.max(height, 5);

	var img = gdlib.createTrueColor(width, height), transparent = format == "gif"
			&& img.colorAllocate(112, 121, 211)
			|| img.colorAllocateAlpha(0, 0, 0, 127);

	img.fill(0, 0, transparent);
	img.colorTransparent(transparent);

	if (format == "png") {
		img.alphaBlending(0);
		img.saveAlpha(1);
	}

	return img;
};

Sprite.prototype.__processExplode = function(err, img, path) {

	var x = 0, y = 0;

	fs.readFileSync(this.source_description_file, 'utf-8').trim().split('\n')
			.forEach(function(line) {

				if (line == '--') {
					x = 0;
					y++;
				} else {

					var posX = x * 16, posY = y * 16, dest = this.createImage(
							16, 16, this.output_format), dest_path = pathlib
							.join(this.output_dir, line + "."
											+ this.output_format);

					img.copyResampled(dest, 0, 0, posX, posY, 16, 16, 16, 16);

					dest.savePng(dest_path, 0, function() {
								console.log("image saved '" + dest_path + "'");
							});

					x++;
				}

			}.bind(this))

}