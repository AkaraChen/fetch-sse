import { IFetchOptions } from './interface'
import { parseServerSentEvent } from './sse'
import { checkOk, getDefaultHeaders } from './utils'

export async function fetchEventData(
  url: string | URL,
  options: IFetchOptions = {},
): Promise<void> {
  const {
    data,
    headers = {},
    onMessage,
    onError,
    onOpen,
    onClose,
    ...rest
  } = options
  const mergedHeaders = {
    ...getDefaultHeaders(data),
    ...headers,
  }
  const body = options.body ?? JSON.stringify(data)
  try {
    const res = await fetch(url, {
      ...rest,
      headers: mergedHeaders,
      body,
    })
    await checkOk(res)
    onOpen?.(res)
    // consumes data
    if (typeof onMessage === 'function' && res.body) {
      await parseServerSentEvent(res.body, event => {
        onMessage(event)
      })
      onClose?.()
    }
  } catch (err) {
    onError?.(err)
  }
}
