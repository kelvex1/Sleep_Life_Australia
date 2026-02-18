'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, FileText, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-brand-blue" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-brand-blue mb-3 sm:mb-4">Privacy Policy</h1>
            <p className="text-brand-blue-light text-base sm:text-lg font-medium max-w-2xl mx-auto">
              Your privacy and the security of your personal information are of utmost importance to us
            </p>
            <p className="text-brand-blue-light text-sm sm:text-base mt-2">
              Last Updated: December 4, 2025
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-2">Introduction</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-brand-blue-light font-medium leading-relaxed">
                      Sleep Life Australia is committed to protecting your privacy and handling your personal and health information in accordance with the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs). This Privacy Policy explains how we collect, use, store, and protect your information when you use our services or interact with our website.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Information We Collect</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-brand-blue-light space-y-1 ml-2 font-medium">
                    <li>Name, date of birth, and contact details (phone, email, address)</li>
                    <li>Medicare and health insurance information</li>
                    <li>Emergency contact information</li>
                    <li>Demographic information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-2">Health Information</h3>
                  <ul className="list-disc list-inside text-brand-blue-light space-y-1 ml-2 font-medium">
                    <li>Medical history and current health conditions</li>
                    <li>Sleep study results and diagnostic data</li>
                    <li>CPAP therapy records and equipment information</li>
                    <li>Treatment plans and progress notes</li>
                    <li>Doctor referrals and medical reports</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-2">Website Usage Information</h3>
                  <ul className="list-disc list-inside text-brand-blue-light space-y-1 ml-2 font-medium">
                    <li>IP address and browser information</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referral source and navigation patterns</li>
                    <li>Chat interactions with our virtual assistant (Voiceflow)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">How We Use Your Information</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-brand-blue-light space-y-2 font-medium">
                  <p>We collect and use your information for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Providing sleep study services and CPAP therapy</li>
                    <li>Processing appointment bookings and managing your care</li>
                    <li>Communicating with you about your treatment and appointments</li>
                    <li>Billing and insurance claims processing</li>
                    <li>Sharing information with your referring doctor or other healthcare providers involved in your care</li>
                    <li>Improving our services and website functionality</li>
                    <li>Complying with legal and regulatory requirements</li>
                    <li>Quality assurance and clinical audits</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Information Sharing and Disclosure</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-brand-blue-light space-y-2 font-medium">
                  <p>We may share your information with:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Your referring doctor or expert</li>
                    <li>Other healthcare providers involved in your care</li>
                    <li>Medicare Australia and private health insurers for billing purposes</li>
                    <li>Third-party service providers who assist us in delivering our services (under strict confidentiality agreements)</li>
                    <li>Government agencies or regulatory bodies when required by law</li>
                  </ul>
                  <p className="mt-3">
                    We will only disclose your information with your consent or as required or authorized by law. We do not sell your personal information to third parties.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Cookies and Tracking Technologies</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-brand-blue-light space-y-2 font-medium">
                  <p>Our website uses cookies and similar technologies to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and user behavior</li>
                    <li>Improve website functionality and user experience</li>
                    <li>Enable chat functionality through our Voiceflow integration</li>
                  </ul>
                  <p className="mt-3">
                    You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Data Security</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-brand-blue-light space-y-2 font-medium">
                  <p>
                    We take the security of your information seriously and implement appropriate technical and organizational measures to protect it from unauthorized access, disclosure, alteration, or destruction. These measures include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Secure storage of physical and electronic records</li>
                    <li>Access controls and authentication procedures</li>
                    <li>Regular security assessments and updates</li>
                    <li>Staff training on privacy and confidentiality</li>
                    <li>Encryption of sensitive data during transmission</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Your Rights</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-brand-blue-light space-y-2 font-medium">
                  <p>Under the Australian Privacy Act, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Access your personal and health information</li>
                    <li>Request corrections to inaccurate or incomplete information</li>
                    <li>Request a copy of your medical records</li>
                    <li>Withdraw consent for certain uses of your information</li>
                    <li>Make a complaint about our handling of your information</li>
                  </ul>
                  <p className="mt-3">
                    To exercise any of these rights or for questions about your information, please contact us using the details provided below.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Data Retention</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-brand-blue-light space-y-2 font-medium">
                  <p>
                    We retain your personal and health information for as long as necessary to fulfill the purposes outlined in this policy and as required by Australian healthcare regulations. Medical records are typically retained for a minimum of 7 years from the date of your last consultation, or longer if required by law.
                  </p>
                  <p>
                    Once the retention period expires, we will securely dispose of your information in accordance with our record management procedures.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Contact Us</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-brand-blue-light space-y-3 font-medium">
                  <p>
                    If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border-2 border-brand-blue-light/30 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-brand-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-brand-blue">Address</p>
                        <p className="text-brand-blue-light">14/1397 Wanneroo Rd, Wanneroo WA 6065</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-brand-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-brand-blue">Phone</p>
                        <a href="tel:0861179339" className="text-brand-blue hover:text-brand-blue-dark transition-colors">
                          08 6117 9339
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-brand-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-brand-blue">Email (Privacy Inquiries)</p>
                        <a href="mailto:reception@sleeplifeaustralia.com.au" className="text-brand-blue hover:text-brand-blue-dark transition-colors">
                          reception@sleeplifeaustralia.com.au
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-blue-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue" />
                  </div>
                  <div className="w-full">
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Changes to This Policy</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-brand-blue-light space-y-2 font-medium">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy on our website with a new &quot;Last Updated&quot; date. We encourage you to review this policy periodically to stay informed about how we protect your information.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-50 rounded-lg p-6 sm:p-8 border-2 border-brand-blue-light/30 text-center">
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-brand-blue mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-brand-blue mb-2">Your Privacy Matters</h3>
              <p className="text-brand-blue-light font-medium max-w-2xl mx-auto">
                At Sleep Life Australia, we are committed to maintaining the highest standards of privacy and confidentiality. Your trust is essential to us, and we work diligently to protect your personal and health information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
