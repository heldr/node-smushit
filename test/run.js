"use strict";
var smosh       = require('../'),
    path        = require('path'),
    fs          = require('fs'),
    assert      = require('assert'),
    jpg         = new Buffer(fs.readFileSync(path.join(__dirname, 'fixtures/dp.jpg'))),
    jpgExpected = new Buffer(fs.readFileSync(path.join(__dirname, 'expected/dp.jpg'))),
    png         = new Buffer(fs.readFileSync(path.join(__dirname, 'fixtures/dp.png'))),
    pngExpected = new Buffer(fs.readFileSync(path.join(__dirname, 'expected/dp.png')));

smosh(jpg).on('end', function(newFile, data) {
    console.log('JPG');
    assert(newFile instanceof Buffer);
    assert(newFile.toString() !== '');
    assert.equal(jpgExpected.length, newFile.length);
    assert.equal(data.percent, '2.96', ' compression rate');
});

smosh(png).on('end', function(newFile, data) {
    console.log('PNG');
    assert(newFile instanceof Buffer);
    assert(newFile.toString() !== '');
    assert.equal(pngExpected.length, newFile.length);
    assert.equal(data.percent, '36.46', ' compression rate');
});
