import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const BarChartComponent = ({ data, xKey, bars, width = 600, height = 300 }) => (
  <BarChart width={width} height={height} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey={xKey} />
    <YAxis />
    <Tooltip />
    <Legend />
    {bars.map((bar, index) => (
      <Bar key={index} dataKey={bar.dataKey} fill={bar.color} name={bar.name} />
    ))}
  </BarChart>
);

export default BarChartComponent;
