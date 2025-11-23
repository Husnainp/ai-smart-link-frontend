"use client";

import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  display: inline-block;
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  outline: none;
  transition: box-shadow 120ms ease, border-color 120ms ease;
  width: 100%;

  &:focus {
    box-shadow: 0 0 0 4px rgba(11,116,255,0.08);
    border-color: ${(p) => p.theme.colors.primary};
  }

  &::placeholder { color: ${(p) => p.theme.colors.muted}; }
`;

export default function Input({ value, onChange, placeholder = '', type = 'text', ...props }) {
  return (
    <StyledInput type={type} value={value} onChange={onChange} placeholder={placeholder} {...props} />
  );
}
