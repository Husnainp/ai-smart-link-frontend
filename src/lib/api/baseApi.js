import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from '../config'

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('content-type', 'application/json')
    return headers
  },
})

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: ['User', 'Site', 'Country', 'Specialty', 'Package', 'Interview'],
  endpoints: () => ({}),
})
