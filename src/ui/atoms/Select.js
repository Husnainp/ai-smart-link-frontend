import styled from 'styled-components';

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.sm};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 1rem;
`;

export default Select;
