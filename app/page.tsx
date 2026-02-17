'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Home, Waves, Clock, Calendar, Users, ArrowRight, Stethoscope, MessageCircle, Volume2, HelpCircle, Heart, ClipboardList } from 'lucide-react';

const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground').then(mod => ({ default: mod.AnimatedBackground })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
});

export default function HomePage() {
  const services = [
    {
      icon: Home,
      title: 'At-Home Sleep Studies',
      description: 'Sleep studies conducted in the comfort of your own home. Professional equipment and expert analysis.',
      features: ['Sleep in your own bed', 'Medicare-recognised testing', 'Clear, comprehensive reports']
    },
    {
      icon: Waves,
      title: 'CPAP Therapy & Support',
      description: 'Personalised CPAP therapy with expert fitting, education, and ongoing support.',
      features: ['Individualised equipment selection', 'Expert mask fitting and education', 'Ongoing care and follow-up support']
    },
    {
      icon: Activity,
      title: 'Sleep Consultations',
      description: 'Comprehensive sleep health assessments with experienced clinicians to identify sleep concerns and guide appropriate treatment.',
      features: ['Thorough clinical assessment', 'Personalised care plans', 'Ongoing follow-up and support']
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Fast Appointments',
      description: 'Get timely access to sleep studies and consultations, without long waiting times.'
    },
    {
      icon: Calendar,
      title: 'Easy Online Booking',
      description: 'Book your appointment online anytime, with clear next steps and local support when you need it.'
    },
    {
      icon: Users,
      title: 'A Dedicated Clinical Team',
      description: 'Our experienced sleep scientists, clinicians, and technicians work together to support your care, from diagnosis through to ongoing management.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <section className="relative bg-transparent min-h-screen flex items-center pt-24 md:pt-28">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            <div className="text-left space-y-6 lg:space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-blue-light leading-tight">
                We make you better in bed
              </h1>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-brand-blue-light leading-relaxed">
                Sleep well, live well with the support of Perth's sleep apnoea experts.
              </h2>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-semibold text-brand-blue mb-3">Sleep Apnoea can be exhausting:</h3>
                <p className="text-base sm:text-lg text-brand-blue-light leading-relaxed">
                  From your first assessment through to education and ongoing personalised support, we help you manage sleep apnoea so you can feel rested, clearer, and back to feeling like you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/book">
                  <Button
                    size="lg"
                    className="bg-brand-blue-light hover:bg-brand-blue text-white font-semibold text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Book Appointment
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-brand-blue-light text-brand-blue-light hover:bg-brand-blue-light hover:text-white font-semibold text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Take Sleep Quiz
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/chatgpt_image_dec_31,_2025,_12_27_30_pm.png"
                alt="Sleep well with Sleep Life Australia"
                fill
                className="object-cover opacity-70"
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-brand-blue-light to-brand-blue rounded-2xl p-8 shadow-2xl border-2 border-brand-blue-light hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ClipboardList className="w-10 h-10 text-brand-blue-light" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Not Sure If You Have Sleep Apnoea?</h3>
                  <p className="text-white/90 text-lg mb-4">Take our quick 60 second assessment to find out your risk level</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                      5 simple questions
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                      Instant results
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                      Completely anonymous
                    </span>
                  </div>
                </div>
                <Link href="/quiz">
                  <Button
                    size="lg"
                    className="bg-white hover:bg-gray-50 text-brand-blue-light font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-h-[56px] touch-manipulation"
                  >
                    Take Sleep Quiz
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-blue mb-4">Your Journey to Better Sleep</h2>
            <p className="text-lg sm:text-xl text-brand-blue-light max-w-2xl mx-auto px-4">
              Follow our simple 3-step process to transform your sleep and improve your quality of life
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              <div className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand-blue-light rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md">
                  1
                </div>
                <div className="mt-6 text-center flex flex-col h-full">
                  <div className="w-16 h-16 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-brand-blue-light" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-3">Visit Your GP</h3>
                  <p className="text-sm text-brand-blue-light leading-relaxed mb-4 flex-grow">Discuss your sleep concerns with your GP and request a referral. Ask your GP to send the referral directly to us (<a href="mailto:reception@sleeplifeaustralia.com.au" className="text-brand-blue hover:underline">reception@sleeplifeaustralia.com.au</a>), or download the form to take with you.</p>
                  <a href="/referral_(1).pdf" download>
                    <Button
                      size="sm"
                      className="bg-brand-blue-light hover:bg-brand-blue text-white font-semibold w-full min-h-[44px] touch-manipulation"
                    >
                      Download GP Referral Form
                    </Button>
                  </a>
                </div>
              </div>

              <div className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand-blue-light rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md">
                  2
                </div>
                <div className="mt-6 text-center flex flex-col h-full">
                  <div className="w-16 h-16 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-brand-blue-light" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-3">Upload Your Referral</h3>
                  <p className="text-sm text-brand-blue-light leading-relaxed mb-4 flex-grow">Already have a completed referral? Upload it here and our team will be in touch within 7 days to organise your sleep test.</p>
                  <Link href="/referral">
                    <Button
                      size="sm"
                      className="bg-brand-blue-light hover:bg-brand-blue text-white font-semibold w-full min-h-[44px] touch-manipulation"
                    >
                      Upload Referral
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand-blue-light rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md">
                  3
                </div>
                <div className="mt-6 text-center flex flex-col h-full">
                  <div className="w-16 h-16 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-brand-blue-light" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-3">Book Your Sleep Test</h3>
                  <p className="text-sm text-brand-blue-light leading-relaxed mb-4 flex-grow">Ready to move forward? Book your sleep test online now at a time that suits you.</p>
                  <Link href="/book">
                    <Button
                      size="sm"
                      className="bg-brand-blue-light hover:bg-brand-blue text-white font-semibold w-full min-h-[44px] touch-manipulation"
                    >
                      Book Sleep Test Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="chat-katie" className="relative py-24 px-6 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue-light bg-white mb-6">
              <Heart className="w-4 h-4 text-brand-blue-light" />
              <span className="text-brand-blue-light text-sm font-medium tracking-wide uppercase">Meet Your Sleep Expert</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-brand-blue mb-4">
              Talk to Katie, Our AI Sleep Expert
            </h2>
            <p className="text-xl text-brand-blue-light max-w-3xl mx-auto mb-8 leading-relaxed">
              Get instant answers about Sleep Life Australia services, sleep therapy options, and sleep studies. Katie is here to guide you through your sleep health journey.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="grid lg:grid-cols-3 gap-0">
              <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
                <Image
                  src="/Sleep_Life_Australia_-_Home_page.png"
                  alt="Person waking up refreshed and stretching in bed"
                  fill
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
              </div>

              <div className="p-8 lg:p-10 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-brand-blue-light rounded-full flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-blue">Katie is Ready to Help</h3>
                    <p className="text-sm text-brand-blue-light">Available 24/7 for your questions</p>
                  </div>
                </div>

                <p className="text-brand-blue-light mb-5 leading-relaxed">
                  Katie can answer your questions about Sleep Life Australia, sleep therapy treatments, and sleep studies. She speaks to you with clear audio guidance, making it easy to get information while multitasking.
                </p>

                <div className="bg-blue-100 rounded-lg p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Volume2 className="w-5 h-5 text-brand-blue-light mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-brand-blue font-semibold mb-1">
                        Voice & Text Options Available
                      </p>
                      <p className="text-xs text-brand-blue-light">
                        Katie speaks her responses out loud, perfect for hands-free browsing. Prefer to read? Simply hit the mute button.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-brand-blue-light hover:bg-brand-blue active:scale-95 text-white font-semibold px-8 py-6 shadow-md transition-all duration-300 hover:shadow-lg w-full touch-manipulation mb-3"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).voiceflow?.chat?.open) {
                      (window as any).voiceflow.chat.open();
                    }
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chat with Katie
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-xs text-brand-blue-light text-center">
                  Or click <span className="font-semibold text-brand-blue-light">&quot;Chat with Katie&quot;</span> at the bottom right
                </p>
              </div>

              <div className="p-8 lg:p-10 bg-blue-100 border-l flex flex-col justify-center">
                <h4 className="text-lg font-semibold text-brand-blue mb-5">Katie Can Help You With:</h4>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-brand-blue text-sm mb-1">Sleep Life Services</h5>
                        <p className="text-xs text-brand-blue-light leading-relaxed">Learn about our locations, testing procedures, and how to get started</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-brand-blue text-sm mb-1">Sleep Therapy Options</h5>
                        <p className="text-xs text-brand-blue-light leading-relaxed">Discover CPAP therapy, masks, and ongoing support options</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-brand-blue text-sm mb-1">Sleep Studies & FAQs</h5>
                        <p className="text-xs text-brand-blue-light leading-relaxed">Get answers about sleep studies, results, and what to expect</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-brand-blue text-sm mb-1">Booking & Referrals</h5>
                        <p className="text-xs text-brand-blue-light leading-relaxed">Find out how to book appointments and manage referrals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sleep-studies" className="relative py-24 px-6 bg-white scroll-mt-24">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-brand-blue mb-4">Our Services</h2>
            <p className="text-xl text-brand-blue-light max-w-2xl mx-auto leading-relaxed">
              Comprehensive sleep health care combining clinical expertise, proven technology, and ongoing support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={service.title} className="bg-white border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden rounded-2xl">
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {index === 0 && (
                    <>
                      <Image
                        src="/cpap_machine copy.jpg"
                        alt="At-Home Sleep Studies"
                        fill
                        className="object-cover"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <Image
                        src="/support.jpg"
                        alt="CPAP Therapy & Support"
                        fill
                        className="object-cover"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <Image
                        src="https://images.pexels.com/photos/7108319/pexels-photo-7108319.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Sleep Consultations"
                        fill
                        className="object-cover"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
                    </>
                  )}
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg z-10">
                    <service.icon className="h-8 w-8 text-brand-blue-light" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-brand-blue">{service.title}</CardTitle>
                  <CardDescription className="text-brand-blue-light text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-brand-blue-light">
                        <div className="w-1.5 h-1.5 bg-brand-blue-light rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cpap-therapy" className="relative py-24 px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-brand-blue mb-4">Why Choose Sleep Life Australia?</h2>
            <p className="text-xl text-brand-blue-light leading-relaxed">We don't just test and treat sleep apnoea. We support you with clear guidance, practical education, and ongoing care at every step.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-20 h-20 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-10 w-10 text-brand-blue-light" />
                </div>
                <h3 className="text-2xl font-semibold text-brand-blue mb-2">{benefit.title}</h3>
                <p className="text-brand-blue-light leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="relative py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-brand-blue mb-4">What Our Patients Say</h2>
            <p className="text-xl text-brand-blue-light max-w-2xl mx-auto leading-relaxed">
              Real experiences from patients who have transformed their sleep health with Sleep Life Australia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-brand-blue-light mb-6 leading-relaxed">
                &quot;The team at Sleep Life Australia completely changed my life. After struggling with sleep apnea for years, their professional approach and cutting-edge equipment helped me finally get the rest I needed. Highly recommend!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-blue-light/30 flex items-center justify-center">
                  <span className="text-brand-blue-light font-bold text-lg">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-brand-blue">John D.</p>
                  <p className="text-sm text-brand-blue-light">Google Review</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-brand-blue-light mb-6 leading-relaxed">
                &quot;Exceptional service from start to finish. The at-home sleep study was so convenient, and the staff were incredibly knowledgeable and caring. My CPAP therapy has been life-changing. Thank you Sleep Life!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-blue-light/30 flex items-center justify-center">
                  <span className="text-brand-blue-light font-bold text-lg">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-brand-blue">Sarah M.</p>
                  <p className="text-sm text-brand-blue-light">Google Review</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-brand-blue-light mb-6 leading-relaxed">
                &quot;Professional, caring, and thorough. The team took the time to explain everything and made sure I was comfortable throughout the entire process. My sleep quality has improved dramatically. Five stars!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-blue-light/30 flex items-center justify-center">
                  <span className="text-brand-blue-light font-bold text-lg">RT</span>
                </div>
                <div>
                  <p className="font-semibold text-brand-blue">Robert T.</p>
                  <p className="text-sm text-brand-blue-light">Google Review</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-brand-blue-light font-semibold">
              Google Reviews
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6 bg-blue-50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-12 border border-brand-blue-light/30 shadow-xl">
            <h2 className="text-4xl font-bold text-brand-blue mb-4">Ready to Improve Your Sleep?</h2>
            <p className="text-xl text-brand-blue-light mb-8">
              Book your appointment today and take the first step towards better sleep health
            </p>
            <Link href="/book">
              <Button size="lg" className="bg-brand-blue-light hover:bg-brand-blue active:scale-95 text-white font-semibold text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-6 touch-manipulation">
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
