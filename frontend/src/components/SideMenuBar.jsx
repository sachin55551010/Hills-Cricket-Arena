import { Palette, Target, Trophy, UserRound, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setChooseTheme } from "../store/themeSlice";
import { setIsMenuOpen } from "../store/authSlice";
import { defaultAvatar } from "../utils/noprofilePicHelper";
import { useProfileQuery } from "../store/authApi";

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

  return (
    // side menu bar

    <div
      onClick={closeBtn}
      className={`lg:static max-h-dvh lg:w-fit lg:h-fit lg:bg-transparent ${
        isMenuOpen ? "fixed inset-0 z-95 bg-black/80 " : "hidden lg:block"
      } `}
    >
      {/* section for side menu items  */}
      <section
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-base-100 h-dvh w-[80%] lg:w-fit lg:h-fit lg:bg-transparent"
      >
        {/* menu header  */}
        <header className="flex justify-between border-b py-4 px-2 lg:hidden">
          <h2 className="font-extrabold text-2xl">Menu</h2>

          {/* cross button to close side menu  */}
          <button
            onClick={() => dispatch(setIsMenuOpen(false))}
            className="flex items-center justify-center rounded-md hover:bg-base-content/400 w-8 transition-all duration-200"
          >
            <X strokeWidth={4} />
          </button>
        </header>
        {/* menu list items  */}

        <>
          {isLoading ? (
            <div className="text-center mt-10">
              <span className="loading loading-dots loading-xl"></span>
            </div>
          ) : (
            <ul
              onClick={() => dispatch(setIsMenuOpen(false))}
              className="grid grid-cols-1 p-2 gap-2 lg:flex lg:items-center lg:text-[.7rem] lg:p-0 cursor-pointer lg:gap-1"
            >
              {/* user profile  */}
              <li className="p-2 rounded-md hover:bg-base-content/40 transition-all duration-200">
                {/* if user not loggedin  */}
                {!authUser ? (
                  <NavLink to="/login" className="flex items-center gap-4">
                    <UserRound className="lg:hidden" />
                    <h1 className="font-bold md:font-normal">Log In</h1>
                  </NavLink>
                ) : (
                  <NavLink
                    to={`/profile/${playerId}`}
                    className="flex items-center gap-4 lg:h-5 lg:gap-2"
                  >
                    {authUser?.player?.profilePicture === "" ? (
                      <div className="rounded-full h-15 w-15 lg:h-7 lg:w-7 flex items-center justify-center bg-info">
                        <div className="text-lg font-bold lg:text-sm capitalize">
                          {defaultAvatar(authUser?.player?.playerName)}
                        </div>
                      </div>
                    ) : (
                      <img
                        className="h-15 w-15 rounded-full lg:h-7 lg:w-7 object-cover"
                        src={
                          authUser?.player?.profilePicture ||
                          authUser?.player?.playerId?.profileImg ||
                          "avatar.jpg"
                        }
                        alt=""
                      />
                    )}

                    <div className="lg:hidden">
                      <h1 className="font-bold md:font-normal">
                        {authUser?.player?.playerName}
                      </h1>
                      <p className="text-[.8rem] truncate max-w-[13rem] lg:hidden">
                        {authUser?.player?.playerId?.email}
                      </p>
                    </div>
                  </NavLink>
                )}
              </li>

              {/* my tournaments  */}
              {authUser?.player?.role === "organiser" && (
                <li className="p-2 rounded-md hover:bg-base-content/40 transition-all duration-200">
                  <NavLink
                    to="my-tournament"
                    className="flex gap-4 items-center lg:gap-1"
                  >
                    <Target className="lg:size-4 md:hidden" />
                    <h1 className="font-bold md:font-normal">My Tournaments</h1>
                  </NavLink>
                </li>
              )}

              <li className="p-2 rounded-md hover:bg-base-content/40 transition-all duration-200">
                <NavLink
                  to="add-tournament"
                  className="flex items-center gap-4 lg:gap-1"
                >
                  <Trophy className="lg:size-4 md:hidden" />
                  <h1 className="font-bold md:font-normal">
                    Create New Tournament
                  </h1>
                </NavLink>
              </li>

              <li
                onClick={handleChangeThemeBtn}
                className="p-2 rounded-md hover:bg-base-content/40 transition-all duration-200"
              >
                <div className="flex gap-4 lg:gap-1 items-center">
                  <Palette className="lg:size-4 md:hidden" />
                  <h1 className="font-bold md:font-normal">Change Theme</h1>
                </div>
              </li>
            </ul>
          )}
        </>
      </section>
    </div>
  );
};
