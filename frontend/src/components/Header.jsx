import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const Header = ({ data, backTo }) => {
  const navigate = useNavigate();
  const handleNavigateBtn = () => {
    if (backTo) return navigate(backTo);
    else navigate(-1);
  };
  return (
    <div>
      <header className="fixed top-0 left-0 z-[1000] h-[var(--nav-h)] bg-base-100 flex items-center gap-2 px-2 w-dvw">
        <button onClick={handleNavigateBtn}>
          <ArrowLeft size={30} strokeWidth={4} />
        </button>

        <h1 className="font-bold capitalize">{data}</h1>
      </header>
    </div>
  );
};
