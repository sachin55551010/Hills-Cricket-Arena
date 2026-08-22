import { Palette, Target, Trophy, UserRound, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setChooseTheme } from "../store/themeSlice";
import { setIsMenuOpen } from "../store/authSlice";
import { defaultAvatar } from "../utils/noprofilePicHelper";
import { useProfileQuery } from "../store/authApi";
import { GiCricketBat } from "react-icons/gi";

export const SideMenuBar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isMenuOpen } = useSelector((state) => state.auth);

  const handleChangeThemeBtn = (e) => {
    e.stopPropagation();
    dispatch(setChooseTheme(true));
  };

  const playerId = authUser?.player?._id;
  const { isLoading } = useProfileQuery(playerId);

  const closeBtn = () => {
    dispatch(setIsMenuOpen(false));
  };

  const navItemClass = ({ isActive }) =>
    `
      group flex items-center gap-3
      rounded-xl px-3 py-2.5
      text-sm font-medium
      transition-all duration-200
      ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
      }
      lg:gap-2 lg:px-2.5 lg:py-2
    `;

  return (
    <div
      onClick={closeBtn}
      className={`
        lg:static lg:h-fit lg:w-fit lg:bg-transparent
        ${
          isMenuOpen
            ? "fixed inset-0 z-95 bg-black/50 backdrop-blur-[2px]"
            : "hidden lg:block"
        }
      `}
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="
          h-dvh w-[82%] max-w-[320px]
          bg-base-100
          shadow-2xl
          lg:h-fit lg:w-fit lg:max-w-none
          lg:bg-transparent lg:shadow-none
        "
      >
        {/* Mobile Header */}
        <header
          className="
            flex items-center justify-between
            border-b border-base-content/10
            px-4 py-4
            lg:hidden
          "
        >
          <div>
            <h2 className="text-lg font-bold tracking-tight">Menu</h2>
            <p className="mt-0.5 text-xs text-base-content/50">
              Navigate your account
            </p>
          </div>

          <button
            onClick={() => dispatch(setIsMenuOpen(false))}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              text-base-content/60
              transition-all duration-200
              hover:bg-base-content/5
              hover:text-base-content
              active:scale-95
            "
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </header>

        {/* Menu */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-dots loading-md" />
          </div>
        ) : (
          <ul
            onClick={() => dispatch(setIsMenuOpen(false))}
            className="
              flex flex-col gap-1.5
              p-3
              lg:flex-row lg:items-center
              lg:gap-1
              lg:p-0
            "
          >
            {/* Profile */}
            <li className="mb-2 lg:mb-0">
              {!authUser ? (
                <NavLink to="/login" className={navItemClass}>
                  <div
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-base-content/5
                      lg:hidden
                    "
                  >
                    <UserRound size={18} strokeWidth={1.8} />
                  </div>

                  <span>Log In</span>
                </NavLink>
              ) : (
                <NavLink
                  to={`/profile/${playerId}`}
                  className={({ isActive }) =>
                    `
                      group flex items-center gap-3
                      rounded-xl px-3 py-2
                      transition-all duration-200
                      lg:gap-2 lg:px-2 lg:py-1
                      ${isActive ? "bg-primary/10" : "hover:bg-base-content/5"}
                    `
                  }
                >
                  {/* Avatar */}
                  {authUser?.player?.profilePicture === "" ? (
                    <div
                      className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-primary/10
                        text-primary
                        ring-1 ring-primary/10
                        lg:h-7 lg:w-7
                      "
                    >
                      <span className="text-base font-bold capitalize lg:text-xs">
                        {defaultAvatar(authUser?.player?.playerName)}
                      </span>
                    </div>
                  ) : (
                    <img
                      className="
                        h-11 w-11 shrink-0
                        rounded-full
                        object-cover
                        ring-1 ring-base-content/10
                        lg:h-7 lg:w-7
                      "
                      src={
                        authUser?.player?.profilePicture ||
                        authUser?.player?.playerId?.profileImg ||
                        "avatar.jpg"
                      }
                      alt=""
                    />
                  )}

                  {/* User information */}
                  <div className="min-w-0 lg:hidden">
                    <h1 className="truncate text-sm font-semibold">
                      {authUser?.player?.playerName}
                    </h1>

                    <p className="mt-0.5 max-w-[14rem] truncate text-xs text-base-content/50">
                      {authUser?.player?.playerId?.email}
                    </p>
                  </div>
                </NavLink>
              )}
            </li>

            {/* Desktop separator */}
            <div className="hidden h-5 w-px lg:block" />

            {/* My Tournaments */}
            {authUser?.player?.role === "organiser" && (
              <li>
                <NavLink to="my-tournament" className={navItemClass}>
                  <Target
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0 lg:size-4"
                  />

                  <span>My Tournaments</span>
                </NavLink>
              </li>
            )}

            {/* Create Tournament */}
            <li>
              <NavLink to="add-tournament" className={navItemClass}>
                <Trophy
                  size={18}
                  strokeWidth={1.8}
                  className="shrink-0 lg:size-4"
                />

                <span>Create New Tournament</span>
              </NavLink>
            </li>

            {/* Theme */}
            <li>
              <button
                onClick={handleChangeThemeBtn}
                className="
                  group flex w-full items-center gap-3
                  rounded-xl
                  px-3 py-2.5
                  text-left text-sm font-medium
                  text-base-content/70
                  transition-all duration-200
                  hover:bg-base-content/5
                  hover:text-base-content
                  active:scale-[0.99]
                  lg:gap-2 lg:px-2.5 lg:py-2
                "
              >
                <Palette
                  size={18}
                  strokeWidth={1.8}
                  className="
                    shrink-0
                    transition-transform duration-200
                    group-hover:rotate-12
                    lg:size-4
                  "
                />

                <span>Change Theme</span>
              </button>

              <NavLink to="/local-match/setup">
                <div
                  className="
                  group flex w-full items-center gap-3
                  rounded-xl
                  px-3 py-2.5
                  text-left text-sm font-medium
                  text-base-content/70
                  transition-all duration-200
                  hover:bg-base-content/5
                  hover:text-base-content
                  active:scale-[0.99]
                  lg:gap-2 lg:px-2.5 lg:py-2
                  lg:hidden
                "
                >
                  <GiCricketBat size={21} />
                  <span>Lets Play</span>
                </div>
              </NavLink>
            </li>
          </ul>
        )}
      </section>
    </div>
  );
};
