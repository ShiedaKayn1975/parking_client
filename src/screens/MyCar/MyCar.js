import React, { useEffect, useState } from 'react'
import PaperItem from '../../components/Paper/PaperItem'
import { useTheme } from '@mui/material'
import {
  Grid, Typography, Box, TableContainer, Table, TableHead, TableBody, TableRow,
  TableCell, Paper, Stack
} from '@mui/material'
import { MainCard } from '../../components/Card'
import 'moment/locale/vi'
import { toast } from 'react-toastify'
import ToolBarAction from '../../components/ToolBarAction'
import { FormModal } from '../../components/Modal'
import { CarForm } from './components'
import Resource from '../../resources/Resource/resource'
import moment from 'moment'

const MyCar = (props) => {
  const theme = useTheme()
  const [cars, setCars] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(25)
  const [recordCount, setRecordCount] = useState(0)

  useEffect(() => {
    getCars()
  }, [])

  const getCars = () => {
    const resource = new Resource('cars')

    resource.client.fetchItems({
      paging: { page: (currentPage || 1), perPage: perPage },
      params: {
        include: 'car_type'
      },
      done: (response, meta) => {
        setCars(response)
        console.log(response)
        setRecordCount(meta['Record Count'])
      },
      error: (error) => {
        toast.error("Get product error")
      }
    })
  }

  const carAction = (car) => {
    FormModal.show({
      title: car ? 'Edit car' : 'Add car',
      mode: car ? 'edit' : 'new',
      submitData: car || {},
      // schema: schema,
      renderComponent: ({ submitData, handleChange }) => <CarForm submitData={submitData} handleChange={handleChange} />,
      action: {
        title: car ? 'Save' : 'Create',
        onSubmit: (submitData, handleChange, ctx) => {
          const formData = submitData.values

          if (submitData.mode == 'new') {
            formData.car_type_id = formData.car_type_id.id

            return new Promise((resolve, reject) => {
              const resource = new Resource('cars')

              resource.client.createItem({
                data: formData,
                done: (response) => {
                  toast.success("Create car success")
                  getCars()
                  resolve(true)
                },
                error: (error) => {
                  toast.success("Create car error")
                  resolve(false)
                }
              })
            })
          } else {
            const formData = submitData.change
            const id = submitData.values.id

            return new Promise((resolve, reject) => {
              const resource = new Resource('cars')

              resource.client.updateItem({
                id: id,
                data: formData,
                done: (response) => {
                  toast.success("Update car success")
                  getCars()
                  resolve(true)
                },
                error: (error) => {
                  toast.success("Update car error")
                  resolve(false)
                }
              })
            })
          }
        }
      }
    })
  }

  return (
    <>
      <FormModal/>
      <PaperItem
        {...theme.typography.body2}
        color={theme.palette.text.secondary}
        borderRadius={3}
        sx={{ paddingBottom: 2 }}
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
                My cars
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
                    text: 'Add car',
                    color: 'primary',
                    visible: true,
                    action: () => {
                      carAction()
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
            borderRadius: 2,
            marginLeft: 2,
            marginRight: 2,
            minHeight: '10vh',
          }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Image</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Car type</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>License plate</Typography></TableCell>
                <TableCell><Typography variant='h5' fontWeight={'bold'}>Created At</Typography></TableCell>
              </TableHead>
              <TableBody>
                {
                  cars.map((car, index) => {
                    return (
                      <TableRow key={index} hover sx={{cursor: 'pointer'}}
                        onClick={() => carAction(car)}
                      >
                        <TableCell style={{padding: '8px'}}>
                          <img src={car.images[0]} style={{maxWidth: 50}} />
                        </TableCell>
                        <TableCell>
                          {car.car_type?.name}
                        </TableCell>
                        <TableCell>
                          {car.license_plate}
                        </TableCell>
                        <TableCell>
                          {moment(car.created_at).format('lll')}
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </PaperItem>
    </>
  )
}

export default MyCar