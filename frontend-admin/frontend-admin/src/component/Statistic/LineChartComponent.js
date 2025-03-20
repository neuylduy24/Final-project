import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "./styleForm.scss"

const LineChartComponent = ({ data, xKey, yKey, width = 600, height = 300, color = "#ff7300" }) => (
  <LineChart width={width} height={height} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey={xKey} />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey={yKey} stroke={color} name="Lượt xem" />
  </LineChart>
);

export default LineChartComponent;
