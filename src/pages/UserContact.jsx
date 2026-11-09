import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe } from 'lucide-react';
import { contactApi } from '../api';
import { useSettings } from '../context/SettingsContext';
import PageHero from '../components/PageHero';
import Seo from '../components/Seo';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { settings } = useSettings();
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
      import('react-hot-toast').then(({ default: toast }) => toast.success('Message sent successfully!'));
    } catch (err) {
      setError(err.message || 'Failed to send message');
      import('react-hot-toast').then(({ default: toast }) => toast.error(err.message || 'Failed to send message'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <Seo
        title="Contact Us"
        description="Get in touch with Velmoras Creation for custom orders, sizing inquiries, wholesale collaboration, and worldwide shipping support."
        url="https://www.velmorascreation.com/contact"
      />
      <PageHero 
        title="Contact Us" 
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Contact Us' }
        ]} 
      />

      <div className="w-[90%] max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">Get in Touch</h2>
              <p className="text-muted leading-relaxed">
                Whether you have a question about our bespoke cinema costumes, custom sizing, an existing order, or bespoke tailoring commissions, our master team is here to assist.
              </p>
            </div>
            
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors">
                <div className="h-11 w-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-xs">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink uppercase tracking-wider text-xs mb-1">Email Us</h3>
                  <a href={`mailto:${settings?.email || 'info@velmorascreation.com'}`} className="text-muted text-sm hover:text-accent transition-colors">{settings?.email || 'info@velmorascreation.com'}</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors">
                <div className="h-11 w-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-xs">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink uppercase tracking-wider text-xs mb-1">Call Us</h3>
                  <a href={`tel:${settings?.phone || settings?.whatsapp || ''}`} className="text-muted text-sm hover:text-accent transition-colors">{settings?.phone || settings?.whatsapp || '+92 3166186641'}</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors">
                <div className="h-11 w-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-xs">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink uppercase tracking-wider text-xs mb-1">Headquarters</h3>
                  <p className="text-muted text-sm leading-relaxed">{settings?.company_name || 'Velmoras Creation'}<br/>{settings?.address || 'G-10, Islamabad, Pakistan'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors">
                <div className="h-11 w-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-xs">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink uppercase tracking-wider text-xs mb-1">Business Hours</h3>
                  <p className="text-muted text-sm leading-relaxed">{settings?.business_hours || 'Mon-Sat 9AM-6PM PKT'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-secondary/60 border border-border/60 rounded-3xl p-7 md:p-10 shadow-sm backdrop-blur-xs">
              <h2 className="text-2xl font-bold text-ink mb-2">Send a Message</h2>
              <p className="text-muted text-sm mb-7">Fill out the form below and our team will get back to you shortly.</p>
              <form onSubmit={submit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
                    <Globe className="h-4 w-4 shrink-0 text-red-600"/> <span>{error}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      required 
                      value={form.name} 
                      onChange={set('name')} 
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-ink text-sm placeholder:text-muted/60 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none shadow-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={form.email} 
                      onChange={set('email')} 
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-ink text-sm placeholder:text-muted/60 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none shadow-xs" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Subject</label>
                  <input 
                    required 
                    value={form.subject} 
                    onChange={set('subject')} 
                    placeholder="e.g. Custom order inquiry / Sizing"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-ink text-sm placeholder:text-muted/60 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none shadow-xs" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Message</label>
                  <textarea 
                    rows="5" 
                    required 
                    value={form.message} 
                    onChange={set('message')} 
                    placeholder="Tell us more about what you need..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-ink text-sm placeholder:text-muted/60 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none resize-y shadow-xs" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full bg-primary text-primary-foreground py-3.5 px-6 font-semibold tracking-wide text-sm rounded-xl hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {submitting ? 'Sending...' : <><Send className="h-4 w-4"/> Send Message</>}
                </button>
                
                {sent && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium mt-4 shadow-xs flex items-center gap-2.5">
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
