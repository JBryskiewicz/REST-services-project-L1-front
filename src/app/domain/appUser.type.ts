export interface AppUser {
  id?: number,
  email: string,
  username: string,
  password: string,
  role?: 'ROLE_USER',
}
