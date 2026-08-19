import React from "react";
import { Header } from "../components/Header";

export const ScoringPage = () => {
  const matchData = JSON.parse(localStorage.getItem("matchData"));
  console.log(matchData);

  const dummyData = [
    { name: "Sachin", runs: 10, balls: 5, four: 2, six: 0, sr: 105 },
    { name: "Ajay", runs: 20, balls: 6, four: 3, six: 1, sr: 150 },
  ];

  const scoringButton = ["0", "1", "2", "3", "4", "5", "6", "..."];

  // const ballColors = {
  //   wicket: "bg-red-500",
  //   four: "bg-orange-600",
  //   six: "bg-green-600",
  // };

  return (
    <div className="h-dvh w-screen pt-12 flex justify-center">
      <Header data="Hills Cricket Scoring" />

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
            <thead>
              <tr className="">
                <th className="text-left px-3 py-2">Batsman</th>
                <th className="px-3 py-2">R</th>
                <th className="px-3 py-2">B</th>
                <th className="px-3 py-2">4s</th>
                <th className="px-3 py-2">6s</th>
                <th className="px-3 py-2">SR</th>
              </tr>
            </thead>

            <tbody className="">
              {dummyData.map((elem) => (
                <tr key={elem.name} className="">
                  <td className="text-left px-3 py-2">{elem.name}</td>
                  <td className="text-center px-3 py-2">{elem.runs}</td>
                  <td className="text-center px-3 py-2">{elem.balls}</td>
                  <td className="text-center px-3 py-2">{elem.four}</td>
                  <td className="text-center px-3 py-2">{elem.six}</td>
                  <td className="text-center px-3 py-2">{elem.sr}</td>
                </tr>
              ))}
            </tbody>

            <tbody>
              <tr className="border-t border-base-content/15">
                <td className="text-left px-3 py-2">Gaurav</td>
                <td className="text-center px-3 py-2">15</td>
                <td className="text-center px-3 py-2">3</td>
                <td className="text-center px-3 py-2">0</td>
                <td className="text-center px-3 py-2">0</td>
                <td className="text-center px-3 py-2">3</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* per ball record */}
        <div className="h-10 border border-base-content/15 rounded-md flex items-center text-[.85rem] pl-2 gap-2 ">
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
          {/* extra key */}
          <div className="flex flex-col gap-2 border rounded-md border-base-content/15 p-2">
            <button className="btn btn-info h-9 text-[.8rem]">Undo</button>
            <button className="btn btn-info h-9 text-[.8rem]">
              Partnership
            </button>
            <button className="btn btn-info h-9 text-[.8rem]">Extra</button>
          </div>
          {/* scoring button */}
          <div className="flex-2 border border-base-content/15 p-2 rounded-md grid gap-2 grid-cols-4 place-items-center">
            {scoringButton.map((btn) => {
              return (
                <button className="border border-base-content/15 w-13 h-13 rounded-full font-semibold">
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
