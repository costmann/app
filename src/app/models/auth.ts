export interface LoginResponse {
  token: string
  passwordExpirationDays: number | null
}
