/* @param {Boolean} root, does this work on root domain */
var root = false

/* @param {String} if not root domain, obtain the repo name */
var repo = root ? '' : l.pathname.split('/')[1]

/* @param {Object} the current location url */
var l = window.location

/* Redirect all 404 trafic to index.html */
l.replace(l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + repo + '/?' +
         (l.pathname ? 'p=' + l.pathname.replace(/&/g, '~and~').replace(repo, '') : '') +
         (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
         (l.hash))
