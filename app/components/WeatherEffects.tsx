"use client";

type WeatherEffectsProps = {
  code: number;
  rain: number;
  temp: number;
};

export default function WeatherEffects({ code, rain, temp }: WeatherEffectsProps) {
  const rainyCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];
  const cloudyCodes = [1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82];
  const sunnyCodes = [0, 1];

  const isRainy = rain >= 55 || (rain >= 45 && rainyCodes.includes(code));
  const isCloudy = cloudyCodes.includes(code);
  const isSunny = sunnyCodes.includes(code) && rain < 45;
  const isSnowy = temp <= 2 && [71, 73, 75, 77, 85, 86].includes(code);
  const isStorm = [95, 96, 99].includes(code);

  const rainAmount = rain >= 80 ? 130 : rain >= 60 ? 95 : 60;
  const cloudMoodClass = isRainy ? "rain-clouds" : "dry-clouds";

  return (
    <>
      {isSunny && (
        <div className="weather-layer sun-layer">
          <div className="sun-glow" />
          <div className="sun-core" />
        </div>
      )}

      {isCloudy && (
        <div className={`weather-layer clouds-layer ${cloudMoodClass}`}>
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="cloud cloud-three" />
        </div>
      )}

      {isRainy && (
        <div className="weather-layer rain-layer">
          {Array.from({ length: rainAmount }).map((_, index) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 4.8 + Math.random() * 3.5;
            const height = 42 + Math.random() * 34;
            const drift = rain >= 70 ? 34 : 18;

            return (
              <span
                key={index}
                className="raindrop"
                style={
                  {
                    left: `${left}%`,
                    height: `${height}px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                    "--drift": `${drift}px`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      )}

      {isStorm && <div className="lightning" />}
      {isSnowy && <div className="weather-layer snow-layer" />}

      <style jsx global>{`
        .weather-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .sun-layer,
        .clouds-layer {
          z-index: 4;
        }

        .rain-layer {
          z-index: 5;
        }

        .snow-layer {
          z-index: 5;
        }

        .sun-glow {
          position: absolute;
          top: 6%;
          right: 2%;
          width: 310px;
          height: 310px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 230, 120, 0.95) 0%,
            rgba(255, 180, 60, 0.55) 36%,
            rgba(255, 130, 40, 0.08) 72%,
            transparent 100%
          );
          filter: blur(1px);
          animation: sunPulse 5s ease-in-out infinite;
        }

        .sun-core {
          position: absolute;
          top: 12%;
          right: 13%;
          width: 105px;
          height: 105px;
          border-radius: 50%;
          background: radial-gradient(circle, #fffbd0 0%, #ffd75f 48%, #ff9638 100%);
          box-shadow:
            0 0 45px rgba(255, 230, 120, 1),
            0 0 115px rgba(255, 160, 45, 0.85);
          animation: sunFloat 7s ease-in-out infinite;
        }

        .cloud {
          position: absolute;
          border-radius: 999px;
          background:
            radial-gradient(circle at 25% 55%, rgba(255,255,255,1), transparent 36%),
            radial-gradient(circle at 48% 35%, rgba(230,245,255,0.98), transparent 39%),
            radial-gradient(circle at 72% 55%, rgba(205,232,255,0.92), transparent 36%),
            rgba(215,238,255,0.78);
          box-shadow:
            0 18px 90px rgba(180,225,255,0.55),
            inset 0 0 36px rgba(255,255,255,0.55);
          filter: drop-shadow(0 0 24px rgba(170,225,255,0.8));
          animation-name: cloudDrift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .cloud-one {
          top: 10%;
          width: 340px;
          height: 124px;
          opacity: 0.96;
          animation-duration: 62s;
        }

        .cloud-two {
          top: 34%;
          width: 410px;
          height: 145px;
          opacity: 0.9;
          animation-duration: 82s;
          animation-delay: -30s;
        }

        .cloud-three {
          top: 62%;
          width: 350px;
          height: 125px;
          opacity: 0.82;
          animation-duration: 98s;
          animation-delay: -55s;
        }

        .rain-clouds .cloud {
          background:
            radial-gradient(circle at 25% 55%, rgba(220,238,250,0.72), transparent 36%),
            radial-gradient(circle at 48% 35%, rgba(190,220,242,0.64), transparent 39%),
            radial-gradient(circle at 72% 55%, rgba(160,200,230,0.54), transparent 36%),
            rgba(135,175,210,0.28);
          box-shadow: 0 12px 48px rgba(90,150,200,0.28);
          filter: drop-shadow(0 0 10px rgba(110,170,220,0.34));
        }

        .rain-clouds .cloud-one {
          width: 280px;
          height: 98px;
          opacity: 0.36;
        }

        .rain-clouds .cloud-two {
          width: 330px;
          height: 116px;
          opacity: 0.32;
        }

        .rain-clouds .cloud-three {
          width: 290px;
          height: 102px;
          opacity: 0.28;
        }

        .raindrop {
          position: absolute;
          top: -100px;
          width: 2px;
          border-radius: 999px;
          background: linear-gradient(to bottom, transparent, rgba(150,215,255,1));
          opacity: 0.95;
          box-shadow: 0 0 9px rgba(125,205,255,0.8);
          animation-name: rainFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .lightning {
          position: fixed;
          inset: 0;
          background: rgba(255,255,255,0.9);
          pointer-events: none;
          z-index: 6;
          animation: lightningFlash 6s infinite;
        }

        @keyframes cloudDrift {
          0% { transform: translateX(-45vw); }
          100% { transform: translateX(135vw); }
        }

        @keyframes rainFall {
          0% { transform: translate3d(0, -20vh, 0) rotate(10deg); }
          100% { transform: translate3d(var(--drift), 120vh, 0) rotate(10deg); }
        }

        @keyframes sunPulse {
          0%, 100% { opacity: 0.86; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        @keyframes sunFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        @keyframes lightningFlash {
          0%, 88%, 100% { opacity: 0; }
          89% { opacity: 0.65; }
          90% { opacity: 0; }
          92% { opacity: 0.35; }
          93% { opacity: 0; }
        }

        @media (max-width: 600px) {
          .sun-layer,
          .clouds-layer {
            z-index: 8;
          }

          .rain-layer,
          .snow-layer {
            z-index: 9;
          }

          .sun-glow {
            top: 4%;
            right: -10%;
            width: 390px;
            height: 390px;
          }

          .sun-core {
            top: 10%;
            right: 12%;
            width: 130px;
            height: 130px;
          }

          .dry-clouds .cloud-one {
            width: 400px;
            height: 148px;
            opacity: 1;
          }

          .dry-clouds .cloud-two {
            width: 455px;
            height: 165px;
            opacity: 0.96;
          }

          .dry-clouds .cloud-three {
            width: 390px;
            height: 145px;
            opacity: 0.92;
          }

          .rain-clouds .cloud-one {
            width: 260px;
            height: 92px;
            opacity: 0.34;
          }

          .rain-clouds .cloud-two {
            width: 300px;
            height: 108px;
            opacity: 0.3;
          }

          .rain-clouds .cloud-three {
            width: 260px;
            height: 92px;
            opacity: 0.26;
          }

          .raindrop {
            width: 3.4px;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}