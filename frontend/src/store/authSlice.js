import { createSlice } from "@reduxjs/toolkit";

const authApi = createSlice({
  name: "auth_slice",
  initialState: {
    authUser: null,
    socket: null,
    picturePopup: false,
    isMenuOpen: false,
  },

  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    clearAuthUser: (state) => {
      state.authUser = null;
    },
    setPicturePopup: (state, action) => {
      state.picturePopup = action.payload;
    },
    setIsMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
  },
});

export const { setAuthUser, clearAuthUser, setPicturePopup, setIsMenuOpen } =
  authApi.actions;
export default authApi.reducer;
