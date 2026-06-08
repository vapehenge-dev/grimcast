import {
  WiDaySunny,
  WiCloudy,
  WiFog,
  WiRain,
  WiShowers,
  WiSnow,
  WiThunderstorm,
  WiStrongWind,
} from "react-icons/wi";

export default function WeatherIcon({
  code,
  rain,
  wind,
  temp,
  size = 72,
}: {
  code: number;
  rain: number;
  wind: number;
  temp: number;
  size?: number;
}) {
  if (code >= 95) return <WiThunderstorm size={size} />;
  if (code >= 71) return <WiSnow size={size} />;
  if (rain >= 70) return <WiRain size={size} />;
  if (wind >= 40) return <WiStrongWind size={size} />;
  if (temp >= 25) return <WiDaySunny size={size} />;
  if (code <= 3) return <WiCloudy size={size} />;
  if (code <= 48) return <WiFog size={size} />;
  if (code <= 82) return <WiShowers size={size} />;

  return <WiCloudy size={size} />;
}