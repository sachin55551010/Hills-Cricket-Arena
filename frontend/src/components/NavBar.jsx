import {
  Menu,
  Palette,
  Target,
  Trophy,
  UserRound,
  UserStar,
} from "lucide-react";

import { GiCricketBat } from "react-icons/gi";

import { SideMenuBar } from "./SideMenuBar";

import { useDispatch, useSelector } from "react-redux";

import { setChooseTheme } from "../store/themeSlice";
import { setIsMenuOpen } from "../store/authSlice";

import { Link, NavLink } from "react-router-dom";

import { defaultAvatar } from "../utils/noprofilePicHelper";
import { useProfileQuery } from "../store/authApi";

export const NavBar = () => {
  const { authUser, isMenuOpen } = useSelector((state) => state.auth);
  const admin_email = authUser?.player?.playerId?.email;

  const isAdmin = admin_email === import.meta.env.VITE_ADMIN_EMAIL_ID;
  const dispatch = useDispatch();

  const playerId = authUser?.player?._id;

  const { isLoading } = useProfileQuery(playerId);

  const handleChangeThemeBtn = (e) => {
    e.stopPropagation();
    dispatch(setChooseTheme(true));
  };

  const navItemClass = ({ isActive }) =>
    `
      flex items-center gap-2
      rounded-lg
      px-3 py-2
      text-sm font-medium
      transition-all duration-200
      ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
      }
    `;

  return (
    <div>
      <header
        className="
        bg-base-100
          fixed z-90
          h-[var(--nav-h)]
          w-full
          flex items-center
          px-2
          shadow-[0px_0px_10px_rgba(0,0,0,.4)]
        "
      >
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          {!isMenuOpen && (
            <button
              onClick={() => dispatch(setIsMenuOpen(true))}
              className="ml-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu strokeWidth={3} />
            </button>
          )}

          {/* Logo */}
          <Link to="/">
            <div className="flex items-center gap-2">
              <img
                src="/my_app_logo.png"
                alt="Hills Cricket Arena"
                className="h-8"
              />

              <h1 className="font-extrabold">Hills Cricket Arena</h1>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {/* Profile */}
          {!isLoading && (
            <>
              {!authUser ? (
                <NavLink to="/login" className={navItemClass}>
                  <UserRound size={18} strokeWidth={1.8} />

                  <span>Log In</span>
                </NavLink>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink
                    to={`/profile/${playerId}`}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-2
                      rounded-lg
                      px-3 py-2
                      transition-all duration-200
                      ${isActive ? "bg-primary/10" : "hover:bg-base-content/5"}
                    `
                    }
                  >
                    {/* Avatar */}
                    {authUser?.player?.profilePicture === "" ? (
                      <div
                        className="
                        flex h-7 w-7
                        items-center justify-center
                        rounded-full
                        bg-primary/10
                        text-primary
                        ring-1 ring-primary/10
                      "
                      >
                        <span className="text-xs font-bold capitalize">
                          {defaultAvatar(authUser?.player?.playerName)}
                        </span>
                      </div>
                    ) : (
                      <img
                        className="
                        h-7 w-7
                        rounded-full
                        object-cover
                        ring-1 ring-base-content/10
                      "
                        src={
                          authUser?.player?.profilePicture ||
                          authUser?.player?.playerId?.profileImg ||
                          "avatar.jpg"
                        }
                        alt=""
                      />
                    )}

                    <span className="max-w-[120px] truncate text-sm font-medium">
                      {authUser?.player?.playerName}
                    </span>
                  </NavLink>

                  {isAdmin && (
                    <NavLink
                      className="text-base-content/60 hover:text-base-content"
                      to="/admin-dashboard"
                    >
                      <UserStar size={20} />
                    </NavLink>
                  )}
                </div>
              )}
            </>
          )}

          {/* Separator */}
          <div className="mx-1 h-6 w-px bg-base-content/10" />

          {/* My Tournaments */}
          {authUser?.player?.role === "organiser" && (
            <NavLink to="my-tournament" className={navItemClass}>
              <Target size={18} strokeWidth={1.8} />

              <span>My Tournaments</span>
            </NavLink>
          )}

          {/* Create Tournament */}
          <NavLink to="add-tournament" className={navItemClass}>
            <Trophy size={18} strokeWidth={1.8} />

            <span>Create Tournament</span>
          </NavLink>

          {/* Start Scoring */}
          <NavLink to="/local-match/setup" className={navItemClass}>
            <GiCricketBat size={20} />

            <span>Start Scoring</span>
          </NavLink>

          {/* Theme */}
          <button
            onClick={handleChangeThemeBtn}
            className="
              group
              flex items-center gap-2
              rounded-lg
              px-3 py-2
              text-sm font-medium
              text-base-content/70
              transition-all duration-200
              hover:bg-base-content/5
              hover:text-base-content
            "
          >
            <Palette
              size={18}
              strokeWidth={1.8}
              className="
                transition-transform duration-200
                group-hover:rotate-12
              "
            />

            <span>Theme</span>
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <SideMenuBar />
    </div>
  );
};
