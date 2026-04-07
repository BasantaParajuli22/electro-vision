
import { Mail, ShieldCheck, FileText, LifeBuoy, CreditCard, Lock } from 'lucide-react';

export default function SupportLegalPage() {
  return (
    <div className="min-h-[calc(100dvh-64px)] bg-stone-50 text-stone-800 font-sans pb-20">
      {/* Header Section */}
      <div className="bg-stone-100 border-b border-stone-200 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-mono font-bold tracking-tighter uppercase mb-2">Electro Vision</h1>
          <p className="text-stone-500 text-sm">Support Center & Legal Documentation</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Navigation (Desktop) */}
        <div className="md:col-span-1 space-y-6">
          <nav className="sticky top-24 space-y-2">
            <a href="#support" className="flex items-center gap-3 p-2 hover:bg-stone-200 rounded transition-colors text-sm font-medium">
              <LifeBuoy size={18} /> Contact Support
            </a>
            <a href="#terms" className="flex items-center gap-3 p-2 hover:bg-stone-200 rounded transition-colors text-sm font-medium">
              <FileText size={18} /> Terms of Service
            </a>
            <a href="#privacy" className="flex items-center gap-3 p-2 hover:bg-stone-200 rounded transition-colors text-sm font-medium">
              <ShieldCheck size={18} /> Privacy Policy
            </a>
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-20">
          
          {/* Section: Support */}
          <section id="support">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
              <Mail size={20} className="text-amber-500" /> Contact Support
            </h2>
            <p className="text-sm text-stone-600 mb-4">
              Need help with an electrical product or your order? Our team is available 24/7.
            </p>
            <div className="bg-white border border-stone-200 p-6 rounded-lg shadow-sm">
              <p className="text-sm font-mono text-stone-500 mb-1">Email us at:</p>
              <p className="text-lg font-semibold text-stone-800">support@electrovision.com</p>
              <a href='https://mail.google.com/mail/u/0/#inbox'  className="mt-4 w-full bg-stone-800 text-white py-2 rounded text-sm hover:bg-stone-900 transition-colors">
                Open Support Ticket
              </a>
            </div>
          </section>

          {/* Section: Terms of Service */}
          <section id="terms">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
              <FileText size={20} className="text-amber-500" /> Terms of Service
            </h2>
            <div className="prose prose-stone prose-sm max-w-none text-stone-600 space-y-4">
              <p>By using Electro Vision, you agree to our terms regarding the sale of electrical components.</p>
              <h3 className="font-bold text-stone-800">1. Payments & Stripe</h3>
              <p>All transactions are processed securely via Stripe. We do not store your full credit card details on our servers.</p>
              <h3 className="font-bold text-stone-800">2. Account Responsibility</h3>
              <p>Whether using OAuth (Google/GitHub) or traditional login, you are responsible for maintaining account security.</p>
            </div>
          </section>

          {/* Section: Privacy Policy */}
          <section id="privacy">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
              <ShieldCheck size={20} className="text-amber-500" /> Privacy Policy
            </h2>
            <div className="space-y-6 text-sm text-stone-600">
              <div className="flex gap-4">
                <Lock className="shrink-0 text-stone-400" />
                <div>
                  <h4 className="font-bold text-stone-800">Authentication & Security</h4>
                  <p>We use OTP (One-Time Password) verification and Robot Captcha to prevent unauthorized access. Your login data is encrypted.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CreditCard className="shrink-0 text-stone-400" />
                <div>
                  <h4 className="font-bold text-stone-800">Data Processing</h4>
                  <p>We collect email and shipping addresses specifically for fulfillment. We utilize OAuth providers only for identity verification.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}