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
    },
    {
      title: 'Add Projects',
      icon: 'tabler:plus',
      badgeColor: 'error',
      path: '/projects/'
    }

    // Add more items as needed
  ]
}

export default navigation
