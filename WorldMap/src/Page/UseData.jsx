import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { feature } from "topojson";
import { json, csv } from "d3";

// const getCountryISO3 = require("country-iso-2-to-3");

// https://www.npmjs.com/package/country-iso-2-to-3

export const useData = () => {
  const [mapData, setData] = useState();
  const [vacData, setVacData] = useState();
  const jsonUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  useEffect(() => {
    json(jsonUrl).then((data) => {
      const countries = feature(data, data.objects.countries);
      setData(countries);
    });
    // csv("Afghanistan.csv").then((data) => {
    //   console.log(data);
    // });

    json("vaccinations.json", {}).then((data) => {
      //  console.log(data[0]);
      setVacData(data[0]);
    });
  }, []);

  return { mapData, vacData };
};
