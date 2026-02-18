'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Clock, Activity, RefreshCw, FileText, Calendar, CreditCard, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FAQPage() {
  const faqs = [
    {
      icon: Clock,
      number: 1,
      question: 'How long do I need to wear the device?',
      answer: (
        <div className="space-y-3">
          <p>Your device is set to record for 12 hours based on your usual bedtime. This is to meet criteria set by Medicare.</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Example: If you normally go to bed at 10:00 pm, it will record from 10:00 pm to 10:00 am.</li>
            <li>Please put the device on by the bedtime that has been agreed with your sleep technician so we capture the full night.</li>
            <li>If you wake early (say 6:00 am) and won&apos;t go back to sleep, you can take it off.</li>
            <li>If you wake in the middle of the night, please keep it on and try to settle back to sleep. That part of the night is important too.</li>
          </ul>
        </div>
      )
    },
    {
      icon: Activity,
      number: 2,
      question: 'What does the device record?',
      answer: (
        <div className="space-y-3">
          <p>The device collects information about:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Heart rate (pulse)</li>
            <li>Oxygen levels</li>
            <li>Sleep stages (brain activity and eye movements)</li>
            <li>Limb movements</li>
            <li>Body position</li>
            <li>Snoring volume</li>
            <li>Breathing patterns</li>
          </ul>
          <p className="font-medium">By combining this information, we can build a detailed picture of your sleep.</p>
        </div>
      )
    },
    {
      icon: RefreshCw,
      number: 3,
      question: 'Why do I need to return the kit by 9:30 am?',
      answer: (
        <div className="space-y-3">
          <p>We run many studies every day, and our kits are limited. Returning yours on time allows us to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Download and check your data</li>
            <li>Clean and sanitise the kit</li>
            <li>Prepare it for the next patient later that day</li>
          </ul>
          <p className="font-medium">A late return delays the process and can affect the next patient&apos;s care. Your effort to bring it back by 9:30 am sharp really helps both us and the next person waiting.</p>
        </div>
      )
    },
    {
      icon: Calendar,
      number: 4,
      question: 'How long until my results are ready?',
      answer: (
        <div className="space-y-3">
          <p>On average, results are ready in <strong>about 3 weeks</strong>. Every study is carefully reviewed by <strong>Australian Sleep Physicians</strong>. We don&apos;t use auto-scoring or AI shortcuts. This takes a little longer but ensures your results are accurate and reliable.</p>
        </div>
      )
    },
    {
      icon: FileText,
      number: 5,
      question: 'What happens after the study?',
      answer: (
        <div className="space-y-3">
          <p>Once your data is reviewed, your Sleep Physician will prepare a detailed report. This report will:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Provide a diagnosis (if one is identified)</li>
            <li>Include recommended treatment options</li>
            <li>Outline next steps tailored to your needs</li>
          </ul>
          <p>We will also have made an appointment for you to meet with your Sleep Technician, who will go through your results in detail.</p>
          <p className="font-medium">A copy of your report will also be sent to your referring GP so they can continue your care.</p>
        </div>
      )
    },
    {
      icon: CreditCard,
      number: 6,
      question: 'Does Medicare/private health cover a CPAP trial?',
      answer: (
        <div className="space-y-3">
          <p>Medicare does not cover CPAP trials. Some private health funds may contribute, depending on your extras cover, although this is uncommon.</p>
          <p>Most private health funds do cover the purchase of a CPAP device. Please check with your provider, as every policy is different.</p>
          <p className="font-medium">We can provide item numbers and documentation to help you confirm your level of cover.</p>
        </div>
      )
    },
    {
      icon: Package,
      number: 7,
      question: 'I need a new mask/part - I have a machine',
      answer: (
        <div className="space-y-3">
          <p>We supply a wide range of CPAP equipment from all major brands. This includes:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Full face masks, nasal masks, nasal pillow masks</li>
            <li>Replacement cushions, headgear, tubing and water chambers</li>
            <li>Options to upgrade to newer machines or masks for better comfort and performance</li>
          </ul>
          <p className="font-medium">Tell us your brand and model and we will match the correct parts or recommend suitable upgrades.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 pt-20 pb-12 sm:pb-24">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-brand-blue-light bg-white mb-4 sm:mb-6">
            <HelpCircle className="w-4 h-4 text-brand-blue" />
            <span className="text-brand-blue text-xs sm:text-sm font-medium tracking-wide uppercase">Sleep Study Information</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand-blue mb-4 px-4">
            Sleep Study <span className="text-brand-blue">FAQs</span>
          </h1>

          <p className="text-lg sm:text-xl text-brand-blue-light max-w-3xl mx-auto px-4">
            Everything you need to know about your sleep study with Sleep Life Australia
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-white border-brand-blue-light/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-brand-blue-light to-brand-blue text-white pb-4 sm:pb-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white/30">
                    <span className="text-xl sm:text-2xl font-bold">{faq.number}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-2xl text-white flex items-start gap-2 sm:gap-3">
                      <faq.icon className="w-6 h-6 sm:w-7 sm:h-7 mt-0.5 sm:mt-1 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 pb-6 sm:pb-8 px-4 sm:px-6 text-brand-blue-light text-sm sm:text-base leading-relaxed">
                {faq.answer}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-8 sm:mt-12">
          <Card className="bg-gradient-to-br from-brand-blue-light to-brand-blue text-white border-0 shadow-xl">
            <CardContent className="p-6 sm:p-8 text-center">
              <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 px-4">Need More Information?</h3>
              <p className="text-base sm:text-lg mb-4 sm:mb-6 text-white/90 px-4">
                Our team is here to help answer any additional questions you may have.
              </p>
              <a
                href="mailto:reception@sleeplifeaustralia.com.au"
                className="inline-block w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-50 text-brand-blue font-semibold px-4 sm:px-8 py-6 shadow-lg w-full sm:w-auto text-sm sm:text-base"
                >
                  Email: reception@sleeplifeaustralia.com.au
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-semibold px-6 sm:px-8 min-h-[44px] touch-manipulation"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
