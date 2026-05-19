import { apiFetch } from './apiFetch'
import type { DashboardData } from '../types/dashboard'

export async function getDashboard(): Promise<DashboardData> {
  return apiFetch<DashboardData>('/api/admin/dashboard')
}