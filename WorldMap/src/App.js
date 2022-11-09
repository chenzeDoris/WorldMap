import React, { useState, useEffect } from "react";
import { useData } from "./Page/UseData";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as d3 from "d3";
import { Marks } from "./Components/Marks";
import "./App.css";
import { LineChart } from "./Components/LineChart";

function APP() {
  const data = useData();
  const [Mapstate, setMapstate] = useState(false);
  const [state, setState] = useState(false);
  const [chart, showChart] = useState(true);
  const [countryName, setCountryName] = useState();

  if (!data) {
    return <pre>Loading..</pre>;
  }
  const onClick = () => {
    setMapstate(!Mapstate);
  };
  const onShowChart = () => {
    showChart(!chart);
  };

  return (
    <div>
      <div className="map" style={{ width: "60%", height: "100%" }}>
        <button onClick={onShowChart}>showChart</button>
        <Marks data={data} chart={chart} setCountryName={setCountryName} />
      </div>
      <div className="countryName" style={{ width: "40%", height: "100%" }}>
        <text>{countryName}</text>
        {countryName ? (
          <LineChart
            countryName={countryName}
            setCountryName={setCountryName}
          />
        ) : (
          <p>Choice one</p>
        )}
      </div>
    </div>
  );
}
export default APP;
