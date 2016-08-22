/**
 * _   ____ ___  ___  ___ ___
 * |   |__| |__) |  | |_  |__)    Straightforward, in browser cache
 * |__ |  | | \_ |__/ |__ | \_    using local storage
 *
 * This project was released under MIT license.
 *
 * @link      http://websemantics.ca
 * @author    Web Semantics, Inc. Dev Team <team@websemantics.ca>
 * @author    Adnan M.Sagar, PhD. <adnan@Larder.ca>
 */

;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([],
            function() {
                return (root.Larder = factory())
            })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Larder = factory()
    }
}(this, function() {
    var root = this || global
    var me = { VERSION: '1.0.2'}
    var init = false;

    /* Library defaults, can be changed using the 'defaults' member method,

		- debug (boolean), turns debug mode off / on

		- cache:id (string), cache identifier

		- cache:expires (int), duration in minutes per item to expire (1 hour / 60 minutes by default)

		- cache:useCookie (boolean), use cookies as fallback (not implemented)

  */

    var defaults = {
        debug: true,
        id: 'larder',
        expires: 60,
        useCookie: true,
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
        Fetch a cache item or return null if expired or does not exists

          Parameters:
          - key (string): item name

  	*/

    me.fetch = function(key) {
        var data = JSON.parse(localStorage.getItem(defaults.id) || '{}')
        var item = (key && data[key]) ? data[key] : null
				var current = new Date().getTime() / 60000 /* current time in minutes */

        /* chack if the item exists, if yes and  expired return the item value, otherwise remove from the cache */

        if (item && item.timestamp) {
            if (item.timestamp > current) {
                log('Item ({{id}}) has been retrieved successfully (expires in {{minutes}} minutes)', {
									id: key,
									minutes: Math.floor(item.timestamp - current)
                })
                return item.value ? item.value : null
            } else {
                me.remove(key)
                log('Item ({{key}}) has expired ({{minutes}}) minute(s) ago and removed from the cache', {
                    key: key,
  									minutes: Math.floor(current - item.timestamp)
                })
            }
        }
        return null
    }

    /*
        Save cache item

          Parameters:
    			- key (string): item key
    			- vaue (object, etc): the value to store
    			- expires (int): duration in minutes to wait for the item to expire (optional)

          Returns:
          - value (object, etc), the stored value
  	*/

    me.save = function(key, value, expires) {

        /* retrieve the cahce object to update */
        var data = JSON.parse(localStorage.getItem(defaults.id) || '{}')

        if (typeof key === 'string' && typeof value !== 'undefined') {
						data[key] = {
                value: value,
                timestamp: (new Date().getTime() / 60000 /* current in minutes */ ) + (expires || defaults.expires)
            	}
            localStorage.setItem(defaults.id, JSON.stringify(data))
            log('Item ({{key}}) has been stored successfully', {
                key: key
            })
        }
        return value
    }



    /*
        Remove a data item from the cache

    			Parameters:
    			- key (string): item id

  	*/

    me.remove = function(key) {

        /* retrive the cahce object to update */
        var data = JSON.parse(localStorage.getItem(defaults.id) || '{}')

        if (typeof key === 'string' && data[key]) {
            delete data[key]
            localStorage.setItem(defaults.id, JSON.stringify(data))
        }
    }

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
    // Generic methods

    /*
          Compile template, replace placeholder with their values (mini handlebars)

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

    return me
}))
