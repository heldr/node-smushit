var http 		 = require("http"),
    url          = require('url'),
    EventEmitter = require('events').EventEmitter;

var SMUSH_HOST = 'www.smushit.com',
    SMUSH_HOST_PATH = "/ysmush.it/ws.php";

function dumpImage(fileData, response){
    var data = '',
        self = this;

    response.setEncoding('binary')
    response.on('data', function(chunk){
        data += chunk;
    });
    response.on('end', function(){
        var fileBuffer = new Buffer(data, 'binary');

        self.emit('end', fileBuffer, fileData);
    });
}

function getBinary(fileData){
    var urlData = null,
        request = null,
        options = null;

    fileData = JSON.parse(fileData);
	urlData  = url.parse(fileData.dest);
	options  = {
		host: urlData.host,
        port: urlData.port,
        path: urlData.pathname
	};
	request = http.get(options, dumpImage.bind(this, fileData));

	request.on("error", onError.bind(this));
};

function getPostData(fileBuffer){
    var doubleDash = '--',
        boundary   = '------multipartformboundary' + (new Date).getTime();

    return {
        contentType: 'multipart/form-data; boundary=' + boundary,
        builder: [
            [doubleDash, boundary].join(''),
            'Content-Disposition: form-data; name="files"; filename="buffer"',
            'Content-Type: application/octet-stream',
            '',
            fileBuffer.toString('binary'),
            [doubleDash, boundary, doubleDash].join(''),
            ''
        ].join('\r\n')
    };
}

function onEnd() {
    this.emit('end', responseBuffer);
}

function onError(err) {
    this.emit('error', err);
}

function onRequestCompleted(response) {
    var self    = this,
        respBuf = '';

    response.on('data', function(chunk) {
        respBuf += chunk;
    });
    response.on('end', function () {
        getBinary.call(self, respBuf);
    });
}

function Smosh(fileBuffer) {
    var smushit = null;

    EventEmitter.call(this);

    if (!(this instanceof Smosh)) {
        smushit = new Smosh();

        return smushit.run(fileBuffer);
    }
};

Smosh.prototype = Object.create(EventEmitter.prototype);
Smosh.prototype.run = function(fileBuffer) {

    var postData = getPostData(fileBuffer),
        options = {
            host: SMUSH_HOST,
            path: SMUSH_HOST_PATH,
            method: "POST",
            headers: {
              'Content-Type': postData.contentType,
              'Content-Length': postData.builder.length
            }
        },
        httpRequest = http.request(options, onRequestCompleted.bind(this));

    httpRequest.write(postData.builder, "binary");
    httpRequest.end();
    httpRequest.on('error', onError.bind(this));

    return this;
}

module.exports = Smosh;
