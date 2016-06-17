'use strict';
var crypto = require('crypto-js');
var moment = require('moment');
var Buffer = require('buffer').Buffer;

class Util {
    static hmac(key, string) {
        var hmacOutput = crypto.HmacSHA256(string, key).toString(crypto.enc.HEX);
        var b = new Buffer(hmacOutput, 'hex');
        return b.toString('base64');
    }

	static uriEscape(string) {
		var output = encodeURIComponent(string);
		output = output.replace(/[^A-Za-z0-9_.~\-%]+/g, escape);

		// AWS percent-encodes some extra non-standard characters in a URI
		output = output.replace(/[*]/g, function(ch) {
			return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
		});

		return output;
	}
}

module.exports = Util;