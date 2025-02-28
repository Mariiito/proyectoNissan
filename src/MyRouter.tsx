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
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}

export default MyRouter