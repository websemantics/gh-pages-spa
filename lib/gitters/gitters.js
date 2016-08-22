/**
 *  __  ______ __ __  __
 * / _ | |  | |_ |__)(_    Straightforward Github
 * \__)| |  | |__| \ __)   reader with cache.
 *
 * This project was released under MIT license.
 *
 * @link      http://websemantics.ca
 * @author    Web Semantics, Inc. Dev Team <team@websemantics.ca>
 * @author    Adnan M.Sagar, PhD. <adnan@websemantics.ca>
 */

;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jQuery', 'larder', 'base-64'],
            function(jQuery, Larder, Base64) {
                return (root.Gitters = factory(jQuery, Larder, Base64))
            })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'), require('larder'), require('base-64'))
    } else {
        root.Gitters = factory(root.jQuery, root.Larder, root.base64)
    }
}(this, function($, cache, Base64) {
    var me = {
        VERSION: '1.0.5'
    }
    var baseUrl = 'https://api.github.com/repos/{{repo}}/contents/{{path}}?ref={{branch}}'

    /* Library defaults, can be changed using the 'defaults' member method,

		- debug (boolean), tuen debug mode off / on

    - clearOnStart (boolean), true by default to clear cache

    - decodeBase64 (boolean), if true, and the object content is Base64 encode, then decode

		- cache:expires (int), duration in minutes to expire cache items (1 hour / 60 minutes by default)

  */

    var defaults = {}

    // -------------------------------------------------------------------------
    // Public methods

    /*
      Override class defaults

        Parameters:
        - opts (object): name value pairs

    */

    me.defaults = function(opts) {
        var ret = $.extend(true, defaults, opts)

        /* also set Larder settings */
        cache.defaults({
            expires: defaults.expires,
            debug: defaults.debug
        })

        return ret
    }

    /*
    Get repository data or the content on a particular path

      Parameters:
      - repo (string): contains the repo ref, 'username/repo'
      - paths (string, array of strings or empty): path(s) to the required folder(s) / file(s) (optional)
      - branch (string): the repo branch (optional)
      - cb (function): callback function
      - bubbleError (boolean): if true, throw and generated error

  */

    me.fetch = function(repo, paths, branch, cb, bubbleError) {

        /* if no path(s) are provided, get the repo's data */
        if (typeof paths === 'function') {
            cb = paths
            bubbleError = branch
            get(compile(baseUrl.substring(0, baseUrl.indexOf('/contents')), {
                repo: repo
            }), bubbleError).then(function(data) {
                cb.call(null, data)
            })

        } else {

            if (typeof branch === 'function') {
                bubbleError = cb
                cb = branch
                branch = 'master'
            }

            /* make sure that paths arg is an array of urls/paths (strings), and if releative paths
               are provided use 'baseUrl' path template to make them absolute */
            paths = (typeof paths === 'object' || typeof paths === 'object') ? paths : [paths]

            $.when.apply($, paths.map(function(path) {
                return get( /* url */ (path.indexOf('github.com') !== -1) ? path : compile(baseUrl, {
                    repo: repo,
                    path: path,
                    branch: branch
                }), bubbleError)
            })).then(function( /* val1, val2, val3 */ ) {

                /* if the user has provided a single path, return the data of that path only */
                cb.call(null, paths.length > 1 ? arguments : arguments[0])

            }).fail(function(err) {
                log((err && err.responseJSON) ? err.responseJSON['message'] : 'There has been an error')
            })
        }
    }

    // -------------------------------------------------------------------------
    // Generic methods


    /*
      Setup the library

    */

    init = function() {

        /* setup the cache with expiration time in case the defaults was set by the user, also,
          clear cache if not set outherwise */

        if (defaults.clearOnStart) {
            cache.clear()
        }
    }

    /*
      Get content of a resource from provided url or a valid cached item

        Parameters:
        - url (string): url to the resource
        - bubbleError (boolean): if true, throw and generated error

    */

    function get(url, bubbleError) {

        /* use url as key for the cache */
        var value = cache.fetch(url)
        var defer = $.Deferred()

        if (value) {
            return defer.resolve(value) /* return a resolved promise with the cached value */
        } else {
            try {
                $.get(url)
                    .done(function(value) {
                        defer.resolve(cache.save(url, decode(value)))
                    }).error(function(err) {
                        log(err.error)
                    })
            } catch (err) {
                if (bubbleError) {
                    throw new Error(err)
                } else {
                    log(err.error)
                }
            }
        }
        return defer
    }

    /*
      Decode the 'content' property of an object is the property 'encoding' is equal to 'base64'
      and the global settings 'decodeBase64' is enabled

        Parameters:
        - string (string): the text to encode

    */

    function decode(object) {
        if (defaults.decodeBase64 && object && object.content > '' &&
            object.encoding && object.encoding === 'base64') {
            object.content = b64decode(object.content)
        }
        return object
    }

    /*
      Encode a string to base64

        Parameters:
        - string (string): the text to encode

    */

    function b64encode(string) {
        return Base64.encode(string.toString())
    }

    /*
      Decode a base64 data

        Parameters:
        - data (string): base64 data

    */

    function b64decode(data) {
        return Base64.decode(data.toString())
    }

    /*
      Compile template, replace placeholder with their values

        Parameters:
        - template (string): string with placeholders, i.e. 'Hello {{name}}'
        - context (object): key/value pairs, i.e. {name: 'World'}

    */

    function compile(template, context) {
        for (var name in context) {
            template = template.replace('{{' + name + '}}', context[name])
        }
        return template
    }

    /*
      Log a message to the console

        Parameters:
				- message (string): print out if in debug mode
				- context (object): if provided, treat the message as a template

    */

    function log(message, context) {
        if (defaults.debug) {
            console.log((typeof context === 'object') ? compile(message, context) : message)
        }
    }

    if (typeof $ === 'undefined') {
        console.error('Please install the latest jQuery library')
    } else if (typeof cache === 'undefined') {
        console.error('Please install the latest Larder library')
    } else if (typeof Base64 === 'undefined') {
        console.error('Please install the latest Base64 library')
    } else {
        $(function() {
            init()
        })
    }

    me.defaults({
        debug: false,
        clearOnStart: true,
        decodeBase64: true,
        expires: 60
    })

    return me
}))
