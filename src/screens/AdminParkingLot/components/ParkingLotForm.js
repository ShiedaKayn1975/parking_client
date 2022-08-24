import React, { useState } from 'react'
import {
  Stack, TableCell, Chip, Tab, Tabs, Box, TableHead, TextField, InputAdornment, IconButton, Button
} from '@mui/material'
import { styled } from '@mui/system';
import AsyncSelect from 'react-select/async';
import { customStyles, makeId } from '../../../utils';
import Resource from '../../../resources/Resource/resource';

const DivComponent = styled('div')({
  marginBottom: 12
})

const ParkingLotForm = (props) => {
  const { submitData, handleChange, ...others } = props
  const handleChangeText = (event) => {
    handleChange(event.target.name, event.target.value)
  }

  const hasError = (field) => {
    return submitData.errors && submitData.errors[field]
  }

  const loadOptions = (inputValue, loadingData) => {
    return loadingData(inputValue)
  };

  return (
    <div>
      <Stack direction={'column'}>
        <DivComponent>
          <Box fontWeight={'bold'} fontSize={13} marginBottom={1} >Name<span style={{ color: 'red' }}>*</span></Box>
          <TextField fullWidth
            onChange={handleChangeText}
            name='name'
            value={submitData.values.name || ''}
          />
          {hasError('name') && <small style={{ color: 'red' }}>{submitData.errors.name[0]}</small>}
        </DivComponent>
        <DivComponent>
          <Box fontWeight={'bold'} fontSize={13} marginBottom={1} >Description<span style={{ color: 'red' }}>*</span></Box>
          <TextField fullWidth
            onChange={handleChangeText}
            name='description'
            value={submitData.values.description || ''}
          />
          {hasError('description') && <small style={{ color: 'red' }}>{submitData.errors.description[0]}</small>}
        </DivComponent>
        {
          submitData.mode == 'new' &&
          <DivComponent>
            <Box fontWeight={'bold'} fontSize={13} marginBottom={1} >Car type <span style={{ color: 'red' }}>*</span></Box>
            <AsyncSelect
              className={"MuiFormControl-marginDense"}
              isSearchable
              loadOptions={(inputValue) => loadOptions(inputValue, function loadingData(inputValue) {
                return new Promise(resolve => {
                  const resource = new Resource('car_types')

                  resource.client.fetchItems({
                    filters: { name: inputValue },
                    done: (response, meta) => {
                      resolve(response.map(item => {
                        return {
                          id: item.id,
                          name: item.name
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
                handleChange('car_type_id', value)
              }}
              value={submitData.values.car_type_id || null}
              styles={customStyles()}
            />
            {hasError('car_type_id') && <small style={{ color: 'red' }}>{submitData.errors.car_type_id[0]}</small>}
          </DivComponent>
        }
        <DivComponent>
          <Box fontWeight={'bold'} fontSize={13} marginBottom={1} >Width<span style={{ color: 'red' }}>*</span></Box>
          <TextField fullWidth
            onChange={handleChangeText}
            name='width'
            type={'number'}
            value={submitData.values.width || ''}
          />
          {hasError('width') && <small style={{ color: 'red' }}>{submitData.errors.width[0]}</small>}
        </DivComponent>
        <DivComponent>
          <Box fontWeight={'bold'} fontSize={13} marginBottom={1} >Height<span style={{ color: 'red' }}>*</span></Box>
          <TextField fullWidth
            onChange={handleChangeText}
            name='height'
            type={'number'}
            value={submitData.values.height || ''}
          />
          {hasError('height') && <small style={{ color: 'red' }}>{submitData.errors.height[0]}</small>}
        </DivComponent>
      </Stack>
    </div>
  )
}

export default ParkingLotForm