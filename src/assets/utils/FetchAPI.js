import { baseUrl } from '../../../conf'

export async function FetchAPI(url, token) {
  const res = await fetch(baseUrl + url, {
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  if (res.status != 200) {
    console.error(data)
  } else {
    return data
  }
}
