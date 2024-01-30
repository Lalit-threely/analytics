// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import { TextField } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { ProjectTableRowType } from 'src/@fake-db/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useAuth } from 'src/hooks/useAuth'
import useDebounce from 'src/hooks/useDebounce'

interface CellType {
  row: ProjectTableRowType
}

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
        {getInitials(row.name || '')}
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
    renderCell: ({ row }: CellType) => {
      const { name } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderName(row)}
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
    minWidth: 250,
    field: 'contactInformation',
    headerName: 'Contact Info',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{row?.contactInformation || '-'}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'platform',
    headerName: 'Source',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.primary' }}>
        {row?.platform === 'cognito' ? 'Email/Phone' : (row?.platform || '-')}
      </Typography>
    )
  },

  // {
  //   flex: 0.1,
  //   minWidth: 105,
  //   field: 'lastLoginTime',
  //   headerName: 'Last Login',
  //   renderCell: ({ row }: CellType) => (
  //     <Typography sx={{ color: 'text.primary' }}>{row.lastLoginTime.split('T')[0]}</Typography>
  //   )
  // },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'createdAt',
    headerName: 'Account Created At',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.primary' }}>{(row.createdAt && row?.createdAt?.split('T')[0]) || '-'}</Typography>
    )
  }
]

const AnalyticsDroppedOffUsers = () => {
  // ** State
  const [data, setData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState<string | null>(null)

  const auth = useAuth()
  const debouncedSearch = useDebounce(value, 500)

  useEffect(() => {
    async function fetchSearchedData() {
      await fetchData(debouncedSearch)
    }
    if (debouncedSearch) fetchSearchedData()
  }, [debouncedSearch])

  const fetchData = async (searchValue = '') => {
    setLoading(true)

    try {
      const response = await auth.getUsers({
        fromClientId: auth.clientId,
        verified: false,
        ...(searchValue ? { searchText: searchValue } : {})
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

  const getRowId = (row: any) => row.uuid

  return data ? (
    <Card>
      <CardHeader
        title='Dropped Off Users'
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 4,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
        action={
          <>
            <TextField
              label='Search'
              variant='outlined'
              value={value}
              onChange={e => setValue(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          </>
        }
      />
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
    </Card>
  ) : null
}

export default AnalyticsDroppedOffUsers
