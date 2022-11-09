import {
  axisBottom,
  axisLeft,
  curveCardinal,
  line,
  max,
  scaleLinear,
  select,
  json,
  scaleBand,
} from "d3";
import { useEffect, useRef, useState } from "react";
import "./LineChart.css";

export const LineChart = ({ countryName, setCountryName }) => {
  const [dailydata, setdailyData] = useState();
  const [date, setDate] = useState();
  const [noMatch, setNoMatch] = useState();
  const [Data, setData] = useState();
  const [clickchange, setClickChange] = useState("Daily People Vaccinated");
  const [isActive, setIsActive] = useState(false);

  const svgref = useRef();

  //  render the line chart
  const render = (w, h, svg) => {
    //add this to remove the links
    svg.selectAll("path").remove();
    svg.selectAll("text").remove();
    svg.selectAll("g").remove();
    // title
    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("font-family", "Times New Roman")
      .style("font-size", 20)
      .text(clickchange + " : " + countryName);
    //xLabel
    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", h + 30)
      .attr("text-anchor", "middle")
      .style("font-family", "Times New Roman")
      .style("font-size", 15)
      .text("Date");

    // yLabel
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -150)
      .attr("transform", "translate(60," + h / 2 + ")rotate(-90)")
      .style("font-family", "Times New Roman")
      .style("font-size", 15)
      .text("Cases");
    // setting scalling
    const xScale = scaleLinear()
      .domain([0, dailydata?.length - 1])
      .range([0, w]);

    const yScale = scaleLinear()
      .domain([0, max(dailydata) + max(dailydata) / 10])
      .range([h, -1]);
    const getLine = line()
      .x((d, i) => {
        return xScale(i);
      })
      .y(yScale);
    // .curve(curveCardinal);

    // setting the axis
    const xAxis = axisBottom(xScale)
      .ticks(6)
      .tickFormat((i) => {
        return date[i];
      });
    const yAxis = axisLeft(yScale).ticks(6);

    svg.append("g").call(xAxis).attr("transform", `translate(0,${h})`);
    // .attr("rotate", "90");
    svg.append("g").call(yAxis);

    // setting up the data for the svg
    svg
      .selectAll(".line")
      .data([dailydata])
      .join("path")
      .attr("d", (d) => {
        return getLine(d);
      })
      .attr("class", "lineChart");

    // for the scatter plot
    if (clickchange === "Total Vaccinations") {
      svg
        .append("g")
        .selectAll("dot")
        .data(dailydata)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
          // console.log();
          return xScale(i);
        })
        .attr("cy", function (d, i) {
          return yScale(d);
        })
        .attr("r", 1.6)
        .attr("class", "cricle")
        .on("click", (d, i) => {});
    }
    // May bar chart?
  };
  useEffect(() => {
    json("vaccinations.json", {}).then((data) => {
      //  console.log(data[0]);
      // setvacData(data[0]);
      const tempData = data?.reduce((accumulator, d) => {
        // get the
        const obj = {
          country: d.country,
          data: d.data,
        };
        // console.log(obj);
        accumulator[d.country] = obj;
        return accumulator;
      }, {});
      // list of the daily people vaccinated
      const dailydata = tempData[countryName]?.data?.map((obj) => {
        if (obj?.daily_people_vaccinated === undefined) {
          return 0;
        }
        return obj?.daily_people_vaccinated;
      });
      //get total data
      const totaldata = tempData[countryName]?.data?.reduce(function (
        result,
        obj
      ) {
        if (obj?.total_vaccinations !== undefined) {
          const temp = {
            total: obj?.total_vaccinations,
            date: obj?.date,
          };
          result.push(temp);
        }
        return result;
      },
      []);
      // get fully total data
      const fullytotaldata = tempData[countryName]?.data?.reduce(function (
        result,
        obj
      ) {
        if (obj?.people_fully_vaccinated !== undefined) {
          const temp = {
            total: obj?.people_fully_vaccinated,
            date: obj?.date,
          };
          result.push(temp);
        }
        return result;
      },
      []);

      // date
      const date = tempData[countryName]?.data?.map((obj) => {
        return obj?.date;
      });
      // a object
      const Data = tempData[countryName]?.data?.map((obj) => {
        const daily =
          obj?.daily_people_vaccinated === undefined
            ? 0
            : obj?.daily_people_vaccinated;

        const temp = {
          daily_people_vaccinated: daily,
          date: obj?.date,
        };
        return temp;
      });
      setData(Data);
      setDate(date);
      if (clickchange === "Daily People Vaccinated") {
        setdailyData(dailydata);
      } else if (clickchange === "Total Vaccinations") {
        setdailyData(
          totaldata?.map((obj) => {
            return obj?.total;
          })
        );
      } else if (clickchange === "People Fully Vaccinated") {
        setdailyData(
          fullytotaldata?.map((obj) => {
            return obj?.total;
          })
        );
      }
    });
    const w = 600;
    const h = 400;
    const svg = select(svgref.current)
      .attr("width", w)
      .attr("height", h)
      .style("background", "aliceblue")
      .style("margin-top", "100")
      .style("margin-left", "50")
      .style("overflow", "visible");
    if (dailydata && date) {
      // setdailyData(tempData[countryName]);
      render(w, h, svg);
      // console.log("here");
      setNoMatch(false);
    } else {
      setNoMatch(true);
    }
  });
  // line chart
  // daily_people_vaccinated: 28
  //bar chart?
  // daily_people_vaccinated_per_hundred: 0.001
  // daily_vaccinations: 2336
  // daily_vaccinations_per_million: 455
  // daily_vaccinations_raw: 2651
  // date: "2022-09-23"
  // people_fully_vaccinated: 4132410
  // people_fully_vaccinated_per_hundred: 80.56
  // people_vaccinated: 4297495
  // people_vaccinated_per_hundred: 83.78
  // total_boosters: 3332838
  // total_boosters_per_hundred: 64.97
  // total_vaccinations: 11762743
  const handleClickDaily = () => {
    // setIsActive((current) => !current);
    setClickChange("Daily People Vaccinated");
  };
  const handleClickTotal = () => {
    setClickChange("Total Vaccinations");
  };
  const handleClickPeopleFullly = () => {
    setClickChange("People Fully Vaccinated");
  };

  return (
    <>
      <button
        className="button"
        // style={{
        //   backgroundColor: isActive ? "salmon" : "",
        //   color: isActive ? "white" : "",
        // }}
        onClick={handleClickDaily}
      >
        Daily people vaccinated
      </button>
      <button className="button" onClick={handleClickTotal}>
        Total vaccinations
      </button>
      <button className="button" onClick={handleClickPeopleFullly}>
        People Fully Vaccinated
      </button>

      {noMatch ? (
        <p>No matches, please select another country</p>
      ) : (
        <svg ref={svgref}></svg>
      )}
    </>
  );
};
