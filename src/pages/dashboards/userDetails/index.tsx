import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import RefreshIcon from '@mui/icons-material/Refresh'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Typography from '@mui/material/Typography'
import { getCurrentTime } from 'src/@core/utils/helper-functions'

const UserDetails = () => {
  const [refreshKey, setRefreshKey] = useState<any>(new Date())

  const handleRefreshClick = () => {
    setRefreshKey(new Date())
  }

  return (
    <>
      <Box display='flex' flexDirection='column' alignItems='flex-end' justifyContent='flex-end' minHeight='2vh'>
        <Button variant='outlined' onClick={handleRefreshClick} style={{ marginTop: '5px' }}>
          <RefreshIcon style={{ marginRight: '8px' }} />
          Refresh
        </Button>
        <Typography
          variant='caption'
          component='div'
          gutterBottom
          style={{
            borderRadius: '1.2rem',
            marginBottom: '1rem',
            marginTop: '.8rem'
          }}
        >
          {`Last updated at ${getCurrentTime(refreshKey)}`}
        </Typography>
      </Box>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={12}>
            <AnalyticsProject refreshKey={refreshKey?.toLocaleString()} />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </>
  )
}

export default UserDetails
