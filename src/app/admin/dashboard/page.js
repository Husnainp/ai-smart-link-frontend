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

// Zod schema (works in JS!)
const siteSchema = z.object({
  site_url: z.string().url('Must be a valid URL').min(1, 'URL is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  // allow either an existing URL (string) or a File/FileList when uploading
  cover_image: z.any().optional(),
  description: z.string().min(10, 'Description too short').max(500),
  category: z.string().min(1, 'Please select a category'),
});

// Styled Components (same as yours - keeping all)
const Container = styled.div`
  min-height: 100vh;
  background: #f7fafc;
`;

// ... (Keep ALL your existing styled components exactly as they were)
// I'm including only the essential ones for brevity, but copy-paste your full list

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #c53030; }
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
`;

// Reusable UI primitives (imported from `src/ui`)
// `Form`, `FormGroup`, `ButtonGroup`, `Label`, `Input`, `Select`, `Textarea`, `Modal`,
// `ModalContent`, `CloseButton`, `Table`, `Thead`, `Th`, `Tbody`, `Tr`, `Td`, `ActionButton`, `Tag`, `Pagination`.

// Keep a couple of small page-specific utilities here.
const ErrorMessage = styled.div`
  color: #c53030;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

// Confirm modal styles reused for layout
const ConfirmBody = styled.div`
  padding: 1rem 0;
  color: #2d3748;
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  // const { user, isAuthenticated } = useSelector(state => state.auth);

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

  // RTK Query hooks
  // request sites from server; include q (search), category, pagination and sort
  // debounce searchQuery to avoid firing API on every keystroke
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
  // Normalize categories into { id, name } objects so select values are consistent
  const CATEGORIES = (categories && categories.length > 0)
    ? categories.map((c) => ({ id: c.id || c._id || c._key || String(c.id || c._id || c._key), name: c.name || c.title || c.label || String(c) }))
    : defaultCategories.map((n) => ({ id: n, name: n }));

  const onSubmit = async (data) => {
    try {
      // handle cover image upload if a File was provided
      let coverValue = data.cover_image;
      // react-hook-form returns FileList for file inputs
      if (data.cover_image && data.cover_image instanceof FileList && data.cover_image.length > 0) {
        const file = data.cover_image[0];
        const uploaded = await s3Uploader(file, setCoverUploading);
        if (!uploaded || uploaded instanceof Error) {
          toast.error('Image upload failed');
          return;
        }
        coverValue = uploaded;
      }

      // ensure category is passed as id (string)
      const payload = { ...data, category: String(data.category), cover_image: coverValue };
      if (editingId) {
        await updateSite({ id: editingId, data: payload }).unwrap();
      } else {
        await createSite(payload).unwrap();
      }

      // Reset filters/pagination so the newly created/updated site is visible
      try {
        setSearchQuery('');
        setCategoryFilter('');
        setPage(1);
      } catch (e) {
        // ignore if state setters aren't available in some contexts
      }

      // Force refetch to ensure UI shows latest data
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
    // resolve category id from site (could be object, id or name)
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

  const handleDelete = async (id) => {
    // Open confirmation modal instead of immediately deleting
    setConfirmTarget({ id, title: null });
    setConfirmOpen(true);
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

  // Confirm modal handlers
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
      // Try calling delete with id param first; fall back to object shape if necessary
      try {
        await deleteSite(confirmTarget.id).unwrap();
      } catch (firstErr) {
        console.warn('First delete attempt failed, retrying with object payload', firstErr);
        await deleteSite({ id: confirmTarget.id }).unwrap();
      }
      toast.success('Link deleted');
      setConfirmOpen(false);
      setConfirmTarget({ id: null, title: null });
      // refetch the sites list to ensure UI updates
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
        // tolerant extraction of generated text
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
    // normalize id if category is an object
    const isObject = typeof category === 'object';
    const id = isObject ? (category.id || category._id || category._key || '') : String(category);
    // try to find by id or by name
    const found = CATEGORIES.find(c => String(c.id) === id || c.name === category || c.id === category);
    if (found) return found.name;
    // fallback to provided object's name if available
    if (isObject) return category.name || category.title || '';
    return String(category || '');
  };

  const filteredSites = sitesList.filter(site => {
    const matchesSearch = (site.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (site.site_url || site.site_url || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // if (!isAuthenticated) {
  //   router.push('/login');
  //   return null;
  // }

  return (
    <Container>
      <Header>
        <Logo>Smart Link Admin</Logo>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, { 'Admin'}</span>
          <LogoutButton onClick={() => { dispatch(logoutAction()); router.push('/login'); }}>
            Logout
          </LogoutButton>
        </div>
      </Header>

      {/* Modal Form */}
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
                {/* Preview: show selected file preview or existing URL preview */}
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

          <Button onClick={handleAddNew} style={{ marginBottom: '1.5rem' }}>
            + Add New Link
          </Button>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 700, color: '#4a5568' }}>Search Title:</label>
              <Input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                style={{ minWidth: 260 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 700, color: '#4a5568' }}>Category:</label>
              <Select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>
          </div>

          {sitesLoading ? (
            <p>Loading links...</p>
          ) : filteredSites.length === 0 ? (
            <p>No links found.</p>
          ) : (
            <div>
              {/* Your Table component here with filteredSites.map(...) */}
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
              {/* Pagination controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div style={{ color: '#4a5568' }}>
                  Showing page {pagination.page} of {pagination.totalPages} — {pagination.total} total
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button type="button" secondary disabled={pagination.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Prev
                  </Button>
                  <Button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Section>
      </Main>
      {/* Confirm Delete Modal */}
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