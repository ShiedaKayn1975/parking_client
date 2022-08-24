import React, { useState } from 'react'
import PaperItem from '../../components/Paper/PaperItem'
import { useTheme } from '@mui/material'
import {
  Grid, Typography, Box, TableContainer, Table, TableHead, TableBody, TableRow,
  TableCell, Paper, Stack
} from '@mui/material'
import { MainCard } from '../../components/Card'
import { IconDatabaseOff } from '@tabler/icons'
import 'moment/locale/vi'
import { toast } from 'react-toastify'

const OrderedParkingLot = (props) => {
  const theme = useTheme()
  const [history, setHistory] = useState([])

  return (
    <>
      <PaperItem
        {...theme.typography.body2}
        color={theme.palette.text.secondary}
        borderRadius={3}
        sx={{paddingBottom: 2}}
      >
        <Grid container
          sx={{
            marginBottom: 2
          }}
        >
          <Grid item xs={12}>
            <Typography variant='h3'
              sx={{
                float: 'left',
                marginLeft: 3,
                marginTop: 2
              }}
            >
              Ordered lots
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableCell width={'50%'}><Typography variant='h5' fontWeight={'bold'}>Số tiền</Typography></TableCell>
                <TableCell width={'55%'}><Typography variant='h5' fontWeight={'bold'}>Đã nạp lúc</Typography></TableCell>
              </TableHead>
              <TableBody>
                
              </TableBody>
            </Table>
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

export default OrderedParkingLot