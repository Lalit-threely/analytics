// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useTheme } from '@mui/material/styles'
import { useState, MouseEvent, useEffect } from 'react'
import format from 'date-fns/format'
import { CircularProgress, Box } from '@mui/material'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useAuth } from 'src/hooks/useAuth'

const AnalyticsRegisteredUsersChart = () => {
  const auth = useAuth()
  const theme = useTheme()

  const [filter, setFilter] = useState<string | null>('Daily')
  const [categories, setCategories] = useState<Array<string>>([])
  const [loading, setLoading] = useState(false)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff']
    },
    grid: {
      padding: { top: -10 },
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      }
    },
    tooltip: {
      custom(data: any) {
        return `<div class='bar-chart'>
              <span>Users: ${data.series[data.seriesIndex][data.dataPointIndex]}</span>
              </div>`
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled },
        formatter: function (val) {
          return val.toFixed(0)
        }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      },
      categories: categories
    }
  }

  const [series, setSeries] = useState([
    {
      data: []
    }
  ])

  useEffect(() => {
    fetchData(filter)
    const intervalId = setInterval(() => {
      fetchData(filter)
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchData = async (filter: any) => {
    setLoading(true)

    try {
      const response = await auth.getNewRegisteredUsers({
        rangeType: filter,
        fromClientId: auth.clientId,
        resultCount: 7,
        verified: true
      })

      if (response.success) {
        let xCategories = []
        const data = response.data

        const sortedData = data.sort(
          (a: { from: string }, b: { from: string }) => new Date(a.from).getTime() - new Date(b.from).getTime()
        )

        if (filter === 'Daily') {
          xCategories = sortedData.map((item: any) => {
            const formattedDate = format(new Date(item.from), 'dd-MM-yyyy')

            return formattedDate
          })
        }
        if (filter === 'Weekly') {
          xCategories = sortedData.map((entry: any) => {
            const fromDate = new Date(entry.from)
            const toDate = new Date(entry.to)
            const formattedRange = `${fromDate.getDate() + ' '}${fromDate.toLocaleDateString('en', {
              month: 'short'
            })}-${toDate.getDate() + ' '}${toDate.toLocaleDateString('en', { month: 'short' })}`

            return formattedRange
          })
        }
        if (filter === 'Monthly') {
          xCategories = sortedData.map((item: any) => {
            const formattedMonth = format(new Date(item.from), 'MMM')

            return formattedMonth
          })
        }

        if (filter === 'Yearly') {
          xCategories = sortedData.map((item: any) => {
            const formattedMonth = format(new Date(item.from), 'yyyy')

            return formattedMonth
          })
        }

        const seriesData = sortedData.map((item: any) => item.count)

        setCategories(xCategories)

        setSeries([
          {
            data: seriesData
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActive = (event: MouseEvent<HTMLElement>, newActive: string | null) => {
    setFilter(newActive)
    fetchData(newActive)
  }

  return (
    <Card>
      <CardHeader
        title='New Registered Users'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <ToggleButtonGroup exclusive value={filter} onChange={handleActive}>
            <ToggleButton value='Daily'>Daily</ToggleButton>
            <ToggleButton value='Weekly'>Weekly</ToggleButton>
            <ToggleButton value='Monthly'>Monthly</ToggleButton>
            <ToggleButton value='Yearly'>Yearly</ToggleButton>
          </ToggleButtonGroup>
        }
      />

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px'
          }}
        >
          <CircularProgress color='success' size={60} />
        </Box>
      ) : (
        <ReactApexcharts type='line' height={400} options={options} series={series} />
      )}
    </Card>
  )
}

export default AnalyticsRegisteredUsersChart
