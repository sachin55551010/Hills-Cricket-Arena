import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuthUser, setAuthUser } from "./authSlice";
import { toast } from "react-toastify";
export const authApi = createApi({
  reducerPath: "auth_api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/user`,
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    //* function to check user login or not
    checkAuthUser: builder.query({
      query: () => ({
        url: `/me`,
      }),
      providesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthUser(data));
        } catch (error) {
          console.log("check auth error :", error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(clearAuthUser());
        toast.success(data.message, {
          autoClose: 1500,
          theme: "colored",
        });
      },
    }),

    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/update-player",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthUser(data));
          toast.success(data.message, {
            autoClose: 1500,
            theme: "colored",
          });
        } catch (error) {
          toast.error(error.error.data.message, {
            theme: "colored",
            autoClose: 1500,
            hideProgressBar: true,
          });
        }
      },
    }),

    removeProfilePicture: builder.mutation({
      query: (playerId) => ({
        url: `/remove-photo/${playerId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          console.log("remove photo error : ", error);
        }
      },
    }),

    profile: builder.query({
      query: (playerId) => ({
        url: `/profile/${playerId}`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useCheckAuthUserQuery,
  useLogoutMutation,
  useUpdateUserMutation,
  useRemoveProfilePictureMutation,
  useProfileQuery,
} = authApi;
