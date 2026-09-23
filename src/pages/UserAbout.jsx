import { Link } from 'react-router-dom';
import { Truck, Globe, ShieldCheck, Leaf } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-4">About Velmoras Creation</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Premium custom-made dresses exported worldwide. We bridge expert craftsmanship with global fashion demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { icon: Globe, title: 'Global Export', text: 'Shipping bespoke and bulk dresses to 40+ countries with reliable logistics.' },
            { icon: Truck, title: 'Secure Dispatch', text: 'Custom orders carefully packaged and tracked end-to-end globally.' },
            { icon: ShieldCheck, title: 'Couture Quality', text: 'Every dress is inspected against strict international tailoring standards.' },
            { icon: Leaf, title: 'Finest Fabrics', text: 'We source premium, sustainable materials for luxurious comfort and fit.' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 p-6 rounded-2xl">
              <item.icon className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-lg font-bold text-ink mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink mb-6">Our Expertise</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Velmoras Creation is a premier export manufacturer specializing in bespoke, custom-made dresses for clients and retailers worldwide. From concept to creation, we handle fabric sourcing, precision tailoring, quality control, and international shipping.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether fulfilling bulk wholesale orders for fashion boutiques or crafting single-item premium dresses, we maintain an uncompromising commitment to fabric quality, perfect fit, and exquisite finishing built to international standards.
          </p>
        </div>

        <div className="mt-16 text-center">
          <Link to="/products" className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold hover:bg-accent-hover transition-colors">
            View Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
