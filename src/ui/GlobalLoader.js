"use client";

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import { selectIsAnyApiLoading } from '../lib/api/loadingSelector';

const overlayFade = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.2);
  border-top-color: ${(p) => p.theme.colors.primary};
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2,6,23,0.45);
  z-index: 9999;
  animation: ${overlayFade} 180ms ease;
`;

const Card = styled.div`
  background: rgba(255,255,255,0.06);
  padding: 18px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 20px rgba(2,6,23,0.4);
`;

const Text = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
`;

export default function GlobalLoader() {
  const loading = useSelector(selectIsAnyApiLoading);

  if (!loading) return null;

  return (
    <Backdrop aria-live="polite" aria-busy="true">
      <Card>
        <Spinner />
        <Text>Loading…</Text>
      </Card>
    </Backdrop>
  );
}
