'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import toast from 'react-hot-toast';

import { logout as logoutAction } from '@/lib/slices/authSlice';
import { getErrorMessage } from '@/lib/api/errorUtils';
import { useGetSitesQuery } from '@/lib/api/sitesApi';


const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  background: ${(props) =>
    props.primary ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${(props) => (props.primary ? 'white' : '#667eea')};
  border: ${(props) => (props.primary ? 'none' : '2px solid #667eea')};
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const Hero = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem;
  text-align: center;
  color: white;

  @media (max-width: 768px) {
    padding: 3rem 1rem 1.5rem;
  }
`;

const HeroTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.95;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: ${(props) => (props.active ? 'white' : 'rgba(255, 255, 255, 0.2)')};
  color: ${(props) => (props.active ? '#667eea' : 'white')};
  border: 2px solid ${(props) => (props.active ? 'white' : 'rgba(255, 255, 255, 0.3)')};
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
    color: #667eea;
    border-color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Card = styled.a`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${(props) =>
    props.src
      ? `url(${props.src}) center/cover`
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => (props.src ? 'rgba(0, 0, 0, 0.1)' : 'transparent')};
  }
`;

const CardImagePlaceholder = styled.div`
  font-size: 3rem;
  color: white;
  z-index: 1;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardCategory = styled.span`
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
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #718096;
  line-height: 1.6;
  flex: 1;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: white;
  font-size: 1.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: white;

  h3 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    opacity: 0.9;
  }
`;

const ErrorState = styled.div`
  background: rgba(254, 215, 215, 0.95);
  color: #c53030;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin: 2rem auto;
  max-width: 600px;
`;

const CATEGORIES = ['Technology', 'Design', 'News', 'Education', 'Entertainment', 'Business', 'Health', 'Other'];

export default function Home() {
  // Fetch sites from API; fallback to empty list
  const { data: sitesData, isLoading: sitesLoadingApi, error: sitesErrorApi } = useGetSitesQuery();
  const sites = sitesData?.results || sitesData || [];
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  
  

  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
   
  }, [dispatch]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    // Clear client-side auth only (no server logout)
    dispatch(logoutAction());
    toast.success('Logged out');
    router.push('/');
  };

  const handleDashboard = () => {
    router.push('/admin/dashboard');
  };

  const filteredSites = selectedCategory
    ? sites.filter((site) => site.category === selectedCategory)
    : sites;

  const getCategoryIcon = (category) => {
    const icons = {
      Technology: '💻',
      Design: '🎨',
      News: '📰',
      Education: '📚',
      Entertainment: '🎬',
      Business: '💼',
      Health: '🏥',
      Other: '🔗',
    };
    return icons[category] || '🔗';
  };
const isLoading = sitesLoadingApi;
const error = sitesErrorApi ? getErrorMessage(sitesErrorApi) : null;
  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>Smart Links</Logo>
          <HeaderButtons>
            {isAuthenticated && user?.role === 'admin' && (
              <Button primary onClick={handleDashboard}>
                Dashboard
              </Button>
            )}
            {isAuthenticated ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </HeaderButtons>
        </HeaderContent>
      </Header>

      <Hero>
        <HeroTitle>Discover Amazing Websites</HeroTitle>
        <HeroSubtitle>A curated collection of the web's best resources</HeroSubtitle>
      </Hero>

      <Main>
        <Filters>
          <FilterButton active={selectedCategory === ''} onClick={() => setSelectedCategory('')}>
            All
          </FilterButton>
          {CATEGORIES.map((category) => (
            <FilterButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </Filters>

        {isLoading ? (
          <LoadingState>Loading amazing links...</LoadingState>
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : filteredSites.length === 0 ? (
          <EmptyState>
            <h3>No Links Yet</h3>
            <p>{selectedCategory ? `No links in ${selectedCategory} category yet.` : 'Check back soon for amazing links!'}</p>
          </EmptyState>
        ) : (
          <Grid>
            {filteredSites.map((site) => {
              const cover = site.cover_image || site.coverImage || 'https://via.placeholder.com/800x400?text=No+Image';
              const url = site.siteUrl || site.site_url || '#';
              return (
                <Card key={site.id} href={url} target="_blank" rel="noopener noreferrer">
                  <CardImage src={cover}>
                    {!cover && <CardImagePlaceholder>{getCategoryIcon(site.category)}</CardImagePlaceholder>}
                  </CardImage>
                  <CardContent>
                    <CardCategory>{site.category}</CardCategory>
                    <CardTitle>{site.title || site.name}</CardTitle>
                    <CardDescription>{site.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </Grid>
        )}
      </Main>
    </Container>
  );
}
