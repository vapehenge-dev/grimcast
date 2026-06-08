export default function GrimMeter({ score }: { score: number }) {
  const filled = "█".repeat(score);
  const empty = "░".repeat(10 - score);

  function getGrimStatus(score: number) {
    if (score <= 2) return "Suspiciously Pleasant";
    if (score <= 4) return "Slightly Annoying";
    if (score <= 6) return "Miserable";
    if (score <= 8) return "Proper Grim";
    return "Apocalypse Pending";
  }

  return (
    <section style={styles.grimCard}>
      <p style={styles.grimLabel}>☠️ GRIM METER</p>
      <h2 style={styles.grimScore}>{score}/10</h2>
      <p style={styles.meter}>
        {filled}
        {empty}
      </p>
      <p style={styles.grimStatus}>{getGrimStatus(score)}</p>
    </section>
  );
}

const styles: any = {
  grimCard: {
    background: "#121217",
    border: "1px solid #292933",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "14px",
    textAlign: "center",
  },

  grimLabel: {
    margin: 0,
    color: "#ff4d6d",
    fontWeight: "bold",
  },

  grimScore: {
    fontSize: "46px",
    margin: "6px 0",
  },

  meter: {
    color: "#ff4d6d",
    letterSpacing: "3px",
    fontSize: "22px",
    margin: "8px 0",
  },

  grimStatus: {
    color: "#ffd1dc",
    fontWeight: "bold",
    margin: 0,
  },
};