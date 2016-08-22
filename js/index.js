/**
 *
 *  ____ _ ___ _  _ _  _ ___     ___  ____ ____ ____ ____    ____ ___  ____
 *  | __ |  |  |__| |  | |__]    |__] |__| | __ |___ [__     [__  |__] |__|
 *  |__] |  |  |  | |__| |__]    |    |  | |__] |___ ___]    ___] |    |  |
 *
 *  Enables SPA for Github Pages
 *
 * This project was released under MIT license.
 *
 * @link      http://websemantics.ca
 * @author    Web Semantics, Inc. Dev Team <team@websemantics.ca>
 * @author    Adnan M.Sagar, PhD. <adnan@websemantics.ca>
 */

  /* @param {Boolean} root, does this project work on the root domain */
  var root = false

  /* @param {String} repo, repository name if not working on root domain */
  var repo = root ? '' : window.location.pathname.split('/')[1]

  /**
  * redirect() redirect all 404 trafic to index.html
  *
  * @param {object} l, the current location url
  * @return {Void}
  */
  function redirect(l) {
  l.replace(l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + repo + '/?' +
           (l.pathname ? 'p=' + l.pathname.replace(/&/g, '~and~').replace(repo, '') : '') +
           (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
           (l.hash))
  }

  /* redirect all trafic to index.html if 404 page */
  if(document.title === '404'){
    redirect(window.location)
  }
