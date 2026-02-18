import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Sleep Life Australia and how we help diagnose and treat Obstructive Sleep Apnea with personalised treatment plans. Serving Perth, Wanneroo, Murdoch, Midland, and Albany.',
  openGraph: {
    title: 'About Sleep Life Australia',
    description: 'Expert sleep apnea diagnosis and treatment in Perth and Albany. Comprehensive care from assessment to ongoing therapy support.',
    images: ['/chatgpt_image_dec_31,_2025,_12_27_30_pm copy.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <div>
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-blue-light mb-8 text-center">
              About Sleep Life Australia
            </h1>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-brand-blue font-normal leading-relaxed mb-8">
                  Sleep Life Australia helps people move from tired and frustrated to sleeping well again, with clear assessment, personalised treatment, and ongoing support.
                </p>

                <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                  <Image
                    src="/chatgpt_image_dec_31,_2025,_12_27_30_pm copy.png"
                    alt="Person waking up refreshed"
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-lg text-brand-blue font-semibold leading-relaxed mb-6">
                  Sleep Life Australia was built on the belief that effective sleep apnoea care requires ongoing support, not just equipment.
                </p>

                <p className="text-lg text-brand-blue font-normal leading-relaxed mb-6">
                  We diagnose and manage obstructive sleep apnoea, supporting people who are at risk or already diagnosed with practical education, therapy, and care that continues beyond the initial appointment. Sleep apnoea is a common and serious condition, and the right support can make a meaningful difference to your health, energy, and quality of life.
                </p>

                <p className="text-lg text-brand-blue font-normal leading-relaxed mb-6">
                  Your journey usually begins with an at-home sleep study. This simple take-home study is organised and supported by our team and helps us understand what is happening during your sleep, so we can guide the most appropriate treatment for you.
                </p>

                <p className="text-lg text-brand-blue font-normal leading-relaxed mb-8">
                  Our care is delivered by an experienced team of sleep scientists, clinicians, and technicians working together to support you at every stage.
                </p>

                <div className="bg-gradient-to-r from-brand-blue-light/10 to-brand-blue/10 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-brand-blue-light flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-brand-blue-light mb-2">Our Locations</h3>
                      <p className="text-lg text-brand-blue font-normal">
                        You can find Sleep Life Australia in Wanneroo, Murdoch, Midland, and Albany.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
                  <h3 className="text-2xl font-semibold text-brand-blue-light mb-4">Closing call to action</h3>
                  <p className="text-xl font-semibold text-brand-blue mb-6">
                    If you are ready to feel more rested, clearer, and like yourself again, take the next step below.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/quiz">
                      <Button className="bg-brand-blue-light hover:bg-brand-blue text-white font-semibold px-8 py-6 text-lg">
                        Take Our Sleep Quiz
                      </Button>
                    </Link>
                    <Link href="/book">
                      <Button className="bg-brand-blue hover:bg-brand-blue-light text-white font-semibold px-8 py-6 text-lg">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
