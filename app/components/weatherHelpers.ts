export function getIcon(code: number, rain: number, wind: number, temp: number) {
  if (code >= 95) return "⛈️";
  if (code >= 71) return "❄️";
  if (rain >= 70) return "🌧️";
  if (wind >= 40) return "💨";
  if (temp >= 25) return "☀️";
  if (temp <= 5) return "🥶";
  if (rain >= 40) return "☔";
  return "🌥️";
}

export function getWeatherName(code: number) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Weather nonsense";
}

export function getBackground(code: number, rain: number, temp: number) {
  if (code >= 95) return "radial-gradient(circle at top, #3a234d 0%, #07070b 45%, #010102 100%)";
  if (code >= 71) return "radial-gradient(circle at top, #33495c 0%, #071016 45%, #020405 100%)";
  if (rain >= 50) return "radial-gradient(circle at top, #1f3147 0%, #07090f 45%, #020203 100%)";
  if (temp >= 24) return "radial-gradient(circle at top, #6b2d1f 0%, #1a0b08 45%, #030202 100%)";
  return "radial-gradient(circle at top, #2a1520 0%, #08080b 45%, #020203 100%)";
}

export function getGrimScore(temp: number, rain: number, wind: number, code: number) {
  let score = 0;

  if (rain >= 70) score += 3;
  else if (rain >= 40) score += 2;
  else if (rain >= 20) score += 1;

  if (wind >= 45) score += 3;
  else if (wind >= 30) score += 2;
  else if (wind >= 20) score += 1;

  if (temp <= 3 || temp >= 28) score += 2;
  else if (temp <= 8 || temp >= 24) score += 1;

  if (code >= 95) score += 2;
  if (code >= 71 && code <= 77) score += 2;

  return Math.min(score, 10);
}

export function getRoast(
  temp: number,
  rain: number,
  wind: number,
  savage: boolean,
  score: number
) {
  if (savage && score >= 9) return "Absolute weather carnage. The sky has completely lost its shit.";
  if (savage && score >= 8) return "Today’s weather is an absolute bastard. Stay inside unless you enjoy suffering.";
  if (savage && rain >= 70) return "It’s absolutely pissing it down. The sky is being a complete bastard.";
  if (savage && wind >= 40) return "Windy as hell. Your bins are about to fuck off down the street.";
  if (savage && temp <= 5) return "It’s freezing. The air is being a right cold prick.";
  if (savage && temp >= 25) return "Hot as balls. Britain is about to lose its tiny little mind.";

  if (score >= 9) return "The weather has gone feral. Avoid unnecessary outside nonsense.";
  if (score >= 8) return "Grim as hell. The weather has chosen violence today.";
  if (rain >= 70) return "It’s pissing it down. Take a coat unless you want to look like a soggy idiot.";
  if (wind >= 40) return "Windy as hell. Your hair, bins, and dignity are all at risk.";
  if (temp <= 5) return "Freezing. The air is basically telling your face to piss off.";
  if (temp >= 25) return "Hot as balls. Everyone will now pretend Britain is melting.";
  if (rain >= 40) return "Rain might turn up, because the sky is being a miserable prick.";

  return "Not too bad. The weather is only mildly taking the piss today.";
}

export function getDailyRoast(temp: number, rain: number, wind: number, code: number) {
  const score = getGrimScore(temp, rain, wind, code);

  if (score >= 9) return "An ugly little day. The forecast has bad intentions.";
  if (rain >= 70) return "Soaked. Miserable. Classic outdoor regret.";
  if (wind >= 40) return "Windy enough to make your plans look stupid.";
  if (temp <= 5) return "Cold enough to make your bones complain.";
  if (temp >= 25) return "Warm enough for everyone to lose the plot.";
  if (rain >= 40) return "Rain is lurking about like an annoying little git.";
  if (score <= 2) return "Annoyingly decent. The sky is behaving itself.";
  return "A bit grim, but not full disaster mode.";
}