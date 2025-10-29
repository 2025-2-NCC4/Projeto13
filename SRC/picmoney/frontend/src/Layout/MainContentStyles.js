import styled from 'styled-components';

export const MainContentContainer = styled.main`
  flex: 1;
  padding: 20px;
  margin-left: 250px;
  width: calc(100% - 250px);
  background: #f5f7fb;

  @media (max-width: 768px) {
    margin-left: 70px;
    width: calc(100% - 70px);
  }
`;

export const DashboardContent = styled.div`
  max-width: 80%;
  margin: 0 auto;
`;