import PageHero from '../components/PageHero';
import { Scale, BookOpen, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <PageHero 
        title="Terms & Conditions" 
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Terms & Conditions' }
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
                <BookOpen className="h-6 w-6 text-ink" />
                <h2 className="text-xl font-bold text-ink uppercase tracking-wider text-sm">1. Acceptance of Terms</h2>
              </div>
              <p className="pl-10">
                By accessing and placing an order with Velmoras, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Velmoras.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <Scale className="h-6 w-6 text-ink" />
                <h2 className="text-xl font-bold text-ink uppercase tracking-wider text-sm">2. Products and Pricing</h2>
              </div>
              <div className="pl-10 space-y-6">
                <p>
                  All products listed on the website, their descriptions, and their prices are subject to change without notice. We reserve the right, at any time, to modify, suspend, or discontinue the sale of any product with or without notice.
                </p>
                <div className="bg-secondary p-6 border border-gray-200 flex items-start gap-4 mt-6">
                  <AlertTriangle className="h-5 w-5 text-ink shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-ink uppercase tracking-wider text-xs mb-1">Pricing Accuracy</h3>
                    <p className="text-sm">While we strive for perfect accuracy, errors may occur. In the event a product is listed at an incorrect price due to a typographical error, we have the right to refuse or cancel any orders placed for that product.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="h-6 w-6 text-ink" />
                <h2 className="text-xl font-bold text-ink uppercase tracking-wider text-sm">3. Intellectual Property</h2>
              </div>
              <p className="pl-10">
                The website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by Velmoras and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </section>

            <section className="bg-secondary p-8 border border-gray-200 mt-12">
              <h2 className="text-lg font-bold text-ink mb-4 uppercase tracking-wider text-sm">Questions about our Terms?</h2>
              <p className="mb-6">If you need clarification regarding any of these terms before making a purchase, please reach out to us.</p>
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

export default TermsConditions;