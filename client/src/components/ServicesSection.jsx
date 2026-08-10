import sideImage from './../assets/sidecolorRoof.jpg';

const services = [
  {
    step: "01 — Assess",
    title: "Roof Inspection",
    desc: "On-site condition checks that catch corrosion, loose fixings and wear early, with a clear report before any work is recommended.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="6"></circle>
        <line x1="14.5" y1="14.5" x2="20" y2="20"></line>
      </svg>
    ),
  },
  {
    step: "02 — Fix",
    title: "Roof Repair",
    desc: "Targeted repairs for leaks, damaged panels and failed seals — matched to your existing sheet profile and finish.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z"></path>
      </svg>
    ),
  },
  {
    step: "03 — Build",
    title: "Roof Installation",
    desc: "Full installation of IBR, Chromadek and Q-Tile sheeting, measured and fitted to manufacturer spec from day one.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 19h18"></path>
        <path d="M5 19V9l7-5 7 5v10"></path>
        <path d="M9 19v-6h6v6"></path>
      </svg>
    ),
  },
  {
    step: "04 — Sustain",
    title: "Maintenance Services",
    desc: "Scheduled upkeep — cleaning, fastener checks and recoating — to extend the working life of your roof sheeting.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V19a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"></path>
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section className="services p-6 lg:p-10 rounded-lg bg-white shadow-lg">
      <span className="block text-[#F2601C] text-xs font-semibold tracking-[0.25em] uppercase text-center mb-2">
        Magnif / Roofing Solutions
      </span>
      <h2 className="text-3xl font-bold mb-6 text-[#0B1B42] text-center">
        Our Services
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-center mb-10 gap-6">
        <div
          role="img"
          aria-label="Corrugated metal roof sheeting"
          style={{ backgroundImage: `url(${sideImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          className="w-full lg:w-1/2 h-60 rounded-xl border border-[#E3E5E0] shadow-md"
        />
        <p className="text-[#5B6472] leading-relaxed lg:w-1/2">
          At Magnif, we offer a comprehensive range of roofing services to meet
          all your needs. From new roof installations to repairs and inspections,
          our skilled team is here to ensure your roof is in top condition.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(({ step, title, desc, icon }) => (
          <div
            key={title}
            className="group p-6 bg-gradient-to-br from-[#0B1B42] to-[#14295C] rounded-xl border border-[#E3E5E0] shadow-md transform transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#F2601C]"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-[#F2601C] group-hover:text-white">
              {icon}
            </div>

            <span className="block text-xs tracking-widest text-white/70 uppercase mb-1">
              {step}
            </span>
            <p className="text-white font-bold text-lg mb-2">{title}</p>
            <hr className="border-white/15 mb-3" />
            <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}