export default function BrandLogo() {
  return (
    <span className="brand-logo">
      {/* Mountain peak icon */}
      <svg
        className="brand-icon"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Back peak */}
        <polyline
          points="4,30 14,10 20,20"
          stroke="#93c5fd"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        {/* Front peak */}
        <polyline
          points="12,30 22,8 32,30"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
        {/* Snow cap */}
        <polyline
          points="18.5,11 22,8 25.5,11"
          stroke="#93c5fd"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
        {/* Ground line */}
        <line
          x1="4"
          y1="30"
          x2="32"
          y2="30"
          stroke="#263244"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      <span className="brand-wordmark">
        <span className="brand-peak">PEAK</span>
        <span className="brand-recovery">RECOVERY</span>
      </span>
    </span>
  );
}
