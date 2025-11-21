'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
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
  cover_image: z.string().url('Invalid image URL').optional().or(z.literal('')),
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

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  &.full-width { grid-column: 1 / -1; }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  /* Darker input text for accessibility */
  color: #1a202c;

  &::placeholder { color: #9ca3af; }

  &:focus { outline: none; border-color: #667eea; }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #1a202c;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  color: #1a202c;

  &::placeholder { color: #9ca3af; }

  &:focus { outline: none; border-color: #667eea; }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.secondary ? '#718096' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const AIButton = styled(Button)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  grid-column: 1 / -1;
  @media (max-width: 768px) { flex-direction: column; }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #e2e8f0;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
`;

// Add the rest of your styled components (Table, Filters, etc.) here...

const ErrorMessage = styled.div`
  color: #c53030;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

// Table styles
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(2,6,23,0.06);
`;

const Thead = styled.thead`
  background: linear-gradient(90deg, #f7fafc 0%, #fff 100%);
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 700;
  color: #4a5568;
  font-size: 0.9rem;
  border-bottom: 1px solid #edf2f7;
`;

const Tbody = styled.tbody`
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #fcfdff;
  }
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  vertical-align: middle;
  color: #2d3748;
  font-size: 0.95rem;
  border-bottom: 1px solid #f1f5f9;
  a { color: #667eea; text-decoration: none; }
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.6rem;
  margin-left: 0.5rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  color: white;
  background: #667eea;
  &:hover { filter: brightness(0.95); }
  &.danger { background: #e53e3e; }
  &.muted { background: #718096; }
  &.ai { background: linear-gradient(90deg,#f093fb 0%,#f5576c 100%); }
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  background: rgba(102,126,234,0.08);
  color: #4c51bf;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8rem;
`;

// Confirm modal styles reuse Modal/ModalContent but add specific layout
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

  // RTK Query hooks
  const {
    data: sites = [],
    isLoading: sitesLoading,
    error: sitesError,
    refetch
  } = useGetSitesQuery();

  const sitesList = sites?.results || sites || [];

  const { data: categories = [] } = useGetCategoriesQuery();

  const [createSite, { isLoading: creating }] = useCreateSiteMutation();
  const [updateSite, { isLoading: updating }] = useUpdateSiteMutation();
  const [deleteSite, { isLoading: deleting }] = useDeleteSiteMutation();
  const [generateDescription, { isLoading: aiLoading }] = useGenerateDescriptionMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(siteSchema)
  });

  const defaultCategories = ['Technology', 'Design', 'News', 'Education', 'Entertainment', 'Business', 'Health', 'Other'];
  const CATEGORIES = categories.length > 0 ? categories : defaultCategories;

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateSite({ id: editingId, data }).unwrap();
      } else {
        await createSite(data).unwrap();
      }
      closeModal();
    } catch (err) {
      const message = getErrorMessage(err?.data || err || null);
      toast.error(message);
      console.error('Save error:', err);
    }
  };

  const handleEdit = (site) => {
    setEditingId(site._id);
    reset({
      site_url: site.site_url || site.site_url,
      title: site.title || site.name,
      cover_image: site.cover_image || site.coverImage || '',
      description: site.description,
      category: site.category,
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

  const filteredSites = sitesList.filter(site => {
    const matchesSearch = (site.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (site.site_url || site.site_url || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || site.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
                <Label>Cover Image URL (optional)</Label>
                <Input type="url" placeholder="https://example.com/img.jpg" {...register('cover_image')} />
                {errors.cover_image && <ErrorMessage>{errors.cover_image.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Category *</Label>
                <Select {...register('category')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
                <AIButton type="button" onClick={handleAIGenerate}>
                  Ask AI for Description
                </AIButton>
                <Button type="submit" disabled={isSubmitting || creating || updating}>
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

          {/* Filters, Table, etc. - add your full table code here */}

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
                    <Tr key={site.id}>
                      <Td>
                        <div style={{ fontWeight: 700 }}>{site.title || site.name}</div>
                        <div style={{ color: '#718096', fontSize: '0.85rem' }}>{site.description?.slice(0, 120) || ''}</div>
                      </Td>
                      <Td>
                        <Tag>{site.category}</Tag>
                      </Td>
                      <Td>
                        <a href={site.site_url || site.site_url} target="_blank" rel="noreferrer">{site.site_url || site.site_url}</a>
                      </Td>
                      <Td style={{ textAlign: 'center' }}>
                        <ActionButton onClick={() => handleEdit(site)}>Edit</ActionButton>

                        <ActionButton className="danger" onClick={() => openConfirmDelete(site)}>Delete</ActionButton>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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