import styled, { css } from 'styled-components';

const FilterButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: ${(p) => (p.active ? 'white' : 'rgba(255, 255, 255, 0.2)')};
  color: ${(p) => (p.active ? '#667eea' : 'white')};
  border: 2px solid ${(p) => (p.active ? 'white' : 'rgba(255, 255, 255, 0.3)')};
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
    color: #667eea;
    border-color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

export default FilterButton;
