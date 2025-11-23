import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.div`
  display:flex; gap:0.75rem; align-items:center;
`;

export default function Pagination({ page, totalPages, onPrev, onNext, disabledPrev, disabledNext }){
  return (
    <Wrapper>
      <button type="button" onClick={onPrev} disabled={disabledPrev}>Prev</button>
      <div>Page {page} of {totalPages}</div>
      <button type="button" onClick={onNext} disabled={disabledNext}>Next</button>
    </Wrapper>
  );
}
