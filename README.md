# MOVE D3 Workshop 5/20/2021

The goal of this workshop is to introduce D3.js as a way to make interactive visualizations in the browser. At the end of the workshop we will have produced a bubble map of California as shown below and as you can see [here](https://alrudolph.github.io/d3workshop/).

![Final Result](final.png)

## Setup
You will need to download all of the files under the src folder:
* index.html
* styles.css
* index.js
* utility.js

To run these files, you will need a browser such as Chrome, FireFox, Safari, etc.... It is also recommended that you use an IDE such as VSCode, however any text editor will work.

## Deployment

Under the final folder you can find the completed index.js file. Once you have your completed files, you can deploy them with GitHub Pages. Make a new repo with these four files at the top level and then go to Settings -> Pages and enable github pages. Then you can see a link to github-pages under 'Environments' in your repo.

---

The rest of this README goes through the instructions for the workshop and then a description of each of the files that were glanced over in the workshop.

## Instructions



## example.js

Most of the syntax in Javascript should look familiar if you're coming from another programming language. This section goes over a few basic parts of the language that we will be using throughout the workshop. 

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

Most of the styling here centers the html content described above. I really like using [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) to do this. However, on browsers such as Safari, Flexbox won't work so the styles are duplicated with a `-webkit-` prefix.

The rule for `body` centers the `main` component horizontally. 

The width of the `main` component is 40% of the viewing area, however it is always at least 375px.

In CSS, you use pound signs to select an id. `#map` selects the div with the id `map` and I set the width of it to 100% of the main area and horizontally center the components inside of it.

The styling applied to `input` makes it so that when your mouse hovers over the slider, it changes your cursor to indicate that you can select and drag the slider.

## utility.js

The file, utility.js, includes three functions to help remove tedious parts of the workshop: `getData`, `combineData`, `makeLegend`.

#### getData()

First, this function is marked as `async` so that we can use the `await` keyword to fetch our data. 

Calling `d3.json(url)` returns an object of the form: 
```javascript
{
    help: "...",
    result: {
        records: [
            { 
                area: "Santa Barbara", 
                area_type="County", 
                cases: "52.0", 
                date: "2021-03-01", 
                ... 
            },
            ...
        ],
        ...
    },
    succes: true
}
```

We can see that the data we want is an array under `result.records`, which we can extract as just a variable called `records` using object destructuring:

```javascript
const { result: { records } } = await d3.json(url)
```

From there, we just have to filter and group the data. 

Filter iterates over each item in the array and I use desctructing again to get the `date` and `area` properties from each record. Then I check that the month is January and the area is an actual county name.

```javascript
records
    .filter(
      ({ date, area }) =>
        date.substr(5, 2) === "01" &&
        !["Unknown", "Out of state", "California"].includes(area)
    )
```

Now we have an array of objects for every county for every day in January 2021. Next, we want to group this array by county. I use the `forEach` method to iterate over each county again. This time, I add counties to the `output` object, if they aren't already in it. If the county is in `output` then I push the values into an array for that county.

```javascript
.forEach((county) => {
    /*
        These are the objects I want to store.
        Adding a + in front of values converts them to numbers.
        I also create date objects out of the date strings.
    */
    const d = {
        deaths: +county.deaths,
        cases: +county.cases,
        date: new Date(`${county.date} PST`),
    }

    /*
        We check if the county name (county.area) is already included
        in our output keys. Object.keys(output) returns an array of 
        the county names we already have and we check if it .includes
        the current county
    */
    if (Object.keys(output).includes(county.area)) {
        // Push the data into output:
        output[county.area].push(d)

        // Sort by date:
        output[county.area].sort(
        ({ date: date1 }, { date: date2 }) =>
            (date1.getUTCDate() > date2.getUTCDate()) -
            (date1.getUTCDate() < date2.getUTCDate())
        )
    } else {
        // Create the new key for output and start the array
        output[county.area] = [d]
    }
    })
```

Finally, we return an object where each key is the county name and value is an array of `{ deaths, cases, date }` objects for that county.

#### combineData()

If we combine our map and values into a single object, then accessing these values later is easier as all of this data will be bound to our map and we won't need a bunch of array.find()'s.

We want to join our data by county. The county names in the topojson object are stored as the keys in the `.features` object. First, we get an array of all of these keys `Object.keys(map.features)` then map over them (we're returning a copy of the array where each value is modified).

```javascript
Object.keys(map.features).map((key) => {
    ...
})
```

All of the county geometry and properties data from the topojson map is stored in `county`. We also get the array of daily case/death/date data using `data[county.properties.NAME]`.

The ellipses, `...` *spreads* the county object out to return an object with the data property added. In python this is the same as using `**` on a dictionary. 

The combined data is of the form:
```javascript
[
    {
        data: [{ cases, deaths, date }, ...],
        geometry: {...},
        properties: {...}
    },
    ...
]
```
And you can see that our cases/deaths/date data is appended for each county.

#### makeLegend()

Making a legend like this is basically just making another plot and fine tuning values to make it look nice.

The first part makes the colorbar. `d3.range(1000, -1, -1)` returns an array `[1000, 999, ..., 0]`. We use this data to position and color small rectangles which make up our colorbar.

```javascript
  svg
    .append("g")
    .attr("transform", "translate(430, 50)")
    .selectAll(".bars")
    .data(d3.range(1000, -1, -1))
    .enter()
    .append("rect") // append rectange
    .attr("class", "bars")
    .attr("width", 10)
    .attr("height", 1)
    .attr("x", 0)
    .attr("y", (d) => {
      return d / 8
    })
    // I want the colors to increase the other way:
    .attr("fill", (d) => colorScale(1000 - d)) 
```

For the circles, I specified values to plot in an array called `sizes`. We use `d3.range` again but this time for the indices of the `sizes` array.

```javascript
legendCircles
    .append("g")
    .selectAll(".legendcircles")
    .data(d3.range(sizes.length))
    .enter()
    .append("circle")
    .attr("width", 10)
    .attr("height", 10)
    .attr("r", (d) => radiusScale(sizes[d])) // call the same scale as on the map
    .attr("cx", 0)
    .attr("cy", (d) => circlePos(d))
```

Very similar code follows to append text that labels each of these circles. The rest of this function just places labels for the two legends and limits on the color bar. 