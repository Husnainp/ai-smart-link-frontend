'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { Button, Card as UIListingCard, FilterButton } from '@/ui';

import { logout as logoutAction } from '@/lib/slices/authSlice';
import { getErrorMessage } from '@/lib/api/errorUtils';
import { useGetSitesQuery, useGetCategoriesQuery } from '@/lib/api/sitesApi';


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

// Use reusable Button from `src/ui` for consistent styling across the app.

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

// Use reusable `UIListingCard` molecule for listing cards

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

// categories will be loaded from API

export default function Home() {
  // selectedCategoryId holds the category id from API; empty means no filter
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch categories from API
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.results || categoriesData || [];

  // Pass category id as query param when selected
  const sitesQueryParams = selectedCategory ? { category: selectedCategory } : undefined;
  const { data: sitesData, isLoading: sitesLoadingApi, error: sitesErrorApi } = useGetSitesQuery(sitesQueryParams);
  const sites = sitesData?.results || sitesData || [];
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  
  

  useEffect(() => {
    // placeholder: we might add more init logic later
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

  // sites returned from API will already be filtered when a category id is provided
  const filteredSites = sites;

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
  const getCategoryLabel = (site) => {
    if (!site) return '';
    if (site.categoryName) return site.categoryName;
    // If category is an object
    if (site.category && typeof site.category === 'object') return site.category.name || site.category.title || '';
    // If category is a string, it might be an id — try to resolve from categories
    if (site.category && typeof site.category === 'string') {
      const found = categories.find((c) => (c.id === site.category) || (c._id === site.category) || (c.id === String(site.category)));
      if (found) return found.name || found.title || String(found);
      return site.category;
    }
    return '';
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
          {categories.map((cat) => {
            const id = cat.id || cat._id || cat._t || cat._key;
            const name = cat.name || cat.title || cat.label || cat;
            return (
              <FilterButton
                key={id || name}
                active={selectedCategory === id}
                onClick={() => setSelectedCategory(id)}
              >
                {name}
              </FilterButton>
            );
          })}
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
              const cover = site.cover_image || site.coverImage || null;
              const url = site.siteUrl || site.site_url || '#';
              return (
                <UIListingCard
                  key={site.id || site._id}
                  href={url}
                  cover={cover}
                  icon={getCategoryIcon(getCategoryLabel(site))}
                  category={getCategoryLabel(site)}
                  title={site.title || site.name}
                  description={site.description}
                />
              );
            })}
          </Grid>
        )}
      </Main>
    </Container>
  );
}
