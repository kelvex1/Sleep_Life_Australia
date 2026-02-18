'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, AlertCircle, CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

interface Question {
  id: string;
  text: string;
  points: number;
}

const questions: Question[] = [
  { id: 'q1', text: 'Do you snore loudly?', points: 2 },
  { id: 'q2', text: 'Do you often feel tired or sleepy during the day?', points: 2 },
  { id: 'q3', text: 'Has anyone seen you stop breathing during sleep?', points: 2 },
  { id: 'q4', text: 'Are you over 50 years old?', points: 1 },
  { id: 'q5', text: 'Do you have high blood pressure or a BMI over 30?', points: 1 },
];

type QuizState = 'start' | 'quiz' | 'results';
type RiskLevel = 'low' | 'moderate' | 'high';

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    setQuizState('quiz');
    setCurrentQuestion(0);
    setAnswers({});
    setTotalScore(0);
  };

  const handleAnswer = async (answer: boolean) => {
    const question = questions[currentQuestion];
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = calculateScore(newAnswers);
      const risk = determineRiskLevel(score);
      setTotalScore(score);
      setRiskLevel(risk);

      await saveQuizResults(score, risk, newAnswers);

      setQuizState('results');
    }
  };

  const calculateScore = (answers: Record<string, boolean>): number => {
    return questions.reduce((total, question) => {
      return total + (answers[question.id] ? question.points : 0);
    }, 0);
  };

  const determineRiskLevel = (score: number): RiskLevel => {
    if (score >= 5) return 'high';
    if (score >= 3) return 'moderate';
    return 'low';
  };

  const saveQuizResults = async (score: number, risk: RiskLevel, answers: Record<string, boolean>) => {
    try {
      setIsSubmitting(true);
      const supabase = getSupabaseClient();

      if (!supabase) {
        console.warn('Supabase client not available');
        return;
      }

      const { error } = await supabase
        .from('quiz_results')
        .insert({
          total_score: score,
          risk_level: risk,
          question_answers: answers,
        });

      if (error) {
        console.error('Error saving quiz results:', error);
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = quizState === 'quiz' ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 pt-24 md:pt-28">
      <div className="max-w-2xl mx-auto">
        {quizState === 'start' && (
          <Card className="shadow-xl border-2">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-brand-blue-light/20 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-10 h-10 text-brand-blue" />
              </div>
              <CardTitle className="text-3xl mb-4">Quick Sleep Risk Assessment</CardTitle>
              <CardDescription className="text-lg">
                Find out your sleep apnea risk in under 2 minutes with our simple 5-question quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">What to expect:</h3>
                <ul className="space-y-2 text-brand-blue-light">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
                    <span>5 simple yes/no questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
                    <span>Takes less than 2 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
                    <span>Instant results and recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" />
                    <span>Completely anonymous</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Results stored anonymously to improve our services
              </p>

              <Button
                onClick={handleStart}
                className="w-full h-14 text-lg bg-brand-blue hover:bg-brand-blue-dark"
              >
                Start Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {quizState === 'quiz' && (
          <Card className="shadow-xl border-2">
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-brand-blue-light">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-blue transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pb-8">
              <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-8">
                  {questions[currentQuestion].text}
                </h2>
                <div className="flex gap-4 max-w-md mx-auto">
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 h-16 text-lg bg-brand-blue hover:bg-brand-blue-dark"
                    disabled={isSubmitting}
                  >
                    <CheckCircle2 className="mr-2 w-6 h-6" />
                    Yes
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="flex-1 h-16 text-lg border-2 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    <XCircle className="mr-2 w-6 h-6" />
                    No
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {quizState === 'results' && (
          <Card className="shadow-xl border-2">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4">
                {riskLevel === 'high' && (
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                )}
                {riskLevel === 'moderate' && (
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-orange-600" />
                  </div>
                )}
                {riskLevel === 'low' && (
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                )}
              </div>
              <CardTitle className="text-3xl mb-4">Your Results</CardTitle>
              <div className="flex items-center justify-center gap-4">
                <span className="text-lg text-brand-blue-light">Score: {totalScore}/8</span>
                <Badge
                  variant={riskLevel === 'high' ? 'destructive' : 'default'}
                  className={`text-base px-4 py-1 ${
                    riskLevel === 'moderate' ? 'bg-orange-500' : ''
                  } ${riskLevel === 'low' ? 'bg-green-500' : ''}`}
                >
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              {riskLevel === 'high' && (
                <>
                  <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-xl mb-3 text-red-900">
                      You may be at risk for sleep apnea
                    </h3>
                    <p className="text-brand-blue-light mb-4">
                      Based on your responses, we recommend seeing your GP for a referral to book your sleep test with Sleep Life Australia.
                    </p>
                    <div className="space-y-2 text-brand-blue-light">
                      <p className="font-semibold">Why a sleep test is important:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Early detection can prevent serious health complications</li>
                        <li>Sleep apnea affects heart health, blood pressure, and daily energy</li>
                        <li>Treatment can dramatically improve your quality of life</li>
                        <li>Our at-home sleep tests are convenient and comprehensive</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Contact Sleep Life Australia</h4>
                    <div className="space-y-2 text-brand-blue-light">
                      <p><strong>Phone:</strong> <a href="tel:0861179339" className="text-brand-blue hover:text-brand-blue-dark underline">08 6117 9339</a></p>
                      <p><strong>Email:</strong> <a href="mailto:reception@sleeplifeaustralia.com.au" className="text-brand-blue hover:text-brand-blue-dark underline">reception@sleeplifeaustralia.com.au</a></p>
                    </div>
                  </div>
                </>
              )}

              {riskLevel === 'moderate' && (
                <>
                  <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-xl mb-3 text-orange-900">
                      You have some sleep concerns
                    </h3>
                    <p className="text-brand-blue-light mb-4">
                      While your risk level is moderate, it's worth discussing these symptoms with your GP if they persist or worsen.
                    </p>
                    <p className="text-brand-blue-light">
                      Sleep apnea can develop over time, so monitoring your symptoms is important for your long-term health.
                    </p>
                  </div>

                  <Link href="/faq">
                    <Button variant="outline" className="w-full h-12 border-2">
                      Read Our FAQ
                    </Button>
                  </Link>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Contact Sleep Life Australia</h4>
                    <div className="space-y-2 text-brand-blue-light">
                      <p><strong>Phone:</strong> <a href="tel:0861179339" className="text-brand-blue hover:text-brand-blue-dark underline">08 6117 9339</a></p>
                      <p><strong>Email:</strong> <a href="mailto:reception@sleeplifeaustralia.com.au" className="text-brand-blue hover:text-brand-blue-dark underline">reception@sleeplifeaustralia.com.au</a></p>
                    </div>
                  </div>
                </>
              )}

              {riskLevel === 'low' && (
                <>
                  <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-xl mb-3 text-green-900">
                      Your results look good
                    </h3>
                    <p className="text-brand-blue-light mb-4">
                      Based on your responses, you appear to have a lower risk for sleep apnea. That's great news!
                    </p>
                    <p className="text-brand-blue-light">
                      However, if you develop new symptoms or have concerns about your sleep quality, don't hesitate to reach out to your GP or contact us directly.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Maintain Good Sleep Health:</h4>
                    <ul className="list-disc list-inside space-y-1 text-brand-blue-light ml-2">
                      <li>Maintain a consistent sleep schedule</li>
                      <li>Create a relaxing bedtime routine</li>
                      <li>Keep your bedroom cool, dark, and quiet</li>
                      <li>Limit screen time before bed</li>
                      <li>Stay active during the day</li>
                    </ul>
                  </div>

                  <Link href="/">
                    <Button variant="outline" className="w-full h-12 border-2">
                      Return to Homepage
                    </Button>
                  </Link>
                </>
              )}

              <div className="pt-4 border-t">
                <Button
                  onClick={handleStart}
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  <RefreshCw className="mr-2 w-5 h-5" />
                  Retake Quiz
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                This quiz is a screening tool only and does not replace professional medical advice.
                Always consult with your healthcare provider for proper diagnosis and treatment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
