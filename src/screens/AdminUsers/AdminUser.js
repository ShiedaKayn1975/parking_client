import React, { useEffect, useState } from 'react'
import PaperItem from '../../components/Paper/PaperItem'
import { useTheme } from '@mui/material'
import moment from 'moment'
import {
  Grid, Stack, Typography, TableContainer, Table, TableBody, TableRow,
  TableCell, TableHead, Paper, Tooltip, TablePagination, Switch
} from '@mui/material'
import ToolBarAction from '../../components/ToolBarAction'
import UserResource from '../../resources/User'
import { styled } from '@mui/material'
import { MainCard } from '../../components/Card'
import { toast } from 'react-toastify'
import { tableCellClasses } from '@mui/material/TableCell';
import { ActionableExceptionHandler } from '../../utils'
import { formatter } from '../../utils'
import Resource from '../../resources/Resource/resource'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const AdminUser = (props) => {
  const theme = useTheme()
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(25)
  const [recordCount, setRecordCount] = useState(0)

  useEffect(() => {
    loadUsers()
  }, [])

  const handleChangePage = (event, page) => {
    setCurrentPage(page)
  }

  const handleChangeRowsPerPage = (event) => {
    setPerPage(event.target.value)
  }

  useEffect(() => {
    loadUsers()
  }, [currentPage, perPage])

  const loadUsers = () => {
    const resource = new Resource('users')
    resource.client.fetchItems({
      paging: { page: (currentPage || 1), perPage: perPage },
      done: (response, meta) => {
        setUsers(response)
        setRecordCount(meta['Record Count'])
      },
      error: (error) => {
        toast.error("Get users error")
      }
    })
  }

  const handleUpdateActive = (row, event) => {
    const action_data = {
      active: event.target.checked
    }
    const resource = new Resource('users')

    resource.client.commitAction({
      id: row.id,
      data: {
        action_code: 'update_user_status',
        action_data: action_data
      },
      done: (response) => {
        loadUsers()
        toast.success("Update user success")
      },
      error: (error) => {
        toast.error(ActionableExceptionHandler(error).message)
      }
    })
  }

  return (
    <>
      <PaperItem
        {...theme.typography.body2}
        color={theme.palette.text.secondary}
        borderRadius={3}
      >
        <Grid container
          sx={{
            marginBottom: 2
          }}
        >
          <Grid item xs={8}>
            <Stack>
              <Typography variant='h4'
                sx={{
                  float: 'left',
                  marginLeft: 3,
                  marginTop: 2
                }}
              >
                Users
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <div
              style={{
                marginTop: 10,
                marginRight: 20,
                marginBottom: 10
              }}
            >
            </div>
          </Grid>
        </Grid>
        <MainCard
          sx={{
            borderRadius: 3,
            minHeight: '40vh',
            marginLeft: 2,
            marginRight: 2
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: '20%' }}><Typography variant='h5' fontWeight={'bold'}>Email</Typography></TableCell>
                  <TableCell align="center" sx={{ width: '20%' }}><Typography variant='h5' fontWeight={'bold'}>Display name</Typography></TableCell>
                  <TableCell align="center" sx={{ width: '20%' }}><Typography variant='h5' fontWeight={'bold'}>Given name</Typography></TableCell>
                  <TableCell align="center" sx={{ width: '20%' }}><Typography variant='h5' fontWeight={'bold'}>Created At</Typography></TableCell>
                  <TableCell align="center" sx={{ width: '20%' }}><Typography variant='h5' fontWeight={'bold'}>Active</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row, index) => (
                  <StyledTableRow key={row.id} sx={{ cursor: 'pointer' }}
                  // onClick={() => newProduct(row)}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {row.email}
                    </TableCell>
                    <TableCell align="center">{row.display_name}</TableCell>
                    <TableCell align="center">{row.given_name}</TableCell>
                    <TableCell align="center">{moment(row.created_at).format('ll')}</TableCell>
                    <TableCell align="center">
                      <Switch checked={row.status == 'active'} onClick={(event) => {
                        event.stopPropagation()
                        handleUpdateActive(row, event)
                      }} />
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={recordCount}
            rowsPerPage={perPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </MainCard>
      </PaperItem>
    </>
  )
}

export default AdminUser