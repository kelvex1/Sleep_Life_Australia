import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const locations = [
    { name: 'Wanneroo', address: 'Drovers Medical Centre (First Floor), 14/1397 Wanneroo Rd, Wanneroo WA 6065' },
    { name: 'Murdoch', address: 'Murdoch Professional Centre, 4/6 Robson Way, Murdoch WA 6150' },
    { name: 'Midland', address: 'North Street Medical Centre, 40 Great Northern Hwy, Midland WA 6056' },
    { name: 'Albany', address: 'Albany & Greater Southern Region, 137 Grey Street West, Albany WA 6330' }
  ];

  return (
    <footer className="border-t border-brand-blue-light/20 bg-gray-100 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-brand-blue-light mb-4">Contact Us</h3>
            <div className="space-y-3 text-brand-blue-light">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-brand-blue-light" />
                <a href="tel:0861179339" className="hover:text-brand-blue-light transition-colors">
                  08 6117 9339
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-brand-blue-light" />
                <a href="mailto:reception@sleeplifeaustralia.com.au" className="hover:text-brand-blue-light transition-colors">
                  reception@sleeplifeaustralia.com.au
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-brand-blue-light mb-4">Our Locations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {locations.map((location) => (
                <div key={location.name} className="flex gap-2 text-brand-blue-light">
                  <MapPin className="h-5 w-5 text-brand-blue-light flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-brand-blue">{location.name}</p>
                    <p className="text-sm">{location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-blue-light/20 text-center text-brand-blue-light text-sm">
          <p>&copy; {new Date().getFullYear()} Sleep Life Australia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
