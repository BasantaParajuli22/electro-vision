const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center text-white py-24 md:py-40"
      // New background image relevant to electronics
      style={{ backgroundImage: `url('https://ocohjxbhun.ufs.sh/f/tusHOP3SRakyc8FLA65voD3SOBrVwQq1d6LJjy9GW8T5bnHF')`
 }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          Next-Gen Tech, Delivered Today
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Explore our curated selection of the latest electronic devices. From high-performance laptops to smart home gadgets, find your perfect tech upgrade here.
        </p>
        <a
          href="/products"
          className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Shop All Products
        </a>
      </div>
    </section>
  );
};

export default Hero;