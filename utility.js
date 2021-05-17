const getData = async (url) => {
  const {
    result: { records },
  } = await d3.json(url)

  // console.log(records) // See the data we get from the api

  const output = {}

  records
    .filter(
      ({ date, area }) =>
        date.substr(5, 2) === "01" &&
        !["Unknown", "Out of state", "California"].includes(area)
    )
    .forEach((county) => {
      const d = {
        deaths: +county.deaths,
        cases: +county.cases,
        date: new Date(`${county.date} PST`),
      }

      if (Object.keys(output).includes(county.area)) {
        output[county.area].push(d)
        output[county.area].sort(
          ({ date: date1 }, { date: date2 }) =>
            (date1.getUTCDate() > date2.getUTCDate()) -
            (date1.getUTCDate() < date2.getUTCDate())
        )
      } else {
        output[county.area] = [d]
      }
    })

  // console.log(output) // See the output

  return output
}

// This is just merging the COVID Data with the map data
const combineData = (data, map) =>
  Object.keys(map.features).map((key) => {
    const county = map.features[key]
    return {
      ...county,
      data: data[county.properties.NAME],
    }
  })

const makeLegend = (svg, colorScale, radiusScale) => {
  /*
    Generate an array 1000, 999, ..., 1
    Then for each of these values we have a small rectangle that
    combined make up the color bar
  */
  svg
    .append("g")
    .selectAll(".bars")
    .data(d3.range(1000, -1, -1))
    .enter()
    .append("rect")
    .attr("transform", "translate(430, 50)")
    .attr("class", "bars")
    .attr("width", 10)
    .attr("height", 1)
    .attr("x", 0)
    .attr("y", (d) => {
      return d / 8
    })
    .attr("fill", (d) => colorScale(1000 - d))

  /*
    Specify the circle sizes we want:
  */
  const sizes = [250, 200, 100, 50, 20, 1]
  const circlePos = d3
    .scaleLinear()
    .domain([0, sizes.length - 1])
    .range([0, 150])

  const legendCircles = svg.append("g").attr("transform", "translate(390, 55)")

  /*
    Here I just input an array 0, 1, ..., 5 for the index of each circle
    This way I can evenly space the circles calling the circlePos scale
   */
  legendCircles
    .selectAll(".legendcircles")
    .data(d3.range(sizes.length))
    .enter()
    .append("circle")
    .attr("width", 10)
    .attr("height", 10)
    .attr("r", (d) => radiusScale(sizes[d]))
    .attr("cx", 0)
    .attr("cy", (d) => circlePos(d))

  /*
    Do the same thing as for making the circles but now
    put the text next to the circles
  */
  legendCircles
    .selectAll(".legendText")
    .data(d3.range(sizes.length))
    .enter()
    .append("text")
    .text((d) => sizes[d])
    .attr("x", -20)
    .attr("y", (d) => circlePos(d) + 5)
    .attr("text-anchor", "end")

  /* 
    Put the text for colorbar and axis labels:  
    
  */
  svg
    .append("text")
    .attr("transform", "translate(390, 220) rotate(-90)")
    .text("# Deaths")
    .attr("text-anchor", "end")
  svg
    .append("text")
    .attr("transform", "translate(440, 220) rotate(-90)")
    .attr("text-anchor", "end")
    .text("# Cases")
  svg
    .append("text")
    .attr("transform", "translate(445, 180)")
    .text("# Cases")
    .attr("text-anchor", "start")
    .text("0")
  svg
    .append("text")
    .attr("transform", "translate(445, 50)")
    .text("# Cases")
    .attr("text-anchor", "start")
    .text("1000+")
}
