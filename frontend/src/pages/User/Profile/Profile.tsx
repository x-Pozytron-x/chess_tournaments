import { useParams } from 'react-router-dom'
import { ProfileCurrent } from './ProfileCurrent'
import { ProfileOther } from './ProfileOther'
import './Profile.css'

export const Profile = () => {
  const { user_name } = useParams<{ user_name: string }>()

  // If user_name is provided in URL params, show ProfileOther
  // Otherwise, show ProfileCurrent for the current user
  if (user_name) {
    return <ProfileOther />
  } else {
    return <ProfileCurrent />
  }
}