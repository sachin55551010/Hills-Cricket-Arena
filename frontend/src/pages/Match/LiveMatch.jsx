import React from "react";
import { useGetMatchByIdQuery } from "../../store/matchApi";
import { useParams } from "react-router-dom";

export const LiveMatch = () => {
  const { matchId } = useParams();
  const { data } = useGetMatchByIdQuery(matchId);

  // Later this can come from match data/API

  return (
    <div className="flex min-h-[300px] items-center justify-center p-4 mt-14">
      <div className="w-full lg:w-[70%] rounded-md border border-base-300 bg-base-100 p-6 text-center shadow-sm">
        {/* Status */}
        <div className="mb-4 flex justify-center">
          <span className="rounded-full bg-warning/15 px-4 py-1.5 text-sm font-medium text-warning">
            Upcoming Match
          </span>
        </div>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
          🏏
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-base-content">
          Match will start soon
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          Live scoring will be available once the match starts.
        </p>

        {/* Date & Time */}
        <div className="mt-6 rounded-xl bg-base-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
            Match starts on
          </p>

          <p className="mt-1 text-lg font-bold text-base-content">
            {new Date(data?.match?.matchScheduleDate).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              },
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
