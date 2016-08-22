![SPA](https://websemantics.github.io/gh-pages-spa/assets/img/screenshot.png)
> This is a tiny package to enable building Single Page Applications for [GitHub Pages](https://pages.github.com/).


### [Live demo](http://websemantics.github.io/gh-pages-spa/)


## Getting Started

Use the template provided in the `example` folder or, follow the easy steps below,

1- Create a new project with two pages `index.html` and `404.html`.

2- Install this package with either [Bower](https://bower.io/) or [NPM](https://www.npmjs.com/),

```bash
npm install ghspa
```

3- Include file `ghspa.js` in each page, as follows,

```html
<script type="text/javascript" src="path-to/ghspa.js"></script>
```

4- Set `404.html` page title to `404`, as follows,

```html
<title>404</title>
```

5- This package supports the [two types](https://help.github.com/articles/user-organization-and-project-pages/) of GitHub Pages, **User/Organization** and **Project** Pages. The global parameter `projectPages` is set to `true` by default for **Project** Pages. To enable **User/Organization** Pages or [Custom Domains](https://help.github.com/articles/using-a-custom-domain-with-github-pages/) set it to `false` before including the script as follows,

```html
<script type="text/javascript">var projectPages = false</script>
<script type="text/javascript" src="path-to/ghspa.js"></script>
```


## Credits

This project was built with these resources,

[SPA Github Pages](https://github.com/rafrex/spa-github-pages), host single page apps with github pages.

[Pokemon Go](http://www.flaticon.com/packs/pokemon-go), a free SVG icon set.

[Semantic-UI](http://semantic-ui.com/), a development framework that helps create beautiful, responsive layouts using human-friendly HTML.


## License

[MIT license](http://opensource.org/licenses/mit-license.php)
Copyright (c) Web Semantics, Inc.
