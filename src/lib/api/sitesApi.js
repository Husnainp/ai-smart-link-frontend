import { baseApi } from './baseApi'

export const sitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSites: builder.query({
      query: (params) => ({ url: '/sites', params }),
      providesTags: ['Site'],
    }),
    getPublicSites: builder.query({
      query: (params) => ({ url: '/sites/public', params }),
      providesTags: ['Site'],
    }),
    getSite: builder.query({
      query: (id) => ({ url: `/sites/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Site', id }],
    }),
    createSite: builder.mutation({
      query: (siteData) => ({ url: '/sites', method: 'POST', body: siteData }),
      invalidatesTags: ['Site'],
    }),
    updateSite: builder.mutation({
      query: ({ id, data }) => ({ url: `/sites/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Site', id }, 'Site'],
    }),
    deleteSite: builder.mutation({
      query: (arg) => {
        const id = arg && typeof arg === 'object' ? arg.id : arg
        return { url: `/sites/${id}`, method: 'DELETE' }
      },
      invalidatesTags: ['Site'],
    }),
    getCategories: builder.query({
      query: () => ({ url: '/sites/categories' }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSitesQuery,
  useGetPublicSitesQuery,
  useGetSiteQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
  useGetCategoriesQuery,
} = sitesApi
