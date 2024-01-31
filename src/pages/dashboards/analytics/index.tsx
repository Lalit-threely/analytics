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
import { ChangeEvent, useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

type userData = { registered_users: number; verified_users: number; non_verified_users: number }
import AnalyticsRegisteredUsersChart from 'src/views/dashboards/analytics/AnalyticsRegisteredUsersChart'
import ApexSocialChart from 'src/views/charts/apex-charts/ApexSocialChart'
import ApexWalletChart from 'src/views/charts/apex-charts/ApexWalletChart'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import ApexSocialVsCognito from 'src/views/charts/apex-charts/ApexSocialVsCognito'
import Typography from '@mui/material/Typography';

const AnalyticsDashboard = () => {
  const [userData, setUserData] = useState<userData>()
  const [chartData, setChartData] = useState()
  const [cid, setCid] = useState<string>('')
  const auth = useAuth()

  const fetchData = async () => {
    // setLoading(true)

    try {
      const response = await auth.getRegisteredOrVerifiedCount({
        fromClientId: auth.clientId
      })
      console.log('response', response)
      setUserData(response)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchChartData = async () => {
    // setLoading(true)

    try {
      const response = await auth.getGroupedDataOfCharts({
        fromClientId: auth.clientId,
        verified: true
      })
      console.log('response charts', response)
      setChartData(response)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchChartData()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCid(e.target.value)
  }

  return (
    <>
      {/* <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="30vh" // Adjust the height to your preference
    >
      <TextField
        value={cid}
        label='Enter client id'
        variant='outlined'
        onChange={handleChange}
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={() => auth.setClientId(cid)}
        style={{ marginTop: '10px' }} // Adjust margin as needed
      >
        Submit
      </Button>
    </Box> */}
      <ApexChartWrapper>
      <Typography
      variant="h2"
      component="div"
      gutterBottom
      style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgb(104 94 213)', color: '#fff',borderRadius:'20px',marginBottom:"20px" }}
    >
      User Analytics
    </Typography>
        <KeenSliderWrapper>
          <Grid container spacing={6}>
            {/* <Grid item xs={12} lg={6}>
            <AnalyticsWebsiteAnalyticsSlider />
          </Grid> */}

            {/* <Grid item xs={12} sm={6} lg={6}>
              <AnalyticsActiveUsers />
            </Grid> */}
            <Grid container spacing={6} justifyContent='center' style={{ marginTop: 0, marginLeft: 0 }}>
              {/* <Grid item xs={6} sm={3} lg={3.5}>
                <CardStatsVertical
                  stats={userData?.registered_users.toString() || ''}
                  avatarColor='info'
                  chipColor='default'
                  title='Total Registered Users'
                  subtitle='Total count of users who have registered'
                  avatarIcon='tabler:users'
                />
              </Grid> */}
              <Grid item xs={12} sm={6} lg={6}>
                <CardStatsVertical
                  stats={userData?.verified_users.toString() || '-'}
                  chipColor='info'
                  avatarColor='info'
                  title='Total Registered Users'
                  // subtitle='Total count of users who have registered'
                  avatarIcon='tabler:chart-bar'
                />
              </Grid>

              {/* <Grid item xs={6} sm={3} lg={3.5}>
                <CardStatsVertical
                  stats={userData?.non_verified_users.toString() || ''}
                  chipColor='info'
                  avatarColor='error'
                  title='Total dropped Off Users'
                  // subtitle='Dropped before creating username'
                  avatarIcon='tabler:chart-bar'
                />
              </Grid> */}
              <Grid item xs={12} sm={6} lg={6}>
                <AnalyticsOrderVisits />
              </Grid>
            </Grid>

            <Grid item xs={12} lg={12}>
              <AnalyticsRegisteredUsersChart />
            </Grid>

            {chartData && (
              <>
                <Grid item xs={12} md={6}>
                  <ApexSocialVsCognito cognitoVsSocialCount={(chartData as any)?.cognitoVsSocialCount} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ApexSocialChart socialMethodCounts={(chartData as any)?.socialMethodCounts} />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <ApexWalletChart walletMethodCounts={(chartData as any)?.walletMethodCounts} />
                </Grid> */}
              </>
            )}

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
            {/* <Grid item xs={12} lg={12}>
              <AnalyticsProject />
            </Grid> */}
            {/* <Grid item xs={12} lg={12}>
              <AnalyticsDroppedOffUsers />
            </Grid> */}
          </Grid>
        </KeenSliderWrapper>
      </ApexChartWrapper>
    </>
  )
}

export default AnalyticsDashboard
