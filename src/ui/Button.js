"use client";

import React from 'react';
import styled, { css } from 'styled-components';

// Size styles
const sizes = {
  sm: css`
    padding: 6px 10px;
    font-size: 14px;
  `,
  md: css`
    padding: 10px 14px;
    font-size: 16px;
  `,
};

// Styled button with transient props ($) to avoid DOM warnings
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  color: ${(p) => p.theme.colors.primary};
  border: 2px solid ${(p) => p.theme.colors.primary};
  transition: background 120ms ease, transform 120ms ease, box-shadow 120ms ease;
  ${(p) => sizes[p.$size || 'md']}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Primary: gradient filled button */
  ${(p) =>
    p.$primary &&
    css`
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
    `}

  /* Secondary (muted) */
  ${(p) =>
    p.$secondary &&
    css`
      background: ${p.theme.colors.muted};
      color: white;
      border: none;
    `}

  /* Ghost variant */
  ${(p) =>
    p.$variant === 'ghost' &&
    css`
      background: transparent;
      color: ${p.theme.colors.primary};
      border: 2px solid rgba(255, 255, 255, 0.18);
      &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: ${p.theme.colors.primary};
      }
    `}

  /* AI variant */
  ${(p) =>
    p.$variant === 'ai' &&
    css`
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;
    `}

  /* Active state */
  ${(p) =>
    p.$active &&
    css`
      background: white;
      color: ${p.theme.colors.primary};
      border: 2px solid white;
    `}

  ${(p) => p.$fullWidth && css`width: 100%;`}
`;

export default function Button({
  children,
  onClick,
  type = 'button',
  size = 'md',
  variant = 'default',
  primary = false,
  secondary = false,
  active = false,
  fullWidth = false,
  ...props
}) {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      $size={size}
      $variant={variant}
      $primary={primary}
      $secondary={secondary}
      $active={active}
      $fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
}