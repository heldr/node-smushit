"use strict";
var smosh       = require('../'),
    path        = require('path'),
    fs          = require('fs'),
    assert      = require('assert'),
    Vinyl       = require('vinyl'),
    jpg         = new Buffer(fs.readFileSync(path.join(__dirname, 'fixtures/dp.jpg'))),
    jpgExpected = new Buffer(fs.readFileSync(path.join(__dirname, 'expected/dp.jpg'))),
    png         = new Buffer(fs.readFileSync(path.join(__dirname, 'fixtures/dp.png'))),
    pngExpected = new Buffer(fs.readFileSync(path.join(__dirname, 'expected/dp.png'))),
    vJpg        = new Vinyl({contents: jpg, path: 'fixtures/dp.jpg'}),
    vJpgExp     = new Vinyl({contents: jpgExpected}),
    vPng        = new Vinyl({contents: png, path: 'fixtures/dp.png'}),
    vPngExp     = new Vinyl({contents: pngExpected});

smosh(vJpg)
    .on('data', function(chunk) {
        assert(typeof chunk === 'string');
        console.log('JPG chunk', chunk.length);
    })
    .on('end', function(newFile, data) {
        assert(newFile instanceof Vinyl);
        assert.notEqual(newFile.isNull(), true);
        assert.equal(vJpgExp.contents.length, newFile.contents.length);
        assert.equal(data.percent, '10');
        console.log('optimized Vinyl JPG');
    });


smosh(vPng)
    .on('data', function(chunk) {
        assert(typeof chunk === 'string');
        console.log('PNG chunk', chunk.length);
    })
    .on('end', function(newFile, data) {
        assert(newFile instanceof Vinyl);
        assert.notEqual(newFile.isNull(), true);
        assert.equal(vPngExp.contents.length, newFile.contents.length);
        assert.equal(data.percent, '72');
        console.log('optimized Vinyl PNG');
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
