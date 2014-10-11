smosh
=====

A middleware between smushit and streams

How to use?
------------

```shell
npm install smosh
```

```javascript
var smosh = require('smosh'),
    file  = smosh(oldBuffer);

file.on('end', function(newBuffer) {
    // file content
    console.log(newBuffer.toString());
});

file.on('error', function(err) {
    throw err;
});
```

Based on: [node-smushit](https://github.com/colorhook/node-smushit)
