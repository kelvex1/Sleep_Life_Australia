import { Phone, ArrowRight, Mail, MapPin, Clock3 } from 'lucide-react'

export function Closing() {
  return (
    <>
      <section className="rmae-section" style={{ paddingTop: 0 }}>
        <div className="rmae-shell">
          <div className="rmae-cta rmae-reveal">
            <span className="rmae-eyebrow">Off the road?</span>
            <h2 className="rmae-h2">
              Tell us the fault.
              <br />
              <em>We&apos;ll come to it.</em>
            </h2>
            <p className="rmae-lede" style={{ marginInline: 'auto', textAlign: 'center' }}>
              Same-day call backs during business hours. Rockhampton, Gracemere, Yeppoon and
              the Capricorn Coast.
            </p>
            <div className="rmae-hero-actions" style={{ justifyContent: 'center' }}>
              <a className="rmae-btn" href="tel:+61427667996">
                <Phone size={16} strokeWidth={2.4} /> 0427 667 996
              </a>
              <a className="rmae-btn rmae-btn-ghost" href="#quote">
                Send an enquiry <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="rmae-footer">
        <div className="rmae-shell">
          <div className="rmae-foot-grid">
            <div>
              <a className="rmae-brand" href="#top" style={{ marginBottom: '1rem' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/rmae/logo.svg" alt="Rockhampton Mobile Auto Electrics" width={52} height={52} />
                <span className="rmae-brand-txt">
                  <b>Rockhampton Mobile</b>
                  <span>Auto Electrics</span>
                </span>
              </a>
              <p style={{ maxWidth: '30ch' }}>
                A locally owned and operated auto electrical business. Your one stop shop for all
                your electrical and air conditioning needs.
              </p>
            </div>

            <div>
              <h4>Services</h4>
              <ul>
                <li><a href="#services">Diagnostics</a></li>
                <li><a href="#services">Air conditioning</a></li>
                <li><a href="#services">Dual battery &amp; 12V</a></li>
                <li><a href="#services">Rewiring</a></li>
                <li><a href="#services">Fleet servicing</a></li>
              </ul>
            </div>

            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#work">What we fix</a></li>
                <li><a href="#process">How it works</a></li>
                <li><a href="#reviews">Reviews</a></li>
                <li><a href="#area">Service area</a></li>
                <li><a href="/rockhampton/admin">Owner dashboard</a></li>
              </ul>
            </div>

            <div>
              <h4>Get in touch</h4>
              <p><Phone size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} /><a href="tel:+61427667996">0427 667 996</a></p>
              <p><Mail size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} /><a href="mailto:admin@rmautoelec.com.au">admin@rmautoelec.com.au</a></p>
              <p><MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />Unit 2b/197 Kent St, Rockhampton City QLD 4700</p>
              <p><Clock3 size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />Mon–Fri until 5:00pm · Sat mornings by arrangement</p>
            </div>
          </div>

          <div className="rmae-foot-bar">
            <span>© {new Date().getFullYear()} Rockhampton Mobile Auto Electrics.</span>
            <span>Concept site — built for the Wednesday sit-down.</span>
          </div>
        </div>
      </footer>

      <div className="rmae-callbar">
        <a className="rmae-btn" href="tel:+61427667996">
          <Phone size={16} strokeWidth={2.4} /> Call now
        </a>
        <a className="rmae-btn rmae-btn-ghost" href="#quote">
          Get a quote
        </a>
      </div>
    </>
  )
}
