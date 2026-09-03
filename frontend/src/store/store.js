import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authApi } from "./authApi";
import themeReducer from "./themeSlice";
import slicerReducer from "./scoreSlice"
import { tournamentApi } from "./tournamentApi";
import { teamApi } from "./teamApi";
import { inviteLinkApi } from "./inviteTeamLinkApi";
import { matchApi } from "./matchApi";
import { newsApi } from "./newsApi";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    score: slicerReducer,
    
    
    [authApi.reducerPath]: authApi.reducer,
    [tournamentApi.reducerPath]: tournamentApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [inviteLinkApi.reducerPath]: inviteLinkApi.reducer,
    [matchApi.reducerPath]: matchApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      authApi.middleware,
      tournamentApi.middleware,
      teamApi.middleware,
      inviteLinkApi.middleware,
      matchApi.middleware,
      newsApi.middleware,
    );
  },
});
