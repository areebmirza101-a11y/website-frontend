import PageHero from '../components/PageHero';
import { Truck, Clock, Globe2, PackageCheck, AlertCircle } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <PageHero 
        title="Shipping Policy" 
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Shipping Policy' }
        ]} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Clock, title: "Processing Time", text: "1-2 Business Days" },
              { icon: Truck, title: "Standard Delivery", text: "3-5 Business Days" },
              { icon: Globe2, title: "International", text: "7-14 Business Days" }
            ].map((feature, i) => (
              <div key={i} className="bg-secondary p-8 text-center border border-gray-200 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 border border-gray-200">
                  <feature.icon className="h-5 w-5 text-ink" />
                </div>
                <h3 className="font-bold text-ink uppercase tracking-wider text-xs mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-16 text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-4 uppercase tracking-wider text-sm">
                <PackageCheck className="h-6 w-6 text-ink" />
                Order Processing
              </h2>
              <p className="pl-10">
                All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped containing your tracking number.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-4 uppercase tracking-wider text-sm">
                <Truck className="h-6 w-6 text-ink" />
                Domestic Shipping Rates
              </h2>
              <div className="pl-10">
                <p className="mb-6">Shipping charges for your order will be calculated and displayed at checkout. We offer flat-rate shipping tiers:</p>
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary text-ink text-xs uppercase tracking-wider">
                        <th className="py-4 px-6 font-bold border-b border-gray-200">Shipping Option</th>
                        <th className="py-4 px-6 font-bold border-b border-gray-200 border-l border-gray-200">Estimated Delivery</th>
                        <th className="py-4 px-6 font-bold border-b border-gray-200 border-l border-gray-200">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-muted">
                      <tr>
                        <td className="py-4 px-6 font-medium text-ink">Standard Shipping</td>
                        <td className="py-4 px-6 border-l border-gray-200">3-5 business days</td>
                        <td className="py-4 px-6 border-l border-gray-200 text-ink font-medium">$5.99</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-4 px-6 font-medium text-ink">Express Shipping</td>
                        <td className="py-4 px-6 border-l border-gray-200">1-2 business days</td>
                        <td className="py-4 px-6 border-l border-gray-200 text-ink font-medium">$14.99</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-ink">Free Shipping</td>
                        <td className="py-4 px-6 border-l border-gray-200">3-5 business days</td>
                        <td className="py-4 px-6 border-l border-gray-200 font-bold text-ink uppercase tracking-wider text-xs">Free <span className="font-normal text-muted lowercase tracking-normal">(over $100)</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="bg-secondary p-8 border border-gray-200 flex gap-6">
              <AlertCircle className="h-6 w-6 text-ink shrink-0" />
              <div>
                <h3 className="font-bold text-ink mb-2 uppercase tracking-wider text-xs">Important Notice Regarding Delays</h3>
                <p className="text-sm text-muted leading-relaxed">
                  While we do everything in our power to ensure your order arrives on time, please note that there can occasionally be delays with postal services that are outside of our control, especially during peak holiday seasons.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;