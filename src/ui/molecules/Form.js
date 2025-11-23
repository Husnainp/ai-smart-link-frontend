import styled from 'styled-components';

export const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  &.full-width { grid-column: 1 / -1; }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  grid-column: 1 / -1;
  @media (max-width: 768px) { flex-direction: column; }
`;

export default Form;
