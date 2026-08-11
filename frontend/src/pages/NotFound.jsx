import { useNavigate } from "react-router-dom";
import errorImg from "../../assets/404.svg";
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-dvh pt-20 flex flex-col justify-center items-center">
      <img src={errorImg} alt="" className="h-90 w-90" />
      <button
        onClick={() => navigate(-1)}
        className="btn btn-warning mt-4 w-50 rounded-md"
      >
        Go Back
      </button>
    </div>
  );
};
