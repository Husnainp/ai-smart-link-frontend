import styled from 'styled-components';

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.sm};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  color: ${(p) => p.theme.colors.foreground};
`;

export default Textarea;
