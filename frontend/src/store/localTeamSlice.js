import {createSlice} from '@reduxjs/toolkit';
import {nanoid} from "nanoid"
export const localTeamSlice = createSlice({
    name: "localTeamSlice",
    initialState: {
        localTeamList: [],
        teamData: {
            teamName: "",
            teamId: nanoid(),
            players:[]
        }
        
    },
    reducers : {
        addLocalTeams: (state, action) => {

        },
        deleteLocalTeam: (state, action) => {

        },
        editLocalTeam: (state, action) => {

        }

    }

})

export const {addLocalTeams, deleteLocalTeam, editLocalTeam} = localTeamSlice.actions

export default createSlice.reducer