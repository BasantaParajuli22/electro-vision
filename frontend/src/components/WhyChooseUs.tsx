import { Truck, ShieldCheck, Cpu } from 'lucide-react'; // Changed icons for relevance

const WhyChooseUs = () => {
    const features = [
        {
            icon: <Truck className="h-10 w-10 text-white" />,
            title: "Fast Shipping",
            description: "Your new tech is dispatched quickly and delivered right to your doorstep."
        },
        {
            icon: <ShieldCheck className="h-10 w-10 text-white" />,
            title: "Secure Payments",
            description: "Shop with confidence. Your transactions are safe with our industry-leading encryption."
        },
        {
            icon: <Cpu className="h-10 w-10 text-white" />,
            title: "Quality Guaranteed",
            description: "We source the best devices from top brands, ensuring performance and reliability."
        }
    ];

    return (
        <section className="bg-indigo-700 text-white py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold mb-4">Why Choose ElectroVision?</h2>
                     <p className="text-indigo-200 max-w-2xl mx-auto">We provide a seamless, secure, and satisfying shopping experience from start to finish.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-indigo-600 p-8 rounded-lg text-center shadow-lg">
                            <div className="flex justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-indigo-200">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;