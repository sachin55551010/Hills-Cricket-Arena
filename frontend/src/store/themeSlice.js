import { createSlice } from "@reduxjs/toolkit";

const getDefaultTheme = () => {
  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  return theme ? "dark" : "light";
};

const saved_theme = JSON.parse(localStorage.getItem("my_theme"));

const initial_theme = saved_theme ? saved_theme : getDefaultTheme();

if (!saved_theme) {
  localStorage.setItem("my_theme", JSON.stringify(initial_theme));
}
const themeSlice = createSlice({
  name: "theme",
  initialState: {
    myTheme: saved_theme,
    chooseTheme: false,
  },

  reducers: {
    setChooseTheme: (state, action) => {
      state.chooseTheme = action.payload;
    },

    setMyTheme: (state, action) => {
      state.myTheme = action.payload;
      localStorage.setItem("my_theme", JSON.stringify(action.payload));
    },
  },
});
export const { setChooseTheme, setMyTheme } = themeSlice.actions;
export default themeSlice.reducer;
