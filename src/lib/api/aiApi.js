import { baseApi } from './baseApi'

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateDescription: builder.mutation({
      query: (data) => ({ url: '/ai/generate-description', method: 'POST', body: data }),
    }),
    getAiStatus: builder.query({
      query: () => ({ url: '/ai/status' }),
    }),
  }),
  overrideExisting: false,
})

export const { useGenerateDescriptionMutation, useGetAiStatusQuery } = aiApi
