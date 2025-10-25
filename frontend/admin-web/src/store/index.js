import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice.js'
import context from './slices/contextSlice.js'

export const store = configureStore({
  reducer: { auth, context }
})

