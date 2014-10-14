"use strict";
var smosh       = require('../'),
    path        = require('path'),
    fs          = require('fs'),
    assert      = require('assert'),
    jpg         = new Buffer(fs.readFileSync(path.join(__dirname, 'fixtures/dp.jpg'))),
    jpgExpected = new Buffer(fs.readFileSync(path.join(__dirname, 'expected/dp.jpg'))),
    png         = new Buffer(fs.readFileSync(path.join(__dirname, 'fixtures/dp.png'))),
    pngExpected = new Buffer(fs.readFileSync(path.join(__dirname, 'expected/dp.png')));

smosh(jpg)
    .on('data', function(chunk) {
        assert(typeof chunk === 'string');
    })
    .on('end', function(newFile, data) {
        assert(newFile instanceof Buffer);
        assert(newFile.toString() !== '');
        assert.equal(jpgExpected.length, newFile.length);
        assert.equal(data.percent, '2.96');
        console.log('optimize JPG');
    });

smosh(png)
    .on('data', function(chunk) {
        assert(typeof chunk === 'string');
    })
    .on('end', function(newFile, data) {
        assert(newFile instanceof Buffer);
        assert(newFile.toString() !== '');
        assert.equal(pngExpected.length, newFile.length);
        assert.equal(data.percent, '36.46');
        console.log('optimize PNG');
    });

smosh(jpgExpected).on('error', function(msg) {
    assert(typeof msg === 'string');
    assert(msg.length > 0);
    console.log('emit error when JPG is not optimized');
});

smosh(pngExpected).on('error', function(msg) {
    assert(typeof msg === 'string');
    assert(msg.length > 0);
    console.log('emit error when PNG is not optimized');
});
