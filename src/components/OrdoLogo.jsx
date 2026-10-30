/**
 * Scalable, high-contrast vector logo for Ordo.
 * Concentric focus rings (Cerulean Blue left, Neon Rose right) with crisp ORDO wordmark.
 * Perfectly legible on Jet Black backgrounds across all screen sizes.
 */
export default function OrdoLogo({ className = "" }) {
  return (
    <div className={`ordo-brand-logo ${className}`} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: "drop-shadow(0 0 8px rgba(0, 194, 255, 0.4))" }}
      >
        {/* Outer Ring - Left (Cerulean) */}
        <path
          d="M 45 10 A 40 40 0 0 0 45 90"
          stroke="#00c2ff"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Outer Ring - Right (Neon Rose) */}
        <path
          d="M 55 10 A 40 40 0 0 1 55 90"
          stroke="#ff007f"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Middle Ring - Left (Cerulean) */}
        <path
          d="M 45 28 A 22 22 0 0 0 45 72"
          stroke="#00a8e8"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Middle Ring - Right (Neon Rose) */}
        <path
          d="M 55 28 A 22 22 0 0 1 55 72"
          stroke="#ff2a8d"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Center Target Dot */}
        <circle cx="50" cy="50" r="7.5" fill="#ff007f" />
      </svg>
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
          fontSize: "20px",
          fontWeight: "800",
          letterSpacing: "1.5px",
          color: "#ffffff",
          textShadow: "0 0 12px rgba(0, 194, 255, 0.4)",
        }}
      >
        ORDO
      </span>
    </div>
  );
}
