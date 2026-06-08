"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import GrimMeter from "./components/GrimMeter";
import WeatherEffects from "./components/WeatherEffects";
import {
  getWeatherName,
  getBackground,
  getGrimScore,
} from "./components/weatherHelpers";
import WorstDayAlert from "./components/WorstDayAlert";
import WeatherIcon from "./components/WeatherIcon";

type WorstPlace = {
  name: string;
  temp: number;
  rain: number;
  wind: number;
  code: number;
  score: number;
};

type AttitudeMode = "normal" | "savage";

type SplashDrop = {
  left: number;
  delay: number;
  duration: number;
};

type WeatherBucket = "horrific" | "rain" | "showery" | "wind" | "cold" | "hot" | "grey" | "decent";

const adultNormalLines: Record<WeatherBucket, string[]> = {
  horrific: [
    "Wet, windy and grim from start to finish. Stay indoors unless you enjoy being punished by clouds.",
    "Rain and wind are both turning up today, which is rarely a sign of good decisions.",
    "A proper miserable one. Coat, hood, patience, and maybe a small personal apology.",
    "The weather has gone full British tantrum. Wet, blowy, and deeply annoying.",
    "Today is not built for nice shoes, fresh hair, or optimism.",
    "Everything outside looks like it comes with a complaint form.",
    "The forecast is serving damp sleeves, bad moods, and people pretending they are fine.",
    "Rain and wind together. Nature's way of saying your plans were ambitious.",
    "A day for waterproofs, cancelled walks, and smug indoor decisions.",
    "Outside is open, technically. Whether it is worth visiting is another matter.",
    "The weather is doing the most, and none of it is helpful.",
    "A full combo meal of rain, wind, and poor morale.",
    "This is the kind of forecast that makes staying in look like maturity.",
    "The sky has turned errands into a punishment round.",
    "Wet enough to annoy you, windy enough to finish the job.",
    "There is no version of this where a thin jacket looks clever.",
    "This forecast is rough, loud, damp, and frankly taking liberties.",
    "A proper grim day. The sort that makes the sofa look like a life goal.",
    "Rain and wind are sharing custody of your misery today.",
    "The outdoors has been downgraded to a bad idea.",
    "A day where every journey ends with wet cuffs and regret.",
    "The weather has turned up angry and brought backup.",
    "You can go out, but the forecast is clearly against it.",
    "This is weather for cancelling things and acting like it was a sensible choice.",
    "The sky is in a mood and everyone else has to deal with it."
  ],
  rain: [
    "Rain is properly involved today. Take a coat or accept your soaking.",
    "Dry clothes are on borrowed time.",
    "The sky is leaking again, because apparently we needed that.",
    "Rain is doing a full shift today. Very committed. Very annoying.",
    "Every puddle today looks like it wants a victim.",
    "Your shoes are about to have a difficult conversation with the pavement.",
    "Rain likely. Not dramatic, just enough to ruin the mood.",
    "Take waterproofs. This is not a bravery test.",
    "The rain is not subtle today. It has plans.",
    "Expect wet sleeves, damp roads, and the usual British pretending.",
    "The sky has opened the taps and lost interest in your comfort.",
    "A wet one. Lovely if you are a duck. Less lovely if you own socks.",
    "The rain is hanging around like an unwanted guest.",
    "Today is sponsored by wet pavements and poor footwear choices.",
    "Rain is very much on the menu. Sadly, so is regret.",
    "The forecast says wet. Your trainers should start worrying now.",
    "A coat is not optional unless you enjoy learning lessons publicly.",
    "This is the sort of rain that makes every shortcut worse.",
    "The clouds have decided everything needs rinsing.",
    "Rain will keep interrupting the day like a needy group chat.",
    "The sky is having plumbing issues again.",
    "Outdoor plans are still possible, but they now require commitment.",
    "It is wet enough to make enthusiasm look suspicious.",
    "A proper coat day. Hoodies are lying to themselves.",
    "The rain has turned up and made itself everyone's problem."
  ],
  showery: [
    "Rain is technically on the paperwork, but it is barely trying.",
    "The sky is making threats, but it has not committed.",
    "A shower might appear, act important, then clear off.",
    "Tiny rain risk. Massive British overreaction potential.",
    "There may be a bit of rain, mostly for nuisance value.",
    "The clouds are chatting rubbish, but keep half an eye on them.",
    "Not enough rain to cancel plans. Nice try though.",
    "A damp little interruption is possible, but nothing worth rearranging your life over.",
    "The forecast has put rain in the small print.",
    "It says rain, but this is more threat than event.",
    "A weak shower may wander through looking for attention.",
    "Mostly usable, with a small chance of the sky being awkward.",
    "Rain might happen briefly, just enough to annoy people without a coat.",
    "The sky might spit once and call it effort.",
    "Keep a coat nearby if you enjoy feeling smug later.",
    "The weather is bluffing. Probably.",
    "A shower risk exists, but calling it proper rain would be generous.",
    "There is a small chance of rain and a large chance of someone making a fuss.",
    "The clouds are acting hard but have not brought much with them.",
    "A few damp threats in the forecast. Nothing to lose your head over.",
    "The rain chance is low, but Britain loves a surprise.",
    "You can probably leave the umbrella at home and regret it later.",
    "The sky is hinting at rain like a coward.",
    "Mostly fine, with a possible cameo from a damp cloud.",
    "This is not rain with commitment. This is rain on probation."
  ],
  wind: [
    "The wind is today's main annoyance.",
    "Windy enough to make a simple walk more irritating than it should be.",
    "Expect gusts, flapping coats, and people muttering under their breath.",
    "The wind is not dangerous, just determined to be a nuisance.",
    "Blustery, awkward, and generally annoying.",
    "Hold onto your hood. The wind is being a pain today.",
    "Haircuts are now just suggestions.",
    "Strong gusts and weak patience.",
    "The wind is making easy jobs difficult again.",
    "Walking anywhere will feel further than it is.",
    "Your umbrella is entering a stressful period.",
    "Bins may begin exploring new areas.",
    "The air is being unnecessarily aggressive.",
    "Expect random gusts and regular swearing.",
    "A breezy little nuisance of a day.",
    "The wind has turned errands into light exercise.",
    "Not stormy, just enough to be annoying all day.",
    "A day for zipped coats and low expectations.",
    "The wind will keep reminding you it exists.",
    "Nothing dramatic, just classic blowy nonsense.",
    "A poor day for loose hats and fragile patience.",
    "The breeze has been promoted beyond its ability.",
    "The wind is pushing its luck today.",
    "Outdoor comfort has been reduced by stupid air.",
    "The weather is mostly manageable, with wind being a knob about it."
  ],
  cold: [
    "Cold enough to make you walk faster.",
    "The air has teeth today.",
    "Proper coat weather. Do not get clever.",
    "Warmth is now an indoor activity.",
    "Today is sponsored by cold hands.",
    "Standing still is a poor strategy.",
    "Layers are not negotiable.",
    "The temperature is being rude.",
    "Cold, blunt, and not interested in your comfort.",
    "A day for pockets, proper socks, and no nonsense.",
    "The cold has arrived fully committed.",
    "Your face is about to find out.",
    "This is not light-jacket weather unless you enjoy regret.",
    "The air is sharp enough to get your attention.",
    "Cold enough to make tea feel medicinal.",
    "The temperature has dropped below pretending level.",
    "A chilly one. Dress like you have met Britain before.",
    "The cold is quiet, but it is absolutely there.",
    "Gloves are not dramatic today. They are sensible.",
    "The outside has forgotten how warmth works.",
    "Expect cold fingers and faster walking.",
    "The day has a bite to it.",
    "Warm rooms will feel like achievements.",
    "Do not dress for the weather you wanted.",
    "The cold is doing that annoying creeping-in-through-sleeves thing."
  ],
  hot: [
    "Britain is overheating again.",
    "The sun has turned up and immediately overdone it.",
    "Everyone wanted summer. Remember?",
    "Shade is becoming valuable property.",
    "Public transport will be unpleasant.",
    "Hydration is no longer optional.",
    "The pavement is starting to get ideas.",
    "Good weather. Terrible sweating.",
    "Sunshine with consequences.",
    "The country is melting without dignity.",
    "Warm enough for beer gardens and bad decisions.",
    "The sun is acting like it has something to prove.",
    "A day for water, shade, and not pretending lager counts.",
    "Warm enough for Britain to start complaining about the thing it begged for.",
    "Looks lovely until you have to move.",
    "The office fan is about to become the most important person in the room.",
    "A sweaty little forecast with outdoor potential.",
    "The weather has mistaken Britain for somewhere prepared.",
    "Short sleeves are allowed. Common sense still required.",
    "The sun is working overtime and HR should intervene.",
    "Nice day, if you ignore the sweating.",
    "Warm, bright, and probably about to expose poor life choices.",
    "The heat is manageable, unless you have to use a bus.",
    "Get outside, but do not act shocked when you need water.",
    "The sun has clocked in and immediately started showing off."
  ],
  grey: [
    "Grey, dull, and completely forgettable.",
    "The weather equivalent of plain toast.",
    "Nothing exciting. Nothing useful. Just cloud.",
    "A strong performance from mediocrity.",
    "The sky could not be bothered today.",
    "Cloudy with a chance of boredom.",
    "The atmosphere has given up.",
    "Just enough cloud to ruin everyone's mood.",
    "Today's forecast comes in beige.",
    "A thoroughly uninspiring effort from the sky.",
    "Cloudy, usable, and deeply uninteresting.",
    "The sky is giving waiting-room energy.",
    "A day that will not make the holiday brochure.",
    "The clouds are here, doing very little and taking up space.",
    "Not awful. Not good. Just there.",
    "The weather has turned up in its work trousers.",
    "A grey little shrug of a day.",
    "Cloud cover with no ambition.",
    "A day for errands, not memories.",
    "The sky looks like it needs a day off.",
    "Dull, mild, and aggressively average.",
    "The atmosphere has selected default settings.",
    "Perfectly usable if you lower your standards.",
    "A day with all the sparkle of cold porridge.",
    "Cloudy enough to make everything look tired."
  ],
  decent: [
    "The weather has accidentally done something right.",
    "Get outside before it changes its mind.",
    "A rare win for the atmosphere.",
    "Surprisingly competent conditions.",
    "The sky is behaving itself for once.",
    "Almost pleasant. Check again later.",
    "Dry, mild, and suspiciously reasonable.",
    "The forecast has lowered its weapons.",
    "Enjoy it while it lasts.",
    "Someone in weather control made a mistake.",
    "Not bad at all. Try not to get emotionally attached.",
    "A decent day, which feels legally suspicious.",
    "Outdoor plans have been temporarily approved.",
    "The sky has stopped being a liability for a bit.",
    "Fine enough. Take the win.",
    "This might be the best offer you get today.",
    "Weather with basic manners. Rare scenes.",
    "Usable, calm, and not immediately offensive.",
    "A good window for doing things before Britain remembers itself.",
    "The forecast is giving you a chance. Do not waste it.",
    "Mild, dry-ish, and not looking for a fight.",
    "A surprisingly civilised effort from the sky.",
    "Make plans, but do not trust it blindly.",
    "The weather seems almost professional today.",
    "Decent enough to make staying inside feel a bit lazy."
  ]
};

const adultSavageLines: Record<WeatherBucket, string[]> = {
  horrific: [
    "The weather has gone full bastard and dragged everyone into its wet little breakdown.",
    "Outside is a sideways-rain shitshow and the sky should be embarrassed.",
    "This is proper fuck-off weather. Stay indoors unless suffering is your hobby.",
    "Rain and wind have teamed up like two absolute arseholes looking for victims.",
    "The sky has chosen violence and brought a hosepipe.",
    "This forecast is an aggressive bastard from start to finish.",
    "Wet, windy, miserable, and taking the piss from every direction.",
    "The weather is throwing punches and your umbrella is already dead.",
    "Outside looks like it was designed by a pissed-off cloud with a grudge.",
    "A foul little day. Even the bins look like they have lost the will to live.",
    "The atmosphere is being a complete prick and everyone has to deal with it.",
    "This is not weather. This is damp punishment with extra wind.",
    "The sky has opened the taps and then started swinging.",
    "A full-strength bastard of a forecast. Absolutely no manners.",
    "Rain sideways, wind everywhere, mood straight in the bin.",
    "The outdoors can fuck off today.",
    "This is weather for cancelling plans and blaming the sky like an adult.",
    "A miserable arsehole of a day with wet sleeves guaranteed.",
    "Everything outside is damp, angry, and badly behaved.",
    "The forecast has crawled out of a drain and called itself a day.",
    "The sky owes everyone an apology and a dry pair of socks.",
    "Going outside today is optional in the same way headbutting a wall is optional.",
    "A complete ballbag of a forecast.",
    "Rain and wind are sharing custody of your misery today.",
    "The weather has turned up drunk and looking for a fight.",
    "Today is built from bad language, wet cuffs, and ruined hair.",
    "The clouds are acting like absolute dickheads.",
    "A proper grim bastard of a day. No notes, just suffering.",
    "The sky is having a tantrum and making it everyone else's problem.",
    "This forecast can get in the fucking bin."
  ],
  rain: [
    "It is pissing down. End of report.",
    "The rain is taking the absolute piss today.",
    "The sky has opened the taps and fucked off.",
    "Dry socks are now a luxury item.",
    "Outside is basically a giant puddle with ambitions.",
    "The weather looked at your plans and laughed in their face.",
    "The rain has clocked in early and decided to be a prick about it.",
    "Anyone leaving without a coat is a brave little knobhead.",
    "The sky is leaking like a cheap roof.",
    "This rain has no manners and even less timing.",
    "The clouds are dumping their problems on everyone.",
    "Rain like this turns normal errands into punishment.",
    "Your shoes are about to get mugged by the pavement.",
    "A coat is required. A cheerful attitude can piss off.",
    "The rain has arrived with the energy of an unwanted bill.",
    "The sky is being a damp little knobhead.",
    "This is proper soggy bollocks.",
    "The pavement is about to become a slip-and-swear zone.",
    "The rain is doing overtime and nobody asked it to.",
    "The clouds have opened the tap and left everyone else to deal with it.",
    "Outside is just a big wet argument.",
    "The forecast is wet enough to ruin a good mood before breakfast.",
    "The rain has turned up like it owns the place.",
    "Take waterproofs or accept your role as a sponge.",
    "The sky has decided your plans need rinsing.",
    "Wet, annoying, and absolutely full of itself.",
    "The weather is serving soggy nonsense with no apology.",
    "Rain is making itself everyone's problem again.",
    "The sky is having plumbing issues and taking it out on you.",
    "This rain can piss off and come back with better manners."
  ],
  showery: [
    "The sky is chatting rain like it is harder than it is.",
    "A pathetic shower may turn up, act like a dickhead, then leave.",
    "Rain is in the forecast, but only as a petty little threat.",
    "The clouds might spit once and expect applause.",
    "The weather is bluffing, but it is Britain, so keep one eye on the bastard.",
    "A damp little cameo is possible. Annoying, pointless, and badly timed.",
    "The sky is threatening rain like a toddler threatening to move out.",
    "Tiny rain risk, massive drama from people in suede shoes.",
    "The forecast contains trace amounts of bullshit rain.",
    "A weak shower might pop in, ruin nothing, and still act smug.",
    "The clouds are making damp noises and hoping someone cares.",
    "Barely rain. More like the sky clearing its throat.",
    "A few drops may appear and behave like absolute ballbags.",
    "This is not proper rain. This is weather attention-seeking.",
    "The sky may have a little dribble and call it effort.",
    "Mostly usable, with a small chance of the clouds being arseholes.",
    "The weather is keeping rain in its back pocket like a coward.",
    "Rain is trying to be relevant and mostly failing.",
    "A shower might appear purely to piss you off.",
    "The clouds are being awkward little bastards.",
    "Not enough rain to matter, just enough to annoy everyone.",
    "The sky is being a little piss-tease about rain.",
    "A bit of damp nonsense may pass through.",
    "Rain risk is low, but still annoying because Britain is a knob.",
    "The weather is making threats it probably cannot back up.",
    "A shower may wander in like an unwanted drunk.",
    "The sky has added rain for legal cover.",
    "Do not cancel plans for this. Mock it and move on.",
    "A tiny wet interruption, because apparently peace was too much to ask.",
    "This is rain on probation and it still thinks it is important."
  ],
  wind: [
    "The wind is being a right bastard today.",
    "The air has decided to be a knobhead.",
    "Every bin in the county is considering a new postcode.",
    "Your umbrella is about to become modern art.",
    "The wind is here to ruin coats, hair, and confidence.",
    "The atmosphere is throwing its weight around for no good reason.",
    "A blowy little shit of a day.",
    "The air has no respect for personal space.",
    "Wind like this makes normal life feel badly organised.",
    "A day for zip pockets and swearing at nothing.",
    "The wind is doing too much for something nobody invited.",
    "Every loose item outside is considering a career change.",
    "The weather is pushing people around for sport.",
    "The air is acting like it pays rent.",
    "The wind is making five-minute walks feel like unpaid labour.",
    "Your coat will flap like it has terrible news.",
    "A stupid amount of air movement for a day that is not even impressive.",
    "The wind needs to calm down and get a hobby.",
    "Not a storm. Just the atmosphere being a prick.",
    "The wind is behaving like an arsehole in a doorway.",
    "Expect gusts, flapping coats, and the phrase 'for fuck's sake' by lunchtime.",
    "The air is being a proper dickhead today.",
    "Windy enough to make errands feel like punishment.",
    "The forecast is mostly gusts and bad language.",
    "Hold onto your dignity. The wind is coming for that too.",
    "The wind is absolutely taking liberties.",
    "Your hair has entered witness protection.",
    "The breeze has been promoted way beyond its ability.",
    "The air is acting like a drunk bloke outside a kebab shop.",
    "A day where even walking straight looks like a personal challenge."
  ],
  cold: [
    "It is cold as fuck out there.",
    "Cold enough to make your face regret coming with you.",
    "The air has all the warmth of a parking fine.",
    "Proper cold. Dress badly and suffer publicly.",
    "The temperature is being a nasty little bastard.",
    "Cold hands, rude air, and zero sympathy.",
    "Outside feels like it was designed by someone with no mates.",
    "Bravery is not insulation. It is just stupidity with confidence.",
    "The cold has turned up and started charging rent.",
    "Your ears are about to learn something unpleasant.",
    "The forecast is basically a slap from a freezer door.",
    "The cold is not dramatic. It is just being unpleasant on purpose.",
    "Tea will feel like medical support today.",
    "The air is sharp, rude, and far too pleased with itself.",
    "This is coat weather. Thin jackets can piss off.",
    "Standing still today is how you lose morale.",
    "The outside has all the warmth of a closed pub.",
    "Your fingers will start complaining before you finish locking the door.",
    "The cold is doing that sneaky little bastard routine.",
    "A day where gloves stop being optional and start being evidence.",
    "The temperature has filed for divorce from comfort.",
    "Cold enough to make every queue feel personal.",
    "Warm rooms will feel like achievements.",
    "Do not dress like someone who has never met winter.",
    "The weather has woken up angry and brought cold hands.",
    "This temperature belongs in a punishment.",
    "It is cold enough to make your nose run and your mood turn feral.",
    "The air is a frozen little arsehole today.",
    "The cold is being a dickhead about it.",
    "Wear layers. Fashion can fuck off until it warms up."
  ],
  hot: [
    "It is hot as balls.",
    "Britain is melting and handling it with zero dignity.",
    "The sun has turned up and immediately started acting like a dickhead.",
    "Public transport is now a mobile armpit.",
    "Everyone wanted sunshine. Now everyone smells like regret.",
    "You will be sweating in places you did not even know existed.",
    "The sun is cooking people who thought sunscreen was optional.",
    "Shade is now prime property. Fight accordingly.",
    "The weather has mistaken Britain for somewhere competent.",
    "Warm enough to expose every deodorant failure in the postcode.",
    "The office fan is about to start a workplace feud.",
    "The pavement is getting cocky.",
    "Everyone wanted it to be fucking summer. Remember?",
    "A sweaty little day with strong bus-regret energy.",
    "The sun is showing off like an idiot with a new car.",
    "Drink water. Lager is not hydration, you absolute liability.",
    "The forecast is hot enough to make jeans feel like punishment.",
    "Britain is operating outside its design limits again.",
    "The heat is not impressive, but the complaining will be world class.",
    "Today is sunshine, sweat, and poor decisions.",
    "The sun has clocked in and chosen violence.",
    "Good weather until you have to do anything useful.",
    "The country is about to become sticky and dramatic.",
    "A warm day with a high risk of people becoming unbearable.",
    "The sky is taking the piss with a heat lamp.",
    "Enjoy the sun, but do not be a hero with no sunscreen.",
    "Hot enough for buses to become biohazards.",
    "The sun is being a flaming knobhead today.",
    "This heat can fuck off unless there is shade and a cold drink nearby.",
    "The weather is sweaty bollocks with a heat warning."
  ],
  grey: [
    "It's fucking dull out there.",
    "Grey as fuck. Even the sun could not be arsed to come out today.",
    "The sky looks like a depressed tea towel.",
    "Cloudy, lifeless, and boring as bollocks.",
    "Nothing is happening. Even the weather does not give a shit.",
    "The sky has clocked in and done fuck all.",
    "The atmosphere has all the charisma of wet cardboard.",
    "A day so dull it should come with compensation.",
    "Grey skies, dead mood, zero personality.",
    "The sun has seen the state of this and fucked off.",
    "The forecast is serving damp boredom with no apology.",
    "The sky is giving abandoned car park energy.",
    "Clouds everywhere, joy nowhere.",
    "It is grey, miserable, and completely full of shit.",
    "This weather has all the charm of a council meeting.",
    "The sky is doing the bare minimum and still wants credit.",
    "A soulless grey bastard of a day.",
    "The clouds are just loitering and lowering standards.",
    "Today's weather has the personality of cold porridge.",
    "Grey enough to make even good news look suspicious.",
    "The sky should apologise for being this fucking boring.",
    "A day built for errands, resentment, and staring out the window in disgust.",
    "The forecast is basically background noise with cloud.",
    "Nothing useful. Nothing cheerful. Just grey nonsense.",
    "The weather has turned up, done nothing, and called it a shift.",
    "Perfectly usable, completely dead behind the eyes.",
    "The sky looks hungover and unemployed.",
    "Cloudy, bland, and somehow still taking the piss.",
    "A proper waste of fucking daylight.",
    "This is not weather. This is a grey shrug with attitude problems."
  ],
  decent: [
    "The weather is behaving, which is suspicious as fuck.",
    "Not bad, but do not start trusting the sky like an idiot.",
    "The sky has briefly stopped being a liability.",
    "A rare usable day. Do not get emotionally attached.",
    "This is dangerously close to pleasant, which is unsettling.",
    "The forecast has accidentally stopped being awful.",
    "Outdoor plans have been temporarily approved, you lucky bastard.",
    "The weather has lowered its weapons. For now.",
    "Fine enough to enjoy, if you keep your standards in the gutter.",
    "The sky is pretending to be reasonable. Do not fall for it.",
    "Decent by British standards, which is a pathetically low bar.",
    "Use it before the atmosphere remembers it is usually a dickhead.",
    "The forecast is giving you a chance. Do not waste it.",
    "A rare break from atmospheric nonsense.",
    "This might be the best offer you get all week, so stop moaning.",
    "The day may pass without becoming a complaint. Weird.",
    "The weather seems almost professional today, the smug bastard.",
    "Dry-ish, mild-ish, and not actively trying to ruin you.",
    "The sky has taken the morning off from being a bastard.",
    "A suspiciously civilised effort from the atmosphere.",
    "Go outside. GrimCast does not say that often.",
    "Enjoy it while Britain forgets to be miserable.",
    "The forecast is almost respectable. Try not to scare it.",
    "You can make plans today. That is probably how it gets you.",
    "Decent enough to make staying inside look like a personal failure.",
    "The weather has stopped being a dickhead for five minutes.",
    "A rare day where the sky is not acting like an arsehole.",
    "Take the win before the forecast starts chatting shit again.",
    "This is almost nice, which is suspicious as fuck.",
    "Good enough to use. Still Britain, so do not get cocky."
  ]
};


function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickBucket(temp: number, rain: number, wind: number, code: number): WeatherBucket {
  const weatherName = getWeatherName(code).toLowerCase();
  const mentionsRain =
    weatherName.includes("rain") ||
    weatherName.includes("shower") ||
    weatherName.includes("drizzle");

  if (rain >= 75 && wind >= 30) return "horrific";

  // Hot days should not get rain insults unless the rain risk is genuinely high.
  if (temp >= 26 && rain < 70) return "hot";

  // Only real rain risk gets the proper rain bucket.
  if (rain >= 60) return "rain";

  // If the weather code says rain but the percentage is low, use light/showery lines.
  if (mentionsRain) return "showery";

  if (wind >= 32) return "wind";
  if (temp <= 6) return "cold";

  if (
    weatherName.includes("cloud") ||
    weatherName.includes("overcast") ||
    weatherName.includes("fog") ||
    weatherName.includes("mist")
  ) {
    return "grey";
  }

  return "decent";
}

function pickSavageBucket(temp: number, rain: number, wind: number, code: number): WeatherBucket {
  const weatherName = getWeatherName(code).toLowerCase();
  const mentionsRain =
    weatherName.includes("rain") ||
    weatherName.includes("shower") ||
    weatherName.includes("drizzle");

  if (rain >= 75 && wind >= 30) return "horrific";
  if (rain >= 45) return "rain";
  if (rain >= 15 || mentionsRain) return "showery";
  if (wind >= 28) return "wind";
  if (temp <= 7) return "cold";
  if (temp >= 24) return "hot";

  if (
    weatherName.includes("cloud") ||
    weatherName.includes("overcast") ||
    weatherName.includes("fog") ||
    weatherName.includes("mist") ||
    weatherName.includes("clear") === false
  ) {
    return "grey";
  }

  return "decent";
}

function isWetWeatherCode(code: number) {
  const name = getWeatherName(code).toLowerCase();

  return (
    name.includes("rain") ||
    name.includes("shower") ||
    name.includes("drizzle") ||
    name.includes("thunder")
  );
}

function getCurrentConditionLabel(code: number, currentRain: number, laterRain: number) {
  const name = getWeatherName(code);

  if (isWetWeatherCode(code) && currentRain <= 0 && laterRain >= 45) {
    return "Rain expected later";
  }

  if (isWetWeatherCode(code) && currentRain <= 0) {
    return "Looks dry right now";
  }

  return name;
}

function getMainWeatherThreat(
  temp: number,
  rain: number,
  wind: number,
  code: number,
  currentLooksWet: boolean
) {
  const weatherName = getWeatherName(code).toLowerCase();

  const rainScore = currentLooksWet
    ? 95
    : rain >= 75
    ? 90
    : rain >= 60
    ? 72
    : rain >= 45
    ? 52
    : rain >= 30
    ? 34
    : rain >= 15
    ? 18
    : 0;

  const windScore =
    wind >= 55 ? 96 : wind >= 45 ? 82 : wind >= 35 ? 64 : wind >= 28 ? 42 : 0;

  const heatScore =
    temp >= 32 ? 98 : temp >= 29 ? 84 : temp >= 26 ? 68 : temp >= 24 ? 44 : 0;

  const coldScore =
    temp <= 0 ? 98 : temp <= 3 ? 84 : temp <= 6 ? 68 : temp <= 9 ? 40 : 0;

  const greyScore =
    weatherName.includes("cloud") ||
    weatherName.includes("overcast") ||
    weatherName.includes("fog") ||
    weatherName.includes("mist")
      ? 38
      : 0;

  if (rain >= 75 && wind >= 35) return "stormy";

  const scores = [
    { threat: "rain", score: rainScore },
    { threat: "wind", score: windScore },
    { threat: "hot", score: heatScore },
    { threat: "cold", score: coldScore },
    { threat: "grey", score: greyScore },
  ].sort((a, b) => b.score - a.score);

  const winner = scores[0];

  if (!winner || winner.score <= 0) return "decent";

  if (winner.threat === "rain" && rain < 60 && !currentLooksWet) {
    return "showery";
  }

  return winner.threat;
}

function getAccuracyMood(
  currentLooksWet: boolean,
  effectiveRain: number,
  beerScore: number,
  grimScore: number
) {
  if (grimScore >= 8) {
    return {
      title: "GrimCast is expecting a proper mess.",
      text: "The numbers say the sky is lining up something unpleasant. Rain, wind, cold, heat — whichever idiot is in charge, it is not looking friendly.",
    };
  }

  if (currentLooksWet && effectiveRain >= 60) {
    return {
      title: "Looks like GrimCast called the wet bit.",
      text: "Rain was on the board and the sky appears to be backing the forecast. Annoying, but at least not nonsense.",
    };
  }

  if (beerScore >= 8 && grimScore <= 3) {
    return {
      title: "GrimCast is cautiously pleased.",
      text: "The day looks usable, which is suspicious. Enjoy it before the sky remembers its job.",
    };
  }

  return {
    title: "Too early to judge the smug little forecast.",
    text: "Conditions and the forecast are not fighting each other too badly. Check back later and see if GrimCast embarrassed itself.",
  };
}

function isInsideGrimcastMapArea(lat: number, lon: number) {
  // GrimCast is currently built and worded as a UK weather app.
  // These bounds stop accidental taps in places like Florida being judged with British copy.
  return lat >= 49.5 && lat <= 61.2 && lon >= -8.8 && lon <= 2.2;
}

function pickAttitudeLine(
  temp: number,
  rain: number,
  wind: number,
  code: number,
  savage: boolean,
  index: number,
  salt: number
) {
  const bucket = savage
    ? pickSavageBucket(temp, rain, wind, code)
    : pickBucket(temp, rain, wind, code);
  const lines = savage ? adultSavageLines[bucket] : adultNormalLines[bucket];

  const seed = Math.round(
    temp * 101 +
      rain * 211 +
      wind * 307 +
      code * 401 +
      index * 997 +
      salt * 1291
  );

  const chosen = Math.floor(seededRandom(seed) * lines.length);

  return lines[chosen];
}


function pickUniqueAttitudeLine(
  temp: number,
  rain: number,
  wind: number,
  code: number,
  savage: boolean,
  index: number,
  salt: number,
  usedLines: Set<string>
) {
  const bucket = savage
    ? pickSavageBucket(temp, rain, wind, code)
    : pickBucket(temp, rain, wind, code);
  const lines = savage ? adultSavageLines[bucket] : adultNormalLines[bucket];

  const seed = Math.round(
    temp * 101 +
      rain * 211 +
      wind * 307 +
      code * 401 +
      index * 997 +
      salt * 1291
  );

  const start = Math.floor(seededRandom(seed) * lines.length);

  for (let offset = 0; offset < lines.length; offset++) {
    const candidate = lines[(start + offset) % lines.length];

    if (!usedLines.has(candidate)) {
      usedLines.add(candidate);
      return candidate;
    }
  }

  const fallback = `${lines[start]} (${index + 1})`;
  usedLines.add(fallback);
  return fallback;
}

function getUniqueHourlyAttitude(
  temp: number,
  rain: number,
  wind: number,
  code: number,
  savage: boolean,
  index: number,
  usedLines: Set<string>
) {
  return pickUniqueAttitudeLine(temp, rain, wind, code, savage, index, 1, usedLines);
}

function getUniqueFortnightlyAttitude(
  temp: number,
  rain: number,
  wind: number,
  code: number,
  savage: boolean,
  index: number,
  usedLines: Set<string>
) {
  return pickUniqueAttitudeLine(temp, rain, wind, code, savage, index, 9, usedLines);
}

function getHourlyAttitude(
  temp: number,
  rain: number,
  wind: number,
  code: number,
  savage: boolean,
  index: number
) {
  return pickAttitudeLine(temp, rain, wind, code, savage, index, 1);
}

function getFortnightlyAttitude(
  temp: number,
  rain: number,
  wind: number,
  code: number,
  savage: boolean,
  index: number
) {
  return pickAttitudeLine(temp, rain, wind, code, savage, index, 9);
}

function isValidWeatherData(data: any) {
  return (
    data &&
    data.current &&
    data.daily &&
    data.hourly &&
    typeof data.current.temperature_2m !== "undefined" &&
    typeof data.current.apparent_temperature !== "undefined" &&
    typeof data.current.weather_code !== "undefined" &&
    Array.isArray(data.daily.temperature_2m_max) &&
    Array.isArray(data.daily.precipitation_probability_max) &&
    Array.isArray(data.hourly.time)
  );
}


export default function Page() {
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState("");
  const [savage, setSavage] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);
  const [favouritesList, setFavouritesList] = useState<string[]>([]);
  const [warning, setWarning] = useState<any>(null);
  const [worstPlaces, setWorstPlaces] = useState<WorstPlace[]>([]);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareCardUrl, setShareCardUrl] = useState("");
  const [shareCardFile, setShareCardFile] = useState<File | null>(null);
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [splashDrops, setSplashDrops] = useState<SplashDrop[]>([]);
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [mapMessage, setMapMessage] = useState("Tap anywhere in Britain or Northern Ireland to pick a location.");
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarkerRef = useRef<any>(null);

  function loadWeather(searchLocation?: string) {
    const query = searchLocation || location || "Manchester";
    setLoading(true);
    setWeatherError("");

    fetch(`/api/weather?location=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isValidWeatherData(data)) {
          console.error("Bad weather response:", data);
          setWeatherError("Could not load proper weather data for that place. Try another search or use your current location.");
          setLoading(false);
          return;
        }

        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setWeatherError("Could not load weather. The API is being difficult.");
        setLoading(false);
      });
  }

  function loadWeatherFromMap(lat: number, lon: number) {
    if (!isInsideGrimcastMapArea(lat, lon)) {
      setMapMessage("GrimCast is UK-only for now. Tap somewhere in Britain or Northern Ireland.");
      return;
    }

    const mapLabel = `Map Pin ${lat.toFixed(3)}, ${lon.toFixed(3)}`;
    setLoading(true);
    setWeatherError("");
    setLocation(mapLabel);
    setPlaceSuggestions([]);
    setMapMessage("Loading weather for that exact spot...");

    fetch(
      `/api/weather?lat=${lat}&lon=${lon}&location=${encodeURIComponent(mapLabel)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!isValidWeatherData(data)) {
          console.error("Bad map weather response:", data);
          setWeatherError("That map spot did not return proper weather data. Try tapping somewhere else nearby.");
          setLoading(false);
          setMapMessage("That spot failed. Try another nearby place.");
          return;
        }

        setWeather(data);
        setLoading(false);
        setMapPickerOpen(false);
        setMapMessage("Tap anywhere in Britain or Northern Ireland to pick a location.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => {
        setWeatherError("That map pick failed. Try another spot.");
        setLoading(false);
        setMapMessage("That map pick failed. Try another spot.");
      });
  }

  function searchPlaces(value: string) {
    setLocation(value);

    if (value.length < 2) {
      setPlaceSuggestions([]);
      return;
    }

    fetch(`/api/places?q=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data) => setPlaceSuggestions(data.results || []))
      .catch(() => setPlaceSuggestions([]));
  }

  function checkWarning(rain: number, wind: number, temp: number) {
    fetch(`/api/warnings?rain=${rain}&wind=${wind}&temp=${temp}`)
      .then((res) => res.json())
      .then((data) => setWarning(data.warning))
      .catch(() => setWarning(null));
  }

  function addFavourite() {
    if (!weather?.placeName) return;

    const updated = Array.from(new Set([...favouritesList, weather.placeName]));
    setFavouritesList(updated);
    localStorage.setItem("grimcast-favourites", JSON.stringify(updated));
  }

  function removeFavourite(place: string) {
    const updated = favouritesList.filter((item) => item !== place);
    setFavouritesList(updated);
    localStorage.setItem("grimcast-favourites", JSON.stringify(updated));
  }

  function useMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(true);

        fetch(
          `/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&location=Current Location`
        )
          .then((res) => res.json())
          .then((data) => {
            if (!isValidWeatherData(data)) {
              console.error("Bad weather response:", data);
              setWeatherError("Could not load proper weather data. Try again.");
              setLoading(false);
              return;
            }

            setWeather(data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      },
      () => {
        alert("Could not get your location. Your laptop is being useless.");
      }
    );
  }

  function getBeerGardenScore(
  temp: number,
  rain: number,
  wind: number
) {
  if (rain >= 90) return 0;
  if (wind >= 50) return 0;
  if (rain >= 75 && wind >= 35) return 0;
  if (temp <= 5) return 0;

  let score = 10;

 if (rain >= 80) score -= 8;
else if (rain >= 70) score -= 7;
  else if (rain >= 50) score -= 5;
  else if (rain >= 30) score -= 3;
  else if (rain >= 15) score -= 1;

  if (wind >= 45) score -= 5;
  if (wind >= 30) score -= 4;
  else if (wind >= 25) score -= 1;

  if (temp < 8) score -= 5;
  else if (temp < 11) score -= 4;
  else if (temp < 14) score -= 2;
  else if (temp > 30) score -= 3;
  else if (temp > 26) score -= 1;

  return Math.max(0, Math.min(10, score));
}

 function getBeerGardenText(score: number) {
  if (score === 0) {
    return "Absolutely not. The beer garden is closed in spirit. Sit inside like someone with a working brain.";
  }

  if (score <= 2) {
    return "Technically possible, but so is eating soup with a fork. Go indoors.";
  }

  if (score <= 4) {
    return "Only if you're stubborn, badly dressed, or already three pints deep.";
  }

  if (score <= 6) {
    return "Possible, but you'll need commitment, shelter, and low standards.";
  }

  if (score <= 8) {
    return "Decent beer garden weather. Take a jacket because Britain cannot be trusted.";
  }

  return "Prime pint weather. Get outside before Britain ruins it.";
}

  function getDaylightLeft(sunset: string) {
    const now = new Date();
    const sunsetTime = new Date(sunset);
    const difference = sunsetTime.getTime() - now.getTime();

    if (difference <= 0) return "Gone";

    const hours = Math.floor(difference / 1000 / 60 / 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);

    return `${hours}h ${minutes}m`;
  }

  useEffect(() => {
    if (!mapPickerOpen || !mapDivRef.current) return;

    let cancelled = false;

    async function setupMap() {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");

      if (cancelled || !mapDivRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        leafletMarkerRef.current = null;
      }

      const ukBounds = L.latLngBounds(
        [49.5, -8.8],
        [61.2, 2.2]
      );

      const map = L.map(mapDivRef.current, {
        zoomControl: true,
        attributionControl: true,
        maxBounds: ukBounds,
        maxBoundsViscosity: 0.9,
        minZoom: 5,
      }).setView([54.5, -3.4], 6);

      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      map.on("click", (event: any) => {
        const lat = event.latlng.lat;
        const lon = event.latlng.lng;

        if (!isInsideGrimcastMapArea(lat, lon)) {
          setMapMessage("That is outside GrimCast's UK range. Tap somewhere in Britain or Northern Ireland.");
          return;
        }

        if (leafletMarkerRef.current) {
          leafletMarkerRef.current.remove();
        }

        leafletMarkerRef.current = L.circleMarker([lat, lon], {
          radius: 10,
          color: "#ff4d6d",
          fillColor: "#ff4d6d",
          fillOpacity: 0.85,
          weight: 3,
        }).addTo(map);

        loadWeatherFromMap(lat, lon);
      });

      setTimeout(() => map.invalidateSize(), 150);
    }

    setupMap();

    return () => {
      cancelled = true;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        leafletMarkerRef.current = null;
      }
    };
  }, [mapPickerOpen]);

  useEffect(() => {
    setSplashDrops(
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 2,
      }))
    );

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("grimcast-favourites");

    if (saved) {
      setFavouritesList(JSON.parse(saved));
    } else {
      setFavouritesList([]);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(true);

        fetch(
          `/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&location=Current Location`
        )
          .then((res) => res.json())
          .then((data) => {
            if (!isValidWeatherData(data)) {
              console.error("Bad weather response:", data);
              setWeatherError("Could not load proper weather data. Try again.");
              setLoading(false);
              return;
            }

            setWeather(data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            loadWeather("Manchester");
          });
      },
      () => {
        loadWeather("Manchester");
      }
    );
  }, []);

  useEffect(() => {
    if (!weather) return;

    const rain = weather.daily.precipitation_probability_max[0];
    const wind = weather.daily.wind_speed_10m_max[0];
    const temp = weather.current.temperature_2m;

    checkWarning(rain, wind, temp);
  }, [weather]);

useEffect(() => {
  fetch("/api/worstplaces")
    .then((res) => res.json())
    .then((data) => {
      setWorstPlaces(data.places || []);
    })
    .catch(() => {
      setWorstPlaces([]);
    });
}, []);

 if (showSplash) {
  return (
    <main style={styles.splashScreen}>
      <div style={styles.splashRain}>
        {splashDrops.map((drop, index) => (
          <span
            key={index}
            style={{
              ...styles.splashDrop,
              left: `${drop.left}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
      </div>

      <div style={styles.splashContent}>
 <Image
  src="/grimcast-logo.png"
  alt="GrimCast"
  width={1000}
  height={1000}
  priority
  style={{
    width: "420px",
    maxWidth: "90vw",
    height: "auto",
    display: "block",
  }}
/>

  <p style={styles.splashText}>
    Loading the miserable sky...
  </p>
  
</div>

      <style jsx global>{`
        @keyframes splashRainFall {
          0% {
            transform: translateY(-20vh);
          }
          100% {
            transform: translateY(120vh);
          }
        }

        @keyframes splashFadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splashPulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}

  if (!weather) {
    return (
      <main style={styles.loading}>
        {weatherError || "Loading the miserable sky..."}
      </main>
    );
  }

  if (!isValidWeatherData(weather)) {
    return (
      <main style={styles.loading}>
        Weather data came back broken. Try searching again or using your location.
      </main>
    );
  }

  const currentTemp = weather.current.temperature_2m;
  const feelsLike = weather.current.apparent_temperature;
  const currentWind = weather.current.wind_speed_10m;
  const gusts = weather.current.wind_gusts_10m;
  const currentCode = weather.current.weather_code;

  const todayTemp = weather.daily.temperature_2m_max[0];
  const todayLow = weather.daily.temperature_2m_min[0];
  const todayRain = weather.daily.precipitation_probability_max[0];
  const todayWind = weather.daily.wind_speed_10m_max[0];

  const currentRainAmount =
    Number(weather.current?.rain ?? weather.current?.precipitation ?? 0) || 0;

  const currentLooksWet = isWetWeatherCode(currentCode) && currentRainAmount > 0;
  const currentConditionLabel = getCurrentConditionLabel(
    currentCode,
    currentRainAmount,
    Math.max(todayRain, weather.hourly.precipitation_probability[0] || 0)
  );

  const grimScore = getGrimScore(todayTemp, todayRain, todayWind, currentCode);

  // OpenWeather's free forecast is 3-hourly. 8 blocks = roughly the next 24 hours.
  const hourlyWindow = weather.hourly.time.slice(0, 8).map((hour: string, index: number) => {
    const hourRain = weather.hourly.precipitation_probability[index] || 0;
    const hourWind = weather.hourly.wind_speed_10m[index] || 0;
    const hourTemp = weather.hourly.temperature_2m[index] || currentTemp;
    const hourCode = weather.hourly.weather_code[index] || currentCode;

    return {
      hour,
      rain: hourRain,
      wind: hourWind,
      temp: hourTemp,
      code: hourCode,
      misery: hourRain * 2 + hourWind * 1.3 + Math.max(0, 8 - hourTemp) * 4,
    };
  });

  const worstHour = hourlyWindow.reduce((worst: any, item: any) => {
    return item.misery > worst.misery ? item : worst;
  }, hourlyWindow[0]);

  const worstHourTime = new Date(worstHour.hour).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const nextFewHours = hourlyWindow.slice(0, 3);
  const nextFewHoursRain = Math.max(...nextFewHours.map((item: any) => item.rain || 0));
  const nextFewHoursWind = Math.max(...nextFewHours.map((item: any) => item.wind || 0));
  const rainNowScore = currentLooksWet ? 100 : 0;

  // For the main briefing, judge the day by the nastiest realistic spell.
  // For beer garden, judge now + the next few hours so it does not say 10/10 before a soaking.
  const effectiveRain = Math.max(todayRain, worstHour.rain || 0);
  const effectiveWind = Math.max(todayWind, worstHour.wind || 0);
  const effectiveCode = worstHour.rain >= 45 ? worstHour.code : currentCode;

  const beerRain = Math.max(rainNowScore, nextFewHoursRain);
  const beerWind = Math.max(currentWind || 0, nextFewHoursWind);
  const beerScore = getBeerGardenScore(currentTemp, beerRain, beerWind);

  const dryChance = Math.max(0, 100 - effectiveRain);
  const dryNowText = currentLooksWet ? "Wet now" : "Dry right now";

  const strongRainHours = hourlyWindow.filter((item: any) => item.rain >= 60).length;
  const nastyWindHours = hourlyWindow.filter((item: any) => item.wind >= 35).length;
  const coldHours = hourlyWindow.filter((item: any) => item.temp <= 6).length;
  const hotHours = hourlyWindow.filter((item: any) => item.temp >= 24).length;

  const mainThreat = getMainWeatherThreat(
    currentTemp,
    effectiveRain,
    effectiveWind,
    effectiveCode,
    currentLooksWet
  );


  const accuracyMood = getAccuracyMood(
    currentLooksWet,
    effectiveRain,
    beerScore,
    grimScore
  );

  let briefingHeadline = savage
    ? "The weather is doing fuck all, but somehow still looks annoying."
    : "The weather is behaving, which is frankly suspicious.";

  let briefingDetail = savage
    ? "No proper disaster, no drama, just low-grade sky bullshit hanging around like an unwanted guest."
    : "Nothing too catastrophic right now. That does not mean the sky deserves your trust.";

  let briefingAdvice = savage
    ? "Use it if you must, but do not start acting like the weather has earned respect."
    : "Use the day while it is still acting normal.";

  const currentLine = currentLooksWet
    ? `Right now: it is actually wet in ${weather.placeName}.`
    : `Right now: it looks dry in ${weather.placeName}.`;

  const laterRainLine =
    mainThreat === "rain" || mainThreat === "stormy" || mainThreat === "showery"
      ? effectiveRain >= 45
        ? `Later: rain risk hits ${effectiveRain}% around ${worstHourTime}.`
        : `Later: worst rain risk only reaches ${effectiveRain}% around ${worstHourTime}.`
      : mainThreat === "wind"
      ? `Later: wind is the main nuisance, peaking around ${worstHourTime}.`
      : mainThreat === "hot"
      ? `Today: heat is the main nuisance at ${Math.round(currentTemp)}°C.`
      : mainThreat === "cold"
      ? `Today: cold is the main nuisance at ${Math.round(currentTemp)}°C.`
      : mainThreat === "grey"
      ? "Today: the main problem is grey, lifeless boredom."
      : "Today: nothing too dramatic is leading the charge.";

  if (mainThreat === "wind") {
    briefingHeadline = savage
      ? "The wind is the annoying bastard today."
      : "Wind is the main problem today.";
    briefingDetail = `${currentLine} Later: wind peaks around ${worstHourTime}. Rain is not running this show today; the air is.`;
    briefingAdvice = savage
      ? "Secure anything loose and accept that your hair has lost."
      : "Zip up, secure loose stuff, and expect the wind to make simple things annoying.";
  } else if (mainThreat === "hot") {
    briefingHeadline = savage
      ? "The heat is being a sweaty little prick."
      : "Heat is the main problem today.";
    briefingDetail = `${currentLine} It is around ${Math.round(currentTemp)}°C, and the forecast is more about heat than rain.`;
    briefingAdvice = savage
      ? "Drink water and stop pretending lager is hydration."
      : "Drink water, find shade, and do not underestimate how muggy it feels.";
  } else if (mainThreat === "cold") {
    briefingHeadline = savage
      ? "The cold is the miserable bastard today."
      : "Cold is the main problem today.";
    briefingDetail = `${currentLine} It is around ${Math.round(currentTemp)}°C, so the problem is temperature, not rain.`;
    briefingAdvice = savage
      ? "Wear layers. Fashion can piss off until you can feel your hands."
      : "Wear proper layers and do not dress for the weather you wanted.";
  } else if (mainThreat === "grey") {
    briefingHeadline = savage
      ? "It's fucking dull out there."
      : "Grey and dull is the main problem today.";
    briefingDetail = `${currentLine} Rain is not the headline. The sky is just flat, grey and doing absolutely nothing useful.`;
    briefingAdvice = savage
      ? "Go out if you must, but do not expect the day to have a personality."
      : "Usable, but deeply uninspiring.";
  } else   if (!savage) {
    if (mainThreat === "stormy" && currentLooksWet && effectiveRain >= 80 && effectiveWind >= 35) {
      briefingHeadline = `${weather.placeName} is getting absolutely battered.`;
      briefingDetail =
        `${currentLine} ${laterRainLine} Rain and wind are both involved, so this is a proper coat-and-patience situation rather than a quick dash.`;
      briefingAdvice =
        "Going outside is technically possible in the same way licking a plug socket is technically possible.";
    } else if (mainThreat === "rain" && !currentLooksWet && effectiveRain >= 80) {
      briefingHeadline = "Dry now, but the sky has plans.";
      briefingDetail =
        `${currentLine} ${laterRainLine} So no, GrimCast is not saying it is pouring this second. It is saying the forecast later looks ready to ruin sleeves.`;
      briefingAdvice =
        "Enjoy the dry bit, but keep a proper coat nearby unless you like surprise soakings.";
    } else if (mainThreat === "rain" && effectiveRain >= 80) {
      briefingHeadline = `${weather.placeName} is due a proper soaking.`;
      briefingDetail =
        `${currentLine} ${laterRainLine} Rain is not popping in. It is moving in, unpacking, and making itself everyone else's problem.`;
      briefingAdvice =
        "Take waterproofs, spare patience, and stop pretending a hoodie counts as protection.";
    } else if ((mainThreat === "rain" || mainThreat === "stormy") && effectiveRain >= 60 && effectiveWind >= 30) {
      briefingHeadline = currentLooksWet
        ? "Wet now, wind later, lovely little misery combo."
        : "Dry now, wet and pushy later.";
      briefingDetail =
        `${currentLine} ${laterRainLine} Around ${worstHourTime} looks like the point where the weather becomes least interested in your comfort.`;
      briefingAdvice =
        "Big coat. Sensible shoes. No heroic nonsense.";
    } else if (mainThreat === "rain" && effectiveRain >= 60) {
      briefingHeadline = currentLooksWet
        ? "Rain is already inserting itself into the day."
        : "Dry now, but rain is waiting in the wings.";
      briefingDetail =
        `${currentLine} ${laterRainLine} It is not constant apocalypse rain, but it is enough to make staying dry feel like admin.`;
      briefingAdvice =
        "Carry a coat unless you enjoy arriving places looking mildly defeated.";
    } else if (mainThreat === "showery" || (effectiveRain >= 35 && mainThreat === "rain")) {
      briefingHeadline = "Showers are lurking with intent.";
      briefingDetail =
        `${currentLine} ${laterRainLine} The overall risk is not catastrophic, but there are enough awkward bits to make the day annoying.`;
      briefingAdvice =
        "Do not trust a dry pavement. It knows nothing.";
    } else if (effectiveWind >= 55) {
      briefingHeadline = "The wind is being an absolute nuisance.";
      briefingDetail =
        `${currentLine} Bins are preparing escape routes and umbrellas are quietly updating their wills. There are ${nastyWindHours} properly blowy hours ahead.`;
      briefingAdvice = "Secure anything loose, including your dignity.";
    } else if (effectiveWind >= 40) {
      briefingHeadline = "The wind is going to make everything more annoying.";
      briefingDetail =
        `${currentLine} Not quite storm territory, just enough gusts to turn every corner into a personal disagreement.`;
      briefingAdvice = "Dress for movement. The forecast has no respect for presentation.";
    } else if (currentTemp >= 28) {
      briefingHeadline = "Britain is overheating again.";
      briefingDetail =
        `${currentLine} The buses will smell criminal, offices will become greenhouses, and everyone will pretend they wanted this.`;
      briefingAdvice = "Hydrate like an adult and avoid rooms with one tiny fan and twenty enemies.";
    } else if (currentTemp <= 1) {
      briefingHeadline = "Cold enough to make your face reconsider its life choices.";
      briefingDetail =
        `${currentLine} The air outside has all the warmth and compassion of a parking enforcement officer.`;
      briefingAdvice = "Wear proper layers. Bravery is not insulation.";
    } else if (currentTemp <= 6 || coldHours >= 4) {
      briefingHeadline = "The cold is doing that quiet bullying thing.";
      briefingDetail =
        `${currentLine} Not dramatic enough for a survival documentary, just cold enough to make every queue feel longer.`;
      briefingAdvice = "Layers, gloves, and no pretending a thin jacket is a plan.";
    } else if (effectiveRain <= 10 && effectiveWind < 25 && currentTemp >= 18) {
      briefingHeadline = "Against all odds, the weather is behaving itself.";
      briefingDetail =
        `${currentLine} Dry, usable and not actively hostile. This is rare enough to be treated with suspicion.`;
      briefingAdvice = "Get outside before the sky remembers what it is supposed to be doing.";
    } else if (effectiveRain <= 25 && effectiveWind < 30 && currentTemp >= 12) {
      briefingHeadline = "A usable day, which is almost suspicious.";
      briefingDetail =
        `${currentLine} Worst point is around ${worstHourTime}, but even that looks more annoying than catastrophic.`;
      briefingAdvice = "Use it. Do not trust it. The sky has form.";
    } else {
      briefingHeadline = "A mixed bag with commitment issues.";
      briefingDetail =
        `${currentLine} ${laterRainLine} Nothing is screaming disaster, but the forecast still has enough awkward bits to be annoying.`;
      briefingAdvice = "Dress like the weather might change its mind, because it probably will.";
    }
  } else {
    const savageBucket = pickSavageBucket(
      currentTemp,
      effectiveRain,
      effectiveWind,
      effectiveCode
    );

    if (savageBucket === "horrific") {
      briefingHeadline = currentLooksWet
        ? "The atmosphere has chosen violence."
        : "Dry now, but the atmosphere is loading violence.";
      briefingDetail =
        `${currentLine} ${laterRainLine} Rain. Wind. Misery. This is not just a forecast. It is the sky cracking its knuckles and looking for plans to ruin.`;
      briefingAdvice =
        "Stay inside unless the trip is essential, paid, or emotionally unavoidable. Anything else is volunteering to get slapped by the sky.";
    } else if (savageBucket === "rain") {
      briefingHeadline = currentLooksWet
        ? "The sky has completely lost its shit."
        : "Dry now, but the sky is getting ready to lose its shit.";
      briefingDetail =
        currentLooksWet
          ? `Right now: it is wet in ${weather.placeName}. Later: rain risk still hits ${effectiveRain}% around ${worstHourTime}. Your plans have been reviewed by the weather and told to get fucked.`
          : `Right now: it looks dry in ${weather.placeName}. Later: rain risk hits ${effectiveRain}% around ${worstHourTime}. So enjoy the nice bit while it lasts, because the sky has a bucket hidden behind its back.`;
      briefingAdvice =
        currentLooksWet
          ? "Take a proper coat. Not a hoodie. A hoodie is just wet fabric with confidence."
          : "Do not be fooled by the dry bit. The forecast is smiling at you like a bastard with a plan.";
    } else if (savageBucket === "showery") {
      briefingHeadline = "The showers are lurking like little bastards.";
      briefingDetail =
        `${currentLine} ${laterRainLine} This is trap weather: harmless-looking, then suddenly damp enough to ruin your sleeves for sport.`;
      briefingAdvice =
        "Carry a coat if you hate being mugged by clouds. Leave it if you enjoy learning lessons publicly.";
    } else if (savageBucket === "wind") {
      briefingHeadline = "The wind has become everyone's problem.";
      briefingDetail =
        `${currentLine} The air around ${weather.placeName} is acting like a drunk bloke outside a kebab shop. Worst point is around ${worstHourTime}, with ${effectiveWind} km/h wind being a noisy little prick.`;
      briefingAdvice =
        "Secure anything loose. Bags, garden chairs, dignity, all of it.";
    } else if (savageBucket === "cold") {
      briefingHeadline = "It is cold enough to question your life choices.";
      briefingDetail =
        `${currentLine} The air has turned sharp, rude, and personally unpleasant. Your face is going to regret leaving the house.`;
      briefingAdvice =
        "Wear actual layers. Fashion can fuck off until basic survival has been handled.";
    } else if (savageBucket === "hot") {
      briefingHeadline = "Britain has mistaken itself for Spain again.";
      briefingDetail =
        `${currentLine} It is warm enough for everyone to start making poor decisions and pretending they are enjoying it. Public transport will become a mobile armpit.`;
      briefingAdvice =
        "Drink water. Find shade. Stop pretending lager counts as hydration.";
    } else if (savageBucket === "grey") {
      briefingHeadline = "It's fucking dull out there.";
      briefingDetail =
        `${currentLine} Grey as fuck in ${weather.placeName}. Even the sun looked at this and decided not to get involved. Nothing is happening, nothing is improving, and somehow you still have to carry on.`;
      briefingAdvice =
        "Go out if you must, but do not expect the day to have a personality.";
    } else {
      briefingHeadline = "The weather is behaving, which is suspicious as fuck.";
      briefingDetail =
        `${currentLine} It is usable, which already feels like a trap. The sky has briefly stopped being a liability, but do not start trusting it like an idiot.`;
      briefingAdvice =
        "Use it while it lasts. Do not get cocky.";
    }
  }

  const shareText = `☠️ GRIMCAST\n\n${weather.placeName}\n${Math.round(currentTemp)}°C · ${currentConditionLabel}\nRight now: ${dryNowText}\nWind: ${effectiveWind} km/h\nGrim Score: ${grimScore}/10\nBeer Garden Score: ${beerScore}/10\n\n${briefingHeadline}\n${briefingDetail}\n\nWorst period: ${worstHourTime}\nChance of staying dry: ${dryChance}%`;
 async function createShareCardFile() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
const roundedRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    
    const gradient = ctx.createLinearGradient(0, 0, 0, 1350);
    gradient.addColorStop(0, "#09090f");
    gradient.addColorStop(0.45, "#15151d");
    gradient.addColorStop(1, "#050507");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const glow = ctx.createRadialGradient(540, 180, 20, 540, 180, 600);
    glow.addColorStop(0, "rgba(255,77,109,0.34)");
    glow.addColorStop(1, "rgba(255,77,109,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundedRect(70, 70, 940, 1210, 48);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 3;
    roundedRect(70, 70, 940, 1210, 48);
    ctx.stroke();

    ctx.fillStyle = "#ff4d6d";
    ctx.font = "900 38px Arial";
    ctx.fillText("REAL WEATHER. BAD ATTITUDE.", 110, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 92px Arial";
    ctx.fillText("GRIMCAST", 110, 255);

    ctx.fillStyle = "#ffb3c1";
    ctx.font = "800 42px Arial";
    ctx.fillText(weather.placeName || "Current Location", 110, 330);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 150px Arial";
    ctx.fillText(`${Math.round(currentTemp)}°C`, 110, 500);

    ctx.fillStyle = "#cfcfd8";
    ctx.font = "700 42px Arial";
    ctx.fillText(currentConditionLabel, 110, 560);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundedRect(110, 620, 860, 230, 34);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 54px Arial";
    ctx.fillText(`Grim Score ${grimScore}/10`, 145, 700);

    ctx.fillStyle = "#ffcc66";
    ctx.font = "900 44px Arial";
    ctx.fillText(`Beer Garden ${beerScore}/10`, 145, 760);

    ctx.fillStyle = "#dddddd";
    ctx.font = "700 34px Arial";
    ctx.fillText(`Rain ${effectiveRain}%  ·  Wind ${effectiveWind} km/h`, 145, 815);

    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(" ");
      let line = "";
      let currentY = y;

      words.forEach((word) => {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && line.length > 0) {
          ctx.fillText(line, x, currentY);
          line = word + " ";
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      });

      ctx.fillText(line, x, currentY);
      return currentY + lineHeight;
    };

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 44px Arial";
    const afterHeadline = wrapText(briefingHeadline, 110, 940, 860, 54);

    ctx.fillStyle = "#d7d7df";
    ctx.font = "700 32px Arial";
    wrapText(briefingDetail, 110, afterHeadline + 20, 860, 42);

    ctx.fillStyle = "#ff4d6d";
    ctx.font = "900 34px Arial";
    ctx.fillText("grimcast.co.uk", 110, 1220);

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        resolve(
          new File([blob], "grimcast-share.png", {
            type: "image/png",
          })
        );
      }, "image/png");
    });
  }

  function openSharePanel(file: File | null) {
    if (shareCardUrl) {
      URL.revokeObjectURL(shareCardUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setShareCardUrl(url);
      setShareCardFile(file);
    }

    setSharePanelOpen(true);
  }

  async function copyShareText() {
    try {
      await navigator.clipboard.writeText(shareText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      alert(shareText);
    }
  }

  async function shareCardNative() {
    if (!shareCardFile) {
      await copyShareText();
      return;
    }

    if (
      navigator.share &&
      (!(navigator as any).canShare ||
        (navigator as any).canShare({ files: [shareCardFile] }))
    ) {
      try {
        await navigator.share({
          title: "☠️ GrimCast",
          text: shareText,
          files: [shareCardFile],
        });
        return;
      } catch {
        // If the phone refuses file sharing, keep the preview panel open.
      }
    }

    await copyShareText();
  }

  async function shareMisery() {
    const cardFile = await createShareCardFile();

    if (!cardFile) {
      await copyShareText();
      return;
    }

    // Open our own share panel first so the user always sees the actual card.
    // The phone's native share sheet is still available inside the panel.
    openSharePanel(cardFile);
  }

  const background = getBackground(currentCode, currentLooksWet ? 100 : todayRain, currentTemp);
  const currentWeatherName = getWeatherName(currentCode).toLowerCase();
  const mentionsWetWeather =
    currentLooksWet ||
    currentWeatherName.includes("rain") ||
    currentWeatherName.includes("shower") ||
    currentWeatherName.includes("drizzle");

  // Only show animated rain when rain risk is genuinely worth showing.
  // 31% should read as a possible shower, not a full wet background.
  const showLiveRain = currentLooksWet;

  const showLiveClouds =
    currentWeatherName.includes("cloud") ||
    currentWeatherName.includes("overcast") ||
    currentWeatherName.includes("mist") ||
    currentWeatherName.includes("fog") ||
    mentionsWetWeather;

  const showLiveWind = effectiveWind >= 35;
  const showLiveSun = currentTemp >= 22;
  const showLiveCold = currentTemp <= 6;
  const rainDropCount = currentLooksWet ? 66 : 0;
  const cloudCount = showLiveClouds ? 7 : 0;
  const windCount = effectiveWind >= 45 ? 10 : 6;
  const showLiveMist = showLiveClouds && !showLiveRain;
  const usedHourlyAttitudes = new Set<string>();
  const usedFortnightlyAttitudes = new Set<string>();

  return (
    <main style={{ ...styles.page, background }}>
      {showLiveRain && <WeatherEffects code={currentCode} rain={100} temp={currentTemp} />}

      <div style={styles.liveWeatherLayer} aria-hidden="true">
        {showLiveSun && <div style={styles.liveSunGlow} />}

        {showLiveClouds && (
          <div style={styles.liveCloudDeck}>
            {Array.from({ length: cloudCount }).map((_, index) => (
              <div
                key={`cloud-${index}`}
                style={{
                  ...styles.liveCloud,
                  top: `${6 + index * 10}%`,
                  left: `${-46 + ((index * 31) % 105)}%`,
                  width: `${180 + (index % 4) * 56}px`,
                  height: `${74 + (index % 3) * 18}px`,
                  opacity: 0.42 + (index % 3) * 0.08,
                  animationDelay: `${index * -11}s`,
                  animationDuration: `${78 + index * 12}s`,
                }}
              >
                <span style={styles.liveCloudPuffOne} />
                <span style={styles.liveCloudPuffTwo} />
                <span style={styles.liveCloudPuffThree} />
              </div>
            ))}
          </div>
        )}

        {showLiveMist && <div style={styles.liveMistLayer} />}

        {showLiveRain &&
          Array.from({ length: rainDropCount }).map((_, index) => (
            <span
              key={`rain-${index}`}
              style={{
                ...styles.liveRainDrop,
                left: `${(index * 37) % 100}%`,
                top: `${-20 - (index % 10) * 8}%`,
                height: `${22 + (index % 5) * 10}px`,
                opacity: currentLooksWet ? 0.58 : 0,
                animationDelay: `${index * -0.42}s`,
                animationDuration: `${3.6 + (index % 7) * 0.32}s`,
              }}
            />
          ))}

        {showLiveWind &&
          Array.from({ length: windCount }).map((_, index) => (
            <span
              key={`wind-${index}`}
              style={{
                ...styles.liveWindLine,
                top: `${12 + ((index * 13) % 76)}%`,
                left: `${-40 - (index % 4) * 12}%`,
                width: `${90 + (index % 5) * 42}px`,
                opacity: effectiveWind >= 40 ? 0.34 : 0.2,
                animationDelay: `${index * -0.85}s`,
                animationDuration: `${4.5 + (index % 5) * 0.55}s`,
              }}
            />
          ))}

        {showLiveCold &&
          Array.from({ length: 36 }).map((_, index) => (
            <span
              key={`cold-${index}`}
              style={{
                ...styles.liveColdFleck,
                left: `${(index * 23) % 100}%`,
                top: `${(index * 19) % 100}%`,
                animationDelay: `${index * -0.4}s`,
              }}
            />
          ))}
      </div>

      <style jsx global>{`
        @keyframes grimLiveRainFall {
          0% { transform: translate3d(0, -22vh, 0) rotate(12deg); }
          100% { transform: translate3d(-34px, 122vh, 0) rotate(12deg); }
        }

        @keyframes grimCloudDrift {
          0% { transform: translate3d(-30vw, 0, 0); }
          100% { transform: translate3d(150vw, 0, 0); }
        }

        @keyframes grimMistDrift {
          0% { transform: translate3d(-20vw, 0, 0); opacity: 0.12; }
          50% { opacity: 0.26; }
          100% { transform: translate3d(20vw, 0, 0); opacity: 0.14; }
        }

        @keyframes grimWindRush {
          0% { transform: translateX(-30vw); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateX(145vw); opacity: 0; }
        }

        @keyframes grimColdFloat {
          0%, 100% { transform: translateY(0); opacity: 0.18; }
          50% { transform: translateY(-12px); opacity: 0.55; }
        }
      `}</style>

      <div style={styles.app}>
       <header style={styles.header}>
  <img
    src="/grimcast-logo.png"
    alt="GrimCast"
    style={styles.logoImage}
  />
</header>

        <section style={styles.searchBox}>
          <input
            value={location}
            onChange={(e) => searchPlaces(e.target.value)}
            placeholder="Town, city or postcode"
            style={styles.input}
          />
        </section>

        {placeSuggestions.length > 0 && (
          <section style={styles.suggestions}>
            {placeSuggestions.map((place) => (
              <button
                key={`${place.label}-${place.latitude}`}
                onClick={() => {
                  setLocation(place.label);
                  setPlaceSuggestions([]);
                  setLoading(true);

                  fetch(
                    `/api/weather?lat=${place.latitude}&lon=${
                      place.longitude
                    }&location=${encodeURIComponent(place.label)}`
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (!isValidWeatherData(data)) {
                        console.error("Bad weather response:", data);
                        setWeatherError("Could not load proper weather data for that place. Try another one.");
                        setLoading(false);
                        return;
                      }

                      setWeather(data);
                      setLoading(false);
                    })
                    .catch(() => {
                      setLoading(false);
                    });
                }}
                style={styles.suggestionButton}
              >
                {place.label}
              </button>
            ))}
          </section>
        )}

        <section style={styles.favourites}>
          {favouritesList.length === 0 ? (
            <p style={styles.emptyFavourites}>
              No favourites yet. Search a place and tap ⭐ Add Favourite.
            </p>
          ) : (
            favouritesList.map((place) => (
              <div key={place} style={styles.favWrap}>
                <button
                  onClick={() => {
                    setLocation(place);
                    loadWeather(place);
                  }}
                  style={styles.favButton}
                >
                  ⭐ {place}
                </button>

                <button
                  onClick={() => removeFavourite(place)}
                  style={styles.removeFavButton}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </section>

        <section style={styles.actionRow}>
          <button onClick={useMyLocation} style={styles.smallActionButton}>
            📍 Use My Location
          </button>

          <button
            onClick={() => {
              setMapPickerOpen(true);
              setMapMessage("Tap anywhere in Britain or Northern Ireland to pick a location.");
            }}
            style={styles.smallActionButton}
          >
            🗺 Pick on Map
          </button>

          <button onClick={addFavourite} style={styles.smallActionButton}>
            ⭐ Add Favourite
          </button>
        </section>

        <button onClick={() => setSavage(!savage)} style={styles.savageButton}>
          Savage Mode: {savage ? "ON" : "OFF"}
        </button>

        {loading && <p style={styles.loadingText}>Checking the sky...</p>}
        {weatherError && <p style={styles.errorText}>{weatherError}</p>}

        {mapPickerOpen && (
          <section style={styles.mapOverlay}>
            <div style={styles.mapPanel}>
              <div style={styles.mapHeader}>
                <div>
                  <p style={styles.cardLabel}>🗺 LOCATION PICKER</p>
                  <h2 style={styles.mapTitle}>Tap the map</h2>
                  <p style={styles.mapText}>{mapMessage}</p>
                </div>

                <button
                  onClick={() => setMapPickerOpen(false)}
                  style={styles.mapCloseButton}
                >
                  ×
                </button>
              </div>

              <div ref={mapDivRef} style={styles.mapCanvas} />

              <p style={styles.mapHint}>
                Tip: zoom in first, then tap the exact UK place you want GrimCast to judge.
              </p>
            </div>
          </section>
        )}

        {activeTab === "today" && (
          <>
            <section style={styles.hero}>
              <p style={styles.place}>📍 {weather.placeName}</p>

              <div style={styles.bigIcon}>
                <div style={styles.weatherOrb}>
                  <WeatherIcon
                    code={currentCode}
                    rain={todayRain}
                    wind={currentWind}
                    temp={currentTemp}
                    size={96}
                  />
                </div>
                <p style={styles.iconCaption}>{currentConditionLabel}</p>
              </div>

              <h2 style={styles.bigTemp}>{Math.round(currentTemp)}°C</h2>

              <p style={styles.weatherName}>
                {currentConditionLabel} · Feels like{" "}
                {Math.round(feelsLike)}°C
              </p>

              <section style={styles.briefingCard}>
                <p style={styles.briefingTitle}>☠️ TODAY&apos;S GRIM BRIEFING</p>

                <p style={styles.briefingMeta}>
                  {Math.round(currentTemp)}°C · {currentConditionLabel}
                </p>

                <h3 style={styles.briefingHeadline}>{briefingHeadline}</h3>

                <p style={styles.briefingText}>{briefingDetail}</p>

                <div style={styles.worstPeriodCard}>
                  <span style={styles.smallLabel}>Worst period</span>
                  <strong style={styles.worstPeriodTime}>{worstHourTime}</strong>
                  <p style={styles.worstPeriodText}>
                    {worstHour.rain}% rain · {worstHour.wind} km/h wind · {getWeatherName(worstHour.code)}
                  </p>
                </div>

                <p style={styles.briefingAdvice}>{briefingAdvice}</p>

                <div style={styles.briefingStats}>
                  <span>{dryNowText}</span>
                  <span>Later dry odds: {dryChance}%</span>
                </div>

                <button onClick={shareMisery} style={styles.shareButton}>
                  {shareCopied ? "Copied misery ✅" : "📤 Make Share Card"}
                </button>
              </section>
            </section>


            <section style={styles.accuracyCard}>
              <p style={styles.cardLabel}>🌅 DAYLIGHT</p>

              <div style={styles.daylightGrid}>
                <div>
                  <span style={styles.smallLabel}>Sunrise</span>
                  <strong style={styles.largeValue}>
                    {new Date(weather.daily.sunrise[0]).toLocaleTimeString(
                      "en-GB",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </strong>
                </div>

                <div>
                  <span style={styles.smallLabel}>Sunset</span>
                  <strong style={styles.largeValue}>
                    {new Date(weather.daily.sunset[0]).toLocaleTimeString(
                      "en-GB",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </strong>
                </div>
              </div>

              <p style={styles.cardRoast}>
                Daylight left: {getDaylightLeft(weather.daily.sunset[0])}
              </p>
            </section>

            <section style={styles.beerCard}>
              <p style={styles.cardLabel}>🍺 BEER GARDEN SCORE</p>
              <strong style={styles.beerScore}>{beerScore}/10</strong>
              <p style={styles.cardRoast}>{getBeerGardenText(beerScore)}</p>
            </section>

            <section style={styles.todayGrid}>
              <div style={styles.statBox}>
                <span style={styles.statLabel}>High</span>
                <strong style={styles.statValue}>{todayTemp}°C</strong>
              </div>

              <div style={styles.statBox}>
                <span style={styles.statLabel}>Low</span>
                <strong style={styles.statValue}>{todayLow}°C</strong>
              </div>

              <div style={styles.statBox}>
                <span style={styles.statLabel}>Later Rain Risk</span>
                <strong style={styles.statValue}>{effectiveRain}%</strong>
              </div>

              <div style={styles.statBox}>
                <span style={styles.statLabel}>Gusts</span>
                <strong style={styles.statValue}>{gusts} km/h</strong>
              </div>
            </section>
          </>
        )}

        {activeTab === "radar" && (
          <section style={styles.radarSection}>
            <div style={styles.radarHero}>
             <p style={styles.cardLabel}>🛰️ GRIMCAST RADAR</p>

<h2 style={styles.radarTitle}>
  Is That Rain Coming For You?
</h2>

<p style={styles.radarText}>
  This map shows the rain moving across the UK right now. Use it like a misery detector:
  if the wet blob is drifting towards your area, your coat is about to become relevant.
</p>
            </div>

            <div style={styles.radarFrameWrap}>
              <iframe
                title="Rain Radar"
                src="https://embed.windy.com/embed2.html?lat=54.5&lon=-3.4&detailLat=54.5&detailLon=-3.4&width=650&height=450&zoom=5&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
                style={styles.radarFrame}
              />
            </div>

            <section style={styles.radarTips}>
              <div style={styles.radarTip}>
                <strong>🌧 Small patch heading your way</strong>
                <span>Probably annoying. Coat optional, regret possible.</span>
              </div>

              <div style={styles.radarTip}>
                <strong>🌧 Big patch heading your way</strong>
                <span>Take a coat. Dry optimism is no longer sensible.</span>
              </div>

              <div style={styles.radarTip}>
                <strong>⛈ Heavy rain blob nearby</strong>
                <span>You are not popping out quickly. You're getting soaked.</span>
              </div>

              <div style={styles.radarTip}>
                <strong>☠️ Huge mess over your area</strong>
                <span>Stay in, make tea, and let the outside world embarrass itself.</span>
              </div>
            </section>
          </section>
        )}

        {activeTab === "worst" && (
          <>
            <GrimMeter score={grimScore} />

            {warning && (
              <section style={styles.warningCard}>
                <p style={styles.warningLabel}>🚨 WEATHER WARNING</p>
                <h2 style={styles.warningTitle}>{warning.title}</h2>
                <p style={styles.warningText}>{warning.message}</p>
              </section>
            )}

            <WorstDayAlert weather={weather} />

            <section style={styles.worstPlacesCard}>
              <h3 style={styles.sectionTitle}>☠️ Top 10 Worst Places In Britain</h3>
              <p style={styles.worstIntro}>
                Tap a place to load its weather. Misery tourism, basically.
              </p>

              {worstPlaces.length === 0 ? (
                <p style={styles.miniText}>Checking Britain&apos;s misery levels...</p>
              ) : (
                worstPlaces.map((place, index) => (
                  <button
                    key={place.name}
                    style={styles.worstPlaceRow}
                    onClick={() => {
                      setLocation(place.name);
                      loadWeather(place.name);
                      setActiveTab("today");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <div style={styles.worstPlaceText}>
                      <strong>
                        {index + 1}. {place.name}
                      </strong>
                      <p style={styles.miniText}>
                        {getWeatherName(place.code)} · {place.rain}% rain ·{" "}
                        {place.wind} km/h wind
                      </p>
                    </div>

                    <strong style={styles.worstScore}>{place.score}/10</strong>
                  </button>
                ))
              )}
            </section>
          </>
        )}
        {activeTab === "hourly" && (
          <section style={styles.forecastSection}>
            <h3 style={styles.sectionTitle}>3 Hourly Forecast</h3>

            {weather.hourly.time.slice(0, 8).map((hour: string, index: number) => {
              const temp = weather.hourly.temperature_2m[index];
              const rain = weather.hourly.precipitation_probability[index];
              const code = weather.hourly.weather_code[index];
              const wind = weather.hourly.wind_speed_10m[index];

              return (
                <div key={hour} style={styles.forecastCard}>
                  <div style={styles.forecastTop}>
                    <div style={styles.forecastLeft}>
                      <span style={styles.smallIcon}>
                        <WeatherIcon
                          code={code}
                          rain={rain}
                          wind={wind}
                          temp={temp}
                          size={42}
                        />
                      </span>

                      <div>
                        <strong>
                          {new Date(hour).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>

                        <p style={styles.miniText}>
                          {getWeatherName(code)} · {rain}% rain
                        </p>
                      </div>
                    </div>

                    <div style={styles.forecastRight}>
                      <strong>{temp}°</strong>
                      <span>{wind} km/h</span>
                    </div>
                  </div>

                  <p style={styles.hourlyRoast}>
                    {getUniqueHourlyAttitude(temp, rain, wind, code, savage, index, usedHourlyAttitudes)}
                  </p>
                </div>
              );
            })}
          </section>
        )}

        {activeTab === "forecast" && (
          <section style={styles.forecastSection}>
            <h3 style={styles.sectionTitle}>Forecast</h3>

            {weather.daily.time.slice(0, 6).map((day: string, index: number) => {
              const code = weather.daily.weather_code[index];
              const temp = weather.daily.temperature_2m_max[index];
              const low = weather.daily.temperature_2m_min[index];
              const rain = weather.daily.precipitation_probability_max[index];
              const wind = weather.daily.wind_speed_10m_max[index];
              const score = getGrimScore(temp, rain, wind, code);

              return (
                <div key={day} style={styles.forecastCard}>
                  <div style={styles.forecastTop}>
                    <div style={styles.forecastLeft}>
                      <span style={styles.smallIcon}>
                        <WeatherIcon
                          code={code}
                          rain={rain}
                          wind={wind}
                          temp={temp}
                          size={42}
                        />
                      </span>

                      <div>
                        <strong>
                          {new Date(day).toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                          })}
                        </strong>

                        <p style={styles.miniText}>
                          {getWeatherName(code)} · Grim {score}/10
                        </p>
                      </div>
                    </div>

                    <div style={styles.forecastRight}>
                      <strong>{temp}°</strong>
                      <span>{low}°</span>
                    </div>
                  </div>

                  <div style={styles.forecastDetails}>
                    <span>Rain: {rain}%</span>
                    <span>Wind: {wind} km/h</span>
                  </div>

                  <p style={styles.dailyRoast}>
                    {getUniqueFortnightlyAttitude(temp, rain, wind, code, savage, index, usedFortnightlyAttitudes)}
                  </p>
                </div>
              );
            })}
          </section>
        )}

        <footer style={styles.openWeatherCorner}>
          Weather data: Powered by OpenWeather. The attitude is entirely GrimCast's fault.
        </footer>

        <nav style={styles.bottomNav}>
          <button
            style={activeTab === "today" ? styles.navActive : styles.navButton}
            onClick={() => setActiveTab("today")}
          >
            ☀️
            <span>Today</span>
          </button>

          <button
            style={activeTab === "hourly" ? styles.navActive : styles.navButton}
            onClick={() => setActiveTab("hourly")}
          >
            🕒
            <span>3 Hourly</span>
          </button>

          <button
            style={
              activeTab === "forecast" ? styles.navActive : styles.navButton
            }
            onClick={() => setActiveTab("forecast")}
          >
            📅
            <span>Forecast</span>
          </button>

          <button
            style={activeTab === "radar" ? styles.navActive : styles.navButton}
            onClick={() => setActiveTab("radar")}
          >
            🛰️
            <span>Radar</span>
          </button>

          <button
            style={activeTab === "worst" ? styles.navActive : styles.navButton}
            onClick={() => setActiveTab("worst")}
          >
            ☠️
            <span>Worst</span>
          </button>
        </nav>

        {sharePanelOpen && (
          <section style={styles.sharePanelOverlay}>
            <div style={styles.sharePanel}>
              <button
                onClick={() => setSharePanelOpen(false)}
                style={styles.shareCloseButton}
              >
                ×
              </button>

              <p style={styles.cardLabel}>📤 SHARE GRIMCAST</p>
              <h2 style={styles.sharePanelTitle}>Your misery card is ready</h2>
              <p style={styles.sharePanelText}>
                Tap Share Card for the proper image share sheet. On local phone testing over HTTP,
                some phones block image sharing, so Save Card is the reliable fallback.
              </p>

              {shareCardUrl && (
                <img
                  src={shareCardUrl}
                  alt="GrimCast share card"
                  style={styles.sharePreviewImage}
                />
              )}

              <div style={styles.shareOptionGrid}>
                <button onClick={shareCardNative} style={styles.shareOptionButton}>
                  📲 Share Card
                </button>

                {shareCardUrl && (
                  <a
                    href={shareCardUrl}
                    download="grimcast-share.png"
                    style={styles.shareOptionLink}
                  >
                    ⬇️ Save Card
                  </a>
                )}

                {shareCardUrl && (
                  <a
                    href={shareCardUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.shareOptionLink}
                  >
                    🖼 Open Card
                  </a>
                )}

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.shareOptionLink}
                >
                  WhatsApp Text
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.shareOptionLink}
                >
                  X / Twitter
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.shareOptionLink}
                >
                  Facebook Link
                </a>

                <button onClick={copyShareText} style={styles.shareOptionButton}>
                  {shareCopied ? "Copied ✅" : "Copy Text"}
                </button>
              </div>
            </div>
          </section>
        )}
   </div>
</main>
  );
}

const styles: any = {
  loading: {
    minHeight: "100vh",
    background: "#050505",
    color: "white",
    padding: "20px",
    fontFamily: "Arial",
  },

  splashScreen: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(255,77,109,0.22), transparent 35%), linear-gradient(180deg, #050509, #111118)",
    color: "white",
    fontFamily: "Arial",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  splashRain: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    opacity: 0.55,
  },

  splashDrop: {
    position: "absolute",
    top: "-30px",
    width: "1.5px",
    height: "28px",
    borderRadius: "999px",
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0), rgba(210,230,255,0.8))",
    animationName: "splashRainFall",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },

splashContent: {
  textAlign: "center",
  position: "relative",
  zIndex: 2,
  animation: "splashFadeUp 0.9s ease forwards",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
},

  splashBrandPlate: {
    width: "min(92vw, 420px)",
    margin: "0 auto 14px",
    padding: "28px 24px 24px",
    borderRadius: "30px",
    background:
      "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,77,109,0.07))",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow:
      "0 24px 70px rgba(0,0,0,0.45), 0 0 38px rgba(255,77,109,0.18), inset 0 1px 0 rgba(255,255,255,0.16)",
    backdropFilter: "blur(12px)",
  },

  splashMini: {
    margin: "0 0 8px",
    color: "#ffb3c1",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "4px",
    textTransform: "uppercase",
  },

  splashKicker: {
    margin: "8px 0 0",
    color: "#ff4d6d",
    fontSize: "14px",
    fontWeight: "900",
    letterSpacing: "4px",
    textTransform: "uppercase",
  },

  splashTitle: {
    margin: "0",
    fontSize: "60px",
    lineHeight: 0.92,
    letterSpacing: "-2px",
    fontWeight: "900",
    textTransform: "uppercase",
    textShadow: "0 12px 34px rgba(0,0,0,0.45)",
  },

  splashText: {
    color: "#aaa",
    fontWeight: "bold",
    animation: "splashPulse 1.2s infinite",
  },

  page: {
    paddingBottom: "150px",
    minHeight: "100vh",
    color: "white",
    fontFamily: "Arial",
    padding: "16px",
    position: "relative",
    overflowX: "hidden",
  },

  liveWeatherLayer: {
    position: "fixed",
    inset: 0,
    zIndex: 4,
    pointerEvents: "none",
    overflow: "hidden",
    opacity: 1,
  },

  liveRainDrop: {
    position: "absolute",
    width: "2px",
    borderRadius: "999px",
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0), rgba(218,238,255,0.95), rgba(130,180,235,0.55))",
    boxShadow: "0 0 6px rgba(180,220,255,0.42)",
    animationName: "grimLiveRainFall",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    willChange: "transform",
  },

  liveCloudDeck: {
    position: "absolute",
    inset: 0,
    opacity: 1,
  },

  liveCloud: {
    position: "absolute",
    borderRadius: "999px",
    background:
      "radial-gradient(circle at 25% 42%, rgba(255,255,255,0.98), transparent 34%), radial-gradient(circle at 52% 26%, rgba(230,245,255,0.88), transparent 36%), radial-gradient(circle at 76% 50%, rgba(190,225,255,0.78), transparent 34%), linear-gradient(180deg, rgba(235,246,255,0.76), rgba(135,170,210,0.42))",
    boxShadow:
      "0 22px 95px rgba(125,205,255,0.46), inset 0 14px 34px rgba(255,255,255,0.46)",
    filter: "drop-shadow(0 0 22px rgba(150,220,255,0.72))",
    animationName: "grimCloudDrift",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    willChange: "transform",
  },

  liveCloudPuffOne: {
    position: "absolute",
    left: "12%",
    top: "-34%",
    width: "42%",
    height: "92%",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.72)",
    boxShadow: "inset 0 10px 28px rgba(255,255,255,0.44)",
  },

  liveCloudPuffTwo: {
    position: "absolute",
    left: "38%",
    top: "-48%",
    width: "46%",
    height: "110%",
    borderRadius: "999px",
    background: "rgba(240,250,255,0.76)",
    boxShadow: "inset 0 10px 30px rgba(255,255,255,0.48)",
  },

  liveCloudPuffThree: {
    position: "absolute",
    right: "8%",
    top: "-20%",
    width: "36%",
    height: "78%",
    borderRadius: "999px",
    background: "rgba(215,238,255,0.62)",
  },

  liveMistLayer: {
    position: "absolute",
    inset: "8% -20% 0 -20%",
    background:
      "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.12), transparent 24%), radial-gradient(circle at 70% 45%, rgba(255,255,255,0.10), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.05), transparent 70%)",
    animationName: "grimMistDrift",
    animationDuration: "22s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },

  liveWindLine: {
    position: "absolute",
    height: "2px",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
    animationName: "grimWindRush",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    willChange: "transform",
  },

  liveSunGlow: {
    position: "absolute",
    top: "-120px",
    right: "-120px",
    width: "460px",
    height: "460px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,245,170,0.98) 0%, rgba(255,213,86,0.82) 20%, rgba(255,154,46,0.48) 43%, rgba(255,119,77,0.10) 70%, transparent 82%)",
    boxShadow: "0 0 95px rgba(255,198,75,0.65)",
    filter: "none",
  },

  liveColdFleck: {
    position: "absolute",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "rgba(220,240,255,0.75)",
    boxShadow: "0 0 10px rgba(220,240,255,0.55)",
    animationName: "grimColdFloat",
    animationDuration: "3.4s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },

  app: {
    maxWidth: "430px",
    margin: "0 auto",
    position: "relative",
    zIndex: 20,
  },

  header: {
    paddingTop: "22px",
    marginBottom: "24px",
    textAlign: "center",
  },

  logoShell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  logoWordmark: {
    width: "100%",
    padding: "18px 14px 16px",
    borderRadius: "26px",
    background:
      "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,77,109,0.055))",
    border: "1px solid rgba(255,255,255,0.11)",
    boxShadow:
      "0 18px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
  },

  logoTopLine: {
    display: "block",
    color: "#ffb3c1",
    fontWeight: "900",
    fontSize: "12px",
    letterSpacing: "4px",
    marginBottom: "6px",
    textTransform: "uppercase",
  },

  logoBottomLine: {
    display: "block",
    color: "#ff4d6d",
    fontWeight: "900",
    fontSize: "13px",
    letterSpacing: "4px",
    marginTop: "7px",
    textTransform: "uppercase",
  },

  kicker: {
    color: "#ff4d6d",
    fontWeight: "900",
    fontSize: "13px",
    letterSpacing: "2.2px",
    margin: "6px 0 0",
    textTransform: "uppercase",
  },

  title: {
    fontSize: "58px",
    lineHeight: 0.9,
    fontWeight: "900",
    letterSpacing: "-2px",
    margin: 0,
    textTransform: "uppercase",
    color: "#fff",
    textShadow: "0 14px 38px rgba(0,0,0,0.45)",
  },

  searchBox: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #333",
    background: "#101014",
    color: "white",
    fontSize: "16px",
  },

  suggestions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "12px",
  },

  suggestionButton: {
    background: "#202028",
    color: "#fff",
    border: "1px solid #343442",
    borderRadius: "999px",
    padding: "8px 12px",
    cursor: "pointer",
  },

  favourites: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    marginBottom: "12px",
    minHeight: "40px",
  },

  favWrap: {
    display: "flex",
    alignItems: "center",
    background: "#15151b",
    border: "1px solid #333",
    borderRadius: "999px",
    overflow: "hidden",
    flexShrink: 0,
  },

  favButton: {
    whiteSpace: "nowrap",
    background: "transparent",
    color: "#fff",
    border: "none",
    padding: "9px 12px",
    cursor: "pointer",
  },

  removeFavButton: {
    background: "#2a1016",
    color: "#ff9aaa",
    border: "none",
    padding: "9px 11px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  emptyFavourites: {
    color: "#888",
    fontSize: "14px",
    margin: 0,
  },

  actionRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "8px",
    marginBottom: "12px",
  },

  smallActionButton: {
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #333",
    background: "#15151b",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  savageButton: {
    width: "100%",
    padding: "13px",
    borderRadius: "14px",
    border: "1px solid #3a3a3a",
    background: "#17171c",
    color: "white",
    fontWeight: "bold",
    marginBottom: "14px",
    cursor: "pointer",
  },

  loadingText: {
    color: "#ffb3c1",
    fontWeight: "bold",
    textAlign: "center",
  },

  errorText: {
    background: "rgba(255,77,109,0.13)",
    border: "1px solid rgba(255,77,109,0.35)",
    color: "#ffd5dd",
    padding: "12px",
    borderRadius: "14px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "12px",
  },

  hero: {
    background:
      "linear-gradient(160deg, rgba(255,77,109,0.25), rgba(255,255,255,0.06))",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "30px",
    padding: "24px",
    textAlign: "center",
    marginBottom: "14px",
    backdropFilter: "blur(12px)",
  },

  place: {
    color: "#ffb3c1",
    fontWeight: "bold",
  },

  bigIcon: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },

  weatherOrb: {
    width: "128px",
    height: "128px",
    borderRadius: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.28), rgba(255,77,109,0.14) 42%, rgba(0,0,0,0.2) 100%)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow:
      "0 18px 45px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
  },

  iconCaption: {
    margin: 0,
    color: "#ffb3c1",
    fontWeight: "900",
    fontSize: "13px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  bigTemp: {
    fontSize: "64px",
    margin: "6px 0",
  },

  weatherName: {
    color: "#ccc",
    fontWeight: "bold",
  },

  briefingCard: {
    marginTop: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "16px",
  },

  briefingTitle: {
    margin: "0 0 8px 0",
    fontWeight: "bold",
    color: "#ff4d6d",
    fontSize: "14px",
  },

  briefingMeta: {
    margin: "0 0 10px",
    color: "#aaa",
    fontWeight: "bold",
  },

  briefingHeadline: {
    margin: "0 0 10px",
    fontSize: "26px",
    lineHeight: 1.1,
    color: "#fff",
  },

  briefingText: {
    margin: 0,
    lineHeight: 1.5,
    color: "#ddd",
  },

  briefingAdvice: {
    color: "#ffb3c1",
    fontWeight: "900",
    lineHeight: 1.45,
    margin: "12px 0 0",
  },

  worstPeriodCard: {
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "14px",
    marginTop: "14px",
    textAlign: "left",
  },

  worstPeriodTime: {
    display: "block",
    fontSize: "30px",
    color: "#fff",
    marginTop: "4px",
  },

  worstPeriodText: {
    margin: "6px 0 0",
    color: "#bbb",
    fontWeight: "bold",
    fontSize: "13px",
  },

  shareButton: {
    width: "100%",
    marginTop: "14px",
    padding: "13px",
    borderRadius: "14px",
    border: "none",
    background: "#ff4d6d",
    color: "white",
    fontWeight: "900",
    cursor: "pointer",
  },

  briefingStats: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    color: "#bbb",
    fontSize: "14px",
  },

  premiumGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "12px",
  },

  premiumCard: {
    background:
      "linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035))",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "12px",
    backdropFilter: "blur(10px)",
  },

  cardLabel: {
    margin: "0 0 10px",
    color: "#ffb3c1",
    fontWeight: "900",
    fontSize: "13px",
    letterSpacing: "1px",
  },

  daylightGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  smallLabel: {
    display: "block",
    color: "#aaa",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "4px",
  },

  largeValue: {
    display: "block",
    color: "#fff",
    fontSize: "28px",
  },

  bigCardValue: {
    display: "block",
    fontSize: "34px",
    marginBottom: "4px",
  },

  cardStatus: {
    display: "block",
    color: "#ddd",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  cardRoast: {
    color: "#ddd",
    fontWeight: "bold",
    lineHeight: 1.4,
    marginBottom: 0,
  },

  beerCard: {
    background:
      "linear-gradient(160deg, rgba(255,180,0,0.22), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,180,0,0.35)",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "12px",
  },

  beerScore: {
    display: "block",
    fontSize: "46px",
    color: "#ffcc66",
    marginBottom: "8px",
  },

  todayGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "120px",
  },

  statBox: {
    background: "#121217",
    border: "1px solid #292933",
    borderRadius: "18px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  statLabel: {
    color: "#999",
    fontSize: "13px",
    fontWeight: "bold",
  },

  statValue: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#fff",
  },

  forecastSection: {
    background: "#101014",
    border: "1px solid #292933",
    borderRadius: "24px",
    padding: "16px",
    marginBottom: "120px",
  },

  sectionTitle: {
    marginTop: 0,
  },

  forecastCard: {
    background: "#15151b",
    border: "1px solid #292933",
    borderRadius: "18px",
    padding: "14px",
    marginBottom: "12px",
  },

  forecastTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  forecastLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  smallIcon: {
    width: "54px",
    height: "54px",
    minWidth: "54px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.035))",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
  },

  miniText: {
    margin: "4px 0 0",
    color: "#aaa",
    fontSize: "13px",
  },

  forecastRight: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  forecastDetails: {
    display: "flex",
    gap: "12px",
    marginTop: "12px",
    color: "#bbb",
    fontSize: "13px",
  },

  dailyRoast: {
    color: "#ffb3c1",
    fontWeight: "bold",
    marginBottom: 0,
    lineHeight: 1.45,
  },

  hourlyRoast: {
    margin: "12px 0 0",
    color: "#ffb3c1",
    fontWeight: "bold",
    lineHeight: 1.45,
    fontSize: "14px",
  },

  warningCard: {
    background:
      "linear-gradient(160deg, rgba(255,180,0,0.22), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,180,0,0.35)",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "14px",
  },

  warningLabel: {
    margin: 0,
    color: "#ffcc66",
    fontWeight: "bold",
    fontSize: "13px",
    letterSpacing: "1px",
  },

  warningTitle: {
    fontSize: "26px",
    margin: "8px 0",
  },

  warningText: {
    color: "#ffe6a3",
    fontWeight: "bold",
    marginBottom: 0,
  },

  radarSection: {
    background: "#101014",
    border: "1px solid #292933",
    borderRadius: "24px",
    padding: "16px",
    marginBottom: "120px",
  },

  radarHero: {
    background:
      "linear-gradient(160deg, rgba(255,77,109,0.2), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "22px",
    padding: "18px",
    marginBottom: "14px",
  },

  radarTitle: {
    fontSize: "34px",
    margin: "0 0 8px",
  },

  radarText: {
    color: "#ddd",
    fontWeight: "bold",
    margin: 0,
    lineHeight: 1.45,
  },

  radarFrameWrap: {
    borderRadius: "22px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.14)",
    marginBottom: "14px",
  },

  radarFrame: {
    width: "100%",
    height: "520px",
    border: "none",
    display: "block",
  },

  radarTips: {
    display: "grid",
    gap: "10px",
  },

  radarTip: {
    background: "#15151b",
    border: "1px solid #292933",
    borderRadius: "16px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    color: "#ddd",
  },

  worstPlacesCard: {
    background: "#101014",
    border: "1px solid #292933",
    borderRadius: "24px",
    padding: "16px",
    marginBottom: "120px",
  },

  worstIntro: {
    color: "#bbb",
    fontWeight: "bold",
    marginTop: "-4px",
  },

  worstPlaceRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    textAlign: "left",
    background: "#15151b",
    color: "white",
    border: "1px solid #292933",
    borderRadius: "16px",
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer",
  },

  worstPlaceText: {
    minWidth: 0,
  },

  worstScore: {
    color: "#ff4d6d",
    fontSize: "20px",
    whiteSpace: "nowrap",
  },

  mapOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.82)",
    zIndex: 2000,
    padding: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  mapPanel: {
    width: "100%",
    maxWidth: "760px",
    height: "86vh",
    background: "#101014",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
  },

  mapHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    padding: "8px 4px 14px",
  },

  mapTitle: {
    margin: "0 0 6px",
    fontSize: "30px",
    color: "#fff",
  },

  mapText: {
    margin: 0,
    color: "#ddd",
    fontWeight: "bold",
    lineHeight: 1.35,
  },

  mapCloseButton: {
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "#20151a",
    color: "#ffb3c1",
    fontSize: "26px",
    fontWeight: "900",
    cursor: "pointer",
    flexShrink: 0,
  },

  mapCanvas: {
    flex: 1,
    minHeight: "420px",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.14)",
  },

  mapHint: {
    margin: "12px 4px 2px",
    color: "#aaa",
    fontSize: "13px",
    fontWeight: "bold",
  },

  sharePanelOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 3000,
    background: "rgba(0,0,0,0.82)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px",
  },

  sharePanel: {
    width: "100%",
    maxWidth: "430px",
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#101014",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "24px",
    padding: "18px",
    position: "relative",
    boxShadow: "0 24px 80px rgba(0,0,0,0.62)",
  },

  shareCloseButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "#20151a",
    color: "#ffb3c1",
    fontSize: "24px",
    fontWeight: "900",
    cursor: "pointer",
  },

  sharePanelTitle: {
    margin: "2px 42px 8px 0",
    fontSize: "28px",
    color: "#fff",
  },

  sharePanelText: {
    margin: "0 0 14px",
    color: "#cfcfd8",
    fontWeight: "bold",
    lineHeight: 1.4,
  },

  sharePreviewImage: {
    width: "100%",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.14)",
    marginBottom: "14px",
    display: "block",
  },

  shareOptionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  shareOptionButton: {
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "#ff4d6d",
    color: "#fff",
    fontWeight: "900",
    cursor: "pointer",
    textAlign: "center",
  },

  shareOptionLink: {
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "#17171c",
    color: "#fff",
    fontWeight: "900",
    textDecoration: "none",
    textAlign: "center",
  },

  accuracyCard: {
    background:
      "linear-gradient(160deg, rgba(255,77,109,0.16), rgba(255,255,255,0.045))",
    border: "1px solid rgba(255,77,109,0.25)",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "12px",
  },

  accuracyTitle: {
    display: "block",
    fontSize: "22px",
    lineHeight: 1.15,
    color: "#fff",
    marginBottom: "8px",
  },

nextHitText: {
    display: "block",
    fontSize: "24px",
    lineHeight: 1.15,
    color: "#ffffff",
    marginBottom: "8px",
    fontWeight: "900",
  },

openWeatherCorner: {
  textAlign: "right",
  fontSize: "8px",
  opacity: 2.0,
  paddingRight: "60px",
  marginTop: "6px",
  marginBottom: "52px",
  color: "rgba(255,255,255,0.4)",
},

  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#101014",
    borderTop: "1px solid #292933",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 4px",
    zIndex: 999,
  },

  navButton: {
    background: "transparent",
    border: "none",
    color: "#888",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    fontSize: "11px",
  },

  navActive: {
    background: "transparent",
    border: "none",
    color: "#ff4d6d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "11px",
  },

 logoImage: {
  width: "260px",
  maxWidth: "90%",
  height: "auto",
  display: "block",
  margin: "0 auto",
},

splashLogo: {
  width: "320px",
  maxWidth: "90%",
  height: "auto",
  display: "block",
  margin: "0 auto",
},
};
