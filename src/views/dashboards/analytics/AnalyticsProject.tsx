// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AvatarGroup from '@mui/material/AvatarGroup'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import axios from 'axios'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { ProjectTableRowType } from 'src/@fake-db/types'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useAuth } from 'src/hooks/useAuth'

// interface CellType {
//   row: ProjectTableRowType
// }

// ** renders name column
const renderName = (row: ProjectTableRowType) => {
  if (row.avatar) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
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

const columns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'name',
    minWidth: 180,
    headerName: 'Name',
    renderCell: ({ row }) => {
      const { name, date } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderName(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
              {date}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 250,
    field: 'contactInformation',
    headerName: 'Contact Info',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.secondary' }}>{row.contactInformation}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'platform',
    headerName: 'Source',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.primary' }}>{row.platform}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'triaName',
    headerName: 'Tria Name',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.primary' }}>{row.triaName}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'loginCount',
    headerName: 'Login Count',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.loginCount + 1}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'lastLoginTime',
    headerName: 'Last Login',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.primary' }}>{row.lastLoginTime.split('T')[0]}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'createdAt',
    headerName: 'Account Created At',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.primary' }}>{row.createdAt.split('T')[0]}</Typography>
    )
  }

  // {
  //   flex: 0.1,
  //   field: 'team',
  //   minWidth: 120,
  //   sortable: false,
  //   headerName: 'Team',
  //   renderCell: ({ row }) => (
  //     <AvatarGroup className='pull-up'>
  //       {row.avatarGroup.map((src, index) => (
  //         <CustomAvatar key={index} src={src} sx={{ height: 26, width: 26 }} />
  //       ))}
  //     </AvatarGroup>
  //   )
  // },
  // {
  //   flex: 0.1,
  //   minWidth: 150,
  //   field: 'status',
  //   headerName: 'Status',
  //   renderCell: ({ row }) => (
  //     <>
  //       <LinearProgress
  //         color='primary'
  //         value={row.status}
  //         variant='determinate'
  //         sx={{
  //           mr: 3,
  //           height: 8,
  //           width: '100%',
  //           borderRadius: 8,
  //           backgroundColor: 'background.default',
  //           '& .MuiLinearProgress-bar': {
  //             borderRadius: 8
  //           }
  //         }}
  //       />
  //       <Typography sx={{ color: 'text.secondary' }}>{`${row.status}%`}</Typography>
  //     </>
  //   )
  // },

  // {
  //   flex: 0.1,
  //   minWidth: 100,
  //   sortable: false,
  //   field: 'actions',
  //   headerName: 'Actions',
  //   renderCell: () => (
  //     <OptionsMenu
  //       iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
  //       options={[
  //         'Details',
  //         'Archive',
  //         { divider: true, dividerProps: { sx: { my: theme => `${theme.spacing(2)} !important` } } },
  //         {
  //           text: 'Delete',
  //           menuItemProps: {
  //             sx: {
  //               color: 'error.main',
  //               '&:not(.Mui-focusVisible):hover': {
  //                 color: 'error.main',
  //                 backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.08)
  //               }
  //             }
  //           }
  //         }
  //       ]}
  //     />
  //   )
  // }
]

const AnalyticsProject = () => {
  // ** State
  const [data, setData] = useState([])
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [loading, setLoading] = useState(false)
  const auth = useAuth()

  // useEffect(() => {
  //   axios.get('/pages/profile-table', { params: { q: value } }).then(response => {
  //     setData(response.data)
  //   })
  // }, [value])

  const fetchData = async () => {
    setLoading(true)

    try {
      const response = await auth.getUsers({
        fromClientId: auth.clientId
      })
      setData(response)
      console.log('response for table data---------->', response)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const getRowId = (row:any) => row.uuid

  return data ? (
    <Card>
      <CardHeader
        title='Projects'
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        // action={<CustomTextField value={value} placeholder='Search' onChange={e => handleFilter(e.target.value)} />}
        sx={{
          py: 4,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      />
      <DataGrid
        autoHeight
        pagination
        rows={data}
        rowHeight={62}
        columns={columns}
        checkboxSelection
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        getRowId={getRowId}
        slots={{ toolbar: GridToolbar }}
      />
    </Card>
  ) : null
}

export default AnalyticsProject
