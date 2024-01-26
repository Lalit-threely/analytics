import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import OptionsMenu from 'src/@core/components/option-menu'
import CardHeader from '@mui/material/CardHeader'
import { useAuth } from 'src/hooks/useAuth'

const AnalyticsActiveUsers = () => {
  const auth = useAuth()

  const [defaultFilter, setDefaultFilter] = useState<string>('Daily')
  const [userCount, setUserCount] = useState<any>(null) // Use the appropriate type for your API response
  const [loading, setLoading] = useState(false)

  const fetchData = async (filter: string) => {
    setLoading(true)

    try {
      const response = await auth.getActiveUsers({
        rangeType: filter,

        // "fromClientId": "7db16867-55c4-4abf-90d9-0f523e29b7c3",
        fromClientId: auth.clientId,
        resultCount: 1,
        verified: true
      })
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
    console.log(option, 'dddddd')
    setDefaultFilter(option)
    fetchData(option)
  }

  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title='Active Users'
        subheader={`${defaultFilter} Active Users Overview`}
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
        <Box sx={{ gap: 2, mb: 5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <Typography variant='h4'>{userCount ?? 'Loading...'}</Typography>
          </div>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticsActiveUsers
