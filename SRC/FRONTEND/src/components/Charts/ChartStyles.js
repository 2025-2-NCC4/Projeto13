import styled from 'styled-components';

export const ChartContainer = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 220px;
  display: flex;
  flex-direction: column;
`;

export const ChartSubtitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 10px;
  text-align: center;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-top: 15px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;