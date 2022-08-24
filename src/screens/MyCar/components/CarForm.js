import React, { useState } from 'react'
import {
  Stack, TableCell, Chip, Tab, Tabs, Box, TableHead, TextField, InputAdornment, IconButton, Button
} from '@mui/material'
import { styled } from '@mui/system';
import AsyncSelect from 'react-select/async';
import { customStyles, makeId } from '../../../utils';
import Resource from '../../../resources/Resource/resource';
import MultiFileUploader from '../../../components/MultiFileUploader/MultiFileUploader';

const DivComponent = styled('div')({
  marginBottom: 12
})

const CarForm = (props) => {
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

  const handleUpload = (event) => {
    handleChange('images', event.target.value)
  }

  return (
    <div>
      <Stack direction={'column'}>
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
          <Box fontWeight={'bold'} fontSize={13} marginBottom={1} >License plate<span style={{ color: 'red' }}>*</span></Box>
          <TextField fullWidth
            onChange={handleChangeText}
            name='license_plate'
            value={submitData.values.license_plate || ''}
          />
          {hasError('license_plate') && <small style={{ color: 'red' }}>{submitData.errors.license_plate[0]}</small>}
        </DivComponent>
        {
          submitData.mode == 'new' &&
          <DivComponent>
            <Box fontWeight={'bold'} fontSize={13} marginBottom={1} >Images<span style={{ color: 'red' }}>*</span></Box>
            <MultiFileUploader
              onChange={(files) => {
                const event = {
                  target: {
                    name: 'images',
                    value: files
                  }
                }
                handleUpload(event)
              }}
              title="Upload your car images"
              hideUploadButton={true}
              hidePreview={false}
            />
          </DivComponent>
        }
      </Stack>
    </div>
  )
}

export default CarForm