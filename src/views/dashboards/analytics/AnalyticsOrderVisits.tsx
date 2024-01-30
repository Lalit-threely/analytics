import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import OptionsMenu from 'src/@core/components/option-menu'
import CardHeader from '@mui/material/CardHeader'
import { useAuth } from 'src/hooks/useAuth'

const AnalyticsOrderVisits = () => {
  const auth = useAuth()

  const [defaultFilter, setDefaultFilter] = useState<string>('Daily')
  const [userCount, setUserCount] = useState<any>(null) // Use the appropriate type for your API response
  const [loading, setLoading] = useState(false)
  const [percentageChange, setPercentageChange] = useState<any>(null)

  const fetchData = async (filter: string) => {
    setLoading(true)

    try {
      const response = await auth.getNewRegisteredUsers({
        rangeType: filter,

        // "fromClientId": "7db16867-55c4-4abf-90d9-0f523e29b7c3",
        fromClientId: auth.clientId,
        resultCount: 2,
        verified:true
      })
      calculatePercentageChange(response.data[0].count, response.data[1].count)
      setUserCount(response.data[0].count)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(defaultFilter)
  }, [defaultFilter])

  const handleOptionSelect = (option: string) => {
    console.log(option, "dddddd")

    setDefaultFilter(option);
    fetchData(option);
  };

  function calculatePercentageChange(currentValue: any, previousValue: any) {
    if (currentValue === 0 && previousValue === 0) {
      setPercentageChange(0);
      
      // return 0;
  }
    let difference = currentValue - previousValue;
    let absPreviousValue = Math.abs(previousValue) || 1
    let percentageChange = (difference / absPreviousValue) * 100
    setPercentageChange(percentageChange)
  }

  const timePeriod = () => {
    let timePeriod;
  
    // Determine the time period based on the value of defaultFilter
    switch (defaultFilter) {
      case 'Daily':
        timePeriod = 'Today';
        break;
      case 'Weekly':
        timePeriod = 'This Week';
        break;
      case 'Monthly':
        timePeriod = 'This Month';
        break;
      case 'Yearly':
        timePeriod = 'This Year';
        break;
      default:
        timePeriod = ''; // Handle other cases if needed
    }
    return timePeriod;
  }
  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title={`New Registered Users ( ${timePeriod()} )`}
        subheader={` `}
        action={
          <OptionsMenu
            options={[
              {
                text: 'Daily',
                menuItemProps: {
                  onClick: () => {
                    handleOptionSelect('Daily')
                  }
                }
              },
              {
                text: 'Weekly',
                menuItemProps: {
                  onClick: () => {
                    handleOptionSelect('Weekly')
                  }
                }
              },
              {
                text: 'Monthly',
                menuItemProps: {
                  onClick: () => {
                    handleOptionSelect('Monthly')
                  }
                }
              },
              {
                text: 'Yearly',
                menuItemProps: {
                  onClick: () => {
                    handleOptionSelect('Yearly')
                  }
                }
              }
            ]}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
        <Box sx={{ gap: 2, mb: 4.4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',ml:3 }}>
          <div>
            <Typography variant='h2'>{userCount ?? '-'}</Typography>
          </div>
          <Typography variant='h2' sx={{ fontWeight: 500, color: percentageChange >= 0 ? 'success.main' : 'error.main' }}>
            {loading
              ? '-'
              : percentageChange == null || percentageChange == 0
              ? '-'
              : `${percentageChange.toFixed(2)}%`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticsOrderVisits
