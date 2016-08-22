```        
                ░░░░░░░░░
             ░░░░░░░░░░░░░░░
          ░░░░░/   \░░░░░░░░░░░
        ░░░░░░░\   /░░/   \░░░░░░            
          ░░░░░░| |░░░\  _/░░░░░                
            ░░░░| |░░░/ /░░░░    
              ░░| |░░/ /░░░
             ___| |░/ /░░____________________  _____
            / ____// //_  __/_  __/ ____/ __ \/ ___/
           / / __ / /  / /   / / / __/ / /_/ /\__ \
          / /_/ // /  / /   / / / /___/ _, _/___/ /
          \____/___/ /_/   /_/ /_____/_/ |_\/____/  

          Straightforward Github reader with cache
```

> Gitters is a utility that provides a straightforward way to access content on Github without the hassle of dealing with Github API libraries. There is no need for an `API KEY` to use Gitters, and, the library provides a basic cache support using [Larder](https://github.com/websemantics/larder) to optimize network usage.

## Install

Bower

```bash
Bower install gitters
```

NPM

```bash
npm i install gitters
```

## Getting Started

This library comes pre-configured with three global settings, `clearOnStart` to indicate clearing the cache on each Browser refresh event (enabled by default), `expires`, the expiration period per stored item in minutes (set to 1 hour by default), to change,

```javascript
Gitters.defaults({
  clearOnStart: false,
  expires: '120' /* two hours expiration per item */
})
```

And finally, `decodeBase64` which when set to `true`, the content of all retrieved objects will be Base64-decoded before saving the the cache. This setting `decodeBase64` is enabled by default; here's how to switch it off,

```javascript
Gitters.defaults({
  decodeBase64: false
})
```

## Usage

The library provides one pubic method besides setting defaults, `fetch` to enable content navigation Github,

- Get repo details,

```javascript
Gitters.fetch('websemantics/semantic-ant', function(repo){
  console.log(repo)
})
```

- Returns the content of a folder (list of files)

```javascript
Gitters.content('websemantics/vimeo-upload', 'img', 'master', function(files) {
  console.log(files)
})
```

The branch argument is optional.

- Get the content of a list of files

```javascript
Gitters.fetch('websemantics/Hotdraw.js', 'src/Demo', function(files) {
    Gitters.fetch('websemantics/Hotdraw.js', files.map(function(file) {
        return file.path
    }), 'master', function(jsFiles) {
        for (i in jsFiles) {
            console.log(jsFiles[i].content)
        }
    })
})
```

## Used By

The [Semantic Ant](https://github.com/websemantics/semantic-ant) project uses [Gitters](https://github.com/websemantics/gitters) to read documentation files directly from the Browser.
