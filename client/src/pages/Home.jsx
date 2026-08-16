import ProductList from '../components/ProductList';
import ServicesSection from '../components/ServicesSection';
import myBackgrnd from '../assets/magnif-bg.png';


const corrugateStyle = {
  backgroundImage: `repeating-linear-gradient(
    90deg,
    #B9C2C8 0px, #B9C2C8 3px,
    #C9D0D5 3px, #C9D0D5 6px,
    #A9B3B9 6px, #A9B3B9 9px
  )`,
};

const stats = [
  { value: '15+', label: 'Years in roofing' },
  { value: '3', label: 'Sheet profiles: IBR, Chromadek, Q-Tile' },
  { value: '1000+', label: 'Roofs manufactured & installed' },
];

const reasons = [
  {
    title: 'High-quality materials',
    desc: 'Every sheet is rolled and coated to spec, no shortcuts on gauge or finish.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      </svg>
    ),
  },
  {
    title: 'Expert installation',
    desc: 'Fitted by teams who work with our sheeting every day, to manufacturer spec.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Warranty coverage',
    desc: 'Backed roofing, so you are covered long after installation day.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: 'Competitive pricing',
    desc: 'Manufacturing in-house keeps quality up and cost down.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

function Home() {
  return (
    <>
      {/* Hero section */}
      <section
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${myBackgrnd})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1B42]/85 via-[#0B1B42]/65 to-[#0B1B42]/90"></div>

        <div className="relative z-10 text-center px-6">
          <span className="block text-[#F2601C] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            IBR · Chromadek · Q-Tile
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-wide text-white mb-4">
            Welcome to Mag<span className="text-[#4E9B02]">nif</span>
          </h1>
          <h4 className="text-white/70 text-xl mb-8">Magnificent roof over your head</h4>

          <button
            className="bg-[#F2601C] hover:bg-[#D9540F] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition"
            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Our Products
          </button>
        </div>
      </section>

      <div className="bg-[#F7F7F5]">
        <div className="container mx-auto py-16 space-y-20 px-6">

          {/* Product list section */}
          <section id="products" className="products bg-white/90 backdrop-blur-md shadow-lg rounded-lg">
            <span className="block text-[#F2601C] text-2xl font-semibold tracking-[0.25em] uppercase text-center mb-2 pt-8">
              What we make
            </span>
            <h2 className="text-3xl font-bold text-center text-[#0B1B42] mb-10">Our Products</h2>
            <ProductList />
          </section>

          {/* Services Section */}
          <ServicesSection />

          {/* About Section */}
          <section className="about grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div>
              <span className="block text-[#F2601C] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                About Magnif
              </span>
              <h2 className="text-3xl font-bold text-[#0B1B42] mb-4">Roofing, manufactured right.</h2>
              <p className="text-[#5B6472] leading-relaxed mb-8">
                Magnif is a leading provider of high-quality roofing solutions. We specialize in
                delivering durable and aesthetically pleasing roofs for residential and commercial
                properties. Our team of experts is dedicated to ensuring customer satisfaction
                through exceptional craftsmanship and reliable service.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {stats.map(({ value, label }) => (
                  <div key={label} className="border-l-2 border-[#F2601C] pl-3">
                    <p className="text-2xl font-extrabold text-[#0B1B42]">{value}</p>
                    <p className="text-xs text-[#5B6472] leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={corrugateStyle} className="w-full h-64 rounded-xl border border-[#E3E5E0] shadow-inner"></div>
          </section>

          {/* Why Choose Us Section */}
          <section className="facts">
            <span className="block text-[#F2601C] text-xs font-semibold tracking-[0.25em] uppercase text-center mb-2">
              The difference
            </span>
            <h2 className="text-3xl font-bold text-[#0B1B42] text-center mb-10">Why Choose Magnif?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {reasons.map(({ title, desc, icon }) => (
                <div
                  key={title}
                  className="group p-6 bg-white rounded-xl border border-[#E3E5E0] shadow-md transform transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#F2601C]"
                >
                  <div className="w-11 h-11 rounded-full bg-[#0B1B42] text-white flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-[#F2601C]">
                    {icon}
                  </div>
                  <p className="text-[#14171C] font-bold mb-2">{title}</p>
                  <p className="text-[#5B6472] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/**Contact us */}
<section className="contactUs bg-white text-white rounded-xl shadow-lg p-8 lg:p-12 mt-12">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {/* Location Info */}
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#0B1B42]">Where We Are Located</h2>
      <p className="leading-relaxed text-[#5B6472]">
        851 Mpandawana Industrial Park,<br />
        Gutu Garage Opposite Telone
      </p>
    </div>

    {/* Contact Info */}
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#0B1B42]">Get in Touch With Us</h2>
      <ul className="space-y-2">
        <li>📞 <a href="tel:+263774774865" className="hover:text-[#F2601C]">+263 77 123 4567</a></li>
        <li>📞 <a href="tel:+263713165372" className="hover:text-[#F2601C]">+263 71 234 5678</a></li>
      </ul>
      <div className="mt-4">
        <a
          href="https://www.facebook.com/people/Magnif-Pvt-Ltd/61554219253016/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-[#F2601C] hover:bg-[#D9540F] text-white px-4 py-2 rounded-full shadow-md transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
          </svg>
          <span>Facebook</span>
        </a>
      </div>
    </div>
  </div>
</section>


        </div>
      </div>
    </>
  );
}

export default Home;