import { getGrimScore } from "./weatherHelpers";

export default function WorstDayAlert({ weather }: { weather: any }) {
  let worstIndex = 0;
  let worstScore = 0;

  weather.daily.time.forEach((day: string, index: number) => {
    const temp = weather.daily.temperature_2m_max[index];
    const rain = weather.daily.precipitation_probability_max[index];
    const wind = weather.daily.wind_speed_10m_max[index];
    const code = weather.daily.weather_code[index];

    const score = getGrimScore(temp, rain, wind, code);

    if (score > worstScore) {
      worstScore = score;
      worstIndex = index;
    }
  });

  const worstDate = weather.daily.time[worstIndex];
  const worstRain = weather.daily.precipitation_probability_max[worstIndex];
  const worstWind = weather.daily.wind_speed_10m_max[worstIndex];

  return (
    <section style={styles.card}>
      <p style={styles.label}>☠️ WORST DAY ALERT™</p>

      <h2 style={styles.title}>
        {new Date(worstDate).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "short",
        })}
      </h2>

      <p style={styles.text}>
        This is the ugliest little day in the forecast.
      </p>

      <div style={styles.grid}>
        <div>
          <span>Grim</span>
          <strong>{worstScore}/10</strong>
        </div>

        <div>
          <span>Rain</span>
          <strong>{worstRain}%</strong>
        </div>

        <div>
          <span>Wind</span>
          <strong>{worstWind} km/h</strong>
        </div>
      </div>

      <p style={styles.warning}>
        Avoid outdoor plans unless you enjoy weather-based misery.
      </p>
    </section>
  );
}

const styles: any = {
  card: {
    background:
      "linear-gradient(160deg, rgba(255,77,109,0.22), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,77,109,0.35)",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "14px",
  },

  label: {
    margin: 0,
    color: "#ff4d6d",
    fontWeight: "bold",
    fontSize: "13px",
    letterSpacing: "1px",
  },

  title: {
    fontSize: "30px",
    margin: "8px 0",
  },

  text: {
    color: "#ffd1dc",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "8px",
    marginTop: "12px",
  },

  warning: {
    color: "#ccc",
    marginBottom: 0,
  },
};