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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-3 backdrop-blur-sm">
  <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-base-content/10 bg-base-300/95 p-4 shadow-2xl backdrop-blur-xl md:p-8">

    {/* Close Button */}
    <button
      onClick={() => dispatch(setChooseTheme(false))}
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-base-content/5 text-base-content/60 transition-all duration-200 hover:rotate-90 hover:bg-base-content/10 hover:text-base-content md:right-4 md:top-4 md:h-9 md:w-9"
    >
      <X size={17} strokeWidth={3} className="md:size-[19px]" />
    </button>

    {/* Header */}
    <div className="mb-5 text-center md:mb-7">
      <h1 className="text-xl font-black tracking-tight md:text-3xl">
        Select Your Theme
      </h1>

      <p className="mt-1 text-xs text-base-content/60 md:mt-2 md:text-sm">
        Choose a theme that matches your style
      </p>
    </div>

    {/* Themes */}
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
      {THEMES.map((theme) => {
        return (
          <div
            onClick={() => handleSelectThemeBtn(theme)}
            data-theme={theme}
            key={theme}
            className={`group relative flex min-h-[65px] cursor-pointer flex-col items-center justify-center rounded-xl border p-2.5 text-center font-bold capitalize shadow-sm transition-all duration-200
              hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg
              md:min-h-[90px] md:p-4
              ${
                myTheme === theme
                  ? "scale-[1.03] border-primary ring-2 ring-primary/30 shadow-lg"
                  : "border-base-content/10"
              }
            `}
          >
            {/* Selected Indicator */}
            {myTheme === theme && (
              <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-content md:right-2 md:top-2 md:h-5 md:w-5">
                <Check size={9} strokeWidth={4} className="md:size-3" />
              </div>
            )}

            {/* Theme Preview */}
            <div className="mb-1.5 flex gap-1 md:mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-primary md:h-3 md:w-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-secondary md:h-3 md:w-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent md:h-3 md:w-3" />
            </div>

            {/* Theme Name */}
            <span className="text-xs md:text-sm">
              {theme.charAt(0).toUpperCase() + theme.slice(1, 9)}
            </span>

            {/* Hover indicator */}
            <div
              className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary transition-all duration-200 md:inset-x-4 ${
                myTheme === theme
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-60"
              }`}
            />
          </div>
        );
      })}
    </div>

    {/* Footer */}
    <div className="mt-4 flex items-center justify-center md:mt-7">
      <span className="rounded-full bg-base-content/5 px-3 py-1.5 text-[10px] font-medium text-base-content/50 md:px-4 md:py-2 md:text-xs">
        Theme changes are applied instantly
      </span>
    </div>
  </div>
</div>
  );
};
