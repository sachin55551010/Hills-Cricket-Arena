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
              className="mt-18 w-[97%] flex flex-col items-center p-4 border md:w-[70%] lg:w-[60%] gap-6 border-base-content/20 rounded-lg mb-6"
            >
              {/* form input fields */}
              <div className="w-full flex flex-col gap-4 md:grid grid-cols-2">
                <label
                  htmlFor="tournament-name"
                  className="w-full flex flex-col gap-3"
                >
                  <span className="font-bold">Tournament Name *</span>
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
                    className="border border-base-content/30 w-full h-10 rounded-md outline-0 pl-3 focus:border-base-content capitalize"
                    id="tournament-name"
                  />
                </label>
                <label
                  htmlFor="city-name"
                  className="w-full flex flex-col gap-3"
                >
                  <span className="font-bold">City *</span>
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
                    className="border border-base-content/30 w-full h-10 rounded-md outline-0 pl-3 focus:border-base-content capitalize"
                    id="city-name"
                  />
                </label>
                <label
                  htmlFor="ground-name"
                  className="w-full flex flex-col gap-3"
                >
                  <span className="font-bold">Ground *</span>
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
                    className="border border-base-content/30 w-full h-10 rounded-md outline-0 pl-3 focus:border-base-content capitalize"
                    id="ground-name"
                  />
                </label>
                <label
                  htmlFor="oraniser-name"
                  className="w-full flex flex-col gap-3"
                >
                  <span className="font-bold">Organiser Name *</span>
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
                    className="border border-base-content/30 w-full h-10 rounded-md outline-0 pl-3 focus:border-base-content capitalize"
                    id="organiser-name"
                  />
                </label>
                <label
                  htmlFor="oraniser-number"
                  className="w-full flex flex-col gap-3"
                >
                  <span className="font-bold">Organiser Number *</span>
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
                    className="border border-base-content/30 w-full h-10 rounded-md outline-0 pl-3 focus:border-base-content"
                    id="organiser-number"
                  />
                </label>
                <div className="w-full flex flex-col gap-3">
                  <h1 className="font-bold">Organiser Email</h1>
                  <div className="border h-10 rounded-md border-base-content/30 flex items-center pl-3 text-base-content/40 cursor-not-allowed">
                    {authUser?.player?.playerId?.email}
                  </div>
                </div>
              </div>

              {/* tournament start end date */}
              <div className="flex justify-between gap-4 w-full">
                <label htmlFor="" className="flex flex-col gap-3 w-full">
                  <span className="font-bold">Start Date</span>
                  <input
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
                    className="border border-base-content/30 h-10 rounded-md px-2 focus:border-base-conten"
                  />
                </label>
                <label htmlFor="" className="flex flex-col gap-3 w-full">
                  <span className="font-bold">End Date</span>
                  <input
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
                    className="border border-base-content/30 h-10 rounded-md px-2 focus:border-base-conten"
                  />
                </label>
              </div>

              {/* tournament category */}
              <div className="w-full p-2">
                <span className="font-bold">Tournament Category *</span>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                  {TOURNAMENT_CATEGORY.map((val, index) => {
                    return (
                      <div
                        onClick={() =>
                          handleBadgeSelectorBtn("tournamentCategory", val)
                        }
                        key={index}
                        className={`badge badge-soft badge-info rounded-full py-4 transition-all duration-300 cursor-pointer hover:border-info/90 hover:shadow-[0px_0px_10px_var(--color-info)] ${
                          tournamentInfo.tournamentCategory === val &&
                          "scale-110 border-info/90 shadow-[0px_0px_10px_var(--color-info)] font-bold"
                        } capitalize`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ball type */}
              <div className="w-full">
                <span className="font-bold">Select Ball Type *</span>
                <div className="grid grid-cols-3 md:flex gap-6 mt-4 justify-normal">
                  {BALL_TYPE.map((val, index) => {
                    return (
                      <div
                        onClick={() => handleBadgeSelectorBtn("ballType", val)}
                        key={index}
                        className={`badge badge-soft badge-info rounded-full py-4 transition-all duration-300 cursor-pointer hover:border-info/90 hover:shadow-[0px_0px_10px_var(--color-info)] ${
                          tournamentInfo.ballType === val &&
                          "scale-110 border-info/90 shadow-[0px_0px_10px_var(--color-info)] font-bold"
                        } `}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pitch Type */}
              <div className="w-full">
                <span className="font-bold">Select Pitch Type *</span>
                <div className="grid grid-cols-4 md:flex gap-4 mt-4">
                  {PITCH_TYPE.map((val, index) => {
                    return (
                      <div
                        onClick={() => handleBadgeSelectorBtn("pitchType", val)}
                        key={index}
                        className={`badge badge-soft badge-info rounded-full py-4 transition-all duration-300 cursor-pointer hover:border-info/90 hover:shadow-[0px_0px_10px_var(--color-info)] ${
                          tournamentInfo.pitchType === val &&
                          "scale-110 border-info/90 shadow-[0px_0px_10px_var(--color-info)] font-bold"
                        } `}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* select player vhange limit */}
              <label
                htmlFor="max-changes"
                className="w-full flex flex-col gap-3"
              >
                <span className="font-bold">
                  Maximum Changes Allowed (Optional)
                </span>

                <input
                  id="max-changes"
                  type="text"
                  value={tournamentInfo.maxChangesAllowed}
                  maxLength={1} // ❌ prevent double digit
                  onChange={(e) => {
                    const value = e.target.value;

                    // allow only numbers 1–6
                    if (/^[1-6]?$/.test(value)) {
                      setTournamentInfo({
                        ...tournamentInfo,
                        maxChangesAllowed: e.target.value,
                      });
                    }
                  }}
                  className="border border-base-content/30 w-full h-10 rounded-md outline-0 pl-3 focus:border-base-content"
                  placeholder="Enter 1–6"
                />
              </label>
              {/* additional information */}
              <label
                htmlFor="additional-info"
                className="flex flex-col gap-3 w-full"
              >
                Additional Info
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
                  className="border border-base-content/30 w-full h-30 rounded-md outline-0 pl-3 pt-3 focus:border-base-content capitalize"
                  placeholder="Enter winner Cash Prize, Runnerup Prize, Man of the match, man of the series, rules and any important information etc"
                ></textarea>
              </label>

              <div
                className={`w-full ${
                  mode === "edit" && "grid grid-cols-1 gap-2 md:grid-cols-2"
                }`}
              >
                <button
                  className={`btn btn-success w-full rounded-lg ${
                    mode === "edit" && "btn-warning"
                  }`}
                  disabled={isAdding}
                >
                  {mode === "create" ? "Create" : "Update"}
                </button>
                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteModal(true)}
                    className="btn btn-error w-full rounded-lg"
                    disabled={isUpdating}
                  >
                    Delete
                  </button>
                )}
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
