import { Menu } from "lucide-react";
import { SideMenuBar } from "./SideMenuBar";
import { useDispatch, useSelector } from "react-redux";
import { setIsMenuOpen } from "../store/authSlice";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const { isMenuOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div>
      <header
        className={`fixed z-90 w-full h-[var(--nav-h)] flex items-center  px-2 justify-between bg-base-100 shadow-[0px_0px_10px_rgba(0,0,0,.4)]`}
      >
        <Link to="/">
          <div className="flex gap-2 items-center">
            {!isMenuOpen && (
              <Menu
                strokeWidth={4}
                onClick={() => dispatch(setIsMenuOpen(true))}
                className={`ml-2 lg:hidden`}
              />
            )}
            <div className="flex gap-2 items-center">
              <img src="/my_app_logo.png" alt="" className="h-8" />

              <h1 className="font-extrabold">Hills Cricket Arena</h1>
            </div>
          </div>
        </Link>

        <div className="lg:flex">
          <SideMenuBar />
        </div>
      </header>
    </div>
  );
};
