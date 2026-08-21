export type RoleItem = {
  role_id: number
  role_name: string
  description: string | null
}

export type User = {
  user_id: number,
  user_name: string,
  user_email: string,
  user_fullname: string | null,
  user_avatar: string | null,
  user_rating: number,
  user_telegram: string | null,
  user_chesscom: string | null,
  user_lichess: string | null,
  user_role: number,
  is_active: number,
  created_at: string,
  roles: RoleItem[],
  permissions: string[],
  user_tournaments_count: number,
  user_tournaments_wins: number,
}

export const Role = {
  USER: 0,
  ADMIN: 1,
} as const

export type Role = (typeof Role)[keyof typeof Role]
