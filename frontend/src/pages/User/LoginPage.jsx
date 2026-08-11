export const LoginPage = () => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }/auth/${provider}`;
  };

  return (
    <div className="fixed inset-0 z-[999] min-h-[100dvh-var(--nav-h)] w-full flex flex-col items-center p-2 bg-cover bg-center bg-no-repeat bg-[url(/cricket_bg_desktop.jpg)]">
      <form
        onSubmit={handleFormSubmit}
        className=" flex mt-2 w-full flex-col md:w-[80%] lg:w-[60%] md:mt-2 bg-base-300/40 rounded-xl backdrop-blur-sm border border-base-content/40"
      >
        {/* heading  */}
        <div className="flex flex-col mt-2 gap-4 md:gap-4 p-4 items-center md:mt-2">
          <div className="flex gap-2 items-center">
            <div>
              <img src="/my_app_logo.png" alt="" className="h-15" />
            </div>
            <h1 className="font-black text-xl font-stretch-expanded">
              Hills Cricket Arena
            </h1>
          </div>
          <h1 className="font-extrabold text-l">
            Welcome to Hills Cricket Arena
          </h1>
          <h1 className="font-bold text-sm">
            Manage your cricket events with ease
          </h1>
        </div>
        <div className="w-full px-2 mt-4 md:mt-2">
          <p className="border-1 border-base-content/30 w-full"></p>
        </div>

        <div className="flex flex-col items-center pb-8">
          <img src="/login_logo.svg" alt="" className="h-50 w-60" />
          <div className="flex items-center justify-between px-2 mt-2"></div>
          <h2 className="font-bold text-sm text-center">
            Please Login to continue
          </h2>
          <div className="px-4 mt-2 flex flex-col gap-4">
            {/* login with google btn */}
            <button
              onClick={() => handleOAuthLogin("google")}
              className="btn bg-white rounded-md text-black border-[#e5e5e5] h-10 mt-4"
            >
              <svg
                aria-label="Google logo"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Login with Google
            </button>
            <p className="text-[.6rem] text-base-content/60 mt-2">
              By continuing with Google, you agree to our Terms & Conditions and
              Privacy Policy. We only receive the basic information required to
              verify your identity.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
