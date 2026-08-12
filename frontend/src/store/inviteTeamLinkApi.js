import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

export const inviteLinkApi = createApi({
  reducerPath: "inviteLink_api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/invite`,
    credentials: "include",
    
  }),
  tagTypes: ["Invite"],
  endpoints: (builder) => ({
    // get inviteLink data
    getInviteData: builder.query({
      query: (token) => ({
        url: `/invite/${token}`,
      }),
      providesTags: ["Invite"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          toast.error(error.error.data.message, {
            autoClose: 1500,
          });
        }
      },
    }),

    createInviteLink: builder.mutation({
      query: ({ tournamentId, teamId }) => ({
        url: `/create-invite/${tournamentId}/${teamId}`,
        method: "POST",
      }),
    }),

    validateInviteLink: builder.mutation({
      query: (token) => ({
        url: `/join-team/${token}`,
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
        } catch (error) {
          console.log(error);
          toast.error(error.error.data.message, {
            autoClose: 2000,
            theme: "dark",
          });
        }
      },
    }),
  }),
});

export const {
  useCreateInviteLinkMutation,
  useValidateInviteLinkMutation,
  useGetInviteDataQuery,
} = inviteLinkApi;
