# express-accepts-override

[![npm version](https://badge.fury.io/js/express-accepts-override.svg)](https://badge.fury.io/js/express-accepts-override)

## Middleware to override `accepts` header with query or url path file extension

## Installation

  npm install express-accepts-override

## Usage

  var acceptsOverride = require('express-accepts-override');

  app.use(acceptsOverride(options));

## Options

  accepts: ['json', 'html', 'csv', 'txt'] // must be valid mime extensions
  query: 'format' // /path?format=csv
  resolveOrder: ['suffix', 'query', 'header'] // will use first match

resolveOrder options:
- suffix: /somepath.json, /somepath.csv
- query: /somepath?format=json, /somepath?format=csv (change 'format' to something else with options.query)
- header: 'accepts:text/csv'
