const express = require('express');
const mime = require('mime-types');

console.log(mime.lookup('json'));

mime.lookup('index.html');
