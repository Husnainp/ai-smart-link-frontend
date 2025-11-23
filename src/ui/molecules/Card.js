import styled from 'styled-components';
import React from 'react';

const CardLink = styled.a`
  background: ${(p) => p.theme.colors.background};
  border-radius: ${(p) => p.theme.radii.md};
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(2,6,23,0.06);
  transition: transform 180ms ease, box-shadow 180ms ease;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(2,6,23,0.12);
  }
`;

const Image = styled.div`
  width: 100%;
  height: 200px;
  background: ${(p) => (p.src ? `url(${p.src}) center/cover` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(p) => (p.src ? 'rgba(0,0,0,0.06)' : 'transparent')};
  }
`;

const Placeholder = styled.div`
  font-size: 3rem;
  color: white;
  z-index: 1;
`;

const Content = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Category = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

const Description = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.95rem;
  line-height: 1.5;
`;

export default function Card({ href = '#', cover, icon, category, title, description, target = '_blank', rel = 'noopener noreferrer', onClick, ...props }) {
  return (
    <CardLink href={href} target={target} rel={rel} onClick={onClick} {...props}>
      <Image src={cover}>
        {!cover && icon ? <Placeholder>{icon}</Placeholder> : null}
      </Image>
      <Content>
        {category ? <Category>{category}</Category> : null}
        {title ? <Title>{title}</Title> : null}
        {description ? <Description>{description}</Description> : null}
      </Content>
    </CardLink>
  );
}
