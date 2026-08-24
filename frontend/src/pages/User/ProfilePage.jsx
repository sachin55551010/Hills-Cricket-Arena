import { CalendarDays, Mars, Pen, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLogoutMutation, useProfileQuery } from "../../store/authApi";
import { Header } from "../../components/Header";
import { setPicturePopup } from "../../store/authSlice";
import { defaultAvatar } from "../../utils/noprofilePicHelper";
import allRounder from "../../../assets/all_rounder.svg";
import { PreviewProfilePicture } from "../../components/PreviewProfilePicture";
export const ProfilePage = () => {
  const { authUser, picturePopup } = useSelector((state) => state.auth);

  const [logout] = useLogoutMutation();
  const { playerId } = useParams();
  const { data, isLoading } = useProfileQuery(playerId);

  const profilePicture = data?.playerProfile?.profilePicture;
  const playerName = data?.playerProfile?.playerName;
  const gender = data?.playerProfile?.gender;
  const number = data?.playerProfile?.number;
  const battingStyle = data?.playerProfile?.battingStyle;
  const bowlingStyle = data?.playerProfile?.bowlingStyle;
  const playingRole = data?.playerProfile?.playingRole;
  const dateOfBirth = data?.playerProfile?.dateOfBirth;

  const navigate = useNavigate();
  const handleLogoutBtn = () => {
    logout();
    navigate("/");
  };
  const dispatch = useDispatch();
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const playerDetails = [
    { icon: <Phone />, label: "Phone Number", value: number },
    { icon: <Mars />, label: "Gender", value: gender },
    {
      icon: (
        <img
          src={allRounder}
          alt=""
          className="h-[100%] w-[100%] object-contain"
        />
      ),
      label: "Playing Role",
      value: playingRole,
    },
    {
      icon: (
        <img
          src={allRounder}
          alt=""
          className="h-[100%] w-[100%] object-contain"
        />
      ),
      label: "Batting Style",
      value: battingStyle,
    },
    {
      icon: (
        <img
          src={allRounder}
          alt=""
          className="h-[100%] w-[100%] object-contain"
        />
      ),
      label: "Bowling Style",
      value: bowlingStyle,
    },
    {
      icon: <CalendarDays />,
      label: "Date Of Birth",
      value: dateOfBirth
        ? new Date(dateOfBirth.slice(0, 10)).toLocaleDateString("en", options)
        : "_",
    },
  ];

  if (isLoading) {
    return (
      <div className="h-dvh w-dvw flex items-center justify-center">
        <span className="loading loading-ring w-20 h-20"></span>
      </div>
    );
  }
  return (
    <div className={`h-dvh flex flex-col overflow-hidden`}>
      <Header data="My Profile" />
      <div
        className={`flex-1 overflow-y-auto pt-18 px-6 items-center flex flex-col custom-scrollbar ${
          picturePopup && "overflow-hidden"
        }`}
      >
        {/* top gradient div */}
        <section className="relative w-full flex-shrink-0 h-85 md:w-[95%] lg:w-[60%] shadow-[0px_0px_10px_rgba(0,0,0,.4)] rounded-xl border border-base-content/20">
          {/* gredient div */}
          <div className="h-[40%] bg-gradient-to-br from-primary to-secondary rounded-t-xl"></div>

          {/* display user image */}
          <div
            onClick={() => dispatch(setPicturePopup(true))}
            className="absolute hover:cursor-pointer top-[20%] left-1/2 -translate-x-1/2 rounded-full h-30 w-30 border border-base-content/80 md:left-[15%]"
          >
            {profilePicture === "" ? (
              <div className="rounded-full h-[100%] w-[100%] border-1 flex items-center justify-center bg-primary shadow-[0px_0px_20px_rgba(0,0,0,1)]">
                <div className="text-4xl font-extrabold">
                  {defaultAvatar(playerName)}
                </div>
              </div>
            ) : (
              <img
                className="rounded-full h-[100%] w-[100%] object-cover shadow-[0px_0px_20px_rgba(0,0,0,1)]"
                src={profilePicture}
                alt="img"
              />
            )}
          </div>

          {/* player information section */}
          <div className="bg-base-100 h-[60%] rounded-b-xl flex flex-col items-center">
            <div className=" mt-18 flex flex-col items-center gap-4">
              <div className="flex flex-col items-center md:absolute top-[31%] left-[28%] gap-2 lg:left-[23%]">
                <h1 className="text-2xl font-extrabold capitalize">
                  {playerName}
                </h1>
                <h4 className="font-semibold capitalize">
                  {playingRole || ""}
                </h4>
              </div>

              {authUser?.player?._id === data?.playerProfile?._id && (
                <Link
                  to={`/profile/edit-profile/${playerId}`}
                  className="md:absolute top-[34%] right-[5%]"
                >
                  <button className="btn btn-info flex justify-center items-center">
                    <Pen size={20} />
                    <span className="font-bold">Edit Profile</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* player all basic details gender number playing role etc */}
        <section className="w-full rounded-xl md:w-[95%] lg:w-[60%] mt-4 mb-6">
          <ul className=" grid grid-cols-1 gap-3 md:grid-cols-2 mb-6 lg:grid-cols-3">
            {playerDetails.map((player, index) => {
              return (
                <li
                  key={index}
                  className="rounded-lg flex gap-3 items-center p-3 shadow-[0px_0px_10px_rgba(0,0,0,.4)]"
                >
                  <div className="badge badge-soft badge-info flex items-center justify-center h-9 w-9 rounded-lg p-[.5rem]">
                    {player.icon}
                  </div>
                  <div>
                    <h1 className="font-bold text-sm">{player.label}</h1>
                    <h1 className="capitalize text-sm">
                      {player.value || "_"}
                    </h1>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <Link
              to={`/profile/career-stats/${playerId}`}
              className="md:flex-1 btn btn-info"
            >
              Career Stats
            </Link>

            {authUser?.player?._id === data?.playerProfile?._id && (
              <button
                onClick={handleLogoutBtn}
                className="md:flex-1 btn btn-error"
              >
                Log Out
              </button>
            )}
          </div>
        </section>
      </div>
      {picturePopup && <PreviewProfilePicture playerId={playerId} />}
    </div>
  );
};
