import styled from 'styled-components';

export const Button = styled.button`
  background: ${props => {
    if (props.variant === 'secondary') return '#718096';
    if (props.variant === 'danger') return '#e53e3e';
    return '#3498db';
  }};
  color: white;
  border: none;
  padding: ${props => props.size === 'small' ? '8px 16px' : '12px 24px'};
  border-radius: 8px;
  cursor: pointer;
  font-size: ${props => props.size === 'small' ? '14px' : '16px'};
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => {
      if (props.variant === 'secondary') return '#4a5568';
      if (props.variant === 'danger') return '#c53030';
      return '#2980b9';
    }};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
  }
`;

export const IconButton = styled(Button)`
  padding: 8px;
  border-radius: 50%;
`;