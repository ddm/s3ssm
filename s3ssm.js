#!/usr/bin/env node

"use strict";

var AWS = require('aws-sdk');
var walk = require('walk');
var mime = require('mime');
var fs = require('fs');
var path = require('path');
var program = require('commander');

var packagePath = path.join(__dirname, 'package.json');
var packageJson = fs.readFileSync(packagePath, {encoding: 'utf-8'});
var VERSION = JSON.parse(packageJson).version;

function upload (baseDir, bucket, config) {

  AWS.config.loadFromPath(config);
  var s3 = new AWS.S3();
  var files   = [];
  var walker  = walk.walk(baseDir, { followLinks: false });

  walker.on('file', function(root, stat, next) {
    var name = stat.name;
    if (name !== ".DS_Store") {
      var relativeDir = root.replace(baseDir, '');
      var fullName = relativeDir === '' ? name : (relativeDir + '/' + name).replace('/', '');
      files.push(fullName);
    }
    next();
  });

  walker.on('end', function() {
    files.forEach(function(file) {
      fs.readFile(baseDir + file, function (err, data) {
        if (err) { throw err; }
        s3.client.putObject({
          Bucket: bucket,
          Key: file,
          Body: data,
          ContentType: mime.lookup(file),
          ACL: 'public-read'
        }, function (resp) {
          if (resp) { console.log(resp); }
          console.log('Successfully uploaded ', file);
        });
      });
    });
  });
}

program
  .version(VERSION)
  .option('-d, --directory <directory>', 'Directory to upload')
  .option('-b, --bucket <name>', 'S3 bucket name')
  .option('-c, --config [file]', 'JSON configuration file (defaults to ./config.json)', './config.json')
  .parse(process.argv);

var config = program.config || './config.json';
var directory = program.directory;
var bucket = program.bucket;

if (!directory || !bucket) {
  program.help();
}

console.log('Upload', directory);
console.log('to bucket', bucket);
console.log('using configuration:', config);

upload(directory, bucket, config);
