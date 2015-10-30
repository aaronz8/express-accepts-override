var mime = require('mime-types');
var url = require('url');

module.exports = function(options) {
  if (options.connection) {
    throw new Error('Call accepts-middleware with options')
  }

  return function (req, res, next) {
    options = {
      accepts: options.accepts || ['json', 'html', 'csv', 'txt'], // must be valid mime extensions
      query: options.query || 'format', // /path?format=csv
      resolveOrder: options.resolveOrder || ['suffix', 'query', 'header'] // will use first match
    }

    var resolvers = {
      header: _getHeader,
      suffix: _getSuffix,
      query: _getQuery
    };

    var resolverOrder = options.resolveOrder.map(function(resolverName) {
      return resolvers[resolverName];
    });

    var result;
    resolverOrder.some(function(resolver) {
      result = resolver(req, options);
      if (result) return true;
    });

    if (result.header) req.headers.accept = result.header;
    if (result.url) req.url = result.url;

    return next();
  }
}

function _getSuffix(req, options) {
  var parsedUrl = url.parse(req.url);
  var suffixMatch = parsedUrl.pathname.match(new RegExp("\\.(" + options.accepts.join('|') + ")$"));
  if (suffixMatch) {
    parsedUrl.pathname = parsedUrl.pathname.slice(0, suffixMatch.index);
    return {
      header: mime.lookup(suffixMatch[1]),
      url: url.format(parsedUrl)
    };
  } else
    return;
}

function _getQuery(req, options) {
  var queryMatch = req.query[options.query];
  if (queryMatch && options.accepts.indexOf(queryMatch) !== -1)
    return {
      header: mime.lookup(queryMatch)
    };
}

function _getHeader(req) {
  return !!(req.get('accept'));
}
