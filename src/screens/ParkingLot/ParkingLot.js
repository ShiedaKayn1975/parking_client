import React, { useEffect, useState } from 'react'
import PaperItem from '../../components/Paper/PaperItem'
import { Button, Divider, TextField, useTheme } from '@mui/material'
import {
  Grid, Typography, Box, TableContainer, Table, TableHead, TableBody, TableRow,
  TableCell, Paper, Stack, Chip, TablePagination
} from '@mui/material'
import { MainCard } from '../../components/Card'
import { IconDatabaseOff } from '@tabler/icons'
import 'moment/locale/vi'
import Resource from '../../resources/Resource/resource'
import { toast } from 'react-toastify'
import moment from 'moment'
import { FormModal } from '../../components/Modal'
import { parkingLotStatusMapping } from '../../utils'
import Filter from '../../components/Filter'
import { filters } from './filters'
import ToolBarAction from '../../components/ToolBarAction'
import { IconFilter } from '@tabler/icons'
import { serviceAgent } from '../../api'
import AsyncSelect from 'react-select/async';
import { customStyles, makeId } from '../../utils';

const schema = {
  car_id: {
    presence: { allowEmpty: false, message: '^Required' },
  }
}

const ParkingLot = (props) => {
  const theme = useTheme()

  // for all parking lots
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(25)
  const [parkingLots, setParkingLots] = useState([])
  const [recordCount, setRecordCount] = useState(0)
  const [right, setRight] = useState(false)
  const [formFilters, setFormFilters] = useState({})

  // for my parking lots
  const [myCurrentPage, setMyCurrentPage] = useState(null)
  const [myPerPage, setMyPerPage] = useState(null)
  const [myParkingLots, setMyParkingLots] = useState([])
  const [myRecordCount, setMyRecordCount] = useState(null)
  const [myRight, setMyRight] = useState(false)
  const [myFormFilters, setMyFormFilters] = useState({})

  useEffect(() => {
    getParkingLot()
  }, [formFilters])

  useEffect(() => {
    getMyParkingLot()
  }, [myFormFilters])

  const getMyParkingLot = () => {
    serviceAgent.get('/api/v1/parking_lots/my_parking_lots', {
      params: {
        ...myFormFilters,
        page: myCurrentPage,
        perPage: myPerPage
      }
    }).then(response => {
      setMyParkingLots(response.data.parking_lots)
    })
  }

  const loadOptions = (inputValue, loadingData) => {
    return loadingData(inputValue)
  };

  const getParkingLot = () => {
    const resource = new Resource("parking_lots")

    const filters = {}
    Object.keys(formFilters).forEach(item => {
      if (typeof formFilters[item] === 'object') {
        filters[item] = formFilters[item].id
      } else {
        filters[item] = formFilters[item]
      }
    })

    resource.client.fetchItems({
      paging: { page: (currentPage || 1), perPage: perPage },
      filters: filters,
      params: {
        include: 'car_type'
      },
      done: (response, meta) => {
        setParkingLots(response)
        setRecordCount(meta['Record Count'])

      },
      error: (error) => {
        toast.error("Get variant error")
      }
    })
  }

  const handleChangeFilter = (event) => {
    const { name, value } = event.target;
    setFormFilters({ ...formFilters, [name]: value })
  }

  const handleDeleteFilter = (item) => {
    delete formFilters[item]
    setFormFilters({ ...formFilters })
  }

  const cancelParkingLot = (parkingLot) => {
    const resource = new Resource('parking_lots')
    resource.client.commitAction({
      id: parkingLot.id,
      data: {
        action_code: 'cancel_location',
        action_data: {}
      },
      done: (response) => {
        toast.success("Success")
        getMyParkingLot()
        getParkingLot()
      },
      error: (error) => {
      }
    })
  }

  const parkedParkingLot = (parkingLot) => {
    const resource = new Resource('parking_lots')
    resource.client.commitAction({
      id: parkingLot.id,
      data: {
        action_code: 'parked_location',
        action_data: {}
      },
      done: (response) => {
        toast.success("Success")
        getMyParkingLot()
        getParkingLot()
      },
      error: (error) => {
      }
    })
  }

  const leaveParkingLot = (parkingLot) => {
    const resource = new Resource('parking_lots')
    resource.client.commitAction({
      id: parkingLot.id,
      data: {
        action_code: 'leave_location',
        action_data: {}
      },
      done: (response) => {
        toast.success("Success")
        getMyParkingLot()
        getParkingLot()
      },
      error: (error) => {
      }
    })
  }

  const orderParkingLot = (parkingLot) => {
    FormModal.show({
      title: "Order parking lot",
      schema: schema,
      submitData: {
        parkingLot: parkingLot
      },
      renderComponent: ({ submitData, handleChange }) => {
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <b>Choose a car</b>
                <AsyncSelect
                  className={"MuiFormControl-marginDense"}
                  isSearchable
                  menuPortalTarget={document.body}
                  loadOptions={(inputValue) => loadOptions(inputValue, function loadingData(inputValue) {
                    return new Promise(resolve => {
                      const resource = new Resource('cars')

                      resource.client.fetchItems({
                        filters: { name: inputValue },
                        params:{
                          include: 'car_type'
                        },
                        done: (response, meta) => {
                          resolve(response.map(item => {
                            return {
                              id: item.id,
                              name: item.license_plate + "/" + item.car_type.name
                            }
                          }))
                        },
                        error: (error) => {
                          resolve([])
                        }
                      })
                    })
                  })
                  }
                  defaultOptions
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ id }) => id}
                  onChange={(value) => {
                    handleChange('car_id', value)
                  }}
                  value={submitData.values.car_id || null}
                  styles={customStyles()}
                />
                {submitData.errors.car_id && <span style={{ color: 'red' }}>{submitData.errors.car_id[0]}</span>}
              </Stack>
            </Grid>
          </Grid>
        )
      },
      action: {
        title: 'Submit',
        onSubmit: (submitData, handleChange, ctx) => {
          return new Promise((resolve, reject) => {
            const formData = submitData.values

            const resource = new Resource('parking_lots')
            resource.client.commitAction({
              id: submitData.values.parkingLot.id,
              data: {
                action_code: 'order_location',
                action_data: {
                  car_id: formData.car_id.id
                }
              },
              done: (response) => {
                resolve(response)
                toast.success("Success")
                getParkingLot()
              },
              error: (error) => {
                reject(error)
              }
            })
          })
        }
      }
    })
    // const resource = new Resource('parking_lots')
    // resource.client.commitAction({
    //   id: parkingLot.id,
    //   data: {
    //     action_code: 'order_location',
    //     action_data: {
    //       // order_from: formData.order_from,
    //       // order_to: formData.order_to
    //     }
    //   },
    //   done: (response) => {
    //     toast.success("Success")
    //     getParkingLot()
    //     getMyParkingLot()
    //   },
    //   error: (error) => {

    //   }
    // })
  }

  const handleChangePage = (event, page) => {
    setCurrentPage(page)
  }

  const handleChangeRowsPerPage = (event) => {
    setPerPage(event.target.value)
  }

  return (
    <>
      <FormModal />
      <Filter
        right={right}
        onClose={(side, open) => setRight(false)}
        formState={formFilters}
        onChange={handleChangeFilter}
        onSearch={(filters) => {
          setFormFilters(filters)
        }}
        // resetFilter={this.resetFilter}
        filters={filters}
      />
      <PaperItem
        {...theme.typography.body2}
        color={theme.palette.text.secondary}
        borderRadius={3}
        sx={{ paddingBottom: 2 }}
      >
        {
          myParkingLots.length > 0 &&
          <div>
            <Grid container
              sx={{
                marginBottom: 2
              }}
            >
              <Grid item xs={3}>
                <Typography variant='h4'
                  sx={{
                    float: 'left',
                    marginLeft: 3,
                    marginTop: 2
                  }}
                >
                  My Parking Lots
                </Typography>
              </Grid>
            </Grid>
            <MainCard
              sx={{
                borderRadius: 2,
                marginLeft: 2,
                marginRight: 2,
                minHeight: '10vh',
                marginBottom: 2
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
                      myParkingLots.map((parkingLot, index) => {
                        return (
                          <TableRow key={index} hover style={{ cursor: 'pointer' }}>
                            <TableCell>{parkingLot.name}</TableCell>
                            <TableCell>{parkingLotStatusMapping[parkingLot.status]}</TableCell>
                            <TableCell>{parkingLot.car_type_name}</TableCell>
                            <TableCell>{parkingLot.width}</TableCell>
                            <TableCell>{parkingLot.height}</TableCell>
                            <TableCell>{moment(parkingLot.created_at).format('lll')}</TableCell>
                            <TableCell>
                              {
                                parkingLot.status == 2 &&
                                <Stack direction={'row'} spacing={1}>
                                  <Button size='small' variant='contained' key={index} color='warning'
                                    onClick={() => cancelParkingLot(parkingLot)}
                                  >Cancel</Button>
                                  <Button size='small' variant='contained' key={index} color='success'
                                    onClick={() => parkedParkingLot(parkingLot)}
                                  >Parked</Button>
                                </Stack>
                              }
                              {
                                parkingLot.status == 3 &&
                                <Button size='small' variant='contained' key={index} color='error'
                                  onClick={() => leaveParkingLot(parkingLot)}
                                >Leave</Button>
                              }
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </div>
        }
        <Divider sx={{ marginLeft: 2, marginRight: 2 }} />
        <Grid container
          sx={{
            marginBottom: 2
          }}
        >
          <Grid item xs={3}>
            <Typography variant='h4'
              sx={{
                float: 'left',
                marginLeft: 3,
                marginTop: 2
              }}
            >
              All Parking Lots
            </Typography>
          </Grid>
        </Grid>
        <MainCard
          sx={{
            borderRadius: 2,
            marginLeft: 2,
            marginRight: 2,
            minHeight: '10vh',
          }}
        >
          <Grid container>
            <Grid item xs={9}>
              {
                Object.keys(formFilters).length > 0 &&
                <Grid item xs={12} sx={{ marginLeft: 2, marginBottom: 2 }}>
                  <Stack direction={'row'} spacing={1}>
                    {
                      Object.keys(formFilters).map((item, index) => {
                        return <Chip size='small' label={item} onDelete={() => handleDeleteFilter(item)} key={index} />
                      })
                    }
                  </Stack>
                </Grid>
              }
            </Grid>
            <Grid item xs={3}>
              <div
                style={{
                  marginRight: 20,
                }}
              >
                <ToolBarAction
                  rightActions={[
                    {
                      text: 'Filters',
                      color: 'primary',
                      visible: true,
                      action: () => {
                        setRight(true)
                      },
                      icon: <IconFilter />
                    }
                  ]}
                />
              </div>
            </Grid>
          </Grid>
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
                      <TableRow key={index} hover style={{ cursor: 'pointer' }}>
                        <TableCell>{parkingLot.name}</TableCell>
                        <TableCell>{parkingLotStatusMapping[parkingLot.status]}</TableCell>
                        <TableCell>{parkingLot.car_type?.name}</TableCell>
                        <TableCell>{parkingLot.width}</TableCell>
                        <TableCell>{parkingLot.height}</TableCell>
                        <TableCell>{moment(parkingLot.created_at).format('lll')}</TableCell>
                        <TableCell>
                          {
                            parkingLot.status == 1 &&
                            <Button size='small' variant='contained' key={index}
                              onClick={() => orderParkingLot(parkingLot)}
                            >Order</Button>
                          }
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
          {
            history.length == 0 &&
            <div style={{ width: '100%', marginTop: 20 }}>
              <Stack direction={'column'}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <IconDatabaseOff size={40} />
                <Typography>No data</Typography>
              </Stack>
            </div>
          }
        </MainCard>
      </PaperItem>
    </>
  )
}

export default ParkingLot