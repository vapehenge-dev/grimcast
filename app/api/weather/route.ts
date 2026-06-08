const weatherCache = new Map<string, { time: number; data: any }>();

const CACHE_TIME = 1000 * 60 * 60;

function openWeatherToWeatherCode(id: number) {
  if (id >= 200 && id < 300) return 95;
  if (id >= 300 && id < 400) return 51;
  if (id >= 500 && id < 600) return 61;
  if (id >= 600 && id < 700) return 71;
  if (id >= 700 && id < 800) return 45;
  if (id === 800) return 0;
  if (id === 801) return 2;
  if (id >= 802) return 3;
  return 3;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const location = searchParams.get("location");
  const rawLat = searchParams.get("lat");
  const rawLon = searchParams.get("lon");

  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!API_KEY) {
    return Response.json({
      error: true,
      reason: "Missing OpenWeather API key",
    });
  }

  let lat = rawLat || "52.8306";
  let lon = rawLon || "-1.3776";
  let placeName = location || "Donington Park Circuit";

  const cacheKey = `${location || ""}-${lat}-${lon}`;

  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TIME) {
    return Response.json(cached.data);
  }

  try {
    if (location && !rawLat) {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          location
        )},GB&limit=1&appid=${API_KEY}`
      );

      const geoData = await geoRes.json();

      if (geoData?.length) {
        const best = geoData[0];
        lat = String(best.lat);
        lon = String(best.lon);
        placeName = `${best.name}${best.state ? ", " + best.state : ""}`;
      }
    }

    if (rawLat && rawLon && location?.startsWith("Map Pin")) {
      const reverseRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );

      const reverseData = await reverseRes.json();

      if (reverseData?.length) {
        const place = reverseData[0];

        placeName = `${place.name}${place.state ? ", " + place.state : ""}${
          place.country ? ", " + place.country : ""
        }`;
      }
    }

    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();
    const airData = await airRes.json();

    if (!currentRes.ok) {
      return Response.json({
        error: true,
        reason: currentData.message || "Weather API failed",
        placeName,
      });
    }

    const list = forecastData.list || [];

    const hourly = {
      time: list.map((item: any) => item.dt_txt),
      temperature_2m: list.map((item: any) => item.main.temp),
      precipitation_probability: list.map((item: any) =>
        item.pop ? Math.round(item.pop * 100) : 0
      ),
      weather_code: list.map((item: any) =>
        openWeatherToWeatherCode(item.weather?.[0]?.id || 800)
      ),
      wind_speed_10m: list.map((item: any) =>
        Math.round((item.wind?.speed || 0) * 3.6)
      ),
      uv_index: list.map(() => 0),
    };

    const dailyMap = new Map<string, any[]>();

    list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyMap.has(date)) dailyMap.set(date, []);
      dailyMap.get(date)?.push(item);
    });

    const days = Array.from(dailyMap.entries());

    const daily = {
      time: days.map(([date]) => date),
      weather_code: days.map(([, items]) =>
        openWeatherToWeatherCode(items[0].weather?.[0]?.id || 800)
      ),
      temperature_2m_max: days.map(([, items]) =>
        Math.round(Math.max(...items.map((i: any) => i.main.temp_max)))
      ),
      temperature_2m_min: days.map(([, items]) =>
        Math.round(Math.min(...items.map((i: any) => i.main.temp_min)))
      ),
      precipitation_probability_max: days.map(([, items]) =>
        Math.round(Math.max(...items.map((i: any) => (i.pop ? i.pop * 100 : 0))))
      ),
      wind_speed_10m_max: days.map(([, items]) =>
        Math.round(
          Math.max(...items.map((i: any) => (i.wind?.speed || 0) * 3.6))
        )
      ),
      sunrise: days.map(() =>
        new Date(currentData.sys.sunrise * 1000).toISOString()
      ),
      sunset: days.map(() =>
        new Date(currentData.sys.sunset * 1000).toISOString()
      ),
      uv_index_max: days.map(() => 0),
    };

    const finalData = {
      placeName,
      current: {
        temperature_2m: currentData.main.temp,
        apparent_temperature: currentData.main.feels_like,
        precipitation: currentData.rain?.["1h"] || 0,
        rain: currentData.rain?.["1h"] || 0,
        weather_code: openWeatherToWeatherCode(
          currentData.weather?.[0]?.id || 800
        ),
        wind_speed_10m: Math.round((currentData.wind?.speed || 0) * 3.6),
        wind_gusts_10m: Math.round(
          (currentData.wind?.gust || currentData.wind?.speed || 0) * 3.6
        ),
      },
      hourly,
      daily,
      air: {
        current: {
          us_aqi: airData.list?.[0]?.main?.aqi
            ? airData.list[0].main.aqi * 50
            : 0,
          pm10: airData.list?.[0]?.components?.pm10 || 0,
          pm2_5: airData.list?.[0]?.components?.pm2_5 || 0,
        },
      },
    };

    weatherCache.set(cacheKey, {
      time: Date.now(),
      data: finalData,
    });

    return Response.json(finalData);
  } catch {
    return Response.json({
      error: true,
      reason: "Weather service failed",
      placeName,
    });
  }
}