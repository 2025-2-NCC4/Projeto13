import React from 'react';

const StatCard = ({ title, value, change, isPositive }) => {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
        <i className={`fas fa-arrow-${isPositive ? 'up' : 'down'}`}></i> 
        {change} este mês
      </div>
    </div>
  );
};

export default StatCard;