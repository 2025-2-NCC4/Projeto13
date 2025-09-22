import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 16px;
  background-color: #f8fafc;
  color: #4a5568;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
`;

export const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
`;

export const TableRow = styled.tr`
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child ${TableCell} {
    border-bottom: none;
  }
`;

export const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'completed': return '#c6f6d5';
      case 'pending': return '#fed7d7';
      case 'progress': return '#feebcb';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#2f855a';
      case 'pending': return '#c53030';
      case 'progress': return '#dd6b20';
      default: return '#4a5568';
    }
  }};
`;