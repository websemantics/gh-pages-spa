![SPA](https://websemantics.github.io/gh-pages-spa/img/screenshot.png)
> Single Page Applications for [GitHub Pages](https://pages.github.com/)

### [Live demo](http://websemantics.github.io/gh-pages-spa/)


## Install

Bower

```
bower install ghspa
```

NPM

```
npm install ghspa
```


## Getting Started

1- Create a new project with two pages `index.html` and `404.html`.

2- Include file `ghspa.js` in each page, as follows,

```html
<script type="text/javascript" src="path-to/ghspa.js"></script>
```

3- Set the title of `404.html` page to `404`, as follows,

```html
<title>404</title>
```

4- Optionally, set the global parameter `rootDomain` to `true` to indicate that the project has a custom domain, or is running on an organization repository, as follow,

```html
<script type="text/javascript">var rootDomain = true</script>
```

If the project runs on a public repository, set `rootDomain` to `false`, or ignore all together.


## Credits

This project was heavily inspired and built with these resources,

[SPA Github Pages](https://github.com/rafrex/spa-github-pages), host single page apps with github pages.

[Pokemon Go](http://www.flaticon.com/packs/pokemon-go), a free SVG icon set.


## License

[MIT license](http://opensource.org/licenses/mit-license.php)
Copyright (c) Web Semantics, Inc.
