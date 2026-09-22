import { useGetAllDataQuery } from "../store/superAdminApi";

export const SuperAdmin = () => {
  const { getAllData } = useGetAllDataQuery();
  console.log(getAllData);

  return <div className="bg-base-100 h-dvh w-dvh pt-12">SuperAdmin</div>;
};
