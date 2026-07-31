import ProductList from '../components/ProductList';
import myBackgrnd from '../assets/magnif-bg.png';
import roofMach from '../assets/magnif-roof-from-machine.png';

function Home() {
  return (
    <>
    {/**Hero section */}
      <section className="relative min-h-screen  bg-cover bg-center flex  items-center justify-center " 
      style={{ backgroundImage: `url(${myBackgrnd})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl text-center mb-4 font-extrabold tracking-wide text-blue-950 hover:scale-105 transition-transform duration-300">Welcome to Mag<span className="text-green-400">nif</span></h1>
        <h4 className="text-orange-400 text-xl mb-4">Magnificent roof over your head</h4>
        
         <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md transition"
          onClick={()=> document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
        Explore Our Products
      </button>
      </div>
      </section>
    <div className="container mx-auto px-6 space-y-8">
      
      
      {/**Product list section */}
      <section id="products" className="products p-6 rounded-lg shadow-lg h-[50vh]">
        <h2 className="text-3xl font-bold text-center text-green-500 mb-6 hover:scale-105 transition-transform">Our Products</h2>

        <div>
          <ProductList /></div>
        
        
      </section>

      {/* About Section */}
    <section className="about bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-blue-950 hover:scale-105 transition-transform">
        About Us
      </h2>
      <p className="text-gray-200 leading-relaxed">
        Magnif is a leading provider of high-quality roofing solutions. We
        specialize in delivering durable and aesthetically pleasing roofs for
        residential and commercial properties. Our team of experts is dedicated
        to ensuring customer satisfaction through exceptional craftsmanship and
        reliable service.
      </p>
    </section>

      {/* Services Section */}
    <section className="services bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-blue-950 hover:scale-105 transition-transform">
        Our Services
      </h2>
      <ul className="space-y-2 text-gray-200">
        <li className="hover:text-green-400 transition">Roof Installation</li>
        <li className="hover:text-green-400 transition">Roof Repair</li>
        <li className="hover:text-green-400 transition">Roof Inspection</li>
        <li className="hover:text-green-400 transition">Maintenance Services</li>
      </ul>
    </section>

      {/* Why Choose Us Section */}
    <section className="facts bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-blue-950 hover:scale-105 transition-transform">
        Why Choose Magnif?
      </h2>
      <ul className="space-y-2 text-gray-200">
        <li className="hover:text-green-400 transition">High-quality materials</li>
        <li className="hover:text-green-400 transition">Expert installation</li>
        <li className="hover:text-green-400 transition">Warranty coverage</li>
        <li className="hover:text-green-400 transition">Competitive pricing</li>
      </ul>
    </section>
  </div>
  </>
  );
}

export default Home;