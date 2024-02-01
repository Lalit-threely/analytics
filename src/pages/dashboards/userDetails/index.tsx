import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import RefreshIcon from '@mui/icons-material/Refresh'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const UserDetails = () => {
  const [refreshKey, setRefreshKey] = useState(false)

  const handleRefreshClick = () => {
    setRefreshKey(prevValue => !prevValue)
  }

  return (
    <>
      <Box display='flex' flexDirection='row' alignItems='flex-end' justifyContent='flex-end' height='5vh' mb={3}>
        <Button variant='outlined' onClick={handleRefreshClick} style={{ marginTop: '10px' }}>
          <RefreshIcon style={{ marginRight: '8px' }} />
          Refresh
        </Button>
      </Box>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={12}>
            <AnalyticsProject refreshKey={refreshKey} />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </>
  )
}

export default UserDetails
