import { useRef, useState } from "react";
import { ExtraRunCountModal } from "../components/ExtraRunCountModal";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const ScoringPage = () => {
  const matchData = JSON.parse(localStorage.getItem("currentMatch")) || {};
  console.log(matchData);
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [extraType, setExtraType] = useState("");

  const scoringButton = [
    "0",
    "1",
    "2",
    "MORE",
    "UNDO",
    "3",
    "4",
    "6",
    "...",
    "SWAP",
    "WD",
    "NB",
    "LB",
    "BYE",
    "OUT",
  ];

  const onConfirm = (data) => {
    console.log(data);
    console.log("onconfirm run");
  };

  const handleScoreBtnClick = (val) => {
    if (["WD", "NB", "LB", "BYE"].includes(val)) {
      setIsExtraModalOpen(true);
      setExtraType(val);
    }
  };

  const navigate = useNavigate();

  const lastBackPress = useRef(0);

  const handleBackBtn = () => {
    const now = Date.now();

    if (now - lastBackPress.current < 1500) {
      navigate("/match/setup");
      return;
    }

    lastBackPress.current = now;

    toast.dark("Press back twice to leave", {
      autoClose: 1000,
      position: "bottom-right",
    });
  };

  // const ballColors = {
  //   wicket: "bg-red-500",
  //   four: "bg-orange-600",
  //   six: "bg-green-600",
  // };

  const buttonColors = {
    0: "bg-green-600 ",
    1: "bg-green-600 ",
    2: "bg-green-600",
    3: "bg-green-600",
    4: "bg-green-600",
    6: "bg-green-600",
    "...": "bg-green-600",
    MORE: "bg-green-600 text-[.8rem]",
    UNDO: "bg-yellow-600 text-[.8rem]",
    SWAP: "bg-yellow-600 text-[.8rem]",
    WD: "bg-blue-600",
    NB: "bg-blue-600",
    LB: "bg-blue-600",
    BYE: "bg-blue-600 text-[.8rem]",
    OUT: "bg-red-600 text-[.8rem]",
  };

  return (
    <div className="h-dvh w-screen pt-12 flex justify-center">
      <header className="fixed top-0 left-0 z-[999] h-[var(--nav-h)] bg-base-100 flex items-center gap-2 px-2 w-dvw">
        <div className="flex items-center gap-2">
          <ArrowLeft size={30} strokeWidth={3} onClick={handleBackBtn} />
          <h4 className="font-bold">Hills Cricket Scorer</h4>
        </div>
      </header>

      {/* main scoring screen */}
      <div className="flex flex-col gap-2 w-[97%] lg:w-[60%]">
        {/* header */}
        <div className="flex justify-center gap-2 h-15 items-center">
          <h1>{matchData.firstTeam.name}</h1>
          <span>Vs</span>
          <h2>{matchData.secondTeam.name}</h2>
        </div>

        {/* score display */}
        <div className="flex border border-base-content/15 rounded-md">
          {/* score */}
          <div className="flex-2 p-2">
            {/* Team name and inning */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <p>kandaghat</p>
                <p>1st Inning</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-3xl font-semibold">0-0</div>
                <div>(0.0)</div>
              </div>
            </div>
          </div>

          {/* runrate */}
          <div className="flex-1 p-2 text-sm">
            <p>CRR</p>
            <p>18.03</p>
          </div>
        </div>

        {/* current score board list */}
        <div className="border border-base-content/15 rounded-md">
          <table className="w-full table-fixed text-[.85rem]">
            <thead className="">
              <tr className="">
                <th className="text-left px-3 py-2">Batsman</th>
                <th className="px-3 py-2">R</th>
                <th className="px-3 py-2">B</th>
                <th className="px-3 py-2">4s</th>
                <th className="px-3 py-2">6s</th>
                <th className="px-3 py-2">SR</th>
              </tr>
            </thead>

            <tbody className="border-b border-base-content/15">
              <tr className="">
                <td className="text-left px-3 py-2">
                  {matchData.currentPlayers.striker.name}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.striker.Runs}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.striker.Balls}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.striker.Four}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.striker.Six}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.striker.StrikeRate}
                </td>
              </tr>

              <tr className="">
                <td className="text-left px-3 py-2">
                  {matchData.currentPlayers.nonStriker.name}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.nonStriker.Runs}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.nonStriker.Balls}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.nonStriker.Four}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.nonStriker.Six}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.nonStriker.StrikeRate}
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th className="text-left px-3 py-2">Bowler</th>
                <th className="px-3 py-2">O</th>
                <th className="px-3 py-2">M</th>
                <th className="px-3 py-2">R</th>
                <th className="px-3 py-2">W</th>
                <th className="px-3 py-2">ECO</th>
              </tr>
            </thead>
            <tbody className="">
              <tr className="">
                <td className="text-left px-3 py-2">
                  {matchData.currentPlayers.bowler.name}
                </td>
                <td className="text-center px-3 py-2">
                  {Math.floor(matchData.currentPlayers.bowler.Balls / 6)}.
                  {matchData.currentPlayers.bowler.Balls % 6}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.bowler.Maidens}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.bowler.Runs}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.bowler.wicket}
                </td>
                <td className="text-center px-3 py-2">
                  {matchData.currentPlayers.bowler.Economy}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* per ball record */}
        <div className="border border-base-content/15 rounded-md flex items-center text-[.85rem] pl-2 gap-2 py-2">
          <p className="shrink-0 whitespace-nowrap">This over :</p>

          <div className="flex gap-2 overflow-x-auto min-w-0 hide-scrollbar">
            {Array.from({ length: 6 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="bg-orange-500 h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                >
                  6
                </div>
              );
            })}
          </div>
        </div>

        {/* socring button and extra button */}
        <div className=" flex border-base-content/15 rounded-md gap-2">
          {/* scoring button */}
          <div className="flex-2 border border-base-content/15 py-4 px-2 rounded-md grid gap-y-4 grid-cols-5 place-items-center">
            {scoringButton.map((btn) => {
              return (
                <button
                  onClick={() => handleScoreBtnClick(btn)}
                  className={`border-base-content/40 w-15 h-15 rounded-full font-semibold ${buttonColors[btn]} cursor-pointer border-2 shadow-[inset_0px_0px_5px_rgba(0,0,0,1)]`}
                  key={btn}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {isExtraModalOpen && (
        <ExtraRunCountModal
          extraType={extraType}
          onClose={() => setIsExtraModalOpen(false)}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
};
