import React from 'react'
import { Link } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
// import Logo from '../../../components/Logo/Logo';
import { useTheme } from '@mui/material';
import Logo from '../../../components/Logo/Logo';

const LogoSection = () => {
    const themes = useTheme()
    return (
        <ButtonBase disableRipple component={Link} to={'/'}>
            {/* <Logo /> */}
            <h3
                style={{
                    marginLeft: 10,
                    color: themes.palette.primary.main
            }}
            >Parking car</h3>
        </ButtonBase>
    )
};

export default LogoSection;
