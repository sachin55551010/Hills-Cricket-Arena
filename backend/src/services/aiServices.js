import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const aiServices = async (matchData) => {
  const prompt = `
You are an expert cricket analyst.

Analyze the following completed cricket match data and determine the
Man of the Match.

Consider:
- Batting performance
- Runs scored
- Strike rate
- Wickets
- Bowling economy
- Bowling impact
- Important dismissals
- Match situation
- Overall contribution to the team's performance

Do NOT simply choose the player with the highest runs.
Consider the overall impact of the player's performance on the match.

Return ONLY the requested JSON structure.

MATCH DATA:
${JSON.stringify(matchData)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          playerId: {
            type: "string",
            description: "Unique ID of the Man of the Match player",
          },
          playerName: {
            type: "string",
            description: "Name of the Man of the Match player",
          },
          teamId: {
            type: "string",
            description: "Team ID of the player",
          },
          teamName: {
            type: "string",
            description: "Team name of the player",
          },
          reason: {
            type: "string",
            description:
              "Short explanation of why this player deserves Man of the Match",
          },
          performance: {
            type: "object",
            properties: {
              runs: {
                type: "integer",
              },
              wickets: {
                type: "integer",
              },
              ballsFaced: {
                type: "integer",
              },
              runsConceded: {
                type: "integer",
              },
            },
            required: ["runs", "wickets", "ballsFaced", "runsConceded"],
          },
        },
        required: [
          "playerId",
          "playerName",
          "teamId",
          "teamName",
          "reason",
          "performance",
        ],
      },
    },
  });

  return JSON.parse(response.text);
};
