export function getErrorMessage(error) {
  if (!error) return 'An unknown error occurred.'

  // If error is a string
  if (typeof error === 'string') return error

  // RTK Query error shapes vary. Try to extract common fields.
  // If error contains data
  if (error.data) {
    const d = error.data
    if (typeof d === 'string') return d
    if (d.message) return d.message
    if (d.error) return d.error
    // some APIs return { errors: [...] }
    if (d.errors) {
      try {
        return Array.isArray(d.errors) ? d.errors.join(', ') : JSON.stringify(d.errors)
      } catch (e) {
        // fallthrough
      }
    }
  }

  // Fallbacks
  if (error.error) return error.error
  if (error.message) return error.message

  return 'An error occurred while contacting the server.'
}
