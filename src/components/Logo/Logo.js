import React from 'react'
import { useTheme } from '@mui/material/styles';

const Logo = (props) => {
  const theme = useTheme();

  return (
    <img style={{ width: props.width}} src="data:image/png;base64,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"/>
  );
};

export default Logo;
