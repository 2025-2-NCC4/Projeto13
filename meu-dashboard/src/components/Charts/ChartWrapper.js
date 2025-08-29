import React from 'react';
import { ChartContainer, ChartSubtitle } from './ChartStyles';

const ChartWrapper = ({ title, children }) => {
  return (
    <ChartContainer>
      <ChartSubtitle>{title}</ChartSubtitle>
      {children}
    </ChartContainer>
  );
};

export default ChartWrapper;