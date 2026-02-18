'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import OSA50Questionnaire from '@/components/OSA50Questionnaire';
import STOPBANGAssessment from '@/components/STOPBANGAssessment';
import EpworthScale from '@/components/EpworthScale';
import SignaturePad from '@/components/SignaturePad';
import { encryptData } from '@/lib/encryption';
import {
  ReferralFormData,
  PatientInfo,
  MedicalHistory,
  SleepHistory,
  TestsOrdered,
  OSA50Answer,
  STOPBANGAnswer,
  EpworthAnswer,
  ReferralReason,
  ReferringDoctor,
} from '@/lib/types/referral';
import { ChevronLeft, ChevronRight, Send, CheckCircle2, Copy, Home, Info, Download } from 'lucide-react';

const STEPS = [
  'Page 1: Patient & Assessments',
  'Page 2: Epworth & Referral Details',
  'Review & Submit',
];

export default function ReferralFormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralNumber, setReferralNumber] = useState<string>('');
  const [submittedPatientName, setSubmittedPatientName] = useState<string>('');
  const { toast } = useToast();

  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    age: 0,
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    medicareNumber: '',
    medicareRef: '',
    medicareExpiry: '',
    pensionNumber: '',
    dvaNumber: '',
  });

  const [testsOrdered, setTestsOrdered] = useState<TestsOrdered>({
    level2PSGMedicare: false,
    level2PSGPatientFunded: false,
    level3OSAExpress: false,
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    primaryCarePhysician: '',
    referringPhysician: '',
    referringPhysicianPhone: '',
    chiefComplaint: '',
    currentMedications: '',
    allergies: '',
    pastMedicalHistory: '',
    pastSurgicalHistory: '',
    familyHistory: '',
    socialHistory: '',
  });

  const [sleepHistory, setSleepHistory] = useState<SleepHistory>({
    bedtime: '',
    wakeTime: '',
    sleepLatency: '',
    numberOfAwakenings: '',
    snoring: false,
    witnessedApneas: false,
    gaspingChoking: false,
    morningHeadaches: false,
    dryMouth: false,
    nocturia: '',
    unrefreshing: false,
    daytimeSleepin: false,
  });

  const [osa50Answers, setOsa50Answers] = useState<OSA50Answer[]>([]);
  const [stopbangAnswers, setStopbangAnswers] = useState<STOPBANGAnswer[]>([]);
  const [epworthAnswers, setEpworthAnswers] = useState<EpworthAnswer[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [gpSignature, setGpSignature] = useState<string | null>(null);

  const [referralReason, setReferralReason] = useState<ReferralReason>({
    witnessedApnoeaOrChoking: false,
    regularLoudSnoring: false,
    regularFatigueOrDaytimeSleepiness: false,
    typeIIDiabetes: false,
    other: false,
    hypertension: false,
    cardiacDisease: false,
    obesity: false,
    neurologicalIssues: false,
    stroke: false,
    depression: false,
    frequentNocturia: false,
    sleepyDriving: false,
  });

  const [referringDoctor, setReferringDoctor] = useState<ReferringDoctor>({
    name: '',
    address: '',
    practiceName: '',
    providerNo: '',
    date: new Date().toISOString().split('T')[0],
    signature: null,
  });

  const handleOSA50Answer = (questionId: number, answer: 'yes' | 'no' | 'maybe') => {
    const pointsMap: { [key: number]: number } = {
      1: 3,
      2: 3,
      3: 2,
      4: 2,
    };
    const score = answer === 'yes' ? pointsMap[questionId] : 0;
    setOsa50Answers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, answer, score }];
    });
  };

  const handleStopbangAnswer = (questionId: number, answer: 'yes' | 'no') => {
    const score = answer === 'yes' ? 1 : 0;
    setStopbangAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, answer, score }];
    });
  };

  const handleEpworthAnswer = (questionId: number, score: number) => {
    setEpworthAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, score }];
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData: ReferralFormData = {
        patientInfo,
        medicalHistory,
        sleepHistory,
        testsOrdered,
        referralReason,
        referringDoctor: {
          ...referringDoctor,
          signature: gpSignature,
        },
        osa50Answers,
        osa50Score: osa50Answers.reduce((sum, a) => sum + a.score, 0),
        stopbangAnswers,
        stopbangScore: stopbangAnswers.reduce((sum, a) => sum + a.score, 0),
        epworthAnswers,
        epworthScore: epworthAnswers.reduce((sum, a) => sum + a.score, 0),
        additionalNotes,
      };

      const encryptedData = await encryptData(formData);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/rest/v1/referral_forms?select=id,referral_number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey!,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          referral_date: new Date().toISOString().split('T')[0],
          referring_physician: '',
          patient_initials: `${patientInfo.firstName[0]}${patientInfo.lastName[0]}`,
          has_insurance: false,
          osa50_score: formData.osa50Score,
          stopbang_score: formData.stopbangScore,
          epworth_score: formData.epworthScore,
          encrypted_data: encryptedData,
          encryption_key_id: 'v1',
          form_status: 'submitted',
          email_sent: false,
          pdf_generated: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const [savedForm] = await response.json();

      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-referral-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          referralId: savedForm.id,
          formData,
        }),
      });

      let refNumber = savedForm.referral_number || savedForm.id;

      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        if (emailResult.referralNumber) {
          refNumber = emailResult.referralNumber;
        }
      } else {
        console.error('Email sending failed, but form was saved');
      }

      setReferralNumber(refNumber);
      setSubmittedPatientName(`${patientInfo.firstName} ${patientInfo.lastName}`);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralNumber);
    toast({
      title: 'Copied!',
      description: 'Referral number copied to clipboard',
    });
  };

  const handleDownloadReferral = async () => {
    try {
      const response = await fetch('/referral_(1).pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Sleep_Study_Referral_Form.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Download Started',
        description: 'The referral form is being downloaded',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading the form',
        variant: 'destructive',
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 pt-28">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-green-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl text-green-700 mb-2">Referral Submitted Successfully!</CardTitle>
              <CardDescription className="text-base">
                Thank you, {submittedPatientName}. Your sleep study referral has been received.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-6 text-center">
                <p className="text-sm text-amber-900 font-medium mb-2">Your Referral Number</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <p className="text-4xl font-bold text-amber-900 tracking-wider">{referralNumber}</p>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="border-amber-400 hover:bg-amber-100"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-amber-800">Please save this number for your records</p>
              </div>

              <div className="bg-gray-50 border-l-4 border-brand-blue rounded p-5">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-gray mb-2">Important Timeline Information</h3>
                    <p className="text-sm text-brand-blue-light">
                      Your referral will take up to 7 days to be processed. Please book your appointment online via our website no less than 7 days after your GP appointment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-brand-blue text-lg">What Happens Next?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-blue mb-1">Processing (Up to 7 Days)</h4>
                      <p className="text-sm text-brand-blue-light">
                        Our team will review your assessment results and referral information
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-blue mb-1">Book Your Appointment</h4>
                      <p className="text-sm text-brand-blue-light">
                        After 7 days from your GP appointment, visit our website to book your consultation online
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-blue mb-1">Prepare for Your Visit</h4>
                      <p className="text-sm text-brand-blue-light">
                        We may contact you if we need any additional information
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="font-semibold text-brand-blue mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-brand-blue-light">
                    <span className="font-medium">Website:</span> www.sleeplifeaustralia.com.au
                  </p>
                  <p className="text-brand-blue-light">
                    If you have any questions, please contact us and reference your referral number: <span className="font-semibold">{referralNumber}</span>
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 text-center">
                  A confirmation email with these details has been sent to your email address.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => window.location.href = '/'}
                  size="lg"
                  className="bg-brand-blue hover:bg-brand-blue-dark"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 pt-28">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-blue mb-2">Sleep Study Referral Form</h1>
          <p className="text-brand-blue-light mb-4">Complete all sections for a comprehensive sleep assessment</p>
          <div className="flex justify-center">
            <Button
              onClick={handleDownloadReferral}
              variant="outline"
              size="lg"
              className="border-2 border-brand-blue-light text-brand-blue-light hover:bg-brand-blue-light hover:text-white font-semibold"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Referral Form
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(index);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-110 cursor-pointer ${
                    index === currentStep
                      ? 'bg-brand-blue text-white'
                      : index < currentStep
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-brand-blue-light hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
                <span className="text-xs mt-1 text-center hidden md:block text-brand-blue-light">{step}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-brand-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{STEPS[currentStep]}</CardTitle>
            <CardDescription>Step {currentStep + 1} of {STEPS.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={patientInfo.firstName}
                      onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={patientInfo.middleName}
                      onChange={(e) => setPatientInfo({ ...patientInfo, middleName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={patientInfo.lastName}
                      onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={patientInfo.dateOfBirth}
                      onChange={(e) => {
                        const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
                        setPatientInfo({ ...patientInfo, dateOfBirth: e.target.value, age });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" value={patientInfo.age} readOnly />
                  </div>
                  <div>
                    <Label>Gender *</Label>
                    <RadioGroup
                      value={patientInfo.gender}
                      onValueChange={(value) =>
                        setPatientInfo({ ...patientInfo, gender: value as 'Male' | 'Female' | 'Other' })
                      }
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={patientInfo.address}
                    onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={patientInfo.city}
                      onChange={(e) => setPatientInfo({ ...patientInfo, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={patientInfo.state}
                      onChange={(e) => setPatientInfo({ ...patientInfo, state: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={patientInfo.zipCode}
                      onChange={(e) => setPatientInfo({ ...patientInfo, zipCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-brand-blue mb-4">Medicare Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="medicareNumber">Medicare Number</Label>
                      <Input
                        id="medicareNumber"
                        value={patientInfo.medicareNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPatientInfo({ ...patientInfo, medicareNumber: value });
                        }}
                        maxLength={10}
                        placeholder="10 digits"
                      />
                      <p className="text-xs text-gray-500 mt-1">{patientInfo.medicareNumber?.length || 0}/10 digits</p>
                    </div>
                    <div>
                      <Label htmlFor="medicareRef">Medicare Ref</Label>
                      <Input
                        id="medicareRef"
                        value={patientInfo.medicareRef}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 1);
                          setPatientInfo({ ...patientInfo, medicareRef: value });
                        }}
                        maxLength={1}
                        placeholder="1 digit"
                      />
                    </div>
                    <div>
                      <Label htmlFor="medicareExpiry">Medicare Expiry</Label>
                      <Input
                        id="medicareExpiry"
                        type="month"
                        value={patientInfo.medicareExpiry}
                        onChange={(e) => setPatientInfo({ ...patientInfo, medicareExpiry: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="pensionNumber">Pension Number</Label>
                      <Input
                        id="pensionNumber"
                        value={patientInfo.pensionNumber}
                        onChange={(e) => setPatientInfo({ ...patientInfo, pensionNumber: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dvaNumber">DVA Number</Label>
                      <Input
                        id="dvaNumber"
                        value={patientInfo.dvaNumber}
                        onChange={(e) => setPatientInfo({ ...patientInfo, dvaNumber: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-brand-blue mb-4">Tests Ordered</h3>
                  <p className="text-sm text-brand-blue-light mb-4 italic">
                    Please choose a Level 2 (Patient funded) or Level 3 (OSA Test) if the patient does not meet the Medicare requirements listed below.
                  </p>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="level2Medicare"
                        checked={testsOrdered.level2PSGMedicare}
                        onCheckedChange={(checked) =>
                          setTestsOrdered({ ...testsOrdered, level2PSGMedicare: checked as boolean })
                        }
                      />
                      <Label htmlFor="level2Medicare" className="font-medium cursor-pointer">
                        Level 2 PSG (Medicare Approved)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="level2Patient"
                        checked={testsOrdered.level2PSGPatientFunded}
                        onCheckedChange={(checked) =>
                          setTestsOrdered({ ...testsOrdered, level2PSGPatientFunded: checked as boolean })
                        }
                      />
                      <Label htmlFor="level2Patient" className="font-medium cursor-pointer">
                        Level 2 PSG (Patient funded)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="level3Express"
                        checked={testsOrdered.level3OSAExpress}
                        onCheckedChange={(checked) =>
                          setTestsOrdered({ ...testsOrdered, level3OSAExpress: checked as boolean })
                        }
                      />
                      <Label htmlFor="level3Express" className="font-medium cursor-pointer">
                        Level 3 OSA Test (Express service)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <div className="bg-red-600 text-white px-4 py-3 rounded-t-lg">
                    <h3 className="text-lg font-semibold text-center">Medicare Approved Assessment Conditions</h3>
                  </div>
                  <div className="border border-red-600 rounded-b-lg p-5 bg-white">
                    <ol className="space-y-2 list-decimal list-inside text-brand-blue">
                      <li className="font-medium">Patient Aged 18+</li>
                      <li className="font-medium">
                        OSA50 score of 5+ <span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm font-bold">OR</span> STOPBANG score of 4+
                      </li>
                      <li className="font-medium">Epworth Sleepiness Scale of 8+</li>
                      <li className="font-medium">Home Sleep Study has not been claimed within the last 12 months from the date of this referral.</li>
                    </ol>
                    <p className="mt-4 text-sm text-brand-blue-light italic">
                      We can proceed with a patient funded Level 2 Sleep Study or Level 3 OSA Test if the patient does not meet the above requirements.
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <div className="bg-slate-400 text-brand-blue px-4 py-3 rounded-t-lg border border-gray-300">
                    <h3 className="text-lg font-semibold text-center">Sleep Assessment Tools</h3>
                  </div>
                  <div className="mt-6">
                    <OSA50Questionnaire answers={osa50Answers} onAnswerChange={handleOSA50Answer} />
                  </div>
                  <div className="mt-6">
                    <STOPBANGAssessment answers={stopbangAnswers} onAnswerChange={handleStopbangAnswer} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <EpworthScale answers={epworthAnswers} onAnswerChange={handleEpworthAnswer} />
                </div>

                <div className="border-t pt-6 mt-6">
                  <div className="bg-slate-400 text-brand-blue px-4 py-3 rounded-t-lg border border-gray-300">
                    <h3 className="text-lg font-semibold text-center">Referral Reason</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border border-gray-300 rounded-b-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="witnessedApnoea"
                        checked={referralReason.witnessedApnoeaOrChoking}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, witnessedApnoeaOrChoking: checked as boolean })
                        }
                      />
                      <Label htmlFor="witnessedApnoea" className="font-normal cursor-pointer">
                        Witnessed apnoea or choking
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hypertension"
                        checked={referralReason.hypertension}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, hypertension: checked as boolean })
                        }
                      />
                      <Label htmlFor="hypertension" className="font-normal cursor-pointer">
                        Hypertension
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="stroke"
                        checked={referralReason.stroke}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, stroke: checked as boolean })
                        }
                      />
                      <Label htmlFor="stroke" className="font-normal cursor-pointer">
                        Stroke
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="regularSnoring"
                        checked={referralReason.regularLoudSnoring}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, regularLoudSnoring: checked as boolean })
                        }
                      />
                      <Label htmlFor="regularSnoring" className="font-normal cursor-pointer">
                        Regular loud snoring
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cardiacDisease"
                        checked={referralReason.cardiacDisease}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, cardiacDisease: checked as boolean })
                        }
                      />
                      <Label htmlFor="cardiacDisease" className="font-normal cursor-pointer">
                        Cardiac Disease/Arrhythmia
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="depression"
                        checked={referralReason.depression}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, depression: checked as boolean })
                        }
                      />
                      <Label htmlFor="depression" className="font-normal cursor-pointer">
                        Depression
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="regularFatigue"
                        checked={referralReason.regularFatigueOrDaytimeSleepiness}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, regularFatigueOrDaytimeSleepiness: checked as boolean })
                        }
                      />
                      <Label htmlFor="regularFatigue" className="font-normal cursor-pointer">
                        Regular Fatigue or Daytime Sleepiness
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="obesity"
                        checked={referralReason.obesity}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, obesity: checked as boolean })
                        }
                      />
                      <Label htmlFor="obesity" className="font-normal cursor-pointer">
                        Obesity
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="frequentNocturia"
                        checked={referralReason.frequentNocturia}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, frequentNocturia: checked as boolean })
                        }
                      />
                      <Label htmlFor="frequentNocturia" className="font-normal cursor-pointer">
                        Frequent nocturia
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="typeIIDiabetes"
                        checked={referralReason.typeIIDiabetes}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, typeIIDiabetes: checked as boolean })
                        }
                      />
                      <Label htmlFor="typeIIDiabetes" className="font-normal cursor-pointer">
                        Type II Diabetes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="neurologicalIssues"
                        checked={referralReason.neurologicalIssues}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, neurologicalIssues: checked as boolean })
                        }
                      />
                      <Label htmlFor="neurologicalIssues" className="font-normal cursor-pointer">
                        Neurological Issues
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sleepyDriving"
                        checked={referralReason.sleepyDriving}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, sleepyDriving: checked as boolean })
                        }
                      />
                      <Label htmlFor="sleepyDriving" className="font-normal cursor-pointer">
                        Sleepy driving
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="other"
                        checked={referralReason.other}
                        onCheckedChange={(checked) =>
                          setReferralReason({ ...referralReason, other: checked as boolean })
                        }
                      />
                      <Label htmlFor="other" className="font-normal cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-slate-400 text-brand-blue px-4 py-3 rounded-t-lg border border-gray-300">
                        <h3 className="text-lg font-semibold text-center">Referring Doctor's Details</h3>
                      </div>
                      <div className="space-y-4 p-6 border border-gray-300 rounded-b-lg">
                        <div>
                          <Label htmlFor="doctorName">Doctor's Name</Label>
                          <Input
                            id="doctorName"
                            value={referringDoctor.name}
                            onChange={(e) => setReferringDoctor({ ...referringDoctor, name: e.target.value })}
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="doctorAddress">Address</Label>
                          <Textarea
                            id="doctorAddress"
                            value={referringDoctor.address}
                            onChange={(e) => setReferringDoctor({ ...referringDoctor, address: e.target.value })}
                            rows={3}
                            placeholder="Practice address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="practiceName">Practice Name</Label>
                          <Input
                            id="practiceName"
                            value={referringDoctor.practiceName}
                            onChange={(e) => setReferringDoctor({ ...referringDoctor, practiceName: e.target.value })}
                            placeholder="Medical practice name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="providerNo">Provider No</Label>
                            <Input
                              id="providerNo"
                              value={referringDoctor.providerNo}
                              onChange={(e) => setReferringDoctor({ ...referringDoctor, providerNo: e.target.value })}
                              placeholder="Provider number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="referralDate">Date</Label>
                            <Input
                              id="referralDate"
                              type="date"
                              value={referringDoctor.date}
                              onChange={(e) => setReferringDoctor({ ...referringDoctor, date: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="bg-white p-6 border border-gray-300 rounded-lg h-full flex flex-col justify-center">
                        <p className="text-sm text-brand-blue-light mb-4">
                          Patients with one or more of the following conditions are unsuitable for a home sleep study: Neuropsychological, severe intellectual or physical disability conditions or where video confirmation is essential for diagnosis (parasomnias / RLS).
                        </p>
                        <p className="text-sm text-brand-blue-light">
                          Sleep apnea is serious and if untreated, you may be at a higher risk of a stroke, heart attack or a serious workplace accident. Having a detailed sleep study is the first step toward getting your wellness back and living the life you deserve. We provide an accurate and comprehensive take home sleep study allowing you to be in the comfort of your own bedroom environment. Your sleep study will be facilitated by qualified staff, scored by a sleep scientist and reported on by a sleep expert. By dealing with us, you can expect quick results and expert advice on treatment options moving forward.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Assessment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-brand-blue-light">OSA50 Score</p>
                      <p className="text-3xl font-bold text-brand-blue">
                        {osa50Answers.reduce((sum, a) => sum + a.score, 0)}/10
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-brand-blue-light">STOP-BANG Score</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {stopbangAnswers.reduce((sum, a) => sum + a.score, 0)}/8
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-brand-blue-light">Epworth Score</p>
                      <p className="text-3xl font-bold text-green-600">
                        {epworthAnswers.reduce((sum, a) => sum + a.score, 0)}/24
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalNotes">Additional Notes or Comments</Label>
                  <Textarea
                    id="additionalNotes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={5}
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
                <div>
                  <Label className="text-lg font-semibold mb-2 block">GP Signature *</Label>
                  <p className="text-sm text-brand-blue-light mb-2 italic">Electronically signed</p>
                  <SignaturePad onSignatureChange={setGpSignature} signatureData={gpSignature} />
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm text-yellow-800">
                    By submitting this form, you confirm that all information provided is accurate and
                    complete. This information will be encrypted and securely stored. A PDF copy will be
                    generated and emailed to the referring physician.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || !gpSignature}>
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  Submit Form
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
