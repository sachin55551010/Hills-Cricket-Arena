import { Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setChooseTheme, setMyTheme } from "../store/themeSlice";
import { THEMES } from "../constant/themes";

export const ChangeTheme = () => {
  const { myTheme } = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const handleSelectThemeBtn = (theme) => {
    dispatch(setMyTheme(theme));
  };
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="z-[100] absolute bg-base-300 top-60 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-5 rounded-lg transition-all duration-200 w-[95%] md:w-[60%]">
        <div className="relative]">
          <div className="absolute top-[-3rem] right-[-.5rem] cursor-pointer  p-1 rounded hover:bg-base-300 transition-all duration-200">
            <X
              strokeWidth={5}
              onClick={() => dispatch(setChooseTheme(false))}
              className=""
            />
          </div>

          <h1 className="font-black text-center">Select Your Theme</h1>

          <div className="mt-4 grid grid-cols-3 gap-4 md:gap-8 md:px-2">
            {THEMES.map((theme) => {
              return (
                <div
                  onClick={() => handleSelectThemeBtn(theme)}
                  data-theme={theme}
                  key={theme}
                  className={`py-4 rounded-lg flex items-center gap-1 justify-center font-bold text-sm cursor-pointer hover:scale-115 transition-all duration-200 ${
                    myTheme === theme && "scale-110"
                  }`}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1, 9)}
                  {myTheme === theme && (
                    <Check
                      size={13}
                      className="text-green-400"
                      strokeWidth={6}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
