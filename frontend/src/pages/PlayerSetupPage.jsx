import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Header } from "../components/Header";
export const PlayerSetupPage = () => {
  const navigate = useNavigate();
  const matchData = JSON.parse(localStorage.getItem("matchData"));
  //   console.log(matchData);

  const [formData, setFormData] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  });

  const [errorData, setErrorData] = useState({});

  //   zod player schema to handle errors
  const playerSchema = z.object({
    striker: z
      .string()
      .min(3, "Striker name must be at least 3 characters")
      .max(17, "Striker name must be less than 18 characters")
      .regex(/^\S.*$/, "Name cannot start with a space")
      .refine((value) => /[a-zA-Z]/.test(value), {
        message: "Name cannot contain only numbers",
      }),

    nonStriker: z
      .string()
      .min(3, "Non-striker name must be at least 3 characters")
      .max(17, "Non-striker name must be less than 18 characters")
      .regex(/^\S.*$/, "Name cannot start with a space")
      .refine((value) => /[a-zA-Z]/.test(value), {
        message: "Name cannot contain only numbers",
      }),

    bowler: z
      .string()
      .min(3, "Bowler name must be at least 3 characters")
      .max(17, "Bowler name must be less than 18 characters")
      .regex(/^\S.*$/, "Name cannot start with a space")
      .refine((value) => /[a-zA-Z]/.test(value), {
        message: "Name cannot contain only numbers",
      }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Remove error when user starts correcting the field
    setErrorData((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleStartMatch = (e) => {
    e.preventDefault();
    const result = playerSchema.safeParse(formData);
    const fieldError = {};

    if (!result.success) {
      result.error.issues.forEach((issues) => {
        const fieldName = issues.path[0];
        if (!fieldError[fieldName]) {
          fieldError[fieldName] = issues.message;
        }
      });
      setErrorData(fieldError);

      return;
    }
    const updatedData = { ...matchData, status: "scoring" };
    setFormData(updatedData);
    console.log(formData);

    localStorage.setItem("matchData", JSON.stringify(updatedData));
    setErrorData({});
    navigate("/match/scoring");
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <Header data="Hills Cricket Scorer" />
      <div className="mx-auto max-w-xl mt-12">
        <div className="rounded-2xl bg-base-100 p-6 shadow-lg">
          <h1 className="mb-2 text-2xl font-bold">Select Opening Players</h1>

          <p className="mb-6 text-sm opacity-70">
            Select the two opening batsmen and opening bowler.
          </p>

          <form onSubmit={handleStartMatch} className="space-y-5">
            {/* Strike Batsman */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Strike Batsman Name
              </label>

              <input
                type="text"
                name="striker"
                value={formData.striker}
                onChange={handleChange}
                placeholder="Enter strike batsman name"
                className="input input-bordered w-full outline-0"
              />
              {errorData.striker && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.striker}
                </p>
              )}
            </div>

            {/* Non-strike Batsman */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Non-strike Batsman Name
              </label>

              <input
                type="text"
                name="nonStriker"
                value={formData.nonStriker}
                onChange={handleChange}
                placeholder="Enter non-strike batsman name"
                className="input input-bordered w-full outline-0"
              />
              {errorData.nonStriker && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.nonStriker}
                </p>
              )}
            </div>

            {/* Opening Bowler */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Opening Bowler Name
              </label>

              <input
                type="text"
                name="bowler"
                value={formData.bowler}
                onChange={handleChange}
                placeholder="Enter opening bowler name"
                className="input input-bordered w-full outline-0"
              />
              {errorData.bowler && (
                <p className="text-sm mt-1 pl-2 text-red-500">
                  {errorData.bowler}
                </p>
              )}
            </div>

            {/* Start Match */}
            <button type="submit" className="btn btn-primary w-full">
              Start Match
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
