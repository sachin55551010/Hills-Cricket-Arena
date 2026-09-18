import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Pure helpers  (same logic as LocalMatchScoreboard.jsx)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const fmt = (v, decimals = 1) =>
  v != null && !isNaN(v) ? Number(v).toFixed(decimals) : "-";

const formatOvers = (legalBalls = 0) =>
  `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;

const getPlayerId = (p) => p?.id ?? p?.playerId ?? "";

const dismissalText = (player) => {
  if (player?.dismissal) return player.dismissal;
  if (!player) return "out";
  if (player.isNotOut) return "not out";
  switch (player.wicketType) {
    case "Run Out":
      return `run out (${player.fielder?.name || "fielder"})`;
    case "Caught":
      return `c ${player.fielder?.name || ""} b ${player.bowlerName || ""}`;
    case "Stumped":
      return `st ${player.fielder?.name || ""} b ${player.bowlerName || ""}`;
    case "Retired Out":
      return "retired out";
    default:
      return player.wicketType
        ? `${player.wicketType.toLowerCase()} b ${player.bowlerName || ""}`
        : "out";
  }
};

/**
 * Mirrors getBattingCard() in LocalMatchScoreboard.jsx
 * - Completed innings: uses saved battingCard snapshot
 * - Live innings: dismissed players + current not-out pair (striker/nonStriker)
 */
const getBattingCard = (inning, currentPlayers, isCurrent) => {
  if (inning.battingCard?.length) return inning.battingCard;

  const card = [];
  const seen = new Set();

  const push = (player, isNotOut) => {
    if (!player) return;
    const id = getPlayerId(player);
    if (id && seen.has(id)) return;
    if (id) seen.add(id);
    card.push({
      playerId: id,
      name: player.name || "",
      battingStats: { ...(player.battingStats || {}) },
      isNotOut,
      dismissal: isNotOut ? "not out" : dismissalText(player),
    });
  };

  (inning.outPlayers || []).forEach((p) => push(p, false));
  (inning.retiredHurtPlayers || []).forEach((p) => push(p, true));

  if (isCurrent) {
    push(currentPlayers?.striker, true);
    push(currentPlayers?.nonStriker, true);
  }

  return card;
};

/**
 * Mirrors getBowlingCard() in LocalMatchScoreboard.jsx
 */
const getBowlingCard = (inning, currentPlayers, isCurrent) => {
  if (inning.bowlingCard?.length) return inning.bowlingCard;

  const map = new Map();
  (inning.overHistory || []).forEach((over) => {
    const key = over.bowlerId || over.bowlerName;
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: over.bowlerName || "",
        balls: 0,
        runs: 0,
        wickets: 0,
        maidens: 0,
      });
    }
    const e = map.get(key);
    e.balls += over.legalBalls || 0;
    e.runs += over.runs || 0;
    e.wickets += over.wickets || 0;
    if ((over.legalBalls || 0) >= 6 && (over.runs || 0) === 0) e.maidens += 1;
  });

  const currentBowlerId = isCurrent ? getPlayerId(currentPlayers?.bowler) : "";
  return [...map.values()].map((b) => ({
    ...b,
    isCurrent: b.id === currentBowlerId,
  }));
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Colour palette
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BRAND        = [42, 120, 214];
const ACCENT       = [239, 68, 68];
const DARK         = [18, 24, 38];
const LIGHT_BG     = [245, 246, 248];
const MID_GRAY     = [160, 170, 185];
const WHITE        = [255, 255, 255];
const SUCCESS_CLR  = [34, 197, 94];
const WARNING_CLR  = [234, 179, 8];
const SECTION_BG   = [230, 238, 250];



/**
 * generateMatchPDF(matchData)
 * Produces a full scorecard PDF that mirrors LocalMatchScoreboard.jsx.
 *
 * @param {Object} matchData â€“ Redux currentMatchData object
 */
export const generateMatchPDF = (matchData) => {
  if (!matchData) return;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297

  const MARGIN    = 12;
  const CONTENT_W = W - MARGIN * 2;
  let y = 0;

  
  const drawBg = () => {
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, 18, "F");
    doc.setFillColor(...LIGHT_BG);
    doc.rect(0, 18, W, H - 18, "F");
  };

 
  const drawTopBar = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...WHITE);
    doc.text("HILLS CRICKET ARENA", MARGIN, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MID_GRAY);
    doc.text("Match Scorecard", W - MARGIN, 12, { align: "right" });
  };

  
  const newPage = () => {
    doc.addPage();
    drawBg();
    drawTopBar();
    y = 26;
  };

  
  const ensureSpace = (needed) => {
    if (y + needed > H - 14) newPage();
  };


  const sectionBar = (text, color = BRAND) => {
    ensureSpace(9);
    doc.setFillColor(...color);
    doc.roundedRect(MARGIN, y, CONTENT_W, 6.5, 1.2, 1.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE);
    doc.text(text.toUpperCase(), MARGIN + 3, y + 4.5);
    y += 9;
  };

 
  const subHeading = (text) => {
    ensureSpace(7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...MID_GRAY);
    doc.text(text.toUpperCase(), MARGIN, y);
    y += 4.5;
  };


  const inlineStat = (label, value, xOffset = 0, yOffset = 0) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MID_GRAY);
    doc.text(label, MARGIN + xOffset, y + yOffset);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...DARK);
    doc.text(String(value ?? "-"), MARGIN + xOffset, y + yOffset + 4);
  };

  const addTable = (head, body, colStyles = {}, opts = {}) => {
    if (!body || body.length === 0) return;
    ensureSpace(12);
    autoTable(doc, {
      startY: y,
      head,
      body,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_W,
      styles: {
        font: "helvetica",
        fontSize: 7,
        cellPadding: { top: 1.8, right: 2.5, bottom: 1.8, left: 2.5 },
        textColor: DARK,
        lineColor: [215, 220, 228],
        lineWidth: 0.18,
        fillColor: WHITE,
        overflow: "ellipsize",
      },
      headStyles: {
        fillColor: DARK,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 7,
      },
      alternateRowStyles: { fillColor: [248, 249, 251] },
      columnStyles: colStyles,
      willDrawPage: () => {
        drawBg();
        drawTopBar();
      },
      ...opts,
    });
    y = doc.lastAutoTable.finalY + 4;
  };

 

  drawBg();
  drawTopBar();
  y = 24;

  const t1      = matchData.firstTeam?.name  || "Team A";
  const t2      = matchData.secondTeam?.name || "Team B";
  const innings = matchData.innings || [];
  const inn1    = innings[0];
  const inn2    = innings[1];

  const currentInning   = Number(matchData.currentInning) || 1;
  const currentPlayers  = matchData.currentPlayers;

  
  const CARD_H = 62;
  doc.setFillColor(...WHITE);
  doc.roundedRect(MARGIN, y, CONTENT_W, CARD_H, 3, 3, "F");

  // Team names
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...DARK);
  doc.text(t1, MARGIN + 5, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MID_GRAY);
  doc.text("vs", W / 2, y + 11, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...DARK);
  doc.text(t2, W - MARGIN - 5, y + 11, { align: "right" });

  // Scores
  const score = (inn) =>
    inn ? `${inn.runs ?? 0}/${inn.wickets ?? 0} (${formatOvers(inn.legalBalls || 0)})` : "-";

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BRAND);
  doc.text(score(inn1), MARGIN + 5, y + 20);

  doc.setTextColor(...ACCENT);
  doc.text(score(inn2), W - MARGIN - 5, y + 20, { align: "right" });

  // Divider
  doc.setDrawColor(215, 220, 228);
  doc.setLineWidth(0.25);
  doc.line(MARGIN + 4, y + 24, W - MARGIN - 4, y + 24);

  // Details grid (3 Ã— 2)
  const details = [
    ["Overs",   matchData.totalOvers ?? matchData.overs ?? "-"],
    ["Format",  matchData.matchType  || "-"],
    ["Toss",    matchData.tossWinner || "-"],
    ["Date",    matchData.date
        ? new Date(matchData.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
    ["Status",  matchData.matchStatus || "-"],
    ["Match ID", matchData.matchId ? String(matchData.matchId).slice(0, 14) : "-"],
  ];

  const COL2 = MARGIN + CONTENT_W / 2;
  details.forEach(([label, value], i) => {
    const col  = i % 2;
    const row  = Math.floor(i / 2);
    const xB   = col === 0 ? MARGIN + 5 : COL2;
    const yB   = y + 30 + row * 9;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MID_GRAY);
    doc.text(label, xB, yB);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...DARK);
    doc.text(String(value), xB, yB + 4.5);
  });

  y += CARD_H + 4;

  // Match result banner
  if (matchData.matchResult) {
    doc.setFillColor(...SUCCESS_CLR);
    doc.roundedRect(MARGIN, y, CONTENT_W, 8.5, 1.8, 1.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text(`Result: ${matchData.matchResult}`, W / 2, y + 5.5, { align: "center" });
    y += 13;
  }

 

  innings.forEach((inning, idx) => {
    const isCurrent    = idx + 1 === currentInning;
    const inningLabel  = idx === 0 ? "1st Innings" : "2nd Innings";
    const statusLabel  = inning.battingCard ? "Completed" : "In Progress";
    const statusColor  = inning.battingCard ? SUCCESS_CLR : WARNING_CLR;
    const battingTeam  = inning.battingTeam  || (idx === 0 ? t1 : t2);
    const bowlingTeam  = inning.bowlingTeam  || (idx === 0 ? t2 : t1);
    const color        = idx === 0 ? BRAND : ACCENT;

    const totalBalls   = inning.legalBalls || 0;
    const runRate      = totalBalls > 0 ? ((inning.runs * 6) / totalBalls).toFixed(2) : "0.00";

    const extras       = inning.extras || {};
    const extrasTotal  =
      (extras.wideBallRun || 0) +
      (extras.noBallRun   || 0) +
      (extras.byes        || 0) +
      (extras.legByes     || 0) +
      (extras.overthrow   || 0);

   
    y += 5;
    ensureSpace(30);

    // Inning section background
    doc.setFillColor(...SECTION_BG);
    doc.roundedRect(MARGIN, y, CONTENT_W, 22, 2.5, 2.5, "F");

    // Left â€“ team + inning label + status badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    doc.text(battingTeam, MARGIN + 4, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MID_GRAY);
    doc.text(`vs ${bowlingTeam}`, MARGIN + 4, y + 14.5);

    // Inning tag
    doc.setFillColor(...DARK);
    doc.roundedRect(MARGIN + 4, y + 16.5, 22, 4, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...WHITE);
    doc.text(inningLabel, MARGIN + 6, y + 19.5);

    // Status badge
    doc.setFillColor(...statusColor);
    doc.roundedRect(MARGIN + 28, y + 16.5, 22, 4, 1, 1, "F");
    doc.setFontSize(6);
    doc.text(statusLabel, MARGIN + 30, y + 19.5);

    // Right â€“ score + CRR
    const scoreStr = `${inning.runs ?? 0}-${inning.wickets ?? 0}`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text(scoreStr, W - MARGIN - 4, y + 13, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MID_GRAY);
    doc.text(
      `(${formatOvers(totalBalls)} ov)  Â·  CRR ${runRate}`,
      W - MARGIN - 4,
      y + 19,
      { align: "right" }
    );

    y += 26;

    
    const summaryStats = [
      ["Overs",    formatOvers(totalBalls)],
      ["Run Rate", runRate],
      ["Extras",   extrasTotal],
      ...(idx === 1 ? [["Target", matchData.target ?? "-"]] : []),
    ];

    const colCount = summaryStats.length;
    const colW     = CONTENT_W / colCount;

    ensureSpace(14);
    doc.setFillColor(...WHITE);
    doc.roundedRect(MARGIN, y, CONTENT_W, 12, 1.5, 1.5, "F");
    summaryStats.forEach(([label, value], si) => {
      const xC = MARGIN + si * colW + colW / 2;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...MID_GRAY);
      doc.text(label, xC, y + 4, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text(String(value), xC, y + 10, { align: "center" });
    });
    y += 16;

  
    const battingCard = getBattingCard(inning, currentPlayers, isCurrent);

    if (battingCard.length > 0) {
      subHeading(`Batting  Â·  ${battingTeam}  Â·  ${battingCard.length} batsman${battingCard.length !== 1 ? "s" : ""}`);

      addTable(
        [["Batsman", "Dismissal", "R", "B", "4s", "6s", "SR"]],
        battingCard.map((p) => {
          const s  = p.battingStats || {};
          const isStriker =
            isCurrent && getPlayerId(currentPlayers?.striker) === p.playerId;
          return [
            (p.name || "-") + (isStriker ? " *" : ""),
            p.dismissal || (p.isNotOut ? "not out" : "out"),
            s.runs  ?? 0,
            s.balls ?? 0,
            s.fours ?? 0,
            s.sixes ?? 0,
            fmt(s.strikeRate),
          ];
        }),
        {
          0: { cellWidth: 36, halign: "left",   fontStyle: "bold" },
          1: { cellWidth: "auto", halign: "left", fontStyle: "italic", textColor: MID_GRAY },
          2: { cellWidth: 10, halign: "center", fontStyle: "bold" },
          3: { cellWidth: 10, halign: "center" },
          4: { cellWidth: 10, halign: "center" },
          5: { cellWidth: 10, halign: "center" },
          6: { cellWidth: 14, halign: "center" },
        }
      );
    }

    
    ensureSpace(8);
    doc.setFillColor(...WHITE);
    doc.roundedRect(MARGIN, y, CONTENT_W, 8, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...DARK);
    doc.text(`Extras: ${extrasTotal}`, MARGIN + 3, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MID_GRAY);
    doc.text(
      `(WD ${extras.wideBallRun || 0}  NB ${extras.noBallRun || 0}  LB ${extras.legByes || 0}  B ${extras.byes || 0}  OV ${extras.overthrow || 0})`,
      MARGIN + 28,
      y + 5
    );
    y += 12;

 
    const bowlingCard = getBowlingCard(inning, currentPlayers, isCurrent);

    if (bowlingCard.length > 0) {
      subHeading(`Bowling  Â·  ${bowlingTeam}  Â·  ${bowlingCard.length} bowler${bowlingCard.length !== 1 ? "s" : ""}`);

      addTable(
        [["Bowler", "O", "R", "W", "M", "Economy"]],
        bowlingCard.map((b) => [
          (b.name || "-") + (b.isCurrent ? " *" : ""),
          formatOvers(b.balls || 0),
          b.runs    ?? 0,
          b.wickets ?? 0,
          b.maidens ?? 0,
          b.balls > 0 ? fmt((b.runs / b.balls) * 6) : "-",
        ]),
        {
          0: { cellWidth: "auto", halign: "left",   fontStyle: "bold" },
          1: { cellWidth: 16,     halign: "center" },
          2: { cellWidth: 16,     halign: "center" },
          3: { cellWidth: 16,     halign: "center", fontStyle: "bold" },
          4: { cellWidth: 16,     halign: "center" },
          5: { cellWidth: 20,     halign: "center" },
        }
      );
    }

    
    const fow = (inning.outPlayers || []).map((p, i) => ({
      wicket: p.teamWickets  ?? i + 1,
      name:   p.name         || "-",
      runs:   p.teamRuns     ?? 0,
      balls:  p.battingStats?.balls ?? 0,
      over:   p.teamLegalBalls != null ? formatOvers(p.teamLegalBalls) : "-",
    }));

    if (fow.length > 0) {
      subHeading(`Fall of Wickets  Â·  ${fow.length} wicket${fow.length !== 1 ? "s" : ""}`);

      addTable(
        [["Wkt", "Batsman", "Score", "Balls", "Over"]],
        fow.map((f) => [f.wicket, f.name, f.runs, f.balls, f.over]),
        {
          0: { cellWidth: 12,     halign: "center" },
          1: { cellWidth: "auto", halign: "left" },
          2: { cellWidth: 18,     halign: "center" },
          3: { cellWidth: 18,     halign: "center" },
          4: { cellWidth: 18,     halign: "center" },
        }
      );
    }

 
    if (isCurrent && !inning.battingCard) {
      ensureSpace(6);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(6);
      doc.setTextColor(...MID_GRAY);
      doc.text("* denotes batsman currently on strike  |  * denotes bowler currently bowling", MARGIN, y);
      y += 6;
    }
  });



  const pageCount = doc.internal.getNumberOfPages();
  const genTime   = new Date().toLocaleString("en-IN");

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...DARK);
    doc.rect(0, H - 9, W, 9, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...MID_GRAY);
    doc.text("Hills Cricket Arena â€” Match Scorecard", MARGIN, H - 3.5);
    doc.text(
      `Generated ${genTime}  |  Page ${i} of ${pageCount}`,
      W - MARGIN,
      H - 3.5,
      { align: "right" }
    );
  }

  
  const safe = (s) => String(s || "").replace(/\s+/g, "_").replace(/[^\w_-]/g, "");
  const fileName = `HCA_${safe(matchData.firstTeam?.name) || "Team1"}_vs_${safe(matchData.secondTeam?.name) || "Team2"}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};

