export const validFor = (expiresAt: number) => Math.ceil(expiresAt - new Date().getTime())

let accessToken: string | undefined

export const getAccessToken = () => accessToken

export const setAccessToken = (token?: string) => {
  accessToken = token
}
