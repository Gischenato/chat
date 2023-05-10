import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Initial from '@layouts/Initial'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Test from '@pages/Test'
import Chat from '@pages/Chat'

export default function Router() {
  return (
    <Routes>
    <Route path='/' element={<Initial />}>
      <Route path="/" element={<Home />}>
        <Route path="/" element={<Test />} />
        <Route path="/chat/:chatId/:userId" element={<Chat />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to={'/'} />} />
    </Route>
  </Routes>
  )
}
