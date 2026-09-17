import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt = (v, decimals = 1) =>
  v != null && !isNaN(v) ? Number(v).toFixed(decimals) : "-";

const formatOvers = (legalBalls = 0) =>
  `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;

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

const getBattingCard = (inning) => {
  if (inning.battingCard?.length) return inning.battingCard;
  const card = [];
  const seen = new Set();
  const push = (player, isNotOut) => {
    if (!player) return;
    const id = player.playerId || player.id || "";
    if (id && seen.has(id)) return;
    if (id) seen.add(id);
    card.push({
      name: player.name || "",
      battingStats: { ...(player.battingStats || {}) },
      isNotOut,
      dismissal: isNotOut ? "not out" : dismissalText(player),
    });
  };
  (inning.outPlayers || []).forEach((p) => push(p, false));
  return card;
};

const getBowlingCard = (inning) => {
  if (inning.bowlingCard?.length) return inning.bowlingCard;
  const map = new Map();
  (inning.overHistory || []).forEach((over) => {
    const key = over.bowlerId || over.bowlerName;
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, {
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
  return [...map.values()];
};

// ── colour palette ────────────────────────────────────────────────────────────

const BRAND = [42, 120, 214];
const ACCENT = [239, 68, 68];
const DARK = [18, 24, 38];
const LIGHT_GRAY = [245, 246, 248];
const MID_GRAY = [160, 170, 185];
const WHITE = [255, 255, 255];
const SUCCESS_COLOR = [34, 197, 94];

// ── main export ───────────────────────────────────────────────────────────────

/**
 * generateMatchPDF(matchData)
 * Creates and auto-downloads a PDF scorecard for a cricket match.
 *
 * @param {Object} matchData  – Redux currentMatchData object
 */
export const generateMatchPDF = (matchData) => {
  if (!matchData) return;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const MARGIN = 14;
  const CONTENT_W = W - MARGIN * 2;
  let y = 0;

  // ── utility: ensure space or add page ───────────────────────────────────────
  const ensureSpace = (needed) => {
    if (y + needed > H - 18) {
      doc.addPage();
      drawPageBg();
      drawHeader();
      y = 38;
    }
  };


  // ── page background & header (drawn BEFORE content on each page) ─────────────
  const drawPageBg = () => {
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, 20, "F");
    doc.setFillColor(...LIGHT_GRAY);
    doc.rect(0, 20, W, H - 20, "F");
  };

  const drawHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...WHITE);
    doc.text("HILLS CRICKET ARENA", MARGIN, 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MID_GRAY);
    doc.text("Match Scorecard", W - MARGIN, 13, { align: "right" });
  };

  // ── section title ────────────────────────────────────────────────────────────
  const sectionTitle = (text, color = BRAND) => {
    ensureSpace(10);
    doc.setFillColor(...color);
    doc.roundedRect(MARGIN, y, CONTENT_W, 7, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text(text.toUpperCase(), MARGIN + 4, y + 5);
    y += 10;
  };

  // ── autoTable wrapper ────────────────────────────────────────────────────────
  // willDrawPage fires BEFORE any content is placed on each page, so the
  // background is drawn first and never overwrites table rows.
  const addTable = (head, body, columnStyles = {}) => {
    ensureSpace(14);
    autoTable(doc, {
      startY: y,
      head,
      body,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_W,
      styles: {
        font: "helvetica",
        fontSize: 7.5,
        cellPadding: { top: 2, right: 3, bottom: 2, left: 3 },
        textColor: DARK,
        lineColor: [220, 224, 230],
        lineWidth: 0.2,
        fillColor: WHITE,
      },
      headStyles: {
        fillColor: DARK,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 7.5,
      },
      alternateRowStyles: { fillColor: [250, 251, 253] },
      columnStyles,
      // willDrawPage fires BEFORE table rows — safe to paint background here
      willDrawPage: () => {
        drawPageBg();
        drawHeader();
      },
    });
    y = doc.lastAutoTable.finalY + 5;
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // START DOCUMENT
  // ═══════════════════════════════════════════════════════════════════════════

  drawPageBg();
  drawHeader();
  y = 28;


  // ── Match info card ──────────────────────────────────────────────────────────
  doc.setFillColor(...WHITE);
  doc.roundedRect(MARGIN, y, CONTENT_W, 56, 3, 3, "F");

  const t1 = matchData.firstTeam?.name || "Team A";
  const t2 = matchData.secondTeam?.name || "Team B";
  const inn1 = matchData.innings?.[0];
  const inn2 = matchData.innings?.[1];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text(t1, MARGIN + 5, y + 12);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID_GRAY);
  doc.text("vs", W / 2, y + 12, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text(t2, W - MARGIN - 5, y + 12, { align: "right" });

  if (inn1) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BRAND);
    doc.text(
      `${inn1.runs ?? 0}/${inn1.wickets ?? 0} (${formatOvers(inn1.legalBalls || 0)})`,
      MARGIN + 5,
      y + 22
    );
  }
  if (inn2) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...ACCENT);
    doc.text(
      `${inn2.runs ?? 0}/${inn2.wickets ?? 0} (${formatOvers(inn2.legalBalls || 0)})`,
      W - MARGIN - 5,
      y + 22,
      { align: "right" }
    );
  }

  doc.setDrawColor(220, 224, 230);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + 5, y + 26, W - MARGIN - 5, y + 26);

  const details = [
    ["Overs", matchData.totalOvers ?? matchData.overs ?? "-"],
    ["Format", matchData.matchType || "-"],
    ["Toss", matchData.tossWinner || "-"],
    [
      "Date",
      matchData.date
        ? new Date(matchData.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
    ],
    ["Status", matchData.matchStatus || "-"],
    [
      "Match ID",
      matchData.matchId ? String(matchData.matchId).slice(0, 12) : "-",
    ],
  ];

  const COL2_X = MARGIN + CONTENT_W / 2;
  details.forEach((pair, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xBase = col === 0 ? MARGIN + 5 : COL2_X;
    const yBase = y + 32 + row * 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MID_GRAY);
    doc.text(pair[0], xBase, yBase);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...DARK);
    doc.text(String(pair[1]), xBase, yBase + 4);
  });

  y += 62;

  // Match result banner
  if (matchData.matchResult) {
    doc.setFillColor(...SUCCESS_COLOR);
    doc.roundedRect(MARGIN, y, CONTENT_W, 9, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...WHITE);
    doc.text(`Result: ${matchData.matchResult}`, W / 2, y + 6, {
      align: "center",
    });
    y += 14;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INNINGS SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const innings = matchData.innings || [];

  innings.forEach((inning, inningIdx) => {
    const color = inningIdx === 0 ? BRAND : ACCENT;
    const inningLabel = inningIdx === 0 ? "1st Innings" : "2nd Innings";
    const battingTeam = inning.battingTeam || (inningIdx === 0 ? t1 : t2);
    const bowlingTeam = inning.bowlingTeam || (inningIdx === 0 ? t2 : t1);

    y += 4;
    sectionTitle(`${inningLabel} - ${battingTeam}`, color);

    // Inning summary
    const totalBalls = inning.legalBalls || 0;
    const rr =
      totalBalls > 0 ? ((inning.runs * 6) / totalBalls).toFixed(2) : "0.00";
    const extras = inning.extras || {};
    const extrasTotal =
      (extras.wideBallRun || 0) +
      (extras.noBallRun || 0) +
      (extras.byes || 0) +
      (extras.legByes || 0) +
      (extras.overthrow || 0);

    addTable(
      [["Score", "Overs", "Run Rate", "Extras", "Target"]],
      [[
        `${inning.runs ?? 0}/${inning.wickets ?? 0}`,
        formatOvers(totalBalls),
        rr,
        extrasTotal,
        inningIdx === 1 ? (matchData.target ?? "-") : "-",
      ]],
      {
        0: { halign: "center" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
      }
    );

    // ── Batting card ──────────────────────────────────────────────────────────
    const battingCard = getBattingCard(inning);
    if (battingCard.length > 0) {
      ensureSpace(8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...MID_GRAY);
      doc.text(`BATTING  -  ${battingTeam}`, MARGIN, y);
      y += 4;

      addTable(
        [["Batsman", "Dismissal", "R", "B", "4s", "6s", "SR"]],
        battingCard.map((p) => {
          const s = p.battingStats || {};
          return [
            p.name || "-",
            p.dismissal || (p.isNotOut ? "not out" : "out"),
            s.runs ?? 0,
            s.balls ?? 0,
            s.fours ?? 0,
            s.sixes ?? 0,
            fmt(s.strikeRate),
          ];
        }),
        {
          0: { cellWidth: 38, halign: "left" },
          1: { cellWidth: "auto", halign: "left", fontStyle: "italic" },
          2: { cellWidth: 10, halign: "center", fontStyle: "bold" },
          3: { cellWidth: 10, halign: "center" },
          4: { cellWidth: 10, halign: "center" },
          5: { cellWidth: 10, halign: "center" },
          6: { cellWidth: 14, halign: "center" },
        }
      );
    }

    // ── Extras breakdown ──────────────────────────────────────────────────────
    ensureSpace(10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MID_GRAY);
    doc.text(
      `Extras: ${extrasTotal}  (WD ${extras.wideBallRun || 0}, NB ${extras.noBallRun || 0}, LB ${extras.legByes || 0}, B ${extras.byes || 0}, OV ${extras.overthrow || 0})`,
      MARGIN,
      y
    );
    y += 7;

    // ── Bowling card ──────────────────────────────────────────────────────────
    const bowlingCard = getBowlingCard(inning);
    if (bowlingCard.length > 0) {
      ensureSpace(8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...MID_GRAY);
      doc.text(`BOWLING  -  ${bowlingTeam}`, MARGIN, y);
      y += 4;

      addTable(
        [["Bowler", "O", "R", "W", "M", "Economy"]],
        bowlingCard.map((b) => [
          b.name || "-",
          formatOvers(b.balls || 0),
          b.runs ?? 0,
          b.wickets ?? 0,
          b.maidens ?? 0,
          b.balls > 0 ? fmt((b.runs / b.balls) * 6) : "-",
        ]),
        {
          0: { cellWidth: 52, halign: "left" },
          1: { cellWidth: 16, halign: "center" },
          2: { cellWidth: 16, halign: "center" },
          3: { cellWidth: 16, halign: "center", fontStyle: "bold" },
          4: { cellWidth: 16, halign: "center" },
          5: { cellWidth: "auto", halign: "center" },
        }
      );
    }

    // ── Fall of wickets ───────────────────────────────────────────────────────
    const fow = (inning.outPlayers || []).map((p, i) => ({
      wicket: p.teamWickets ?? i + 1,
      name: p.name || "-",
      runs: p.teamRuns ?? 0,
      balls: p.battingStats?.balls ?? 0,
      over:
        p.teamLegalBalls != null ? formatOvers(p.teamLegalBalls) : "-",
    }));

    if (fow.length > 0) {
      ensureSpace(8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...MID_GRAY);
      doc.text("FALL OF WICKETS", MARGIN, y);
      y += 4;

      addTable(
        [["Wkt", "Batsman", "Score", "Balls", "Over"]],
        fow.map((f) => [f.wicket, f.name, f.runs, f.balls, f.over]),
        {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: "auto", halign: "left" },
          2: { cellWidth: 18, halign: "center" },
          3: { cellWidth: 18, halign: "center" },
          4: { cellWidth: 18, halign: "center" },
        }
      );
    }
  });

  // ── Footer on every page ──────────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...DARK);
    doc.rect(0, H - 10, W, 10, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MID_GRAY);
    doc.text("Hills Cricket Arena - Match Scorecard", MARGIN, H - 4);
    doc.text(
      `Generated ${new Date().toLocaleString("en-IN")}  |  Page ${i} of ${pageCount}`,
      W - MARGIN,
      H - 4,
      { align: "right" }
    );
  }

  // ── Save ──────────────────────────────────────────────────────────────────────
  const safeName = (s) => String(s || "").replace(/\s+/g, "_").replace(/[^\w_-]/g, "");
  const fileName = `HCA_${safeName(matchData.firstTeam?.name) || "Team1"}_vs_${safeName(matchData.secondTeam?.name) || "Team2"}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
