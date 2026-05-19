import { useState, useEffect } from 'react'
import { getDashboard } from '../api/dashboard'
import type { DashboardData } from '../types/dashboard'

export const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboard()
        setDashboard(data)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [])
  console.log(dashboard)

  return (
    <h2>lol  </h2>
  )

}