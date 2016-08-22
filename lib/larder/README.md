```        
          ______________________________________       
         /\                                     \
        /  \                                     \
       /    \                                     \
      /      \_____________________________________\__________________
     /       /                 /       \░░░░░░░░░░░/                 /
    /       /                 /         \░░░░░░░░░/                 /
   /       /                 /           \░░░░░░░/                 /
   \      /                 /             \░░░░░/                 /
    \    /                 /               \░░░/                 /
     \  /                 /                 \░/                 /
      \/_________________/___________________\_________________/

          __        ______    ______    _____    ______    ______    
         /\ \      /\  __ \  /\  == \  /\  __-. /\  ___\  /\  == \   
         \ \ \____ \ \  __ \ \ \  __<  \ \ \/\ \ \ \  __\  \ \  __<   
          \ \_____\ \ \_\ \_\ \ \_\ \_\ \ \____-  \ \_____\ \ \_\ \_\
           \/_____/  \/_/\/_/  \/_/ /_/  \/____/   \/_____/  \/_/ /_/

             Straightforward,  in  browser  cache  using  local  storage                                                               

```

## Install

Bower

```bash
Bower install larder
```

NPM

```bash
npm i larder
```

## Getting Started

Larder supports a simple usage of the Bowser's local storage with expirations (60 minutes by default). The library uses a configurable namespace (id) to protect and avoid clashes with items stored by other applications.

To change these values, use the `defaults` method,

```javascript
Larder.defaults({
  id:'namespace',
  expires: '120' /* two hours expiration per item */
})
```

## Usage

The library provides all you expect from such a utility including,

**save**, this method expects `key`, `value`, and optional `expires` parameter (overrides the global settings).

```javascript
Larder.save('don', {
  name: 'Don Juan',
  height: '165cm',
  weight: '59kg',
  age: 66
})
```

**fetch**, retrieves the `value` or a stored item - providing a `key`, or it returns `null` if it does not exist or has expired. All expired items are removed from the local storage.

```javascript
Larder.fetch('don')
```

`Console.log` output

```
Object  {name: 'Don Juan', height: '165cm',weight: '59kg',  age: 66}
```

**remove**, savely removes an item from the storage for the given `key`.

```javascript
Larder.remove('don')
```

output

```
Well, he wasn't here to start with.
```

**clear**, this method expects will clear all items with the given `namespace`.

```javascript
Larder.clear()
```

## Examples

A Github reader library, [Gitters](https://github.com/websemantics/gitters) uses Larder to implement cache.
