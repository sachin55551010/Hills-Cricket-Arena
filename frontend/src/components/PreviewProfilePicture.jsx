import { useDispatch, useSelector } from "react-redux";
import { setPicturePopup } from "../store/authSlice";
import { X } from "lucide-react";
import { defaultAvatar } from "../utils/noprofilePicHelper";
import {
  useProfileQuery,
  useRemoveProfilePictureMutation,
} from "../store/authApi";
import { useParams } from "react-router-dom";

export const PreviewProfilePicture = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [removePhoto] = useRemoveProfilePictureMutation();

  const { playerId } = useParams();
  const { data } = useProfileQuery(playerId);

  const varifyUser = authUser?.player?._id === playerId;
  const profilePicture = data?.playerProfile?.profilePicture;
  const playerName = data?.playerProfile?.playerName;

  const handleRemoveProfilePicBtn = () => {
    removePhoto(playerId);
  };
  return (
    <div className="fixed z-[999] inset-0 w-full flex justify-center pt-20 h-dvh backdrop-blur-lg overflow-hidden">
      <div className="relative rounded-full flex flex-col items-center">
        {profilePicture === "" ? (
          <div className="rounded-full h-96 w-96 flex items-center justify-center bg-primary">
            <div className="text-8xl font-black">
              {defaultAvatar(playerName)}
            </div>
          </div>
        ) : (
          <img
            src={profilePicture}
            alt=""
            className="h-96 w-96 object-cover
           rounded-full
          "
          />
        )}

        <div
          onClick={() => dispatch(setPicturePopup(false))}
          className="absolute bg-base-100 w-fit p-1 rounded-full transition-all duration-300 ease-in-out hover:scale-115 hover:bg-error top-0 right-0"
        >
          <X strokeWidth={5} />
        </div>
        {varifyUser && authUser?.player?.profilePicture !== "" && (
          <button
            onClick={handleRemoveProfilePicBtn}
            className="btn btn-outline btn-error rounded-md mt-4"
          >
            Remove Photo
          </button>
        )}
      </div>
    </div>
  );
};
