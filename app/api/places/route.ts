export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return Response.json({ results: [] });
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;

  const geoRes = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      query
    )},GB&limit=8&appid=${API_KEY}`
  );

  const geoData = await geoRes.json();

  const results =
    geoData?.map((place: any) => ({
      name: place.name,
      admin1: place.state || "",
      country: place.country,
      latitude: place.lat,
      longitude: place.lon,
      label: `${place.name}${place.state ? ", " + place.state : ""}`,
    })) || [];

  return Response.json({ results });
}