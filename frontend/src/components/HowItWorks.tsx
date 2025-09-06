import { Search, CreditCard, Truck } from 'lucide-react'; // Changed icons

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-indigo-600" />,
      title: 'Find Your Device',
      description: 'Browse our extensive collection of top-tier electronics to find what you need.'
    },
    {
      icon: <CreditCard className="h-12 w-12 text-indigo-600" />,
      title: 'Secure Checkout',
      description: 'Add items to your cart and pay securely with our streamlined checkout process.'
    },
    {
      icon: <Truck className="h-12 w-12 text-indigo-600" />,
      title: 'Fast Delivery',
      description: 'Get your new gear delivered swiftly and safely right to your doorstep.'
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Getting the latest tech is easier than ever. Just follow these three simple steps.</p>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-indigo-100 p-6 rounded-full mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;