import PageHero from '../components/PageHero';
import { RefreshCcw, HandCoins, ArrowRightLeft, MessageCircleQuestion } from 'lucide-react';

const ReturnRefund = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <PageHero 
        title="Returns & Refunds" 
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Returns & Refunds' }
        ]} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white">
          
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-ink mb-4 uppercase tracking-wider text-sm">Our 30-Day Guarantee</h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              We want you to be completely satisfied with your purchase. If you change your mind for any reason, 
              we gladly accept returns of unworn, unwashed, and undamaged items within 30 days of the original purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-secondary p-8 border border-gray-200">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6">
                <HandCoins className="h-5 w-5 text-ink" />
              </div>
              <h3 className="font-bold text-ink mb-3 uppercase tracking-wider text-xs">Refunds</h3>
              <p className="text-sm text-muted leading-relaxed">
                Once we receive your returned item, we will inspect it and notify you. Approved refunds will be processed 
                and a credit will automatically be applied to your original method of payment within 5-7 business days.
              </p>
            </div>
            
            <div className="bg-secondary p-8 border border-gray-200">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6">
                <ArrowRightLeft className="h-5 w-5 text-ink" />
              </div>
              <h3 className="font-bold text-ink mb-3 uppercase tracking-wider text-xs">Exchanges</h3>
              <p className="text-sm text-muted leading-relaxed">
                Need a different size or color? The fastest way to ensure you get what you want is to return the item you have, 
                and once the return is accepted, make a separate purchase for the new item.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-xl font-bold text-ink mb-8 flex items-center gap-4 uppercase tracking-wider text-sm">
              <RefreshCcw className="h-6 w-6 text-ink" />
              How to Start a Return
            </h2>
            
            <div className="space-y-8 pl-10">
              {[
                { step: 1, title: "Pack Your Item", desc: "Place the unworn items with original tags in their original packaging." },
                { step: 2, title: "Include Order Info", desc: "Include your order slip or a note with your Name and Order Number inside the package." },
                { step: 3, title: "Ship it Back", desc: "Mail the package to our returns facility using a trackable shipping method." }
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="w-8 h-8 rounded-full bg-ink text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-1">{item.title}</h4>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-secondary p-8 border border-gray-200 flex items-start gap-6">
              <MessageCircleQuestion className="h-6 w-6 text-ink shrink-0" />
              <div>
                <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-2">Need Help?</h4>
                <p className="text-sm text-muted">
                  Our customer service team is ready to assist you with your return. Contact us at <a href="mailto:support@velmorascreation.com" className="font-semibold text-ink hover:text-accent transition-colors">support@velmorascreation.com</a>.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ReturnRefund;
