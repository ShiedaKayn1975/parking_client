import React, { useEffect, useState } from 'react'
import {
  Grid, Stack, Typography, Tab, Tabs, Box, TableContainer, Table, TableBody, TableRow,
  TableCell, TableHead, Paper, Switch, TablePagination, Button
} from '@mui/material'
import ToolBarAction from '../../components/ToolBarAction'
import PaperItem from '../../components/Paper/PaperItem'
import { useTheme } from '@mui/material'
import { styled } from '@mui/material'
import { MainCard } from '../../components/Card'
import { IconBrandProducthunt } from '@tabler/icons'
import { FormModal } from '../../components/Modal'
import { ParkingLotForm } from './components'
import ProductResource from '../../resources/Product'
import { toast } from 'react-toastify'
import { tableCellClasses } from '@mui/material/TableCell';
import { ActionableExceptionHandler } from '../../utils'
import Resource from '../../resources/Resource/resource'
import { parkingLotStatusMapping } from '../../utils'
import moment from 'moment'

const schema = {
  name: {
    presence: { allowEmpty: false, message: '^Required' },
  },
  car_type_id: {
    presence: { allowEmpty: false, message: '^Required' },
  },
  description: {
    presence: { allowEmpty: false, message: '^Required' },
  },
  width: {
    presence: { allowEmpty: false, message: '^Required' },
  },
  height: {
    presence: { allowEmpty: false, message: '^Required' },
  }
}

const AdminParkingLot = (props) => {
  const theme = useTheme()
  const [parkingLots, setParkingLots] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(25)
  const [recordCount, setRecordCount] = useState(0)

  useEffect(() => {
    getParkingLot()
  }, [currentPage, perPage])

  const handleChangePage = (event, page) => {
    setCurrentPage(page)
  }

  const handleChangeRowsPerPage = (event) => {
    setPerPage(event.target.value)
  }

  const parkingLotAction = (parkingLot) => {
    FormModal.show({
      title: parkingLot ? 'Edit' : 'Add parking lot',
      mode: parkingLot ? 'edit' : 'new',
      submitData: parkingLot || {},
      schema: schema,
      renderComponent: ({ submitData, handleChange }) => <ParkingLotForm submitData={submitData} handleChange={handleChange} />,
      action: {
        title: parkingLot ? 'Save' : 'Create',
        onSubmit: (submitData, handleChange, ctx) => {
          const formData = submitData.values
          
          if (submitData.mode == 'new') {
            formData.car_type_id = formData.car_type_id.id

            return new Promise((resolve, reject) => {
              const resource = new Resource('parking_lots')

              resource.client.createItem({
                data: formData,
                done: (response) => {
                  toast.success("Create parking lot success")
                  getParkingLot()
                  resolve(true)
                },
                error: (error) => {
                  toast.success("Create parking lot error")
                  resolve(false)
                }
              })
            })
          }else{
            const formData = submitData.change
            const id = submitData.values.id

            return new Promise((resolve, reject) => {
              const resource = new Resource('parking_lots')

              resource.client.updateItem({
                id  : id,
                data: formData,
                done: (response) => {
                  toast.success("Create parking lot success")
                  getParkingLot()
                  resolve(true)
                },
                error: (error) => {
                  toast.success("Create parking lot error")
                  resolve(false)
                }
              })
            })
          }
        }
      }
    })
  }

  const getParkingLot = () => {
    const resource = new Resource('parking_lots')
    resource.client.fetchItems({
      paging: { page: (currentPage || 1), perPage: perPage },
      params: {
        include: 'car_type'
      },
      done: (response, meta) => {
        setParkingLots(response)
        setRecordCount(meta['Record Count'])
      },
      error: (error) => {
        toast.error("Get product error")
      }
    })
  }

  const handleDeleteParkingLot = (parkingLot) => {
    let result = confirm("Want to delete?");
    if (result) {
      const resource = new Resource('parking_lots')

      resource.client.commitAction({
        id: parkingLot.id,
        data: {
          action_code: 'delete_parking_lot',
          action_data: {}
        },
        done: (response) => {
          toast.success("Success")
          getParkingLot()
        },
        error: (error) => {
        }
      })
    }
  }

  return (
    <>
      <FormModal />
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
          <Grid item xs={3}>
            <Stack>
              <Typography variant='h4'
                sx={{
                  float: 'left',
                  marginLeft: 3,
                  marginTop: 2
                }}
              >
                Parking Lots
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={9}>
            <div
              style={{
                marginTop: 10,
                marginRight: 20,
                marginBottom: 10
              }}
            >
              <ToolBarAction
                rightActions={[
                  {
                    text: 'Add parking lot',
                    color: 'primary',
                    visible: true,
                    action: () => {
                      parkingLotAction()
                    },
                    sx: { marginRight: 1 }
                  }
                ]}
              />
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
            <Table>
              <TableHead>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Name</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Status</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Car type</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Width(meter)</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Height(meter)</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Created At</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Action</Typography></TableCell>
              </TableHead>
              <TableBody>
                {
                  parkingLots.map((parkingLot, index) => {
                    return (
                      <TableRow key={index} hover style={{ cursor: 'pointer' }}
                        onClick={() => parkingLotAction(parkingLot)}
                      >
                        <TableCell>{parkingLot.name}</TableCell>
                        <TableCell>{parkingLotStatusMapping[parkingLot.status]}</TableCell>
                        <TableCell>{parkingLot.car_type?.name}</TableCell>
                        <TableCell>{parkingLot.width}</TableCell>
                        <TableCell>{parkingLot.height}</TableCell>
                        <TableCell>{moment(parkingLot.created_at).format('lll')}</TableCell>
                        <TableCell>
                          <Button variant='contained' size='small' color='error'
                            onClick={() => handleDeleteParkingLot(parkingLot)}
                          >Delete</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={recordCount}
              rowsPerPage={perPage}
              page={currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </MainCard>
      </PaperItem>
    </>
  )
}

export default AdminParkingLot