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
      className={`min-h-dvh overflow-y-auto bg-base-200/30 ${
        picturePopup ? "overflow-hidden" : ""
      }`}
    >
      <div
        className={`min-h-dvh flex flex-col items-center transition-all duration-200 ${
          picturePopup ? "blur-md" : ""
        }`}
      >
        <Header data="Edit Profile" />

        <fieldset
          disabled={isLoading}
          className="w-full max-w-4xl px-3 sm:px-5 lg:px-6 pb-8"
        >
          <form
            onSubmit={handleSubmitBtn}
            className="mt-20 overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-sm"
          >
            {/* Profile Header */}
            <div className="border-b border-base-content/10 bg-base-200/30 px-4 py-7 sm:px-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => dispatch(setPicturePopup(true))}
                    className="group relative rounded-full outline-none"
                  >
                    {authUser?.player?.profilePicture === "" &&
                    profilePicture === null ? (
                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-primary-content ring-4 ring-base-100 shadow-md transition-transform duration-200 group-hover:scale-105">
                        <span className="text-4xl font-black">
                          {defaultAvatar(authUser?.player?.playerName)}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={profilePicture || authUser?.player?.profilePicture}
                        alt="avatar.jpg"
                        className="h-28 w-28 rounded-full object-cover ring-4 ring-base-100 shadow-md transition-transform duration-200 group-hover:scale-105"
                      />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Camera size={22} className="text-white" />
                    </div>
                  </button>

                  {/* Camera Button */}
                  <label
                    htmlFor="photo"
                    className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-base-100 bg-primary text-primary-content shadow-md transition-transform hover:scale-105"
                  >
                    <Camera size={17} />

                    <input
                      onChange={updateProfilePicture}
                      id="photo"
                      name="profilePicture"
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-lg font-semibold">
                    {authUser?.player?.playerName || "Your Profile"}
                  </h2>

                  <p className="mt-1 text-sm text-base-content/60">
                    Tap your photo to change it
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Player Name */}
                <label
                  htmlFor="player-name"
                  className="group flex w-full flex-col gap-2"
                >
                  <span className="text-sm font-medium text-base-content/80 group-focus-within:text-primary">
                    Player Name
                  </span>

                  <input
                    value={playerInfo.playerName}
                    required={true}
                    onChange={(e) =>
                      setPlayerInfo({
                        ...playerInfo,
                        playerName: e.target.value,
                      })
                    }
                    id="player-name"
                    type="text"
                    name="playerName"
                    placeholder="Enter player name"
                    className="h-11 w-full rounded-xl border border-base-content/15 bg-base-100 px-3.5 outline-none transition-all placeholder:text-base-content/35 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  {errorMessage && (
                    <p className="text-xs text-error">{errorMessage}</p>
                  )}
                </label>

                {/* Mobile Number */}
                <label
                  htmlFor="mobile-number"
                  className="group flex w-full flex-col gap-2"
                >
                  <span className="text-sm font-medium text-base-content/80 group-focus-within:text-primary">
                    Mobile Number
                  </span>

                  <input
                    id="mobile-number"
                    onInput={handleOnInput}
                    value={playerInfo.number}
                    max={10}
                    onChange={(e) =>
                      setPlayerInfo({
                        ...playerInfo,
                        number: e.target.value,
                      })
                    }
                    type="text"
                    name="number"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    className={`h-11 w-full rounded-xl border bg-base-100 px-3.5 outline-none transition-all placeholder:text-base-content/35 focus:ring-4 focus:ring-primary/10 ${
                      isError
                        ? "border-error focus:border-error focus:ring-error/10"
                        : "border-base-content/15 focus:border-primary"
                    }`}
                  />

                  {isError && (
                    <p className="text-xs text-error">{errorMessage}</p>
                  )}
                </label>

                {/* Date of Birth */}
                <label
                  htmlFor="dob"
                  className="group flex w-full flex-col gap-2"
                >
                  <span className="text-sm font-medium text-base-content/80 group-focus-within:text-primary">
                    Date of Birth
                  </span>

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
                    className="h-11 w-full rounded-xl border border-base-content/15 bg-base-100 px-3.5 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </label>

                {/* Playing Role */}
                <label
                  htmlFor="roles"
                  className="group flex w-full flex-col gap-2"
                >
                  <span className="text-sm font-medium text-base-content/80 group-focus-within:text-primary">
                    Playing Role
                  </span>

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
                    className="h-11 w-full rounded-xl border border-base-content/15 bg-base-100 px-3.5 capitalize outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="" disabled>
                      Select playing role
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

                {/* Batting Style */}
                <label
                  htmlFor="batting-style"
                  className="group flex w-full flex-col gap-2"
                >
                  <span className="text-sm font-medium text-base-content/80 group-focus-within:text-primary">
                    Batting Style
                  </span>

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
                    className="h-11 w-full rounded-xl border border-base-content/15 bg-base-100 px-3.5 capitalize outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="" disabled>
                      Select batting type
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

                {/* Bowling Style */}
                <label
                  htmlFor="bowling-style"
                  className="group flex w-full flex-col gap-2"
                >
                  <span className="text-sm font-medium text-base-content/80 group-focus-within:text-primary">
                    Bowling Style
                  </span>

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
                    className="h-11 w-full rounded-xl border border-base-content/15 bg-base-100 px-3.5 capitalize outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="" disabled>
                      Select bowling type
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
              </div>

              {/* Gender */}
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-base-content/80">
                  Gender
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {GENDER.map((val, index) => {
                    const selected = playerInfo.gender === val;

                    return (
                      <label
                        key={index}
                        className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all ${
                          selected
                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/10"
                            : "border-base-content/15 bg-base-100 hover:border-base-content/30"
                        }`}
                      >
                        <input
                          className="hidden"
                          value={val}
                          checked={selected}
                          onChange={(e) =>
                            setPlayerInfo({
                              ...playerInfo,
                              gender: e.target.value,
                            })
                          }
                          type="radio"
                          name="gender"
                        />

                        <span>{val}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Update Button */}
              <button
                className={`mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.98] ${
                  isLoading ? "btn-soft" : "btn-success hover:shadow-md"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}

                <span
                  className={`${isLoading ? "loading loading-spinner loading-sm" : ""}`}
                ></span>
              </button>
            </div>
          </form>
        </fieldset>
      </div>

      {picturePopup && <PreviewProfilePicture />}
    </div>
  );
};
