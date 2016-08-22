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

 /* Github Pagaes SPS package
  *
  * @param {Object} l, the document current location
  * @param {Boolean} root, true if this project works without a repositoy name (custom domain, organization repository)
  */

  ;
  (function(root, factory) {
      if (typeof define === 'function' && define.amd) {
          define([],
              function() {
                  return (root.ghSPA = factory())
              })
      } else if (typeof module === 'object' && module.exports) {
          module.exports = factory()
      } else {
          root.ghSPA = factory()
      }
  }(this, function() {
      var root = this || global
      var l = root.location
      var me = { VERSION: '1.0.0'}

      /* Library defaults, can be changed using the 'defaults' member method,

  		- debug (boolean), turns debug mode off / on

  		- rootDomain (boolean), true to indicate that the project has a custom domain, or is running on an organization repository

    */

      var defaults = {
          debug: true,
          rootDomain: false,
      }

      // -------------------------------------------------------------------------
      // Public methods

      /*
        Override class defaults

          Parameters:
          - opts (object): name value pairs

      */

      me.defaults = function(opts) {
        var key
        for(key in opts || {}){
          if(defaults[key]){
            defaults[key] = opts[key]
          }
        }
      }

      // -------------------------------------------------------------------------
      // Public methods

      /*
      Clear cached data

      */

      me.clear = function() {
          localStorage.removeItem(defaults.id);
          log('Cache ({{id}}) has been cleared', {
              id: defaults.id
          })
      }

      // -------------------------------------------------------------------------
      // Private methods


       /* @param {String} repo, repository name if not working on root domain */
       var repo = defaults.rootDomain ? '' : '/' + l.pathname.split('/')[1]

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

      /*
            Log a message to the console

              Parameters:
      				- message (string): print out if in debug mode

      */

      function log(message) {
          if (defaults.debug) {
              console.log(message)
          }
      }

      /* redirect all trafic to index.html if 404 page */
      document.title === '404' ? redirect() : resolve()

      return me
  }))
