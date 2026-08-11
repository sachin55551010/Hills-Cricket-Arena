import { NewsList } from "../components/NewsList";
import { useGetNewsQuery } from "../store/newsApi";

export const HomePage = () => {
  const { data, isLoading } = useGetNewsQuery();

  if (isLoading) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  return (
    <div className={`py-16 max-h-dvh overflow-y-auto px-2`}>
      <NewsList articles={data?.articles} />
    </div>
  );
};
