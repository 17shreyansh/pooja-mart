import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
  }

  html, body, #root {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
`;

export const Section = styled.section`
  width: 100%;
  padding: 40px 0;
  
  &.hero {
    padding: 80px 0;
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    color: white;
  }
  
  &.alternate {
    background-color: #f8f9fa;
  }
`;

export const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin-bottom: 2rem;
  color: #333;
  
  &.white {
    color: white;
  }
`;

export const Button = styled.button`
  background: #ff6b35;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e55a2b;
  }
`;