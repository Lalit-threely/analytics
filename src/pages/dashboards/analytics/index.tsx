// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
import AnalyticsOrderVisits from 'src/views/dashboards/analytics/AnalyticsOrderVisits'
import AnalyticsActiveUsers from 'src/views/dashboards/analytics/AnalyticsActiveUsers'
import AnalyticsDroppedOffUsers from 'src/views/dashboards/analytics/AnlyticsDroppedOffUsers'
import AnalyticsTotalEarning from 'src/views/dashboards/analytics/AnalyticsTotalEarning'
import AnalyticsSourceVisits from 'src/views/dashboards/analytics/AnalyticsSourceVisits'
import AnalyticsEarningReports from 'src/views/dashboards/analytics/AnalyticsEarningReports'
import AnalyticsSupportTracker from 'src/views/dashboards/analytics/AnalyticsSupportTracker'
import AnalyticsSalesByCountries from 'src/views/dashboards/analytics/AnalyticsSalesByCountries'
import AnalyticsMonthlyCampaignState from 'src/views/dashboards/analytics/AnalyticsMonthlyCampaignState'
import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

type userData = { registered_users: number; verified_users: number; non_verified_users: number }
import AnalyticsRegisteredUsersChart from 'src/views/dashboards/analytics/AnalyticsRegisteredUsersChart'

const AnalyticsDashboard = () => {
  const [userData, setUserData] = useState<userData>({})
  const auth = useAuth()

  const fetchData = async () => {
    // setLoading(true)

    try {
      const response = await auth.getRegisteredOrVerifiedCount({
        fromClientId: '5180b8cc-57d7-4472-9916-21ab42e67108'
      })
      console.log('response', response)
      setUserData(response)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          {/* <Grid item xs={12} lg={6}>
            <AnalyticsWebsiteAnalyticsSlider />
          </Grid> */}
          <Grid item xs={12} sm={6} lg={6}>
            <AnalyticsOrderVisits />
          </Grid>
          <Grid item xs={12} sm={6} lg={6}>
            <AnalyticsActiveUsers />
          </Grid>
          <Grid container spacing={4} justifyContent='space-around' style={{ marginTop: 0 }}>
            <Grid item xs={4} sm={4}>
              <CardStatsVertical
                stats={userData?.registered_users}
                avatarColor='info'
                chipColor='default'
                title='Total Registered Users'
                subtitle='Completed registration'
                avatarIcon='tabler:users'
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <CardStatsVertical
                stats={userData?.verified_users}
                chipColor='info'
                avatarColor='info'
                title='Total Verified Users'
                subtitle='Created trial username & verified'
                avatarIcon='tabler:chart-bar'
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <CardStatsVertical
                stats={userData?.non_verified_users}
                chipColor='info'
                avatarColor='error'
                title='Total dropped Off Users'
                subtitle='Dropped before creating username'
                avatarIcon='tabler:chart-bar'
              />
            </Grid>
          </Grid>
          <Grid item xs={12} lg={12}>
            <AnalyticsRegisteredUsersChart />
          </Grid>

          {/* <Grid item xs={12} sm={6} lg={3}>
            <CardStatsWithAreaChart
              stats='97.5k'
              chartColor='success'
              avatarColor='success'
              title='Revenue Generated'
              avatarIcon='tabler:credit-card'
              chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
            />
          </Grid> */}
          {/* <Grid item xs={12} md={6}>
            <AnalyticsEarningReports />
          {/* </Grid> */}
          {/* <Grid item xs={12} md={6}>
            <AnalyticsSupportTracker />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsSalesByCountries />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTotalEarning />
          </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4}>
            <AnalyticsMonthlyCampaignState />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsSourceVisits />
          </Grid> */}
          <Grid item xs={12} lg={12}>
            <AnalyticsProject />
          </Grid>
          <Grid item xs={12} lg={12}>
            <AnalyticsDroppedOffUsers />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
