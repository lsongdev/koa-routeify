var fs = require('fs');
var pathToRegexp = require('path-to-regexp');

const TAG = {
  TO    : '=>',
  EOL   : '\n',
  SPACE : /\s+/,
  SHARP : '#',
  EM    : '!'
};

function removeQuotes(input){
  return input.map(function(item){
    return item.trim().replace(/"|'/ig, '')
  });
};

exports.removeQuotes = removeQuotes;

module.exports = function parseRoute(filename){
  var content = fs.readFileSync(filename);
  var routes = content.toString().split(TAG.EOL).map(function(line){
    return line.trim();
  }).filter(function(line){
    return line !== '' && (!(/^\/\//).test(line));
  }).map(function(line){
    return line.split(TAG.TO).map(function(str){
      return str.trim();
    });
  }).map(function(item){
    if(item.length < 2){
      throw new Error('invalidate route define', item);
    }
    var method_and_route      = removeQuotes(item[0].split(TAG.SPACE));
    var controller_and_action = removeQuotes(item[1].split(TAG.SHARP));
    var isDev = false;
    if (method_and_route[0]
        && method_and_route[0][0]
        && method_and_route[0][0] === TAG.EM) {
      method_and_route[0] = method_and_route[0].substring(1);
      isDev = true;
    }
    return {
      route       : method_and_route[1],
      method      : method_and_route[0].toUpperCase(),
      regexp      : pathToRegexp(method_and_route[1]),
      controller  : controller_and_action[0],
      action      : controller_and_action[1],
      isDev       : isDev
    }
  });
  return routes;
};
