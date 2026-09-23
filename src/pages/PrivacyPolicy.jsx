import PageHero from '../components/PageHero';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <PageHero 
        title="Privacy Policy" 
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Privacy Policy' }
        ]} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white">
          <p className="text-xs text-muted mb-12 flex items-center gap-2 uppercase tracking-wider font-bold border-b border-gray-200 pb-6">
            <CheckCircle2 className="h-4 w-4 text-ink" />
            Last Updated: August 6, 2026
          </p>

          <div className="space-y-16 text-muted leading-relaxed">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <Shield className="h-6 w-6 text-ink" />
                <h2 className="text-xl font-bold text-ink uppercase tracking-wider text-sm">1. Introduction</h2>
              </div>
              <p className="pl-10">
                Welcome to Velmoras ("we," "our," or "us"). We respect your privacy and are deeply committed to protecting your personal data. 
                This Privacy Policy outlines the types of information we collect, how it is used, and the steps we take to safeguard it when you 
                visit our website or purchase our premium apparel.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <Eye className="h-6 w-6 text-ink" />
                <h2 className="text-xl font-bold text-ink uppercase tracking-wider text-sm">2. Information We Collect</h2>
              </div>
              <div className="pl-10 space-y-6">
                <p>To provide you with an exceptional shopping experience, we collect:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-secondary p-6 border border-gray-200">
                    <h3 className="font-bold text-ink mb-2 uppercase tracking-wider text-xs">Personal Identity Data</h3>
                    <p className="text-sm">Your full name, contact number, email address, shipping, and billing addresses required for order fulfillment.</p>
                  </div>
                  <div className="bg-secondary p-6 border border-gray-200">
                    <h3 className="font-bold text-ink mb-2 uppercase tracking-wider text-xs">Technical Data</h3>
                    <p className="text-sm">IP address, browser type, device information, and session data gathered via cookies to optimize your browsing experience.</p>
                  </div>
                </div>
                <div className="bg-secondary p-6 border border-gray-200 flex items-start gap-4 mt-6">
                  <Lock className="h-5 w-5 text-ink shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-ink uppercase tracking-wider text-xs mb-1">Payment Security</h3>
                    <p className="text-sm">Your payment details are processed securely via third-party PCI-DSS compliant payment gateways. We never store full credit card information on our servers.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <FileText className="h-6 w-6 text-ink" />
                <h2 className="text-xl font-bold text-ink uppercase tracking-wider text-sm">3. How We Use Your Information</h2>
              </div>
              <ul className="pl-10 list-none space-y-4">
                {[
                  "To process, fulfill, and ship your apparel orders accurately.",
                  "To communicate order statuses, send tracking updates, and provide customer support.",
                  "To personalize your shopping experience and recommend relevant products.",
                  "To comply with legal, tax, and accounting obligations."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 bg-ink mt-2.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <Shield className="h-6 w-6 text-ink" />
                <h2 className="text-xl font-bold text-ink uppercase tracking-wider text-sm">4. Data Sharing & Security</h2>
              </div>
              <p className="pl-10">
                We absolutely do not sell, rent, or trade your personal information to third parties. Your data is only shared with highly trusted 
                service providers—such as verified logistics partners and payment processors—strictly for the purpose of fulfilling your order and 
                improving our services.
              </p>
            </section>

            <section className="bg-secondary p-8 border border-gray-200 mt-12">
              <h2 className="text-lg font-bold text-ink mb-4 uppercase tracking-wider text-sm">Contacting Us Regarding Privacy</h2>
              <p className="mb-6">If you have any questions or concerns regarding this Privacy Policy or your data, our dedicated support team is here to help.</p>
              <ul className="space-y-3 font-medium text-ink text-sm">
                <li><span className="text-muted w-20 inline-block uppercase tracking-wider text-xs">Email</span> <a href="mailto:support@velmorascreation.com" className="hover:text-accent transition-colors">support@velmorascreation.com</a></li>
                <li><span className="text-muted w-20 inline-block uppercase tracking-wider text-xs">Phone</span> <a href="tel:+923000000000" className="hover:text-accent transition-colors">+92 300 0000000</a></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;