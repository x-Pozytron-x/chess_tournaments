export type User = {
  user_id: number,
  user_name: string,
  user_email: string,
  user_fullname: string,
  user_role: number
}

export const Role = {
  USER: 0,
  ADMIN: 1,
} as const

export type Role = (typeof Role)[keyof typeof Role]