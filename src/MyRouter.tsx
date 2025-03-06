import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Monitor from './pages/Monitor'
import Home from './pages/Home'
import Layout from './components/Layout'
import Admin from './pages/Admin'

const MyRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}> 
        {/* <Route path="/" element={<App />} /> */}
        <Route path="/" element={<Login />} /> {/* te lleva a la ruta /Login */} 
        <Route path="/home" element={<Home />} /> {/* te lleva a la ruta /Home */} 
        <Route path="/monitor" element={<Monitor />} /> {/* te lleva a la ruta /Monitor */} 
        <Route path="/admin" element={<Admin />} /> {/* te lleva a la ruta /Admin */} 
      </Route>
    </Routes>
  )
}

export default MyRouter