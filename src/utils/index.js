import React from 'react'
import { ActionableExceptionHandler } from "./ActionableErrorHandler";
import { DefaultApiErrorHandler } from "./DefaultApiErrorHandler";
import { Chip } from "@mui/material";

const customStyles = (error) => {
  return {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #C4C4C4',
      marginTop: 3,
      backgroundColor: 'transparent'
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none"
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: 'rgba(0, 0, 0, 0.38)',
      fontSize: '14px'
    }),
    menuList: (provided, state) => ({
      ...provided,
      maxHeight: 200,
      zIndex: 9999
    }),
    menu: (provided, state) => ({
      ...provided,
      zIndex: 9999
    }),
    menuPortal: (provided, state) => ({
      ...provided,
      zIndex: 9999
    })
  }
}

const parkingLotStatusMapping = {
  1: <Chip label="Active" color="primary" size='small' />,
  2: <Chip label="Ordered" color="default" size='small' />,
  3: <Chip label="Parked" color="error" size='small' />,
}

const makeId = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'VND',
});

export {
  ActionableExceptionHandler,
  DefaultApiErrorHandler, 
  customStyles,
  makeId,
  formatter,
  parkingLotStatusMapping
}