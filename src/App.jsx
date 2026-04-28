import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminLoginPage from './pages/AdminLoginPage'
import StudentLoginPage from './pages/StudentLoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/login" element={<StudentLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App