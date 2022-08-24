import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginScreen from './screens/Login'
import { Provider } from 'react-redux'
import configureStore from './store'
import { loadProfile } from './actions/profileAction'
import { useSelector, useDispatch } from 'react-redux'
import { serviceAgent } from './api'
import AppContext from './AppContext'
import { createBrowserHistory } from 'history'
import PageNotFound from './screens/404'
import { ThemeProvider } from '@mui/material/styles'
import theme from './themes'
import MainLayout from './layout/MainLayout'
import Account from './screens/Account/account'
import { ProductDetail } from './screens/ProductDetail'
import Cookies from 'universal-cookie'
import AdminUser from './screens/AdminUsers'
import { AdminVariant } from './screens/AdminVariant'
import { OrderedParkingLot } from './screens/OrderedParkingLot'
import { HistoryBuying } from './screens/HistoryBuying'
import { useMsal } from "@azure/msal-react";
import ParkingLot from './screens/ParkingLot/ParkingLot'
import AdminParkingLot from './screens/AdminParkingLot'

const adminComponents = [
  {
    path: '/',
    component: AdminUser
  },
  {
    path: '/admin/users',
    component: AdminUser
  },
  {
    path: '/admin/parking_lots',
    component: AdminParkingLot
  },
  {
    path: '/admin/variants',
    component: AdminVariant
  },
]

const components = [
  {
    path: '/',
    component: ParkingLot
  },
  {
    path: '/parking_lots',
    component: ParkingLot
  },
  {
    path: '/account',
    component: Account
  },
]

const loggerStore = store => next => action => {
  // console.group(action.type)
  // console.info('dispatching', action)
  let result = next(action)
  // console.log('next state', store.getState())
  // console.groupEnd()
  return result
}

const appHistory = createBrowserHistory()

const appStore = configureStore({}, [
  loggerStore
])

const AppInitialize = (props) => {
  const currentUser = useSelector(state => state.currentUser)
  const loadingState = useSelector(state => state.loadingState)
  const { instance } = useMsal()
  const dispatch = useDispatch()
  const cookies = new Cookies()

  useEffect(() => {
    instance.handleRedirectPromise().then(response => {
      if (response) {
        const accessToken = response.accessToken

        serviceAgent.verify_token({
          formData: {
            access_token: accessToken,
            type: 'microsoft'
          },
          onSuccess: (response) => {
            let token = response.data.token
            serviceAgent.receiveAuthToken(token)

            dispatch(loadProfile())
            window.location.href = '/'
          },
          onError: (error) => {

          }
        })
      }
    })
  }, [])

  useEffect(() => {
    if (!currentUser && serviceAgent.hasToken()) {
      dispatch(loadProfile())
    }
  }, [currentUser])

  if (currentUser && serviceAgent.hasToken()) {
    return (
      <AppContext.Provider value={{ currentUser }}>
        <props.children
          appReady={true}
          currentUser={currentUser}
          loadingState={loadingState}
        />
      </AppContext.Provider>
    )
  }

  if (!serviceAgent.hasToken()) {
    return <props.children
      appReady={false}
    />
  }

  if (loadingState.currentUser == 'failed') {
    return <>
      <div>App error</div>
      <a onClick={() => {
        cookies.remove('token')
        window.location.href = '/'
      }} style={{ color: 'green', cursor: 'pointer' }}>Go back</a>
    </>
  }

  return <>Loading</>
}

const withoutUser = (Component, extraProps = {}) => {
  return function (props) {
    let currentUser = useSelector(state => state.currentUser)
    return currentUser ? <Navigate to="/404" /> : <Component {...props} {...extraProps} />
  }
}

const SignInWrapper = withoutUser(LoginScreen, { verify_token: serviceAgent.verify_token })

const AppProvider = (props) => {

  return (
    <div>
      <Provider store={appStore}>
        <ThemeProvider theme={theme()}>
          <BrowserRouter history={appHistory}>
            <AppInitialize>
              {
                ({ appReady, currentUser, loadingState }) => (
                  <>
                    {
                      appReady == false &&
                      <Routes>
                        <Route exact path='/' element={<SignInWrapper />} />
                        <Route exact path='/login' element={<SignInWrapper />} />
                        <Route path='/404' element={<PageNotFound />} />
                      </Routes>
                    }
                    {
                      (currentUser?.status == 'active' && loadingState?.currentUser == 'success') &&
                      <Routes>
                        <Route element={<MainLayout />} >
                          {
                            (currentUser.kind == 'admin' ? adminComponents : components).map((component, index) => {
                              return <Route key={index} path={component.path} element={
                                <component.component history={appHistory} currentUser={currentUser} />
                              } />
                            })
                          }
                        </Route>
                        <Route path='/404' element={<PageNotFound />} />
                        <Route path="*" element={<Navigate to="/404" />} />
                      </Routes>
                    }
                  </>
                )
              }
            </AppInitialize>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default AppProvider