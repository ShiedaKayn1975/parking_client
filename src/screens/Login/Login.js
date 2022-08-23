import React from 'react'
import { AuthCardWrapper, AuthFooter } from './components'
import { styled } from '@mui/material/styles';
import { Grid, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AnimateButton from '../../components/extended/AnimateButton'
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../../authConfig'

const AuthWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  minHeight: '100vh'
}))

export const LoginScreen = (props) => {
  const theme = useTheme();
  const { instance } = useMsal();

  const signIn = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.log(e);
    });
  }

  return (
    <AuthWrapper>
      <Grid container direction="column" justifyContent="flex-end">
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ mt: 20 }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 1 }}>
                    <h2
                      style={{
                        marginLeft: 10,
                        color: theme.palette.primary.main,
                        textDecoration: 'none'
                      }}
                    >Parking car</h2>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <AnimateButton>
                        <Button
                          disableElevation
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          color="secondary"
                          onClick={signIn}
                        >
                          Login with microsoft office 365
                        </Button>
                      </AnimateButton>
                    </Box>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper>
  )
}