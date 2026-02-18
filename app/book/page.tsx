'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck as CheckCircle2, MapPin, Phone, Hash, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@supabase/supabase-js';
import SignaturePad from '@/components/SignaturePad';

const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

type BookingStep = 'referral-number' | 'patient-info' | 'review-submit' | 'location' | 'complete';

type Location = {
  id: string;
  name: string;
  address: string;
  hasOnlineBooking: boolean;
  calendarUrl: string;
};

const LOCATIONS: Location[] = [
  {
    id: 'wanneroo',
    name: 'Wanneroo',
    address: 'Drovers Medical Centre (First Floor), 14/1397 Wanneroo Rd, Wanneroo WA 6065',
    hasOnlineBooking: true,
    calendarUrl: 'https://calendar.app.google/YCqa4GBwU1VgYPRv5',
  },
  {
    id: 'murdoch',
    name: 'Murdoch',
    address: 'Murdoch Professional Centre, 4/6 Robson Way, Murdoch WA 6150',
    hasOnlineBooking: true,
    calendarUrl: 'https://calendar.app.google/B8Z6fgwuENBfAzr86',
  },
  {
    id: 'midland',
    name: 'Midland',
    address: 'North Street Medical Centre, 40 Great Northern Hwy, Midland WA 6056',
    hasOnlineBooking: true,
    calendarUrl: 'https://calendar.app.google/vjXymA6eiCPqLfEP7',
  },
  {
    id: 'albany',
    name: 'Albany',
    address: 'Albany & Greater Southern Region, 137 Grey Street West, Albany WA 6330',
    hasOnlineBooking: true,
    calendarUrl: 'https://calendar.app.google/pFJkJDahAbaxry599',
  },
];

export default function BookPage() {
  const [step, setStep] = useState<BookingStep>('referral-number');
  const [referralNumber, setReferralNumber] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [gpSignature, setGpSignature] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [bookingReferenceNumber, setBookingReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReferralNumberSubmit = () => {
    setError('');
    setStep('patient-info');
  };

  const handlePatientInfoSubmit = () => {
    if (!patientName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!patientEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!patientPhone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    setError('');
    setStep('review-submit');
  };

  const handleReviewSubmit = () => {
    setError('');
    setStep('location');
  };

  const handleLocationSelect = async (location: Location) => {
    setSelectedLocation(location);
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setError('Unable to connect to database. Please try again later.');
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase.rpc('generate_booking_reference');

      if (dbError) {
        console.error('Error generating booking reference:', dbError);
        setError('Failed to generate booking reference. Please try again.');
        setLoading(false);
        return;
      }

      const generatedReference = data as string;
      setBookingReferenceNumber(generatedReference);

      const { error: insertError } = await supabase
        .from('appointment_bookings')
        .insert({
          referral_number: referralNumber || null,
          booking_reference_number: generatedReference,
          clinic_location: location.name,
          patient_name: patientName,
          patient_email: patientEmail,
          patient_phone: patientPhone,
          booking_status: 'pending',
          google_calendar_booked: false,
        });

      if (insertError) {
        console.error('Error saving booking:', insertError);
        setError('Failed to save booking. Please try again.');
        setLoading(false);
        return;
      }

      window.open(location.calendarUrl, '_blank');

      setTimeout(() => {
        setLoading(false);
        setStep('complete');
      }, 500);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (step === 'referral-number') {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white border-slate-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Hash className="h-8 w-8 sm:h-10 sm:w-10 text-brand-blue" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-brand-blue mb-2 px-2">Book Your Sleep Study</CardTitle>
              <CardDescription className="text-brand-blue-light text-base sm:text-lg font-medium px-2">
                Enter your referral number if you have one, or continue to book your appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative border border-brand-blue-light/30 rounded-lg overflow-hidden min-h-[120px] flex items-center justify-center">
                <div className="absolute inset-0 opacity-30">
                  <Image
                    src="/cpap_machine.jpg"
                    alt="CPAP Machine"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/90 via-white/85 to-gray-50/90"></div>
                <p className="relative z-10 text-brand-blue text-sm sm:text-base font-bold p-4">
                  By submitting this form, I consent to Sleep Life Australia collecting and using my personal and health information as described in the{' '}
                  <Link href="/privacy-policy" className="text-brand-blue hover:text-brand-blue-dark underline font-bold">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="referral-number" className="text-brand-blue font-semibold text-base">
                    Referral Number <span className="text-brand-blue-light text-sm">(Optional)</span>
                  </Label>
                  <Input
                    id="referral-number"
                    type="text"
                    placeholder="Enter your referral number (optional)"
                    value={referralNumber}
                    onChange={(e) => setReferralNumber(e.target.value)}
                    className="mt-2 h-12 text-base border-2 border-slate-300 focus:border-brand-blue"
                  />
                </div>

                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-800 font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Alert className="bg-gray-50 border-brand-blue-light/30">
                <Phone className="h-4 w-4 text-brand-blue" />
                <AlertDescription className="text-brand-blue-light font-medium">
                  If you need any assistance, please call us on{' '}
                  <a
                    href="tel:0861179339"
                    className="text-brand-blue hover:text-brand-blue-dark font-bold underline"
                  >
                    08 6117 9339
                  </a>
                </AlertDescription>
              </Alert>

              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={handleReferralNumberSubmit}
                  className="w-full bg-brand-blue hover:bg-brand-blue-dark active:scale-95 text-white font-semibold h-auto py-5 sm:py-6 text-base touch-manipulation"
                >
                  Continue to Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'patient-info') {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white border-slate-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-brand-blue" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-brand-blue mb-2 px-2">Patient Information</CardTitle>
              <CardDescription className="text-brand-blue-light text-base sm:text-lg font-medium px-2">
                Please provide your contact details for the appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patient-name" className="text-brand-blue font-semibold text-base">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patient-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="mt-2 h-12 text-base border-2 border-slate-300 focus:border-brand-blue"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="patient-email" className="text-brand-blue font-semibold text-base">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patient-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="mt-2 h-12 text-base border-2 border-slate-300 focus:border-brand-blue"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="patient-phone" className="text-brand-blue font-semibold text-base">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patient-phone"
                    type="tel"
                    placeholder="04XX XXX XXX"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="mt-2 h-12 text-base border-2 border-slate-300 focus:border-brand-blue"
                    required
                  />
                </div>

                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-800 font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex gap-3 sm:gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('referral-number')}
                  className="border-2 border-slate-300 text-brand-blue-light hover:bg-slate-50 flex-1"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handlePatientInfoSubmit}
                  className="bg-brand-blue hover:bg-brand-blue-dark active:scale-95 text-white font-semibold flex-1 h-auto py-3 text-base touch-manipulation"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'review-submit') {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white border-slate-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-brand-blue" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-brand-blue mb-2 px-2">Review & Submit</CardTitle>
              <CardDescription className="text-brand-blue-light text-base sm:text-lg font-medium px-2">
                Please review your information to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-brand-blue mb-4">Booking Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {referralNumber && (
                    <div>
                      <Label className="text-brand-blue-light text-sm">Referral Number</Label>
                      <p className="text-brand-blue font-semibold mt-1">{referralNumber}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-brand-blue-light text-sm">Patient Name</Label>
                    <p className="text-brand-blue font-semibold mt-1">{patientName}</p>
                  </div>

                  <div>
                    <Label className="text-brand-blue-light text-sm">Email Address</Label>
                    <p className="text-brand-blue font-semibold mt-1">{patientEmail}</p>
                  </div>

                  <div>
                    <Label className="text-brand-blue-light text-sm">Phone Number</Label>
                    <p className="text-brand-blue font-semibold mt-1">{patientPhone}</p>
                  </div>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800 font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="bg-gray-50 border-brand-blue-light/30">
                <AlertDescription className="text-brand-blue-light font-medium">
                  Please review your information carefully before continuing. By proceeding, you confirm that all information provided is accurate.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 sm:gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('patient-info')}
                  className="border-2 border-slate-300 text-brand-blue-light hover:bg-slate-50 flex-1"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handleReviewSubmit}
                  className="bg-brand-blue hover:bg-brand-blue-dark active:scale-95 text-white font-semibold flex-1 h-auto py-3 text-base touch-manipulation"
                >
                  Continue to Location
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'location') {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue-light/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-brand-blue" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-blue mb-2">Choose Your Clinic Location</h1>
            <p className="text-brand-blue-light text-base sm:text-lg font-medium">
              Select the clinic location where you&apos;d like to book your sleep study
            </p>
          </div>

          {error && (
            <Alert className="bg-red-50 border-red-200 mb-6 max-w-4xl mx-auto">
              <AlertDescription className="text-red-800 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {LOCATIONS.map((location) => (
              <Card
                key={location.id}
                className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => !loading && handleLocationSelect(location)}
              >
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl text-brand-blue group-hover:text-brand-blue-dark transition-colors flex items-center gap-2">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-brand-blue-light text-sm sm:text-base font-medium leading-relaxed">
                    {location.address}
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 font-semibold text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Online booking available
                    </p>
                  </div>

                  <Button
                    className="w-full bg-brand-blue hover:bg-brand-blue-dark active:scale-95 text-white font-semibold touch-manipulation"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Select ${location.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setStep('review-submit')}
              className="border-2 border-slate-300 text-brand-blue-light hover:bg-slate-50"
              disabled={loading}
            >
              Back to Review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white border-slate-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-brand-blue mb-2 px-2">
                Booking Initiated Successfully!
              </CardTitle>
              <CardDescription className="text-brand-blue-light text-base sm:text-lg font-medium px-2">
                {selectedLocation?.name && (
                  <span className="block mb-2">Selected location: <strong>{selectedLocation.name}</strong></span>
                )}
                The booking calendar has been opened in a new tab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-brand-blue-light/50">
                <h3 className="text-xl font-bold text-brand-blue mb-3 flex items-center gap-2">
                  <Hash className="h-6 w-6" />
                  Your Booking Reference Number
                </h3>
                <div className="bg-white rounded-lg p-4 border-2 border-brand-blue">
                  <p className="text-3xl sm:text-4xl font-bold text-center text-brand-blue tracking-wider">
                    {bookingReferenceNumber}
                  </p>
                </div>
                <p className="text-brand-blue-light font-medium mt-3 text-sm">
                  Please save this reference number for your records. You can use it to track or modify your booking.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border-2 border-brand-blue-light/30">
                <h3 className="text-xl font-semibold text-brand-blue mb-4">Next Steps</h3>
                <div className="space-y-3 text-brand-blue-light font-medium">
                  <p>1. Use the booking calendar to select your preferred appointment time</p>
                  <p>2. Complete your booking through the Google Calendar interface</p>
                  <p>3. You will receive a confirmation email with all appointment details</p>
                  <p>4. Keep your booking reference number ({bookingReferenceNumber}) for future reference</p>
                </div>
              </div>

              <Alert className="bg-gray-50 border-brand-blue-light/30">
                <AlertDescription className="text-brand-blue-light font-medium">
                  If the calendar didn&apos;t open automatically, you can click the button below to open it manually.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  onClick={() => selectedLocation && window.open(selectedLocation.calendarUrl, '_blank')}
                  className="bg-brand-blue hover:bg-brand-blue-dark active:scale-95 text-white font-semibold flex-1 py-5 sm:py-6 text-sm sm:text-base touch-manipulation"
                >
                  Open Booking Calendar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="border-2 border-brand-blue text-brand-blue hover:bg-gray-50 active:scale-95 flex-1 py-5 sm:py-6 text-sm sm:text-base touch-manipulation"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
