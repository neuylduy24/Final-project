import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./styleForm.scss"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PieChartComponent = ({ data, width = 430, height = 400 }) => (
  <PieChart width={width} height={height}>
    <Pie
      data={data}
      cx={200}
      cy={200}
      labelLine={false}
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);

export default PieChartComponent;
