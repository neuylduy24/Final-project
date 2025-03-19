import React from "react";
import "./styleForm.scss"

const ChartCard = ({ title, children }) => (
  <div className="chart-card">
    <h2 className="chart-card__title">{title}</h2>
    <div className="chart-card__content">{children}</div>
  </div>
);

export default ChartCard;
