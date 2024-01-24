// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { useState, MouseEvent, useEffect } from 'react'
import format from 'date-fns/format'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { CircularProgress } from '@mui/material'

const AnalyticsRegisteredUsersChart = () => {
  const auth = useAuth()

  const [filter, setFilter] = useState<string | null>('Daily')
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<ApexOptions>({
    // ... (other options)
    xaxis: {
      // ... (other xaxis options)
      categories: []
    }
  })
  const [series, setSeries] = useState([
    {
      data: []
    }
  ])

  useEffect(() => {
    fetchData(filter)
  }, [])

  const fetchData = async (filter: any) => {
    setLoading(true)

    try {
      const response = await auth.getNewRegisteredUsers({
        rangeType: filter,
        fromClientId: '5180b8cc-57d7-4472-9916-21ab42e67108',
        resultCount: 10
      })

      console.log(response, 'dsssssss')

      if (response.success) {
        let xCategories = []
        const data = response.data

        // Extracting 'from' values for x-axis categories
        data.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime())

        if (filter === 'Daily') {
          xCategories = data.map(item => {
            const formattedDate = format(new Date(item.from), 'dd-MM-yyyy')

            return formattedDate
          })
        }
        if (filter === 'Monthly') {
          xCategories = data.map(item => {
            const formattedMonth = format(new Date(item.from), 'MMM')

            return formattedMonth
          })
        }

        if (filter === 'Yearly') {
          console.log('dkjdkdkdkdkdk')
          xCategories = data.map(item => {
            const formattedMonth = format(new Date(item.from), 'yyyy')

            return formattedMonth
          })
        }

        // Extracting 'count' values for series data
        const seriesData = data.map(item => item.count)

        // Update the xaxis categories and series
        setOptions(prevOptions => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: xCategories
          },
          tooltip: {
            custom(data: any) {
              return `<div class='bar-chart'>
              <span>Users: ${data.series[data.seriesIndex][data.dataPointIndex]}</span>
              </div>`
            }
          },
          yaxis: [
            {
              labels: {
                formatter: function (val) {
                  return val.toFixed(0)
                }
              }
            }
          ],
          title: {
            text: 'Users'
          }
        }))

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
            <ToggleButton value='Monthly'>Monthly</ToggleButton>
            <ToggleButton value='Yearly'>Yearly</ToggleButton>
          </ToggleButtonGroup>
        }
      />

      {loading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '350px' // Adjust the height based on your layout
          }}
        >
          <CircularProgress color='success' size={60} /> {/* Adjust the size as needed */}
        </div>
      ) : (
        <ReactApexcharts type='line' height={400} options={options} series={series} />
      )}
    </Card>
  )
}

export default AnalyticsRegisteredUsersChart
