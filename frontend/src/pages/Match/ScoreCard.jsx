import React from "react";
import { useParams } from "react-router-dom";
import { useGetMatchByIdQuery } from "../../store/matchApi";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Trophy,
  CircleDot,
  Layers3,
} from "lucide-react";

export const ScoreCard = () => {
  const { matchId } = useParams();

  const { data, isLoading } = useGetMatchByIdQuery(matchId);

  const match = data?.match;
  const tournament = match?.tournamentId;

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="card bg-base-100 border border-base-300">
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-base-300 rounded w-1/3 mx-auto" />
            <div className="h-10 bg-base-300 rounded w-1/2 mx-auto" />
            <div className="h-20 bg-base-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="p-4">
        <div className="alert alert-error">
          Unable to load match information.
        </div>
      </div>
    );
  }

  const matchDate = new Date(match.matchScheduleDate);

  const formattedDate = matchDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-3 space-y-4">
      {/* Scorecard / Match Status */}
      <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Status */}
          <div className="flex justify-center mb-5">
            <div className="badge badge-warning gap-2 px-4 py-3">
              <Clock3 size={14} />
              Match Not Started
            </div>
          </div>

          {/* Start Time */}
          <div className="text-center mb-7">
            <p className="text-sm text-base-content/60">Match starts on</p>

            <h2 className="text-xl sm:text-3xl font-bold mt-1">
              {formattedDate}
            </h2>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-center gap-5 sm:gap-10">
            <Team
              name={match?.firstTeamId?.teamName}
              logo={match?.firstTeamId?.teamLogo}
            />

            <div className="text-sm font-bold text-base-content/40">VS</div>

            <Team
              name={match?.secondTeamId?.teamName}
              logo={match?.secondTeamId?.teamLogo}
            />
          </div>

          {/* Tournament */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Trophy size={16} />
              <span>{tournament?.tournamentName || "Tournament"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Match Information */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="p-5">
          <h2 className="font-semibold text-lg mb-4">Match Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoItem
              icon={<CalendarDays size={17} />}
              label="Date"
              value={formattedDate}
            />

            <InfoItem
              icon={<MapPin size={17} />}
              label="Venue"
              value={
                tournament?.ground
                  ? `${tournament.ground}, ${tournament.city || ""}`
                  : tournament?.city
              }
            />

            <InfoItem label="Category" value={tournament?.tournamentCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Team ---------------- */

const Team = ({ name }) => {
  return (
    <div className="flex flex-col items-center gap-2 min-w-25">
      <p className="font-semibold text-center text-sm sm:text-base">
        {name || "Team"}
      </p>
    </div>
  );
};

/* ---------------- Info Item ---------------- */

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl bg-base-200/60 p-3">
      <div className="flex items-center gap-2 text-base-content/50">
        {icon}
        <p className="text-xs">{label}</p>
      </div>

      <p className="font-medium mt-1 capitalize">{value || "—"}</p>
    </div>
  );
};
