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

 ;(function(l) {

   /* @param {Boolean} root, does this project work on the root domain */
   var root = false

   /* @param {String} repo, repository name if not working on root domain */
   var repo = root ? '' : '/' + l.pathname.split('/')[1]

   /**
   * redirect() redirect all 404 trafic to index.html
   *
   * @return {Void}
   */
   function redirect() {
     l.replace(l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + repo + '/?' +
              (l.pathname ? 'p=' + l.pathname.replace(/&/g, '~and~').replace(repo, '') : '') +
              (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
              (l.hash))
   }

   /**
   * resolve() resolve 404 redirects into internal routes
   *
   * @return {Void}
   */
   function resolve() {
     if (l.search) {
       var q = {}
       l.search.slice(1).split('&').forEach(function(v) {
         var a = v.split('=')
         q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&')
       })
       if (q.p !== undefined) {
         window.history.replaceState(null, null,
           repo + (q.p || '') +
           (q.q ? ('?' + q.q) : '') +
           l.hash
         )
       }
     }
   }

   /* redirect all trafic to index.html if 404 page */
   document.title === '404' ? redirect() : resolve()

 }(window.location))
