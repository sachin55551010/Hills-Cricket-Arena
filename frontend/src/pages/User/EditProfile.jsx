import { useDispatch, useSelector } from "react-redux";
import { Header } from "../../components/Header";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { PLAYING_ROLE } from "../../constant/playingRole";
import { BATTING_STYLE } from "../../constant/battingStyle";
import { BOWLING_STYLE } from "../../constant/bowlingStyle";
import { setPicturePopup } from "../../store/authSlice";
import { useUpdateUserMutation } from "../../store/authApi";
import { GENDER } from "../../constant/gender";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { defaultAvatar } from "../../utils/noprofilePicHelper";
import { PreviewProfilePicture } from "../../components/PreviewProfilePicture";

export const EditProfile = () => {
  const { authUser, picturePopup } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { playerId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser?.player) return;
    setPlayerInfo({
      playerName: authUser?.player?.playerName,
      gender: authUser?.player?.gender || "",
      number: authUser?.player?.number || "",
      battingStyle: authUser?.player?.battingStyle || "",
      bowlingStyle: authUser?.player?.bowlingStyle || "",
      playingRole: authUser?.player?.playingRole || "",
      dateOfBirth: authUser?.player?.dateOfBirth || "",
      playerId,
    });
  }, [authUser?.player, playerId]);

  // const profilePicture = data?.playerProfile?.profilePicture
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [playerInfo, setPlayerInfo] = useState({
    profilePicture: "",
    playerName: "",
    gender: "",
    number: "",
    battingStyle: "",
    bowlingStyle: "",
    playingRole: "",
    dateOfBirth: "",
    playerId,
  });

  const [updateUser, { isLoading, isError }] = useUpdateUserMutation();

  const updateProfilePicture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setProfilePicture(base64Image);
      setPlayerInfo((prev) => ({ ...prev, profilePicture: base64Image }));
    };
  };

  const handleOnInput = (e) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) {
      setErrorMessage("Please Enter Numbers Only");
    } else {
      setErrorMessage("");
    }
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const handleSubmitBtn = async (e) => {
    try {
      e.preventDefault();

      if (playerInfo.number === "" && playerInfo.number.length < 10) {
        toast.error("Please enter 10 digit number", {
          position: "top-center",
          autoClose: 1500,
          theme: "colored",
        });
        return;
      }
      await updateUser(playerInfo).unwrap();
      navigate(`/profile/${playerId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`${picturePopup && "overflow-hidden"} overflow-y-scroll h-dvh`}
    >
      <div
        className={`flex flex-col items-center ${
          picturePopup && "blur-md transition-all duration-200"
        }`}
      >
        <Header data="Edit Profile" />

        <fieldset
          disabled={isLoading}
          className=" w-full md:w-[90%] lg:w-[70%] p-2"
        >
          <form
            onSubmit={handleSubmitBtn}
            className="mt-18 rounded-xl border border-base-content/20 flex flex-col items-center p-2 mb-4"
          >
            <div className="relative flex flex-col items-center">
              <div
                onClick={() => dispatch(setPicturePopup(true))}
                className="hover:cursor-pointer"
              >
                {authUser?.player?.profilePicture === "" &&
                profilePicture === null ? (
                  <div className="rounded-full h-25 w-25 border-1 flex items-center justify-center bg-primary">
                    <div className="text-4xl font-black">
                      {defaultAvatar(authUser?.player?.playerName)}
                    </div>
                  </div>
                ) : (
                  <img
                    src={profilePicture || authUser?.player?.profilePicture}
                    alt="avatar.jpg"
                    className="object-cover h-25 w-25 rounded-full "
                    accept="image/*"
                  />
                )}
              </div>

              <label
                htmlFor="photo"
                className="absolute top-17 right-[2.5rem] cursor-pointer"
              >
                <div className="bg-red-500 p-1 rounded-full">
                  <Camera />
                </div>
                <input
                  onChange={updateProfilePicture}
                  id="photo"
                  name="profilePicture"
                  type="file"
                  className="hidden"
                />
              </label>
              <p className="mt-4">Change profile picture</p>
            </div>

            <div className="flex flex-col gap-6 items-center mt-4 w-[90%] md:grid grid-cols-2 md:gap-x-4 md:gap-y-6">
              <label
                htmlFor="player-name"
                className="w-full flex flex-col gap-2 focus-within:text-success"
              >
                Player Name
                <p>{errorMessage}</p>
                <input
                  value={playerInfo.playerName}
                  required={true}
                  onChange={(e) =>
                    setPlayerInfo({ ...playerInfo, playerName: e.target.value })
                  }
                  id="player-name"
                  type="text"
                  name="playerName"
                  className="border rounded-lg h-10 w-full outline-none pl-3 "
                />
              </label>
              <label
                htmlFor="mobile-number"
                className="relative w-full flex flex-col gap-2 focus-within:text-success"
              >
                Mobile Number
                <input
                  id="mobile-number"
                  onInput={handleOnInput}
                  value={playerInfo.number}
                  max={10}
                  onChange={(e) =>
                    setPlayerInfo({ ...playerInfo, number: e.target.value })
                  }
                  type="text"
                  name="number"
                  maxLength={10}
                  className={`border rounded-lg h-10 w-full outline-none pl-3 ${
                    isError && "border-red-500"
                  }`}
                />
                <p className="absolute text-error text-[.8rem] top-19">
                  {errorMessage}
                </p>
              </label>
              <label
                htmlFor="dob"
                className="w-full flex flex-col gap-2 focus-within:text-success"
              >
                Date of birth
                <input
                  id="dob"
                  value={playerInfo?.dateOfBirth?.split("T")[0] || ""}
                  min="1900-01-01"
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setPlayerInfo({
                      ...playerInfo,
                      dateOfBirth: e.target.value,
                    })
                  }
                  type="date"
                  name="dateOfBirth"
                  className="border rounded-lg h-10 w-full outline-none pl-3 "
                />
              </label>
              <label
                htmlFor="roles"
                className="w-full flex flex-col gap-2 focus-within:text-success"
              >
                Playing Role
                <select
                  value={playerInfo.playingRole}
                  onChange={(e) =>
                    setPlayerInfo({
                      ...playerInfo,
                      playingRole: e.target.value,
                    })
                  }
                  name="playingRole"
                  id="roles"
                  className="w-full border h-10 rounded-lg capitalize"
                >
                  <option value="" disabled>
                    Select Playing Role
                  </option>
                  {PLAYING_ROLE.map((val, index) => {
                    return (
                      <option
                        key={index}
                        value={val}
                        className="bg-base-300 text-base-content"
                      >
                        {val}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label
                htmlFor="batting-style"
                className="w-full flex flex-col gap-2 focus-within:text-success"
              >
                Batting Style
                <select
                  value={playerInfo.battingStyle}
                  onChange={(e) =>
                    setPlayerInfo({
                      ...playerInfo,
                      battingStyle: e.target.value,
                    })
                  }
                  name="battingStyle"
                  id="batting-style"
                  className="w-full border h-10 rounded-lg capitalize"
                >
                  <option value="" disabled>
                    Select Batting Type
                  </option>
                  {BATTING_STYLE.map((val, index) => {
                    return (
                      <option
                        key={index}
                        value={val}
                        className="bg-base-300 text-base-content"
                      >
                        {val}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label
                htmlFor="bowling-style"
                className="w-full flex flex-col gap-2 focus-within:text-success"
              >
                Bolwing Style
                <select
                  value={playerInfo.bowlingStyle}
                  onChange={(e) =>
                    setPlayerInfo({
                      ...playerInfo,
                      bowlingStyle: e.target.value,
                    })
                  }
                  name="bowlingStyle"
                  id="bowling-style"
                  className="w-full border h-10 rounded-lg capitalize"
                >
                  <option value="" disabled>
                    Select Bowling Type
                  </option>
                  {BOWLING_STYLE.map((val, index) => {
                    return (
                      <option
                        key={index}
                        value={val}
                        className="bg-base-300 text-base-content"
                      >
                        {val}
                      </option>
                    );
                  })}
                </select>
              </label>
              <div className="flex justify-around w-full">
                {GENDER.map((val, index) => {
                  return (
                    <div
                      key={index}
                      className="flex gap-1 items-center capitalize"
                    >
                      <input
                        className="radio radio-xs"
                        value={val}
                        checked={playerInfo.gender === val}
                        onChange={(e) =>
                          setPlayerInfo({
                            ...playerInfo,
                            gender: e.target.value,
                          })
                        }
                        type="radio"
                        name="gender"
                      />
                      <h1>{val}</h1>
                    </div>
                  );
                })}
              </div>
              <button
                className={`btn btn-success w-full ${isLoading && "btn-soft"}`}
                disabled={isLoading}
              >
                {isLoading ? "Updating" : "Update"}
                <span className={`${isLoading ? "loading" : ""}`}></span>
              </button>
            </div>
          </form>
        </fieldset>
      </div>
      {picturePopup && <PreviewProfilePicture />}
    </div>
  );
};
