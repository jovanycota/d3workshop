;(async () => {
  console.log("Plotting map...")

  const CA_MAP_URL =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/CA-06-california-counties.json"

  const DATA_URL =
    "https://data.chhs.ca.gov/api/3/action/datastore_search?resource_id=046cdd2b-31e5-4d34-9ed3-b48cdbc4be7a&q=2021-01&limit=10000"

  const options = {
    week: 1,
  }

  const projection = d3.geoAlbersUsa().scale(2500).translate([1020, 290])
  const path = d3.geoPath().projection(projection)

  const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([-200, 1000])

  const radiusScale = d3.scaleSqrt().domain([0, 250]).range([2, 10])
  const mapData = await d3.json(CA_MAP_URL)
  const data = await getData(DATA_URL)

  const mapFeatures = topojson.feature(
    mapData,
    mapData.objects.cb_2015_california_county_20m
  )

  const combined = combinedData(data, mapFeatures)

  const svg = d3.select("#bubblemap").attr("width", 500).attr("height", 500)

  const highlightCounty = (source, target, county) => {
    const bubble = d3.select(target)
    const translation = path.centroid(county.geometry)
    const x = translation[0] + 15
    const y = translation[1] - 20

    const tooltip = svg
      .append("g")
      .attr("transform", "translate(" + x + "," + y + ")")
    tooltip
      .append("rect")
      .attr("class", "tooltip")
      .attr("width", 160)
      .attr("height", 20)
      .attr("fill", "#D3D3D3")

    tooltip
      .append("text")
      .text(county.properties.NAME + " County")
      .attr("y", 15)
      .attr("x", 5)
    const currentRadius = radiusScale(county.data[options.week - 1].deaths)

    bubble.attr("r", currentRadius * 2)
    d3.select(source).on("mouseout", () => {
      bubble.attr("r", currentRadius)
      tooltip.remove()
    })
  }

  /*
    County Outlines:
  */
  svg
    .append("g")
    .attr("fill", "white")
    .attr("stroke", "black")
    .selectAll("path")
    .data(combined)
    .enter()
    .append("path")
    .attr("d", path)
    .on("mouseover", (event, county) => {
      const target = d3
        .selectAll(".bubble")
        .filter((c) => {
          return c.properties.GEOID === county.properties.GEOID
        })
        .nodes()[0]

      highlightCounty(event.target, target, county)
    })

  /*
    Bubbles
  */
  svg
    .append("g")
    .selectAll(".bubble")
    .data(combined)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("transform", (county) => {
      const translation = path.centroid(county.geometry)
      return "translate(" + translation[0] + "," + translation[1] + ")"
    })
    .on("mouseover", (event, county) => {
      highlightCounty(event.target, event.target, county)
    })

  const updateWeek = (week) => {
    const date = combined[0].data[week - 1].date

    d3.select("#date").text(
      date.getUTCMonth() +
        1 +
        "/" +
        date.getUTCDate() +
        "/" +
        date.getUTCFullYear()
    )

    d3.select("#bubblemap")
      .selectAll(".bubble")
      .transition()
      .attr("fill", (county) => {
        return colorScale(county.data[week - 1].cases)
      })
      .attr("r", (county) => {
        return radiusScale(county.data[week - 1].deaths)
      })
      .duration(100)
  }

  d3.select("#slider")
    .attr("type", "range")
    .attr("min", 1)
    .attr("max", combined[0].data.length)
    .attr("value", 1)
    .on("input", (event) => {
      updateWeek(event.target.value)
    })

  makeLegend(svg, colorScale, radiusScale)
  updateWeek(1)
})()
