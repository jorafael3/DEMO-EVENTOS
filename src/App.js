import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const Incidencias = React.lazy(() => import('./views/incidencias'))
const DetalleEvento = React.lazy(() => import('./views/incidencias/DetalleEvento'))


const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const isAuthenticated = useSelector((state) => state.isAuthenticated)

  const storedAuth = JSON.parse(localStorage.getItem('user_data'));
  const dispatch = useDispatch(); // Obtenemos la función dispatch de Redux
  // 


  if (storedAuth && storedAuth.isAuthenticated) {
    dispatch({ type: 'LOGIN_SUCCESS', user: storedAuth.user });
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme);



  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* <Route exact path="/login" name="Login Page" element={<Login />} /> */}
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />

          {/* <Route exact path="/eventos" name="Eventos" element={<Incidencias />} />
          <Route exact path="/evento/:id" name="Detalle Evento" element={<DetalleEvento />} /> */}


          {/* <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} /> */}
          <Route path="*" name="Home" element={isAuthenticated ? <DefaultLayout /> : <Login />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
