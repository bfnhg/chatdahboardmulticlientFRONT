// ** React Import
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Axios Import
import axios from 'axios'

const TableSelection = () => {
  // ** State
  const [pageSize, setPageSize] = useState(7)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch clients data from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('accessToken')

        const response = await axios.get('http://localhost:5000/api/admin/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        console.log('response', response)

        if (response.data && response.data.clients) {
          setClients(response.data.clients)
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const columns = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'name',
      headerName: 'Name',
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              skin='light'
              color='primary'
              sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
            >
              {getInitials(row.name || 'John Doe')}
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 120,
      headerName: 'Role',
      field: 'role',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.role}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 140,
      headerName: 'Phone',
      field: 'phone',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.phone || 'N/A'}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 140,
      headerName: 'Created At',
      field: 'created_at',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.created_at}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 160,
      headerName: 'Nombre de message',
      field: 'message_count',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.message_count}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title='Clients List' />
      <DataGrid
        autoHeight
        rows={clients}
        columns={columns}
        checkboxSelection
        pageSize={pageSize}
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        loading={loading}
      />
    </Card>
  )
}

export default TableSelection
