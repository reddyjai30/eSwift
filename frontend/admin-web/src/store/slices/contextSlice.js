import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'context',
  initialState: { selectedRestaurantId: null },
  reducers: {
    setRestaurantId(state, action) { state.selectedRestaurantId = action.payload }
  }
})

export const { setRestaurantId } = slice.actions
export default slice.reducer

