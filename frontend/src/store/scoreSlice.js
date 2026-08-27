import {createSlice} from "@reduxjs/toolkit"

let currentMatchData = {};

try {
  currentMatchData = JSON.parse(
    localStorage.getItem("currentMatchData") || "{}"
  );
} catch (error) {
  console.error("Invalid currentMatchData in localStorage:", error);
}
const scoreSlice = createSlice({
    name:"score_slice",
    initialState: currentMatchData,
    reducers:{
        addRuns : (state, action) => {
            console.log("state reducer", state);
            console.log("action reducer", action);
            
            
        }
    },
})
export const {addRuns} = scoreSlice.actions
export default scoreSlice.reducer