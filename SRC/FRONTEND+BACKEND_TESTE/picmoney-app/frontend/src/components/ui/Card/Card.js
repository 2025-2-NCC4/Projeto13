import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: ${props => props.padding || '24px'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: ${props => props.marginBottom || '0'};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  ${props => props.hoverable && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }
  `}
`;

export const CardHeader = styled.div`
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

export const CardBody = styled.div`
  // Estilos do corpo do card
`;