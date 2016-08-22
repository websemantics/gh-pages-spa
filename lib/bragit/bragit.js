/**
 *   ___ ___  _    ___ ___ _____
 *  | _ ) _ \/_\ /  __|_ _|_   _|
 *  | _ \   / _ \| (_ || |  | |
 *  |___/_|_\/ \ \\___|___| |_|
 *              \_\ Show it off
 *
 *                  Display your Github repositories stats in
*                   style using Semantic-ui labeled buttons
 *
 * This project was released under MIT license.
 *
 * @link      http://websemantics.ca
 * @author    Web Semantics, Inc. Dev Team <team@websemantics.ca>
 * @author    Adnan M.Sagar, PhD. <adnan@websemantics.ca>
 */

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jQuery', 'gitters'],
      function (jQuery, Gitters) {
        return (root.Bragit = factory(jQuery, Gitters))
      })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'), require('gitters'))
  } else {
    root.Bragit = factory(root.jQuery, root.Gitters)
  }
}(this, function ($, Gitters) {
  var root = this || global
  var doc = root.document
  var me = {VERSION: '0.1.6'}
  var semantic = ['semantic.min.css', 'semantic.css']


  /* Library defaults, can be changed using the 'defaults' member method,

  - clearOnStart (boolean), false by default, if true, clears the Gitters cache

  - expires (int), minutes for cached requests to expire in minutes (60 minute by default)

  - debug (boolean), show logs if true

  - delimiter (string), used to glue / unglue classes

    - cls (string), prefix for the class names used to inject github stats / urls etc,

    - actions (object), list of all supported actions with Github buttons, the 'url' attribute
                        is used to modify the link element while the 'property' name is used to
                        access the information returned for the repository (for example,
                        stargazers_count will give a number of repo stars)

    - css (object), contains information about css styles to be injected into the document at run-time
    * version (string), semantic-ui version
    * inject (boolean), if true, inject semantic-ui styles (false by default)
    * ignore (boolean), if true, don't inject semantic-ui styles (false by default)
    * uri (string), uri template for the cdn used
    * modules (array), list of semantic-ui components
    * custom (string), any custom css styles if css has been injected

  */

  var defaults = {}

  // -------------------------------------------------------------------------
  // Public methods

  /*
    Override class defaults

      Parameters:
      - opts (object): name value pairs

  */

  me.defaults = function (opts) {
    var ret = $.extend(true, defaults, opts)

    Gitters.defaults({
      clearOnStart: defaults.clearOnStart,
      debug: defaults.debug,
      expires: defaults.expires})

    return ret;
  }

  /*
    Setup the buttons, scan the documents for classes with repo information
    i.e. github-websemantics-bragit-stars

  */

  me.init = function () {
    /* check if semantic-ui styles are loaded */
    var loaded = false
    var href = null

    for (var i in doc.styleSheets) {
      if (href = doc.styleSheets[i].href ? doc.styleSheets[i].href : null) {
        var filename = href.substring(href.lastIndexOf('/') + 1, href.length)
        if (semantic.indexOf(filename) > -1) {
          loaded = true
          break
        }
      }
    }

    /* if semantic-ui css file is not loaded, set inject to true if not already */
    if (!defaults.css.ignore && (!loaded || defaults.css.inject)) {
      log('Injecting semantic-ui buttons ...')
      for (var i in defaults.css.modules) {
        $('head').append('<link rel="stylesheet" href="'
          + compile(defaults.css.uri, {version: defaults.css.version,module: defaults.css.modules[i]})
          + '" type="text/css" />')
      }
      /* inject custom css, if provided */
      if (defaults.css.custom) {
        $('head').append('<link rel="stylesheet" href="' + defaults.css.custom + '" type="text/css" />')
      }
    }

    /* an associative array of all github repos used in the doc  */
    var repos = { /* username-repo : { username: name, repo : repo } */ }

    /* prepare the selector, i.e. github- */
    var selector = defaults.cls + defaults.delimiter

    /* get all classes with the default selector (i.e. github) */
    $('a[class*=' + selector).each(function (index, elem) {
      var cls = $(elem).attr('class') /* get element class */

      /* extract the github information from the element class string,  .. results in
         an array ["github", "username", "repo name", "function"],
            i.e. ["github", "websemantics", "bragit", "stars"] */
      var parts = cls.slice(cls.indexOf(selector) , cls.length)
        .split(' ')[0].split(defaults.delimiter)

      /* Get the action (i.e. starts, forks etc) as the last part of the css class name*/
      var action = parts.pop()

      /* hide the element first
      $('.'+parts.join(defaults.delimiter)).attr('style','visibility:hidden'); */

      /* if an action has at least three parts, github (defaults.cls), username-repo add to list of repos, */
      if (defaults.actions[action] && parts.length > 2) {
        /* remove first element */
        parts.shift()
        var username = parts.shift()
        var repo = parts.join(defaults.delimiter)
        repos[username + defaults.delimiter + repo] = {username: username, repo: repo}
      }
    })

    /* request information of all repositories mentioned in the document,
       and make necessary changes to html code (update stats, urls), .. fun fun! */
    for (var i in repos) {
      get(repos[i], function (repo, data) {
        if (data) {
          for (var action in defaults.actions) {
            var cls = [defaults.cls, repo.username, repo.repo, action].join(defaults.delimiter)
            $('.' + cls).attr('href', data['html_url'] + defaults.actions[action].uri)
            if (defaults.actions[action].property) {
              $('.' + cls + ' .label').text(data[defaults.actions[action].property] || 0)
            }
          }
        }
      })
    }
  }

  /*
    HTTP Get

      Parameters:
      - repo (object): contains github username and repo
      - cb (function): callback function

  */

  function get (repo, cb) {
    try {
      Gitters.fetch(repo.username + '/' + repo.repo, function(data){
        cb.call(null, repo, data)
      }, /* bubble error */ true)
    } catch(err) {
      log(err.message)
    }
  }

  /*
    Compile template, replace placeholder with their values

      Parameters:
      - template (string): string with placeholders, i.e. 'Hello {{name}}'
      - data (object): key/value pairs, i.e. {name: 'World'}

  */

  function compile (template, data) {
    for (var name in data) {
      template = template.replace('{{' + name + '}}', data[name])
    }
    return template
  }

  /*
    Log a message to the console

      Parameters:
      - message (string): print out if in debug mode

  */

  function log (message) {
    if (defaults.debug) {
      console.log(message)
    }
  }

  if (typeof $ === 'undefined') {
      console.error('Please install the latest jQuery library')
  } else if (typeof Gitters === 'undefined') {
      console.error('Please install the latest Gitters library')
  }  else {
      $(function () {me.init()})
  }

  /* set defaults */

  me.defaults({
    clearOnStart: false,
    expires: 60,
    debug: false,
    delimiter: '-',
    cls: 'github',
    actions: {forks: {
        uri: '/network',
        property: 'forks_count'
      },stars: {
        uri: '/stargazers',
        property: 'stargazers_count'
      },watchers: {
        uri: '/watchers',
        property: 'subscribers_count'
      },issues: {
        uri: '/issues',
        property: 'open_issues_count'
      },download: {
        uri: '/archive/master.zip',
        property: null
      },github: {
        uri: '',
        property: null
      },contributors: {
        uri: '/contributors',
        property: null
      }
    },
    css: {
      version: '2.1.8',
      ignore: false,
      inject: false,
      uri: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/{{version}}/components/{{module}}.min.css',
      modules: ['button', 'icon', 'label'],
      custom: null
    }
  })

  return me
}))
