const CACHE_TIME = 1000 * 60 * 60 * 6; // 6 hours

let cachedWorstPlaces: any[] = [];
let lastUpdated = 0;

const places = [
  "Aberdeen",
  "Amesbury",
  "Belfast",
  "Birmingham",
  "Blackpool",
  "Bournemouth",
  "Brighton",
  "Bristol",
  "Cardiff",
  "Carlisle",
  "Edinburgh",
  "Glasgow",
  "Hull",
  "Inverness",
  "Leeds",
  "Liverpool",
  "London",
  "Manchester",
  "Newcastle",
  "Norwich",
  "Plymouth",
  "Portsmouth",
  "Salisbury",
  "Sheffield",
  "Southampton",
  "Swansea",
  "Swindon",
  "York",
];

function getGrimScore(temp: number, rain: number, wind: number, code: number) {
  let score = 0;

  score += rain / 12;
  score += wind / 10;

  if (temp <= 5) score += 2;
  if (temp >= 28) score += 1.5;
  if (code >= 61) score += 2;

  return Math.max(0, Math.min(10, Math.round(score)));
}

export async function GET(request: Request) {
  const now = Date.now();

  if (cachedWorstPlaces.length && now - lastUpdated < CACHE_TIME) {
    return Response.json({
      cached: true,
      updatedAt: lastUpdated,
      places: cachedWorstPlaces,
    });
  }

  const baseUrl = new URL(request.url).origin;

  const results = await Promise.all(
    places.map((place) =>
      fetch(`${baseUrl}/api/weather?location=${encodeURIComponent(place)}`)
        .then((res) => res.json())
        .then((data) => {
          const temp = data.daily.temperature_2m_max[0];
          const rain = data.daily.precipitation_probability_max[0];
          const wind = data.daily.wind_speed_10m_max[0];
          const code = data.daily.weather_code[0];

          return {
            name: place,
            temp,
            rain,
            wind,
            code,
            score: getGrimScore(temp, rain, wind, code),
          };
        })
        .catch(() => null)
    )
  );

  cachedWorstPlaces = results
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 10);

  lastUpdated = now;

  return Response.json({
    cached: false,
    updatedAt: lastUpdated,
    places: cachedWorstPlaces,
  });
}