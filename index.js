var serviceInfo  = {
        host: 'www.smushit.com',
        path: '/ysmush.it/ws.php'
    },
    WebService   = require('./lib/WebService'),
    ImageFile    = require('./lib/ImageFile'),
    EventEmitter = require('events').EventEmitter;

var Smosh = function (fileBuffer) {
        var smushit = null;

        EventEmitter.call(this);

        if (!(this instanceof Smosh)) {
            smushit = new Smosh();

            return smushit.init(fileBuffer);
        }
    },
    onDownload = function (file, fileInfo) {
        var fileBuffer = new Buffer(file, 'binary');

        this.emit('end', fileBuffer, fileInfo);
    },
    onOptimize = function (fileInfo) {
        var imageFile = new ImageFile(fileInfo);

        imageFile
            .on('data', this.emit.bind(this, 'data'))
            .on('error', this.emit.bind(this, 'error'))
            .on('end', onDownload.bind(this))
            .get();
    };

Smosh.prototype = Object.create(EventEmitter.prototype);

Smosh.prototype.init = function (fileBuffer) {
    var webService = new WebService(serviceInfo);

    webService
        .on('end', onOptimize.bind(this))
        .on('error', this.emit.bind(this, 'error'))
        .execute(fileBuffer);

    return this;
};

module.exports = Smosh;
