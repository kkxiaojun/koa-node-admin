/*
 * Data Type
 */
export interface SsoData {
  access_token?: string
  at_hash?: string
  id_token?: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

export interface SsoResult {
  username?: string
  name?: string
  avatar?: string
  email?: string
  gender?: number
  phone?: number
  access_token?: string
}
