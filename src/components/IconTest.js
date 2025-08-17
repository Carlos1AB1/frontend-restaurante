// Test component to verify icons are working
import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun, FiSearch, FiEye } from 'react-icons/fi';

const TestContainer = styled.div`
  padding: 20px;
  background: white;
  color: black;
  
  .icon-test {
    display: inline-block;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    
    svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
      stroke: currentColor;
      stroke-width: 2;
    }
  }
`;

const IconTest = () => {
  return (
    <TestContainer>
      <h3>Icon Test</h3>
      <div className="icon-test">
        <FiMenu />
        <span>Menu</span>
      </div>
      <div className="icon-test">
        <FiUser />
        <span>User</span>
      </div>
      <div className="icon-test">
        <FiMoon />
        <span>Moon</span>
      </div>
      <div className="icon-test">
        <FiSun />
        <span>Sun</span>
      </div>
      <div className="icon-test">
        <FiShoppingCart />
        <span>Cart</span>
      </div>
      <div className="icon-test">
        <FiEye />
        <span>Eye</span>
      </div>
    </TestContainer>
  );
};

export default IconTest;
