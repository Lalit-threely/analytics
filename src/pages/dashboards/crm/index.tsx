// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Custom Component Imports
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'

const CrmDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12}>
          {/* <AnalyticsProject /> */}
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default CrmDashboard
