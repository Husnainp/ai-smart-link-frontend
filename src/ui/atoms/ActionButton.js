import styled from 'styled-components';

const ActionButton = styled.button`
  padding: 0.4rem 0.6rem;
  margin-left: 0.5rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  color: white;
  background: ${(p) => p.danger ? '#e53e3e' : p.muted ? '#718096' : p.ai ? 'linear-gradient(90deg,#f093fb 0%,#f5576c 100%)' : p.theme.colors.primary};
  &:hover { filter: brightness(0.95); }
`;

export default ActionButton;
