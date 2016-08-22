/**
 *   ___ ___  _    ___ ___ _____
 *  | _ ) _ \/_\ /  __|_ _|_   _|
 *  | _ \   / _ \| (_ || |  | |
 *  |___/_|_\/ \ \\___|___| |_|
 *              \_\ DEMO APP ...
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
  factory(root.jQuery, root.Bragit)
}(this, function ($, bragit) {
  var root = this || global
  var defaultBaseClass = 'bragit'
  var actionConfig = { /* Lookup table for action and their settings */
    stars: {
      icon: 'star',
      label: 'Stars',
      template: 'labeled'
    },forks: {
      icon: 'fork',
      label: 'Forks',
      template: 'labeled'
    },watchers: {
      icon: 'eye',
      label: 'Watchers',
      template: 'labeled'
    },issues: {
      icon: 'info circle',
      label: 'Issues',
      template: 'labeled'
    },download: {
      icon: 'download',
      label: 'Download',
      template: 'normal'
    },github: {
      icon: 'github',
      label: 'Github',
      template: 'normal'
    },contributors: {
      icon: 'users',
      label: 'Contributors',
      template: 'normal'
    }
  }

  var templates = { /* Templates */
    labeled: '<a class="ui labeled {{size}} button github-{{username}}-{{repository}}-{{action}}">\
     <div class="ui {{baseClass}} {{size}} button">\
       <i class="{{icon}} icon"></i> {{label}}\
     </div>\
     <div class="ui basic {{baseClass}} left pointing label">\
       <i class="spinner loading icon"></i>\
     </div>\
   </a>',
    normal: '<a class="ui {{baseClass}} {{size}} button github-{{username}}-{{repository}}-{{action}}">\
       <i class="{{icon}} icon"></i> {{label}}\
   </a>',
    include: '<!-- Include this tag in document head or before close body element -->\
   <script type="text/javascript" src="https://cdn.rawgit.com/websemantics/bragit/0.1.2/bragit.js"></script>\
   {{newline}}\
   <!-- Insert the html fragment where you want to show Bragit buttons -->\
   ',
    css: '<!-- Include the style tag in document head -->\
         <style type="text/css">\
   .ui.{{baseClass}}.button, .ui.{{baseClass}}.buttons .button {\
       background-color: {{ color }};\
       color: #fff!important;\
   }\
   \
   .ui.{{baseClass}}.label {\
       color: {{ color }}!important;\
       border-color: {{ color }}!important;\
       background-color: #ffffff;\
   }\
   \
   .ui.{{baseClass}}.button:focus, .ui.{{baseClass}}.buttons .button:focus,\
     .ui.{{baseClass}}.button:hover, .ui.{{baseClass}}.buttons .button:hover {\
       background-color: {{ darkColor }};\
   }\
   \
   .ui.{{baseClass}}.labels .label:focus, .ui.{{baseClass}}.label:focus,\
     .ui.{{baseClass}}.labels .label:hover, .ui.{{baseClass}}.label:hover {\
       color: {{ darkColor }}!important;\
       border-color: {{ darkColor }}!important;\
   }\
   \
   .ui.labeled .ui.button .star.icon {\
     color: #F5CC7A!important;\
   }\
   </style>'
  }

  /*
    Setup process

  */

  init = function () {
    /* Register event listeners */
    $('#repository').bind('blur', function () {onchange()})
    $('#username').bind('blur', function () {onchange()})
    $('#clear').bind('click', function () {onclear()})
    $('#refresh').bind('click', function () {onchange()})
    $('#color').colorPicker({
      doRender: false,
      renderCallback: function ($elm, toggled) {
        var color = $elm.val()
        var colors = this.color.colors.HEX

        if (color > '') {
          $('#color-select').dropdown('set selected', 'custom')
          onchange()
        }

        if (typeof toggled === 'boolean') {
          $('.cp-alpha', this.$UI).css('display', $elm.hasClass('no-alpha') ? 'none' : '')
        }
      },
      cssAddon: // could also be in a css file instead
      '.cp-color-picker{z-index: 9999; border: 1px solid #85b7d9; padding:10px 10px 0; margin-top:2px;' +
        'background:#fff; overflow:visible; border-radius:3px;}' +
        '.cp-color-picker:after{content:""; display:block; ' +
        'position:absolute; top:-15px; left:12px; border:8px solid #fff;' +
        'border-color: transparent transparent #fff}' +
        // simulate border...
        '.cp-color-picker:before{content:""; display:block; ' +
        'position:absolute; top:-16px; left:12px; border:8px solid #fff;' +
        'border-color: transparent transparent #85b7d9}' +
        '.cp-xy-slider:active {cursor:none;}' +
        '.cp-xy-slider{border:1px solid rgba(34,36,38,.15);; margin-bottom:10px;}' +
        '.cp-xy-cursor{width:12px; height:12px; margin:-6px}' +
        '.cp-z-slider{margin-left:10px; border:1px solid rgba(34,36,38,.15);;}' +
        '.cp-z-cursor{border-width:5px; margin-top:-5px;}' +
        '.cp-color-picker .cp-alpha{margin:10px 0 0; height:6px; border-radius:6px;' +
        'overflow:visible; border:1px solid rgba(34,36,38,.15);; box-sizing:border-box;' +
        'background: linear-gradient(to right, rgba(238,238,238,1) 0%,rgba(238,238,238,0) 100%);}' +
        '.cp-color-picker .cp-alpha{margin:10px 0}' +
        '.cp-alpha-cursor{background: #fff; border-radius: 100%;' +
        'width:14px; height:14px; margin:-5px -7px; border:1px solid #666!important;' +
        'box-shadow:inset -2px -4px 3px #ccc}'
    })

    $('select.dropdown').dropdown({direction: 'upward'}).bind('change', function () {onchange()})

    /* Run codemirror & On Change */
    codemirror()
    onchange()


    /* Init popup, ... gets in the way!
    $('.popup').popup({});*/
  }

  /*
   Clear the form

  */

  function onclear () {
    $('#username').val('')
    $('#repository').val('')
    $('#actions-select').dropdown('clear')
    $('#size').dropdown('set selected', 'tiny')
    $('#color-select').dropdown('set selected', 'default')
    $('#code-content').text('')
    $('#display-content').html('')
    onchange();
  }

  /*
   Triggered everytime an input element has changed

  */

  function onchange () {
    var $username = $('#username')
    var $repository = $('#repository')
    var $ginput   = $('#github-input')
    var size = $('#size').val() || 'tiny'
    var colorClass = $('#color-select').val()
    var actions = $('#actions-select').val() || []
    var $color = $('#color')
    var $display = $('#display')
    var $code = $('#code')
    var baseClass = colorClass != 'default' ? colorClass : ''
    var color = tinycolor($color.val())
    var html = ''
    var css = ''

    $ginput.removeClass('error')
    $display.addClass('hidden')
    $code.addClass('hidden')
    $color.removeClass('disabled')

    if (colorClass == 'custom') {
      baseClass = defaultBaseClass
      css = Handlebars.compile(templates['css'])({ baseClass: baseClass,
        color: color.toString(),
      darkColor: color.darken().toString()})
    } else {
      $color.val('')
    }

    if (actions.length > 0) {
      if ($username.val() > '' && $repository.val() > '') {
        $display.removeClass('hidden')
        $code.removeClass('hidden')

        actions.forEach(function (name) {
          var action = actionConfig[name]
          var template = Handlebars.compile(templates[action['template']])

          html += template({
            size: size,
            username: $username.val(),
            repository: $repository.val(),
            action: name,
            baseClass: baseClass,
            icon: action['icon'],
            label: action['label']
          })
        })

        $('#display-content').html(html + css)
        $('#code-content').text(beautify(templates['include'] + html + '{{newline}}' + css))
        $('#code-content').html(Handlebars.compile($('#code-content').html())({newline: '\n'}))

        codemirror()
        bragit.init()
      } else {
        $ginput.addClass('error')
      }
    }
  }

  /*
    Parse the document looking for codemirror instance

  */

  function codemirror () {
    ['code.mixedMode', 'code.shell', 'code.javascript', 'code.xml', 'code.htmlmixed'].forEach(function (cls) {
      if (mode = cls.indexOf('.') > -1 ? cls.split('.')[1] : null) { /* allow only valid class names */
        mode = (mode != 'mixedMode') ? mode : {
          name: 'htmlmixed',
          scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
          mode: null},
            {matches: /(text|application)\/(x-)?vb(a|script)/i,
            mode: 'vbscript'}]
        }

        $(cls).each(function () {
          var $code = $(this).html().replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          $(this).empty()
          var cm = CodeMirror(this, { value: $code, mode: mode, theme: 'mdn-like', readOnly: true, styleSelectedText: true})
          cm.on('focus', function (cMirror) {  cMirror.execCommand('selectAll');})
          cm.on('blur', function (cMirror) { cMirror.execCommand('undoSelection'); })
        })
      }
    })
  }

  /*
   Layout text

     Parameters:
     - source (string): text to be laied-out

  */

  function beautify (source) {
    var output,
      opts = {
        end_with_newline: true,
        brace_style: true
    }

    return html_beautify(source, opts).trim()
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
    if (debug) {
      console.log(message)
    }
  }

  if (typeof $ === 'undefined') {
    console.error('Please install the latest jQuery!')
  } else {
    $(function () {init()})
  }
}))
