// ** React Imports
import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react'
import toast from 'react-hot-toast'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Component Import

// ** Third Party Imports
import axios from 'axios'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { ProjectTableRowType } from 'src/@fake-db/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useAuth } from 'src/hooks/useAuth'
import { Checkbox, Grid, Stack, TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import useDebounce from 'src/hooks/useDebounce'
import { discordIcon, googleIcon, instaIcon, smsIcon, xIcon } from 'src/@core/icons'

// ** renders name column
const renderName = (row: ProjectTableRowType) => {
  if (row.avatar) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else if (row.name) {
    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const renderIcon = (platform: any) => {
  switch (platform) {
    case 'google':
      return googleIcon()
    case 'twitter':
      return xIcon()
    case 'discord':
      return discordIcon()
    case 'instagram':
      return instaIcon()
    case 'cognito':
      return smsIcon()
    default:
      return smsIcon()
  }
}

const columns: GridColDef[] = [
  {
    flex: 0.1,
    minWidth: 220,
    field: 'triaName',
    headerName: 'Tria Name',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.primary' }}>{row?.triaName || '-'}</Typography>
  },
  {
    flex: 0.1,
    field: 'name',
    minWidth: 170,
    headerName: 'Name',
    renderCell: ({ row }) => {
      const { name } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* {renderName(row)} */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {name || '-'}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 320,
    field: 'contactInformation',
    headerName: 'Contact Info',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.contactInformation || '-'}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 160,
    field: 'platform',
    headerName: 'Source',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.primary', display: 'flex' }}>
        {
          <>
            {renderIcon(row?.platform)}
            <span style={{ marginRight: '8px' }} />
          </>
        }
        {row?.platform === 'cognito' || row?.verificationType === 'link' || row?.verificationType === 'otp'
          ? 'Email/Phone'
          : row?.platform?.charAt(0).toUpperCase() + row?.platform.slice(1) || '-'}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 130,
    field: 'loginCount',
    headerName: 'Login Count',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.secondary', margin: 'auto' }}>{row?.loginCount + 1 || '-'}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 200,
    field: 'lastLoginTime',
    headerName: 'Last Login',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.primary' }}>{new Date(row?.lastLoginTime).toLocaleString() || '-'}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 200,
    field: 'createdAt',
    headerName: 'Account Created At',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.primary' }}>{new Date(row?.createdAt).toLocaleString() || '-'}</Typography>
    )
  }
]

interface AnalyticsProjectProps {
  refreshKey: string
}

const AnalyticsProject: React.FC<AnalyticsProjectProps> = ({ refreshKey }) => {
  // ** State
  const [data, setData] = useState([])
  const [value, setValue] = useState<string | null>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<any>(new Date().toISOString().split('T')[0]) // Set default value to today
  const [endDate, setEndDate] = useState<any>(new Date().toISOString().split('T')[0])
  const [verified, setVerified] = useState<boolean>(true)

  const debouncedSearch = useDebounce(value, 100)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setStartDate(new Date().toISOString().split('T')[0])
    setEndDate(new Date().toISOString().split('T')[0])
    setVerified(false)
  }

  const fetchData = async (startDate = undefined, endDate = undefined, verified = true, searchValue = '') => {
    setLoading(true)

    try {
      const response = await auth.getUsers({
        fromClientId: auth.clientId,
        ...(startDate ? { from: startDate } : {}),
        ...(endDate ? { to: endDate } : {}),
        ...(verified ? { verified: verified } : {}),
        ...(searchValue ? { searchText: searchValue } : {})
      })
      const modifiedResponse = response.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })

      if (startDate && endDate) {
        return modifiedResponse
      } else {
        setData(modifiedResponse)
        return modifiedResponse
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const intervalId = setInterval(() => {
      fetchData()
    }, 300000)

    return () => clearInterval(intervalId)
  }, [refreshKey])

  useEffect(() => {
    async function fetchSearchedData() {
      const data = await fetchData(undefined, undefined, undefined, debouncedSearch)

      const filteredData = data.filter((item: any) => {
        const contactMatch = new RegExp(debouncedSearch, 'i').test(item.contactInformation)
        const triaNameMatch = new RegExp(debouncedSearch, 'i').test(item.triaName)

        return contactMatch || triaNameMatch
      })
      setData(filteredData)
    }
    if (debouncedSearch) fetchSearchedData()
  }, [debouncedSearch])

  useEffect(() => {
    const currentDate = new Date()
    if (endDate === currentDate.toISOString().split('T')[0]) {
      setEndDate(currentDate.toISOString())
    }
  }, [endDate])

  const getRowId = (row: any) => row.uuid

  const handleDownload = async () => {
    if (startDate > endDate) {
      toast.error('Invalid date range. Start date cannot be greater than end date.', {
        duration: 2000
      })
      return
    }

    // Check if start date is greater than current date
    const currentDate = new Date().toISOString()
    if (startDate > currentDate) {
      toast.error('Invalid start date. Start date cannot be greater than the current date.', {
        duration: 2000
      })
      return
    }

    // Check if end date is greater than current date
    if (endDate > currentDate) {
      toast.error('Invalid end date. End date cannot be greater than the current date.', {
        duration: 2000
      })
      return
    }
    console.log(startDate, 'this is start date')
    const res = await fetchData(startDate, endDate, verified)

    const csvHeaders = [
      'Name',
      'Contact Info',
      'Source',
      'Tria Name',
      'Login Count',
      'Last Login',
      'Account Created At'
    ]

    const csvRows = res.map(
      ({ name, contactInformation, platform, triaName, loginCount, lastLoginTime, createdAt }: any) => ({
        Name: name || '-',
        'Contact Info': contactInformation || '-',
        Source: platform || '-',
        'Tria Name': triaName || '-',
        'Login Count': loginCount + 1 || '-',
        'Last Login': lastLoginTime.split('T')[0] || '-',
        'Account Created At': createdAt.split('T')[0] || '-'
      })
    )

    const csvDataMap = [csvHeaders, ...csvRows.map((row: any) => Object.values(row))]

    // Create CSV content
    const csvContent = csvDataMap.map(row => row.join(',')).join('\n')

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' })

    // Create a link element and trigger a click event to download the file
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'triaAnalytics.csv'
    link.click()
    handleClose()
  }

  const handleVerificationToggle = () => {
    setVerified(!verified)
  }
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (e.target.value === '') {
      fetchData()
    }
  }

  return data ? (
    <Grid>
      <Card>
        <CardHeader
          title='User Details'
          titleTypographyProps={{ style: { fontSize: '2rem' }, sx: { mb: [2, 0] } }}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
          action={
            <Stack direction='row' spacing={2} alignItems='center' sx={{ width: '100%' }}>
              <TextField
                label='Search'
                variant='outlined'
                value={value}
                onChange={handleSearch}
                sx={{ flexGrow: 1 }} // Use flexGrow to allow the TextField to take remaining space
              />
              <Button variant='outlined' sx={{ height: 55, fontSize: 18, marginRight: 20 }} onClick={handleClickOpen}>
                Export Data
              </Button>
            </Stack>
          }
        />
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50rem'
            }}
          >
            <CircularProgress color='success' size={60} />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            pagination
            rows={data}
            rowHeight={62}
            columns={columns}
            // checkboxSelection
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={getRowId}

            // slots={{ toolbar: GridToolbar }}
          />
        )}
      </Card>
      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>Select Range</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Stack spacing={2} direction='row' alignItems='center'>
            <TextField
              label='Start Date'
              type='date'
              value={new Date(startDate).toISOString().split('T')[0]}
              onChange={e => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
              sx={{ mb: 2, width: '50%' }}
            />

            <TextField
              label='End Date'
              type='date'
              value={new Date(endDate).toISOString().split('T')[0]}
              onChange={e => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
              sx={{ width: '50%' }}
            />
          </Stack>
          <FormControlLabel
            control={<Checkbox checked={verified} onChange={handleVerificationToggle} color='primary' />}
            label='Verified'
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Stack spacing={2} direction='row'>
            <div>
              <Button color='primary' variant='contained' onClick={handleDownload}>
                Download CSV
              </Button>
            </div>
            <Button color='secondary' variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Grid>
  ) : null
}

export default AnalyticsProject
