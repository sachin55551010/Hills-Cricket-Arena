import { CalendarDays, Mars, Pen, Phone, LogOut, Trophy } from "lucide-react";
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = data?.playerProfile;

  const profilePicture = profile?.profilePicture;
  const playerName = profile?.playerName;
  const gender = profile?.gender;
  const number = profile?.number;
  const battingStyle = profile?.battingStyle;
  const bowlingStyle = profile?.bowlingStyle;
  const playingRole = profile?.playingRole;
  const dateOfBirth = profile?.dateOfBirth;

  const isOwnProfile = authUser?.player?._id === profile?._id;

  const handleLogoutBtn = () => {
    logout();
    navigate("/");
  };

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formattedDOB = dateOfBirth
    ? new Date(dateOfBirth.slice(0, 10)).toLocaleDateString("en", options)
    : "_";

  const playerDetails = [
    {
      icon: <Phone size={18} />,
      label: "Phone Number",
      value: number,
    },
    {
      icon: <Mars size={18} />,
      label: "Gender",
      value: gender,
    },
    {
      icon: <img src={allRounder} alt="" className="h-5 w-5 object-contain" />,
      label: "Playing Role",
      value: playingRole,
    },
    {
      icon: <img src={allRounder} alt="" className="h-5 w-5 object-contain" />,
      label: "Batting Style",
      value: battingStyle,
    },
    {
      icon: <img src={allRounder} alt="" className="h-5 w-5 object-contain" />,
      label: "Bowling Style",
      value: bowlingStyle,
    },
    {
      icon: <CalendarDays size={18} />,
      label: "Date of Birth",
      value: formattedDOB,
    },
  ];

  if (isLoading) {
    return (
      <div className="h-dvh w-dvw flex items-center justify-center">
        <span className="loading loading-ring w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="h-dvh pt-12 flex flex-col overflow-hidden bg-base-100">
      <Header data="My Profile" />

      <main
        className={`flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-6 ${
          picturePopup ? "overflow-hidden" : ""
        }`}
      >
        <div className="w-full max-w-3xl mx-auto space-y-5">
          {/* Profile Card */}
          <section className="relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-sm">
            {/* Top Section */}
            <div className="h-28 sm:h-36 bg-base-200 border-b border-base-content/10" />

            {/* Profile Content */}
            <div className="relative px-5 sm:px-8 pb-7">
              {/* Avatar */}
              <button
                type="button"
                onClick={() => dispatch(setPicturePopup(true))}
                className="absolute -top-14 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0"
              >
                <div className="h-28 w-28 rounded-full border-4 border-base-100 bg-base-200 shadow-md overflow-hidden">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={playerName || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl font-bold">
                      {defaultAvatar(playerName)}
                    </div>
                  )}
                </div>
              </button>

              {/* User Info */}
              <div className="pt-16 sm:pt-6 sm:pl-36 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold capitalize tracking-tight">
                    {playerName || "Player"}
                  </h1>

                  <p className="text-sm text-base-content/60 capitalize mt-1">
                    {playingRole || "Player"}
                  </p>
                </div>

                {isOwnProfile && (
                  <Link
                    to={`/profile/edit-profile/${playerId}`}
                    className="btn btn-sm btn-outline gap-2 w-fit"
                  >
                    <Pen size={16} />
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Player Details */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="h-8 w-8 rounded-lg bg-base-200 flex items-center justify-center">
                <Trophy size={16} />
              </div>

              <div>
                <h2 className="font-semibold text-base">Player Details</h2>
                <p className="text-xs text-base-content/50">
                  Personal and playing information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {playerDetails.map((player, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 rounded-xl border border-base-content/10 bg-base-100 p-4 transition hover:border-base-content/20 hover:shadow-sm"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-base-200 flex items-center justify-center text-base-content/70">
                    {player.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-base-content/50">
                      {player.label}
                    </p>

                    <p className="mt-0.5 text-sm font-semibold capitalize truncate">
                      {player.value || "_"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <section className="flex flex-col sm:flex-row gap-3 pb-6">
            <Link
              to={`/profile/career-stats/${playerId}`}
              className="btn btn-outline flex-1"
            >
              <Trophy size={18} />
              Career Stats
            </Link>

            {isOwnProfile && (
              <button
                onClick={handleLogoutBtn}
                className="btn btn-error btn-outline flex-1"
              >
                <LogOut size={18} />
                Log Out
              </button>
            )}
          </section>
        </div>
      </main>

      {picturePopup && <PreviewProfilePicture playerId={playerId} />}
    </div>
  );
};
