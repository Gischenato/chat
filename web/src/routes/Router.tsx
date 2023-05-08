import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Initial from '../layouts/Initial'
import Chat from '../pages/Chat'
import Login from '../pages/Login'
import Register from '../pages/Register'

export default function Router() {
  return (
    <Routes>
    <Route path='/' element={<Initial />}>
      <Route path="/" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="*" element={<Navigate to={'/'} />} />
    </Route>
  </Routes>
  )
}
