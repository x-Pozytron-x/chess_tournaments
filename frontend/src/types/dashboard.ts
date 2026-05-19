export interface DashboardUser {
  user_id: number
  user_name: string
}

export interface DashboardNews {
  news_id: number
  news_title: string
  created_at: string
}

export interface DashboardTournament {
  tournament_id: number
  tournament_name: string
}

export interface DashboardData {
  usersCount: number
  latestUsers: DashboardUser[]
  latestNews: DashboardNews[]
  activeTournaments: DashboardTournament[]
}