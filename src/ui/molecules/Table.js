import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${(p) => p.theme.colors.background};
  border-radius: ${(p) => p.theme.radii.md};
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(2,6,23,0.06);
`;

export const Thead = styled.thead`
  background: linear-gradient(90deg, #f7fafc 0%, #fff 100%);
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 700;
  color: #4a5568;
  font-size: 0.9rem;
  border-bottom: 1px solid #edf2f7;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  &:nth-child(even) { background: #fcfdff; }
`;

export const Td = styled.td`
  padding: 0.75rem 1rem;
  vertical-align: middle;
  color: #2d3748;
  font-size: 0.95rem;
  border-bottom: 1px solid #f1f5f9;
  a { color: ${(p) => p.theme.colors.primary}; text-decoration: none; }
`;

export default Table;
