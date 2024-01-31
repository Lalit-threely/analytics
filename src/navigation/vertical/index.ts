// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      icon: 'tabler:smart-home',
      badgeColor: 'error',
      path: '/dashboards/analytics'
    },
    {
      title: 'User Details',
      icon: 'tabler:user',
      badgeColor: 'error',
      path: '/dashboards/userDetails'
    }
    // Add more items as needed
  ]
}

export default navigation
