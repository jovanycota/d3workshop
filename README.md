# MOVE D3 Workshop 5/20/2021

The goal of this workshop is to introduce D3.js as a way to make interactive visualizations in the browser. At the end of the workshop we will have produced a bubble map of California as shown below.

![Final Result](final.png)

## Setup
You will need to download all of the files under the src folder:
* index.html
* styles.css
* index.js
* utility.js

To run these files, you will need a browser such as Chrome, FireFox, Safari, etc.... It is also recommended that you use an IDE such as VSCode, however any text editor will work.

## Deployment

Under the final folder you can find the completed index.js file. This folder is for the github pages which you can view [here](www.google.com).

---

The rest of this README goes through the instructions for the workshop and then a description of each of the files that were glanced over in the workshop.


## Instructions

## example.js

Most of the syntax in Javascript should look familiar if you're coming from another programming language. This section goes over a few basic parts of the language that we will be using throughout the workshop that you should know if you are not already familiar with Javascript.

To declare a variable in Javascript, we can use the `let` keyword.

```javascript
let a = 2
```

In many cases, we won't need to change the value of a variable after initializing it, in which case we should make it a constant using the `const` keyword.

```javascript
const b = 5
```

If we want to print out the value of a variable or constant we can use `console.log()`. If we want to print out multiple values, we can separate the names using a comma.

```javascript
console.log(a, b)
```

In the browser, you can view this output by right clicking the screen, then selecting inspect and then going to "console" (on Chrome and Firefox).

In this workshop we will be using arrow function expressions. To make a function this way, you need a pair of parenthesis (and any parameters inside) followed by an arrow into curly brackets. The following function takes two parameters, `m` and `n` and returns the product of these two values. 

```javascript
(m, n) => {
  return m * n
}
```

In `example.js` you may notice a semicolon in front of this function. In Javascript, semicolons at the end of a line are optional, however, in certain instances you make get weird results if you don't include them. The reason that a semicolon is needed here (or anywhere after the `console.log()`) is because Javascript will read the file as:

```javascript
console.log(a, b)(m, n) => {
  return m * n
}
```
which is not what we want. In general, this shouldn't be a problem as it doesn't make sense to have an anonymous function on its on line like this.

If we want to call a function later, we can assign it to a variable (and typically you want to make it a constant). Here, we assign the function shown above to a constant called mult.

```javascript
const mult = (m, n) => {
  return m * n
}

console.log(mult(8, 9))
```

Passing in the two numbers, 8 and 9 will log 72.

## index.html

HTML files specify the structure of our website.

We have to start the file by declaring it's type as an html document. Then all of our html will be within the `html` tags. I also specified the language as English.

```html
<!DOCTYPE html>
<html lang="en">
  ...
</html>
```

The rest of code is split into two sections: the head and the body.

#### head

The head element is inclosed in the following tags: `<head></head>`. In the head we can specify metadata about or document.

The following metadata is optional, but can improve compatibility across devices.
```html
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Here we link to our `styles.css` style sheet that is discussed below.

```html
<link rel="stylesheet" href="styles.css" />
```

The following `script` tags import D3, Topojson and a file with utility functions that I've included.

```html
<script src="https://d3js.org/d3.v6.min.js"></script>
<script src="https://unpkg.com/topojson@3"></script>
<script src="utility.js"></script>
```

The final line sets the title of our document. You can see this title in the tab for the page in your browser.

```html
<title>MOVE D3 Workshop</title>
```

#### body

The body, as enclosed by the following tags: `<body></body>` includes the contents that will be shown in the browser.

In order to center the content on the page, I've wrapped everything inside of `<main>` tags. You can use these tags once on a page, to specify the main content on the page. You could use, for example, a `div` here, but we want the tags we use to reflect the type of content inside of them, [see semantic html](https://www.w3schools.com/html/html5_semantic_elements.asp). The `h1` tags represent headings for the page and by default are larger than `h2`, `h3`, ... tags. The paragraph tag, `p`, indicates this is text content.

The map, slider and date are all wrapped inside of a div with the id 'map'. This id is used to individually apply a style to this div in styles.css.

```html
<div id="map">...</div>
```

The `svg` tag is a container for SVG graphics. I give this element an id, so that D3 can select this element later, to start attaching the map to it.

```html
<svg id="bubblemap"></svg>
```

There are many different types of inputs in HTML. In our index.js file we will attach attributes to this element to make it a slider.

```html
<input id="slider"></input>
```

At the end of our body, we want to include the script that will run our d3 code: 
```html
<script src="index.js"></script>
```
We need this at the end of our body since D3 operates on some of the html elements defined above and these need to be placed on the page before D3 can start accessing them. Putting the script at the end of our body like this will run the script once the page has been loaded.


## styles.css



## utility.js
