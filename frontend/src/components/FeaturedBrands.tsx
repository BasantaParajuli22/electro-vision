const FeaturedBrands = () => {
  // Using placeholder images with names of electronic brands
  const brands = [
    'https://via.placeholder.com/150x60?text=Apple',
    'https://via.placeholder.com/150x60?text=Samsung',
    'https://via.placeholder.com/150x60?text=Sony',
    'https://via.placeholder.com/150x60?text=Dell',
    'https://via.placeholder.com/150x60?text=LG',
    'https://via.placeholder.com/150x60?text=Bose',
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop Top Brands</h2>
        <p className="text-gray-600 mb-12">We partner with the leading names in the tech industry.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {brands.map((brandUrl, index) => (
            <img
              key={index}
              src={brandUrl}
              alt={`Brand ${index + 1}`}
              className="mx-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;