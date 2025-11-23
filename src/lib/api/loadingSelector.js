import { baseApi } from './baseApi'

export const selectIsAnyApiLoading = (state) => {
  const apiState = state?.[baseApi.reducerPath]
  if (!apiState) return false

  const { queries = {}, mutations = {} } = apiState

  for (const q of Object.values(queries)) {
    if (q && q.status === 'pending') return true
  }

  for (const m of Object.values(mutations)) {
    if (m && m.status === 'pending') return true
  }

  return false
}

export default selectIsAnyApiLoading
