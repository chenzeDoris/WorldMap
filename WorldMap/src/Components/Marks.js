import {
  geoEqualEarth,
  geoPath,
  selectAll,
  select,
  svg,
  json,
  tsvFormat,
  tsv,
  count,
} from "d3";
import { useState, useRef, useEffect } from "react";
import { feature } from "topojson";
import "./Marks.css";
import { LineChart } from "./LineChart";

const projection = geoEqualEarth();
const path = geoPath().projection(projection);
export const Marks = ({ data, chart, setCountryName }) => {
  const [id, setid] = useState();
  const [Data, setData] = useState(null);
  const [tsvData, setTsvData] = useState();

  // data?.vacData?.data?.map((obj) => {
  //   console.log(obj.date);
  // });
  const svgref = useRef();

  const jsonUrl = "https://unpkg.com/world-atlas@1.1.4/world/110m.json";
  const tsvUrl = "https://unpkg.com/world-atlas@1.1.4/world/110m.tsv";

  // useEffect(() => {
  const svg = select(svgref.current);

  useEffect(() => {
    Promise.all([json(jsonUrl), tsv(tsvUrl)]).then(([jsondata, tsvdata]) => {
      const countryName = tsvdata?.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d.name;
        return accumulator;
      }, {});
      const countries = feature(jsondata, jsondata?.objects?.countries);
      setData(countries);
      setTsvData(countryName);
    });
  }, [id]);

  return (
    <>
      <svg style={{ width: "100%", height: "600px" }} ref={svgref}>
        <g className="Marks">
          <path className="sphere" d={path({ type: "Sphere" })} />
          {data.mapData?.features?.map((feature) => (
            <path
              className="main"
              d={path(feature)}
              onClick={() => {
                setCountryName(tsvData[feature.id]);
                // setid(tsvData[feature.id]);
              }}
            />
          ))}
        </g>
      </svg>
    </>
  );
};
