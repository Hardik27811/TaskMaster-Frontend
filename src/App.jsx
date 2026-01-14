import {Routes,Route ,Navigate} from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import ProtectedRoute from './components/ProtectedRoute'
function App() {


  return (
    <Routes>

      {/* Redirect root path to login */}
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route
      path="/"
      element={
        localStorage.getItem('token')
          ? <Navigate to="/dashboard" replace />
          : <Navigate to="/login" replace />
      }
    />


      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>

      <Route path='/dashboard' element={
                              <ProtectedRoute>
                                  <Dashboard/>
                              </ProtectedRoute>
       }/>

      <Route path='/profile'  element ={
                                        <ProtectedRoute>
                                          <Profile/>
                                        </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default App
