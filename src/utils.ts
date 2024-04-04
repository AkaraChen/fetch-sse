export const checkOk = async (response: Response): Promise<void> => {
  if (!response.ok) {
    const defaultMessage = `Error ${response.status}: ${response.statusText}`
    let message = ''
    if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        const errorData = await response.json()
        message = errorData.message || errorData.error || defaultMessage
      } catch (error) {
        throw new Error('Failed to parse error response as JSON')
      }
    } else {
      try {
        const textData = await response.text()
        message = textData || defaultMessage
      } catch (error) {
        throw new Error('Failed to parse error response as text')
      }
    }

    throw new Error(message)
  }
}

export const getContentType = (
  body?: BodyInit | null | Record<string, any>,
) => {
  if (typeof body === 'string') return 'text/plain'
  if (body instanceof ArrayBuffer) return 'application/octet-stream'
  if (body instanceof Blob) return body.type
  if (body instanceof FormData) return 'multipart/form-data'
  if (body instanceof URLSearchParams)
    return 'application/x-www-form-urlencoded'
  if (body instanceof ReadableStream) return 'text/event-stream'
  if (!body) return undefined
  return 'application/json'
}

export const getDefaultHeaders = (
  body?: BodyInit | null | Record<string, any>,
): HeadersInit => {
  const contentType = getContentType(body)
  const headers: HeadersInit = {
    Accept: 'application/json',
  }
  if (contentType) {
    headers['Content-Type'] = contentType
  }
  return headers
}
