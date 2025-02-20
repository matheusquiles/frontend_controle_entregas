
import styled from 'styled-components';

export const FrameWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

export const Sidebar = styled.nav`
  width: 250px;
  background-color: #f5f5f5;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

export const MenuItem = styled.div`
  margin-bottom: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0; 
  }
`;

export const SubMenu = styled.ul`
  list-style: none;
  padding-left: 1rem;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

export const SubMenuItem = styled.li`
  margin-bottom: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0; 
  }
`;

export const Header = styled.header`
  background-color: #f5f5f5;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Logo = styled.img`
  height: 60px;
`;

export const Content = styled.main`
  flex: 1;
  padding: 2rem;
`;

export const Footer = styled.footer`
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
  width: 100%;
`;