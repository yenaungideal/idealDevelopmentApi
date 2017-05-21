'use strict';

//var path = require('path');
var _ = require('lodash');

var all = {};

module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});