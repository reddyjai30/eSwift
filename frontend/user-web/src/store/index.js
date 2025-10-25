import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/auth.js'
import cart from './slices/cart.js'

export const store = configureStore({ reducer: { auth, cart } })

