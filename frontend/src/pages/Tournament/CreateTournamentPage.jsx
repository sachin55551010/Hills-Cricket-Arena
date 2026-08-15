import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Header } from "../../components/Header";
import { BALL_TYPE } from "../../constant/ballType";
import { PITCH_TYPE } from "../../constant/pitchType";
import { TOURNAMENT_CATEGORY } from "../../constant/tournamentCategory";
import { toast } from "react-toastify";
import {
  useAddTournamentMutation,
  useGetTournamentInfoQuery,
  useUpdateTournamentInfoMutation,
} from "../../store/tournamentApi";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteConfirmModal } from "../../components/modals/DeleteConfirmModal";
import { validateInputs } from "../../utils/validateInputs";

export const CreateTournamentPage = ({ mode }) => {
  const { tournamentId } = useParams();
  const { data } = useGetTournamentInfoQuery(tournamentId, {
    skip: !tournamentId,
  });

  //get all the fields from server
  useEffect(() => {
    if (mode === "edit" && data) {
      setTournamentInfo({
        tournamentName: data?.myTournament?.tournamentName,
        organiserName: data?.myTournament?.ograniserName,
        phone: data?.myTournament?.phone,
        city: data?.myTournament?.city,
        ground: data?.myTournament?.ground,
        startDate: data?.myTournament?.startDate,
        endDate: data?.myTournament?.endDate,
        tournamentCategory: data?.myTournament?.tournamentCategory,
        additionalInfo: data?.myTournament?.additionalInfo,
        ballType: data?.myTournament?.ballType,
        pitchType: data?.myTournament?.pitchType,
        maxChangesAllowed: data?.myTournament?.maxChangesAllowed || "",
      });
    }
  }, [mode, data]);

  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);

  //rtk query methods
  const [addTournament, { isLoading: isAdding }] = useAddTournamentMutation();

  const [updateTournament, { isLoading: isUpdating }] =
    useUpdateTournamentInfoMutation();

  //state for tournaments fields
  const [tournamentInfo, setTournamentInfo] = useState({
    tournamentName: "",
    organiserName: authUser?.player?.playerName || "",
    phone: "",
    city: "",
    ground: "",
    startDate: "",
    endDate: "",
    tournamentCategory: "",
    additionalInfo: "",
    ballType: "",
    pitchType: "",
    maxChangesAllowed: "",
  });

  // state to activate modal
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  //handle badge selector btn
  const handleBadgeSelectorBtn = (type, val) => {
    setTournamentInfo((prev) => ({ ...prev, [type]: val }));
  };

  const todayDate = new Date().toISOString().split("T")[0];

  // check if user entering ending date before starting date
  const validateDates = () => {
    if (!tournamentInfo.startDate || !tournamentInfo.endDate) return true;
    if (tournamentInfo?.startDate <= tournamentInfo?.endDate) {
      return true;
    } else {
      toast.error("Please enter end date after start date");
      return false;
    }
  };
  // form submit method handler
  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validateDates()) return;

      // ✅ convert maxChangesAllowed properly
      const payload = {
        ...tournamentInfo,
        maxChangesAllowed:
          tournamentInfo.maxChangesAllowed === ""
            ? null
            : Number(tournamentInfo.maxChangesAllowed),
      };

      if (mode === "edit" && data) {
        await updateTournament({
          tournamentId,
          updatedFields: payload,
        }).unwrap();

        navigate(`/my-tournament/${tournamentId}/tournament-info`);
      } else {
        if (
          !tournamentInfo.tournamentName.trim() ||
          !tournamentInfo.city.trim() ||
          !tournamentInfo.ground.trim() ||
          !tournamentInfo.organiserName.trim() ||
          !tournamentInfo.phone.trim() ||
          !tournamentInfo.tournamentCategory.trim() ||
          !tournamentInfo.ballType.trim() ||
          !tournamentInfo.pitchType.trim()
        ) {
          toast.error("All Fields are required", {
            duration: 1500,
          });
          return;
        }

        await addTournament(payload).unwrap();
        navigate("/my-tournament");
      }
    } catch (error) {
      console.log("Form submit error", error);
    }
  };

  return (
    <div className={`${isDeleteModal && "overflow-hidden h-dvh"}`}>
      <div>
        <Header
          data={
            mode === "create"
              ? "Create tournament"
              : "Edit tournament information"
          }
        />

        <div className="flex justify-center">
          {mode === "edit" && isUpdating ? (
            <div className=" w-full h-dvh flex items-center justify-center">
              <span className="loading loading-ring w-20 h-20"></span>
            </div>
          ) : (
           <form
  onSubmit={handleFormSubmit}
  className="mt-18 mb-8 w-[96%] md:w-[85%] lg:w-[70%] xl:w-[62%] 
  overflow-hidden rounded-2xl border border-base-content/10 
  bg-base-100/80 shadow-xl shadow-base-content/5 backdrop-blur-sm"
>
  {/* Header */}
  <div className="w-full border-b border-base-content/10 bg-base-200/40 px-5 py-6 sm:px-8">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <span className="text-2xl">🏏</span>
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {mode === "create" ? "Create Tournament" : "Update Tournament"}
        </h1>

        <p className="mt-1 text-sm text-base-content/60">
          {mode === "create"
            ? "Set up your tournament details and match preferences."
            : "Update your tournament details and preferences."}
        </p>
      </div>
    </div>
  </div>

  {/* Form Content */}
  <div className="flex flex-col gap-8 p-5 sm:p-8">

    {/* Basic Information */}
    <section>
      <div className="mb-5">
        <h2 className="text-base font-bold sm:text-lg">
          Tournament Information
        </h2>
        <p className="mt-1 text-xs text-base-content/50 sm:text-sm">
          Add the basic details of your tournament.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">

        {/* Tournament Name */}
        <label
          htmlFor="tournament-name"
          className="flex w-full flex-col gap-2"
        >
          <span className="text-sm font-semibold">
            Tournament Name <span className="text-error">*</span>
          </span>

          <input
            required
            value={tournamentInfo.tournamentName}
            onChange={(e) => {
              setTournamentInfo({
                ...tournamentInfo,
                tournamentName: e.target.value,
              });
            }}
            type="text"
            id="tournament-name"
            placeholder="e.g. Hill Premier League"
            className="h-12 w-full rounded-xl border border-base-content/15 
            bg-base-200/40 px-4 text-sm outline-none transition-all 
            placeholder:text-base-content/30
            focus:border-primary focus:bg-base-100 
            focus:ring-4 focus:ring-primary/10"
          />
        </label>

        {/* City */}
        <label
          htmlFor="city-name"
          className="flex w-full flex-col gap-2"
        >
          <span className="text-sm font-semibold">
            City <span className="text-error">*</span>
          </span>

          <input
            required
            value={tournamentInfo.city}
            onChange={(e) => {
              const { value } = e.target;

              if (validateInputs(value))
                setTournamentInfo({
                  ...tournamentInfo,
                  city: e.target.value,
                });
            }}
            type="text"
            id="city-name"
            placeholder="Enter city"
            className="h-12 w-full rounded-xl border border-base-content/15 
            bg-base-200/40 px-4 text-sm capitalize outline-none transition-all
            placeholder:text-base-content/30
            focus:border-primary focus:bg-base-100 
            focus:ring-4 focus:ring-primary/10"
          />
        </label>

        {/* Ground */}
        <label
          htmlFor="ground-name"
          className="flex w-full flex-col gap-2"
        >
          <span className="text-sm font-semibold">
            Ground <span className="text-error">*</span>
          </span>

          <input
            required
            value={tournamentInfo.ground}
            onChange={(e) => {
              const { value } = e.target;

              if (validateInputs(value))
                setTournamentInfo({
                  ...tournamentInfo,
                  ground: e.target.value,
                });
            }}
            type="text"
            id="ground-name"
            placeholder="Enter ground name"
            className="h-12 w-full rounded-xl border border-base-content/15 
            bg-base-200/40 px-4 text-sm capitalize outline-none transition-all
            placeholder:text-base-content/30
            focus:border-primary focus:bg-base-100 
            focus:ring-4 focus:ring-primary/10"
          />
        </label>

        {/* Organiser Name */}
        <label
          htmlFor="oraniser-name"
          className="flex w-full flex-col gap-2"
        >
          <span className="text-sm font-semibold">
            Organiser Name <span className="text-error">*</span>
          </span>

          <input
            required
            defaultValue={authUser?.player?.playerName || ""}
            onChange={(e) => {
              const { value } = e.target;

              if (validateInputs(value))
                setTournamentInfo({
                  ...tournamentInfo,
                  organiserName: e.target.value,
                });
            }}
            type="text"
            id="organiser-name"
            placeholder="Enter organiser name"
            className="h-12 w-full rounded-xl border border-base-content/15 
            bg-base-200/40 px-4 text-sm capitalize outline-none transition-all
            placeholder:text-base-content/30
            focus:border-primary focus:bg-base-100 
            focus:ring-4 focus:ring-primary/10"
          />
        </label>

        {/* Organiser Number */}
        <label
          htmlFor="oraniser-number"
          className="flex w-full flex-col gap-2"
        >
          <span className="text-sm font-semibold">
            Organiser Number <span className="text-error">*</span>
          </span>

          <input
            required
            value={tournamentInfo.phone}
            onChange={(e) => {
              const { value } = e.target;
              const regex = /^[0-9]*$/;

              if (regex.test(value))
                setTournamentInfo({
                  ...tournamentInfo,
                  phone: e.target.value,
                });
            }}
            type="text"
            maxLength={10}
            id="organiser-number"
            placeholder="10 digit mobile number"
            className="h-12 w-full rounded-xl border border-base-content/15 
            bg-base-200/40 px-4 text-sm outline-none transition-all
            placeholder:text-base-content/30
            focus:border-primary focus:bg-base-100 
            focus:ring-4 focus:ring-primary/10"
          />
        </label>

        {/* Email */}
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-sm font-semibold">
            Organiser Email
          </h1>

          <div
            className="flex h-12 w-full items-center overflow-hidden rounded-xl 
            border border-base-content/10 bg-base-200/60 px-4 text-sm 
            text-base-content/45"
          >
            <span className="truncate">
              {authUser?.player?.playerId?.email}
            </span>
          </div>
        </div>
      </div>
    </section>

    {/* Tournament Dates */}
    <section>
      <div className="mb-5">
        <h2 className="text-base font-bold sm:text-lg">
          Tournament Schedule
        </h2>

        <p className="mt-1 text-xs text-base-content/50 sm:text-sm">
          Select when your tournament will take place.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Start Date */}
        <label
          htmlFor="start-date"
          className="flex w-full flex-col gap-2"
        >
          <span className="text-sm font-semibold">
            Start Date
          </span>

          <input
            id="start-date"
            value={
              tournamentInfo.startDate
                ? tournamentInfo.startDate.split("T")[0]
                : ""
            }
            onChange={(e) =>
              setTournamentInfo({
                ...tournamentInfo,
                startDate: e.target.value,
              })
            }
            min={todayDate}
            type="date"
            className="h-12 w-full rounded-xl border border-base-content/15 
            bg-base-200/40 px-4 text-sm outline-none transition-all
            focus:border-primary focus:bg-base-100 
            focus:ring-4 focus:ring-primary/10"
          />
        </label>

        {/* End Date */}
        <label
          htmlFor="end-date"
          className="flex w-full flex-col gap-2"
        >
          <span className="text-sm font-semibold">
            End Date
          </span>

          <input
            id="end-date"
            min={tournamentInfo.startDate}
            value={
              tournamentInfo.endDate
                ? tournamentInfo.endDate.split("T")[0]
                : ""
            }
            onChange={(e) =>
              setTournamentInfo({
                ...tournamentInfo,
                endDate: e.target.value,
              })
            }
            type="date"
            className="h-12 w-full rounded-xl border border-base-content/15 
            bg-base-200/40 px-4 text-sm outline-none transition-all
            focus:border-primary focus:bg-base-100 
            focus:ring-4 focus:ring-primary/10"
          />
        </label>
      </div>
    </section>

    {/* Tournament Category */}
    <section>
      <div className="mb-4">
        <h2 className="text-sm font-bold sm:text-base">
          Tournament Category <span className="text-error">*</span>
        </h2>

        <p className="mt-1 text-xs text-base-content/50">
          Choose the type of tournament you are organising.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TOURNAMENT_CATEGORY.map((val, index) => {
          const isSelected =
            tournamentInfo.tournamentCategory === val;

          return (
            <button
              type="button"
              onClick={() =>
                handleBadgeSelectorBtn(
                  "tournamentCategory",
                  val
                )
              }
              key={index}
              className={`min-h-12 rounded-xl border px-3 py-3 
              text-sm capitalize transition-all duration-200
              ${
                isSelected
                  ? "border-primary bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.02] font-semibold"
                  : "border-base-content/10 bg-base-200/40 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </section>

    {/* Ball Type */}
    <section>
      <div className="mb-4">
        <h2 className="text-sm font-bold sm:text-base">
          Ball Type <span className="text-error">*</span>
        </h2>

        <p className="mt-1 text-xs text-base-content/50">
          Select the type of ball used in matches.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BALL_TYPE.map((val, index) => {
          const isSelected = tournamentInfo.ballType === val;

          return (
            <button
              type="button"
              onClick={() =>
                handleBadgeSelectorBtn("ballType", val)
              }
              key={index}
              className={`min-h-12 rounded-xl border px-4 py-3 
              text-sm capitalize transition-all duration-200
              ${
                isSelected
                  ? "border-primary bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.02] font-semibold"
                  : "border-base-content/10 bg-base-200/40 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </section>

    {/* Pitch Type */}
    <section>
      <div className="mb-4">
        <h2 className="text-sm font-bold sm:text-base">
          Pitch Type <span className="text-error">*</span>
        </h2>

        <p className="mt-1 text-xs text-base-content/50">
          Choose the pitch condition for your tournament.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PITCH_TYPE.map((val, index) => {
          const isSelected = tournamentInfo.pitchType === val;

          return (
            <button
              type="button"
              onClick={() =>
                handleBadgeSelectorBtn("pitchType", val)
              }
              key={index}
              className={`min-h-12 rounded-xl border px-3 py-3 
              text-sm capitalize transition-all duration-200
              ${
                isSelected
                  ? "border-primary bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.02] font-semibold"
                  : "border-base-content/10 bg-base-200/40 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </section>

    {/* Match Rules */}
    <section>
      <div className="mb-5">
        <h2 className="text-base font-bold sm:text-lg">
          Match Rules
        </h2>

        <p className="mt-1 text-xs text-base-content/50 sm:text-sm">
          Configure optional tournament rules.
        </p>
      </div>

      <label
        htmlFor="max-changes"
        className="flex w-full flex-col gap-2"
      >
        <span className="text-sm font-semibold">
          Maximum Changes Allowed
          <span className="ml-1 text-xs font-normal text-base-content/45">
            (Optional)
          </span>
        </span>

        <input
          id="max-changes"
          type="text"
          value={tournamentInfo.maxChangesAllowed}
          maxLength={1}
          onChange={(e) => {
            const value = e.target.value;

            if (/^[1-6]?$/.test(value)) {
              setTournamentInfo({
                ...tournamentInfo,
                maxChangesAllowed: e.target.value,
              });
            }
          }}
          className="h-12 w-full rounded-xl border border-base-content/15 
          bg-base-200/40 px-4 text-sm outline-none transition-all
          placeholder:text-base-content/30
          focus:border-primary focus:bg-base-100 
          focus:ring-4 focus:ring-primary/10"
          placeholder="Enter 1–6"
        />
      </label>
    </section>

    {/* Additional Information */}
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold sm:text-lg">
          Additional Information
        </h2>

        <p className="mt-1 text-xs text-base-content/50 sm:text-sm">
          Add prizes, rules, awards or any other important information.
        </p>
      </div>

      <textarea
        value={tournamentInfo.additionalInfo}
        onChange={(e) =>
          setTournamentInfo({
            ...tournamentInfo,
            additionalInfo: e.target.value,
          })
        }
        name=""
        id="additional-info"
        className="min-h-32 w-full resize-y rounded-xl border 
        border-base-content/15 bg-base-200/40 px-4 py-3 text-sm 
        outline-none transition-all
        placeholder:text-base-content/30
        focus:border-primary focus:bg-base-100 
        focus:ring-4 focus:ring-primary/10"
        placeholder="Enter winner cash prize, runner-up prize, Man of the Match, Man of the Series, rules and any important information..."
      />
    </section>

    {/* Actions */}
    <div
      className={`w-full pt-2 ${
        mode === "edit"
          ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
          : ""
      }`}
    >
      <button
        className={`btn h-12 w-full rounded-xl border-0 text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5 ${
          mode === "edit"
            ? "btn-warning shadow-warning/20"
            : "btn-primary shadow-primary/20"
        }`}
        disabled={isAdding}
      >
        {isAdding ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            {mode === "create" ? "Creating..." : "Updating..."}
          </>
        ) : (
          <>
            {mode === "create" ? "Create Tournament" : "Update Tournament"}
          </>
        )}
      </button>

      {mode === "edit" && (
        <button
          type="button"
          onClick={() => setIsDeleteModal(true)}
          className="btn btn-error h-12 w-full rounded-xl border-0 
          text-sm font-semibold shadow-lg shadow-error/20 
          transition-all hover:-translate-y-0.5"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Deleting...
            </>
          ) : (
            "Delete Tournament"
          )}
        </button>
      )}
    </div>
  </div>
</form>
          )}
        </div>
      </div>
      {isDeleteModal && (
        <DeleteConfirmModal
          setIsDeleteModal={setIsDeleteModal}
          tournamentId={tournamentId}
          navigate={navigate}
        />
      )}
    </div>
  );
};
