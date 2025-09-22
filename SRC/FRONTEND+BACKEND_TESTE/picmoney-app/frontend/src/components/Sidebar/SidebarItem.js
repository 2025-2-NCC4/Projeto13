import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Item = styled(Link)`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 8px;
  text-decoration: none;
  color: ${props => props.active ? '#ffffff' : '#d1d5db'};
  background: ${props => props.active ? '#374151' : 'transparent'};
  border-radius: 10px;
  transition: all 0.3s ease;
  gap: 10px;

  &:hover {
    background: #374151;
    color: #ffffff;
  }
`;

const Icon = styled.span`
  font-size: 18px;
`;

const Label = styled.span`
  font-weight: ${props => props.active ? '600' : '400'};
`;

const SidebarItem = ({ item, active, to }) => {
  return (
    <Item to={to} active={active ? 1 : 0}>
      <Icon>{item.icon}</Icon>
      <Label active={active}>{item.label}</Label>
    </Item>
  );
};

export default SidebarItem;