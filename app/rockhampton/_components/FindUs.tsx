'use client'

import { MapPin, Clock3, Phone, Mail, ExternalLink } from 'lucide-react'

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7324.14543942386!2d150.512644!3d-23.385586399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6bc3019b5bc354fd%3A0xc67b2c6ed07ad63c!2sRockhampton%20mobile%20auto%20electrics!5e0!3m2!1sen!2sau!4v1788780034607!5m2!1sen!2sau'

const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=Rockhampton+mobile+auto+electrics'

export function FindUs() {
  return (
    <section className="rmae-section" id="find" style={{ paddingTop: 0 }}>
      <div className="rmae-shell">
        <div className="rmae-find rmae-reveal">
          <div className="rmae-map">
            {/* Sits behind the frame: if the map cannot load, this shows through
                rather than leaving an empty box. */}
            <div className="rmae-map-fallback">
              <MapPin size={22} strokeWidth={1.8} aria-hidden />
              <b>Unit 2b/197 Kent St</b>
              <span>Rockhampton City QLD 4700</span>
              <a className="rmae-btn rmae-btn-ghost" href={DIRECTIONS} target="_blank" rel="noreferrer">
                Open in Google Maps <ExternalLink size={14} />
              </a>
            </div>
            <iframe
              src={MAP_SRC}
              title="Map showing Rockhampton Mobile Auto Electrics at Unit 2b/197 Kent Street, Rockhampton City"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="rmae-find-copy">
            <span className="rmae-eyebrow">The workshop</span>
            <h2 className="rmae-h2">
              Mobile most days,
              <br />
              <em>Kent Street the rest</em>
            </h2>
            <p className="rmae-lede">
              Most jobs happen at your place. For the ones that need a hoist, a bench or a
              full fitout, the workshop is on Kent Street in Rockhampton City.
            </p>

            <ul className="rmae-find-list">
              <li>
                <span className="rmae-check-ico"><MapPin size={15} strokeWidth={2.2} /></span>
                <div>
                  <b>Unit 2b/197 Kent St</b>
                  <p>Rockhampton City QLD 4700</p>
                </div>
              </li>
              <li>
                <span className="rmae-check-ico"><Clock3 size={15} strokeWidth={2.2} /></span>
                <div>
                  <b>Mon to Fri until 5:00pm</b>
                  <p>Saturday mornings by arrangement</p>
                </div>
              </li>
              <li>
                <span className="rmae-check-ico"><Phone size={15} strokeWidth={2.2} /></span>
                <div>
                  <b><a href="tel:+61427667996">0427 667 996</a></b>
                  <p>Straight through to the van</p>
                </div>
              </li>
              <li>
                <span className="rmae-check-ico"><Mail size={15} strokeWidth={2.2} /></span>
                <div>
                  <b><a href="mailto:admin@rmautoelec.com.au">admin@rmautoelec.com.au</a></b>
                  <p>For quotes, invoices and fleet accounts</p>
                </div>
              </li>
            </ul>

            <a className="rmae-btn" href={DIRECTIONS} target="_blank" rel="noreferrer">
              Get directions <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
