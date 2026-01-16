// src/pages/coming-soon/ComingSoon.jsx

// ESTILS
const CONTAINER = "text-center text-gray-500 mt-20 px-4";
const TITLE = "text-2xl font-semibold";

export default function ComingSoon() {
  // RENDERITZAT
  return (
    <div className={CONTAINER} role="status" aria-labelledby="coming-soon-title">
      <h2 id="coming-soon-title" className={TITLE}>Coming soon…</h2>
      <p>This feature is under development.</p>
    </div>
  );
}