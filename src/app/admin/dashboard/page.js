'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import {
  Button,
  Input,
  Label,
  Select,
  Textarea as TextArea,
  Form,
  FormGroup,
  ButtonGroup,
  Modal,
  ModalContent,
  CloseButton,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  ActionButton,
  Tag,
  Pagination,
} from '@/ui';
import { s3Uploader } from '@/app/moduls/s3Uploader';
import toast from 'react-hot-toast';

import {
  useGetSitesQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
  useGetCategoriesQuery,
} from '@/lib/api/sitesApi';
import { useGenerateDescriptionMutation } from '@/lib/api/aiApi';
import { getErrorMessage } from '@/lib/api/errorUtils';
import { logout as logoutAction } from '@/lib/slices/authSlice';

// Zod schema
const siteSchema = z.object({
  site_url: z.string().url('Must be a valid URL').min(1, 'URL is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  cover_image: z.any().optional(),
  description: z.string().min(10, 'Description too short').max(500),
  category: z.string().min(1, 'Please select a category'),
});

// Responsive Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #f7fafc;
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    gap: 1rem;
    font-size: 1rem;
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  white-space: nowrap;

  &:hover { 
    background: #c53030; 
  }

  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 2rem;
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: #c53030;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ConfirmBody = styled.div`
  padding: 1rem 0;
  color: #2d3748;
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

// Responsive filters container
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }

  label {
    font-weight: 700;
    color: #4a5568;
    white-space: nowrap;
  }

  input, select {
    width: 100%;
    min-width: 0;

    @media (min-width: 768px) {
      min-width: 200px;
    }
  }
`;

// Responsive pagination
const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const PaginationInfo = styled.div`
  color: #4a5568;
  font-size: 0.875rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1rem;
    text-align: left;
  }
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

// Responsive table wrapper with horizontal scroll
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;

  /* Hide scrollbar for cleaner look on mobile */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f7fafc;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }
`;

// Card layout for mobile (alternative to table)
const CardGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    display: none; /* Hide cards on desktop, show table instead */
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.div`
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const CardDescription = styled.div`
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  align-items: center;
`;

const CardUrl = styled.a`
  color: #667eea;
  font-size: 0.875rem;
  text-decoration: none;
  word-break: break-all;
  display: block;
  margin-bottom: 0.75rem;

  &:hover {
    text-decoration: underline;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// Desktop table (hidden on mobile)
const DesktopTableWrapper = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ id: null, title: null });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState('-created_at');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const sitesQueryParams = (() => {
    const p = {};
    if (debouncedSearch) p.q = debouncedSearch;
    if (categoryFilter) p.category = categoryFilter;
    if (page) p.page = page;
    if (limit) p.limit = limit;
    if (sort) p.sort = sort;
    return Object.keys(p).length ? p : undefined;
  })();

  const {
    data: sites = [],
    isLoading: sitesLoading,
    error: sitesError,
    refetch
  } = useGetSitesQuery(sitesQueryParams);

  const sitesList = sites?.results || sites || [];
  const pagination = {
    page: sites?.page || page,
    limit: sites?.limit || limit,
    total: sites?.total || 0,
    totalPages: sites?.totalPages || 1,
  };

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.results || categoriesData || [];

  const [createSite, { isLoading: creating }] = useCreateSiteMutation();
  const [updateSite, { isLoading: updating }] = useUpdateSiteMutation();
  const [deleteSite, { isLoading: deleting }] = useDeleteSiteMutation();
  const [generateDescription, { isLoading: aiLoading }] = useGenerateDescriptionMutation();

  const [coverUploading, setCoverUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(siteSchema)
  });

  const watchedCover = watch('cover_image');

  const defaultCategories = ['Technology', 'Design', 'News', 'Education', 'Entertainment', 'Business', 'Health', 'Other'];
  const CATEGORIES = (categories && categories.length > 0)
    ? categories.map((c) => ({ id: c.id || c._id || c._key || String(c.id || c._id || c._key), name: c.name || c.title || c.label || String(c) }))
    : defaultCategories.map((n) => ({ id: n, name: n }));

  const onSubmit = async (data) => {
    try {
      let coverValue = data.cover_image;
      if (data.cover_image && data.cover_image instanceof FileList && data.cover_image.length > 0) {
        const file = data.cover_image[0];
        const uploaded = await s3Uploader(file, setCoverUploading);
        if (!uploaded || uploaded instanceof Error) {
          toast.error('Image upload failed');
          return;
        }
        coverValue = uploaded;
      }

      const payload = { ...data, category: String(data.category), cover_image: coverValue };
      if (editingId) {
        await updateSite({ id: editingId, data: payload }).unwrap();
      } else {
        await createSite(payload).unwrap();
      }

      try {
        setSearchQuery('');
        setCategoryFilter('');
        setPage(1);
      } catch (e) {}

      if (typeof refetch === 'function') refetch();
      closeModal();
    } catch (err) {
      const message = getErrorMessage(err?.data || err || null);
      toast.error(message);
      console.error('Save error:', err);
    }
  };

  const handleEdit = (site) => {
    setEditingId(site._id);
    let categoryId = '';
    if (site.category) {
      if (typeof site.category === 'object') {
        categoryId = site.category.id || site.category._id || site.category._key || '';
      } else {
        categoryId = String(site.category);
      }
    }
    reset({
      site_url: site.site_url || site.site_url,
      title: site.title || site.name,
      cover_image: site.cover_image || site.coverImage || '',
      description: site.description,
      category: categoryId,
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    reset({
      site_url: '',
      title: '',
      cover_image: '',
      description: '',
      category: '',
    });
    setShowForm(true);
  };

  const openConfirmDelete = (site) => {
    setConfirmTarget({ id: site._id, title: site.title || site.name || '' });
    setConfirmOpen(true);
  };

  const cancelConfirm = () => {
    setConfirmOpen(false);
    setConfirmTarget({ id: null, title: null });
  };

  const confirmDelete = async () => {
    if (!confirmTarget.id) return;
    setConfirmLoading(true);
    try {
      try {
        await deleteSite(confirmTarget.id).unwrap();
      } catch (firstErr) {
        console.warn('First delete attempt failed, retrying with object payload', firstErr);
        await deleteSite({ id: confirmTarget.id }).unwrap();
      }
      toast.success('Link deleted');
      setConfirmOpen(false);
      setConfirmTarget({ id: null, title: null });
      if (typeof refetch === 'function') refetch();
    } catch (err) {
      const message = getErrorMessage(err?.data || err || null);
      toast.error(message);
      console.error('Delete error:', err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  const handleAIGenerate = () => {
    const title = getValues('title');
    const category = getValues('category');
    const site_url = getValues('site_url');
    if (!title || !category) {
      toast.error('Please fill in Title and Category first!');
      return;
    }

    (async () => {
      try {
        const res = await generateDescription({ title, category, site_url }).unwrap();
        const generated = res?.data?.description || res?.description || res?.generatedDescription || res || '';
        if (generated) {
          setValue('description', generated);
          toast.success('AI generated description applied');
        } else {
          toast('AI returned no description');
        }
      } catch (err) {
        const message = getErrorMessage(err?.data || err || null);
        toast.error(message);
        console.error('AI error:', err);
      }
    })();
  };

  const getCategoryLabel = (category) => {
    if (!category) return '';
    const isObject = typeof category === 'object';
    const id = isObject ? (category.id || category._id || category._key || '') : String(category);
    const found = CATEGORIES.find(c => String(c.id) === id || c.name === category || c.id === category);
    if (found) return found.name;
    if (isObject) return category.name || category.title || '';
    return String(category || '');
  };

  const filteredSites = sitesList.filter(site => {
    const matchesSearch = (site.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (site.site_url || site.site_url || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Container>
      <Header>
        <Logo>Smart Link Admin</Logo>
        <HeaderRight>
          <span>Welcome, Admin</span>
          <LogoutButton onClick={() => { dispatch(logoutAction()); router.push('/login'); }}>
            Logout
          </LogoutButton>
        </HeaderRight>
      </Header>

      {showForm && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <SectionTitle>{editingId ? 'Edit Link' : 'Add New Link'}</SectionTitle>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label>Website URL *</Label>
                <Input type="url" placeholder="https://example.com" {...register('site_url')} />
                {errors.site_url && <ErrorMessage>{errors.site_url.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Title *</Label>
                <Input type="text" placeholder="Google Search" {...register('title')} />
                {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Cover Image (optional)</Label>
                <Input type="file" accept="image/*" {...register('cover_image')} />
                {errors.cover_image && <ErrorMessage>{errors.cover_image.message}</ErrorMessage>}
                {watchedCover && (typeof watchedCover === 'string' ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={watchedCover} alt="cover" style={{ maxWidth: 240, borderRadius: 8 }} />
                  </div>
                ) : (watchedCover instanceof FileList && watchedCover.length > 0) ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={URL.createObjectURL(watchedCover[0])} alt="preview" style={{ maxWidth: 240, borderRadius: 8 }} />
                  </div>
                ) : null)}
              </FormGroup>

              <FormGroup>
                <Label>Category *</Label>
                <Select {...register('category')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Select>
                {errors.category && <ErrorMessage>{errors.category.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Description *</Label>
                <TextArea placeholder="Describe this website..." {...register('description')} />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="ai" onClick={handleAIGenerate}>
                  Ask AI for Description
                </Button>
                <Button type="submit" disabled={isSubmitting || creating || updating || coverUploading}>
                  {editingId ? 'Update' : 'Add'} Link
                </Button>
                <Button type="button" secondary onClick={closeModal}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      <Main>
        <Section>
          <SectionTitle>Manage Links ({sitesList.length})</SectionTitle>

          <Button onClick={handleAddNew} style={{ marginBottom: '1.5rem', width: '100%' }}>
            + Add New Link
          </Button>

          <FiltersContainer>
            <FilterGroup>
              <label>Search:</label>
              <Input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </FilterGroup>

            <FilterGroup>
              <label>Category:</label>
              <Select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </FilterGroup>
          </FiltersContainer>

          {sitesLoading ? (
            <p>Loading links...</p>
          ) : filteredSites.length === 0 ? (
            <p>No links found.</p>
          ) : (
            <>
              {/* Mobile Card View */}
              <CardGrid>
                {filteredSites.map(site => (
                  <Card key={site._id || site.id}>
                    <CardTitle>{site.title || site.name}</CardTitle>
                    <CardDescription>
                      {site.description?.slice(0, 120) || ''}
                    </CardDescription>
                    <CardMeta>
                      <Tag>{getCategoryLabel(site.category)}</Tag>
                    </CardMeta>
                    <CardUrl href={site.site_url || site.site_url} target="_blank" rel="noreferrer">
                      {site.site_url || site.site_url}
                    </CardUrl>
                    <CardActions>
                      <ActionButton onClick={() => handleEdit(site)}>Edit</ActionButton>
                      <ActionButton danger onClick={() => openConfirmDelete(site)}>Delete</ActionButton>
                    </CardActions>
                  </Card>
                ))}
              </CardGrid>

              {/* Desktop Table View */}
              <DesktopTableWrapper>
                <TableWrapper>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Title</Th>
                        <Th>Category</Th>
                        <Th>URL</Th>
                        <Th style={{ width: '220px', textAlign: 'center' }}>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredSites.map(site => (
                        <Tr key={site._id || site.id}>
                          <Td>
                            <div style={{ fontWeight: 700 }}>{site.title || site.name}</div>
                            <div style={{ color: '#718096', fontSize: '0.85rem' }}>{site.description?.slice(0, 120) || ''}</div>
                          </Td>
                          <Td>
                            <Tag>{getCategoryLabel(site.category)}</Tag>
                          </Td>
                          <Td>
                            <a href={site.site_url || site.site_url} target="_blank" rel="noreferrer">{site.site_url || site.site_url}</a>
                          </Td>
                          <Td style={{ textAlign: 'center' }}>
                            <ActionButton onClick={() => handleEdit(site)}>Edit</ActionButton>
                            <ActionButton danger onClick={() => openConfirmDelete(site)}>Delete</ActionButton>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableWrapper>
              </DesktopTableWrapper>

              {/* Pagination */}
              <PaginationContainer>
                <PaginationInfo>
                  Page {pagination.page} of {pagination.totalPages} — {pagination.total} total
                </PaginationInfo>
                <PaginationButtons>
                  <Button type="button" secondary disabled={pagination.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Prev
                  </Button>
                  <Button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}>
                    Next
                  </Button>
                </PaginationButtons>
              </PaginationContainer>
            </>
          )}
        </Section>
      </Main>

      {confirmOpen && (
        <Modal onClick={cancelConfirm}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={cancelConfirm}>×</CloseButton>
            <SectionTitle>Confirm Deletion</SectionTitle>
            <ConfirmBody>
              Are you sure you want to permanently delete "{confirmTarget.title}"? This action cannot be undone.
            </ConfirmBody>
            <ConfirmActions>
              <Button type="button" secondary onClick={cancelConfirm} disabled={confirmLoading}>
                Cancel
              </Button>
              <Button type="button" onClick={confirmDelete} disabled={confirmLoading}>
                {confirmLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </ConfirmActions>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}