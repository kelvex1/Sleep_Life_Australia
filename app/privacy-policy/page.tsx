'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, FileText, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="min-h-screen pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-gray-50">
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
              Last Updated: 22 January 2026
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
                      This Privacy Policy explains how Sleep Life Australia (we, us, our) collects, uses, stores, and protects your personal and health information when you use our services or interact with our website.
                      <br /><br />
                      Sleep Life Australia is committed to managing your information in an open and transparent way and complies with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
                      <br /><br />
                      By attending our clinic, using our services, or accessing our website, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy, subject to your rights set out below.
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
                <p className="text-brand-blue-light font-medium">We collect personal and health information that is reasonably necessary for us to provide our sleep and allied health services.</p>

                <div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-2">Personal Information</h3>
                  <p className="text-brand-blue-light font-medium mb-2">This may include:</p>
                  <ul className="list-disc list-inside text-brand-blue-light space-y-1 ml-2 font-medium">
                    <li>Name, date of birth, and contact details (phone, email, address)</li>
                    <li>Medicare and health insurance information</li>
                    <li>Emergency contact information</li>
                    <li>Demographic information (such as gender and language preferences)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-2">Health Information</h3>
                  <p className="text-brand-blue-light font-medium mb-2">As a provider of health services, we collect health information, which is considered sensitive information under the Privacy Act. This may include:</p>
                  <ul className="list-disc list-inside text-brand-blue-light space-y-1 ml-2 font-medium">
                    <li>Medical history and current health conditions</li>
                    <li>Sleep study results and diagnostic data</li>
                    <li>CPAP therapy records and equipment information</li>
                    <li>Treatment plans and progress notes</li>
                    <li>Doctor referrals and medical reports</li>
                  </ul>
                  <p className="text-brand-blue-light font-medium mt-2">We collect this information directly from you where possible, and also from your referring doctor or other health professionals involved in your care, where you have provided consent or where permitted or required by law.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-blue mb-2">Website Usage Information</h3>
                  <p className="text-brand-blue-light font-medium mb-2">When you visit our website, we may collect:</p>
                  <ul className="list-disc list-inside text-brand-blue-light space-y-1 ml-2 font-medium">
                    <li>IP address and browser information</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referral source and navigation patterns</li>
                    <li>Chat interactions with our virtual assistant (Voiceflow)</li>
                  </ul>
                  <p className="text-brand-blue-light font-medium mt-2">We may also use website analytics tools (for example, Google Analytics or similar services) to help us understand how visitors use our website, using aggregated and de‑identified data wherever practicable.</p>
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
                  <p>We collect, hold, use, and disclose your information only where it is reasonably necessary for our functions and activities, or as otherwise permitted or required by law.</p>
                  <p>We use your personal and health information to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Provide sleep study services, CPAP therapy, and other related health services</li>
                    <li>Process appointment bookings, manage your care, and coordinate your treatment</li>
                    <li>Communicate with you about your treatment, appointments, test results, and follow-up care</li>
                    <li>Process payments, billing, and insurance claims</li>
                    <li>Share information with your referring doctor or other healthcare providers involved in your care</li>
                    <li>Conduct quality assurance, clinical audits, and service improvements</li>
                    <li>Maintain business records and comply with legal and regulatory obligations</li>
                  </ul>
                  <p className="mt-3">We collect and use your health information with your explicit or implied consent, or as otherwise authorised or required by law.</p>
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
                  <p>We may disclose your personal and health information to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Your referring doctor or specialist</li>
                    <li>Other healthcare providers involved in your care (for example, general practitioners, specialists, allied health providers, or hospitals)</li>
                    <li>Medicare Australia and private health insurers for billing and rebate purposes</li>
                    <li>Third-party service providers who assist us in delivering our services (such as IT providers, practice management systems, and secure messaging services), who are subject to strict confidentiality and security obligations</li>
                    <li>Government agencies, regulators, or law enforcement bodies where required or authorised by law</li>
                  </ul>
                  <p className="mt-3">
                    We will only disclose your information with your consent, or where such disclosure is required or authorised by law, including in situations involving serious threats to life, health, or safety.
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
                    <CardTitle className="text-xl sm:text-2xl text-brand-blue mb-3">Overseas Disclosure</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-brand-blue-light space-y-2 font-medium">
                  <p>
                    We do not routinely disclose personal or health information to overseas recipients. If this changes, we will update this Privacy Policy and take reasonable steps to ensure any overseas recipients protect your information in accordance with the APPs.
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
                    You can control or disable cookies through your browser settings. However, disabling cookies may affect the functionality of our website. Some cookies may be provided by third-party analytics providers, and these parties may use the information collected to provide their services to us.
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
                    We take reasonable steps to protect your personal and health information from misuse, interference, loss, and from unauthorised access, modification, or disclosure, as required by APP 11. These measures include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Secure storage of physical and electronic records</li>
                    <li>Role-based access controls and authentication procedures</li>
                    <li>Use of secure practice management and data storage systems</li>
                    <li>Regular security assessments, updates, and backup procedures</li>
                    <li>Staff training on privacy, confidentiality, and information security</li>
                    <li>Encryption of sensitive data during transmission where reasonably practicable</li>
                  </ul>
                  <p className="mt-3">
                    Where we use third-party service providers to store or process information (including cloud services), we take reasonable steps to ensure that they apply appropriate privacy and security safeguards.
                  </p>
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
                  <p>Under the Privacy Act and the APPs, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Access your personal and health information that we hold, subject to some exceptions allowed by law</li>
                    <li>Request corrections to information that you believe is inaccurate, out-of-date, incomplete, irrelevant, or misleading</li>
                    <li>Request a copy of your medical records (which may be subject to reasonable administrative fees)</li>
                    <li>Withdraw or vary your consent to certain uses or disclosures of your information, where it is lawful and practicable to do so</li>
                    <li>Make a complaint if you believe your privacy has been breached</li>
                  </ul>

                  <div className="mt-4">
                    <h4 className="font-semibold text-brand-blue mb-2">Access and Correction</h4>
                    <p>
                      You may request access to, or correction of, your personal or health information by contacting us using the details below. We may need to verify your identity before providing access or making corrections.
                    </p>
                    <p className="mt-2">
                      In some cases, we may refuse access or correction where permitted or required by law. If this occurs, we will give you a written explanation and advise you of your options.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-brand-blue mb-2">Privacy Complaints</h4>
                    <p>
                      If you have concerns about how we have handled your personal or health information, or believe we have breached the APPs, you can contact us using the details below. We may ask you to put your complaint in writing.
                    </p>
                    <p className="mt-2">We will:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>Acknowledge receipt of your complaint</li>
                      <li>Investigate your concerns</li>
                      <li>Respond to you within a reasonable time, usually within 30 days</li>
                    </ul>
                    <p className="mt-2">
                      If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC):
                    </p>
                    <ul className="list-none ml-2 mt-2 space-y-1">
                      <li><strong>Website:</strong> www.oaic.gov.au</li>
                      <li><strong>Phone:</strong> 1300 363 992</li>
                      <li><strong>Post:</strong> GPO Box 5218, Sydney NSW 2001</li>
                    </ul>
                  </div>
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
                    We retain your personal and health information for as long as is necessary to fulfil the purposes outlined in this Privacy Policy and as required by Australian healthcare and record-keeping laws.
                  </p>
                  <p>
                    Medical records are typically retained for a minimum of 7 years from the date of your last consultation, or longer if required by law (for example, for minors, records may be kept until a set period after they turn 18).
                  </p>
                  <p>
                    When we no longer need your information for any permitted purpose, and we are not required by law to retain it, we will take reasonable steps to securely destroy or de-identify the information in accordance with our record management procedures.
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
                        <p className="font-semibold text-brand-blue">Mailing Address</p>
                        <p className="text-brand-blue-light">Sleep Life Australia</p>
                        <p className="text-brand-blue-light">14/1397 Wanneroo Rd</p>
                        <p className="text-brand-blue-light">Wanneroo WA 6065</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-brand-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-brand-blue">Phone</p>
                        <a href="tel:0861179339" className="text-brand-blue hover:text-brand-blue-dark transition-colors">
                          (08) 6117 9339
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
                        <p className="text-sm text-brand-blue-light mt-1 italic">Please mark your correspondence &quot;Attention: Privacy Officer&quot;</p>
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
                    We may update or amend this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or technology. When we make significant changes, we will update the &quot;Last Updated&quot; date at the top of this policy and may also notify you through our website or by other reasonable means.
                  </p>
                  <p>
                    You are encouraged to review this Privacy Policy periodically to stay informed about how we protect your information.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-50 rounded-lg p-6 sm:p-8 border-2 border-brand-blue-light/30 text-center">
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-brand-blue mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-brand-blue mb-2">Your Privacy Matters</h3>
              <p className="text-brand-blue-light font-medium max-w-2xl mx-auto">
                At Sleep Life Australia, we are committed to maintaining high standards of privacy and confidentiality. Your trust is essential to us, and we work diligently to protect your personal and health information at all times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
