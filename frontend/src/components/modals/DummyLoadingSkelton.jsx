export const DummyListLoadingSkelton = () => {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 p-2 rounded-md w-full">
      {[...Array(6)].map((_, index) => {
        return (
          <div
            key={index}
            className="flex flex-col gap-4 bg-base-200 w-full p-2 rounded-md"
          >
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
              <div className=" flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
          </div>
        );
      })}
    </ul>
  );
};

export const DummyCardLoadingSkelton = () => {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 p-2 rounded-md w-full">
      {[...Array(6)].map((_, index) => {
        return (
          <div key={index} className="flex flex-col gap-4 w-full">
            <div className="skeleton h-42 w-full"></div>
          </div>
        );
      })}
    </ul>
  );
};
