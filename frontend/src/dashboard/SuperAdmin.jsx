import { useGetAllDataQuery } from "../store/superAdminApi";

export const SuperAdmin = () => {
  const { getAllData } = useGetAllDataQuery();
  console.log(getAllData);

  return <div className="bg-base-100 pt-12">SuperAdmin</div>;
};
