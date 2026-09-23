import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe } from 'lucide-react';
import { contactApi } from '../api';
import PageHero from '../components/PageHero';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSent(false);
    setSubmitting(true);
    try {
      await contactApi.create(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <PageHero 
        title="Contact Us" 
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Contact Us' }
        ]} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">Get in Touch</h2>
              <p className="text-muted leading-relaxed">
                Whether you have a question about our premium apparel, need assistance with an order, or want to explore wholesale opportunities, we're here to help.
              </p>
            </div>
            
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h3 className="font-semibold text-ink uppercase tracking-wider text-sm mb-1">Email Us</h3>
                  <a href="mailto:support@velmorascreation.com" className="text-muted hover:text-accent transition-colors">support@velmorascreation.com</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h3 className="font-semibold text-ink uppercase tracking-wider text-sm mb-1">Call Us</h3>
                  <a href="tel:+923000000000" className="text-muted hover:text-accent transition-colors">+92 300 0000000</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h3 className="font-semibold text-ink uppercase tracking-wider text-sm mb-1">Headquarters</h3>
                  <p className="text-muted leading-relaxed">Velmoras Creation<br/>Lahore, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h3 className="font-semibold text-ink uppercase tracking-wider text-sm mb-1">Business Hours</h3>
                  <p className="text-muted leading-relaxed">Monday - Friday<br/>9:00 AM - 6:00 PM (PKT)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-secondary p-8 md:p-10">
              <h2 className="text-2xl font-bold text-ink mb-8">Send a Message</h2>
              <form onSubmit={submit} className="space-y-6">
                {error && <div className="p-4 bg-white border-l-4 border-accent text-accent text-sm flex items-center gap-2 shadow-sm"><Globe className="h-4 w-4"/> {error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Full Name</label>
                    <input required value={form.name} onChange={set('name')} className="w-full px-4 py-3 bg-white border border-gray-200 focus:ring-1 focus:ring-ink focus:border-ink transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" required value={form.email} onChange={set('email')} className="w-full px-4 py-3 bg-white border border-gray-200 focus:ring-1 focus:ring-ink focus:border-ink transition-all outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Subject</label>
                  <input required value={form.subject} onChange={set('subject')} className="w-full px-4 py-3 bg-white border border-gray-200 focus:ring-1 focus:ring-ink focus:border-ink transition-all outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Message</label>
                  <textarea rows="5" required value={form.message} onChange={set('message')} className="w-full px-4 py-3 bg-white border border-gray-200 focus:ring-1 focus:ring-ink focus:border-ink transition-all outline-none resize-y" />
                </div>
                
                <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground py-4 font-bold tracking-wider uppercase text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? 'Sending...' : <><Send className="h-4 w-4"/> Send Message</>}
                </button>
                
                {sent && (
                  <div className="p-4 bg-white border-l-4 border-green-500 text-green-700 text-sm font-medium mt-4 shadow-sm">
                    Thank you! Your message has been sent successfully. We will get back to you shortly.
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
