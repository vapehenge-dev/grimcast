export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rain = Number(searchParams.get("rain") || 0);
  const wind = Number(searchParams.get("wind") || 0);
  const temp = Number(searchParams.get("temp") || 0);

  let warning = null;

  if (rain >= 80) {
    warning = {
      level: "High",
      title: "Heavy Rain Warning",
      message:
        "The sky is about to empty itself. Waterproofs recommended unless you enjoy being a soggy mess.",
    };
  } else if (wind >= 50) {
    warning = {
      level: "High",
      title: "Strong Wind Warning",
      message:
        "Wind is looking nasty. Secure your bins before they start a new life down the road.",
    };
  } else if (temp <= 0) {
    warning = {
      level: "Medium",
      title: "Freezing Weather Warning",
      message:
        "It is bastard cold. Pavements may be slippery and your face may hate you.",
    };
  } else if (temp >= 28) {
    warning = {
      level: "Medium",
      title: "Heat Warning",
      message:
        "It is hot enough for Britain to completely overreact. Drink water and stop pretending you are fine.",
    };
  }

  return Response.json({ warning });
}