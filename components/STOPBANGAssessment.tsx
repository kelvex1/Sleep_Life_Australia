'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { STOPBANGAnswer } from '@/lib/types/referral';

const STOPBANG_QUESTIONS = [
  {
    id: 1,
    question: 'Does the patient Snore?',
    highlighted: true,
  },
  {
    id: 2,
    question: 'Does the patient feel tired, fatigued or sleepy during the day time?',
    highlighted: false,
  },
  {
    id: 3,
    question: 'Has anyone observed the patient stop breathing or choking/gasping during their sleep?',
    highlighted: true,
  },
  {
    id: 4,
    question: 'Is the patient being treated for high blood pressure?',
    highlighted: false,
  },
  {
    id: 5,
    question: 'Is the patient\'s BMI greater than 35?',
    highlighted: true,
  },
  {
    id: 6,
    question: 'Is the patient\'s age 50 or older?',
    highlighted: false,
  },
  {
    id: 7,
    question: 'Is the patient\'s neck circumference greater than 40cm?',
    highlighted: true,
  },
  {
    id: 8,
    question: 'Is the patient\'s gender male?',
    highlighted: false,
  },
];

interface STOPBANGAssessmentProps {
  answers: STOPBANGAnswer[];
  onAnswerChange: (questionId: number, answer: 'yes' | 'no') => void;
}

export default function STOPBANGAssessment({ answers, onAnswerChange }: STOPBANGAssessmentProps) {
  const getAnswer = (questionId: number): string => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.answer || '';
  };

  const calculateScore = () => {
    return answers.reduce((total, answer) => total + answer.score, 0);
  };

  const score = calculateScore();

  return (
    <div className="space-y-2">
      <div className="bg-slate-400 text-brand-blue px-3 sm:px-4 py-3 rounded-t-lg border border-gray-300">
        <h3 className="text-sm sm:text-base font-bold text-center">
          STOPBANG Questionnaire - circle all that apply
        </h3>
        <p className="text-xs sm:text-sm text-center mt-1">
          (Score out of 8 and the <span className="border-2 border-brand-blue px-1 rounded whitespace-nowrap">referral requires 4+</span>)
        </p>
      </div>

      <div className="hidden md:block border border-gray-300 rounded-b-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {STOPBANG_QUESTIONS.map((item) => (
              <tr key={item.id} className={item.highlighted ? 'bg-blue-200' : 'bg-white'}>
                <td className="px-4 py-3 border-b border-gray-300">
                  <Label className="text-base font-normal cursor-pointer">
                    {item.question}
                  </Label>
                </td>
                <td className="px-4 py-3 border-b border-gray-300 text-center w-32">
                  <RadioGroup
                    value={getAnswer(item.id)}
                    onValueChange={(value) => onAnswerChange(item.id, value as 'yes' | 'no')}
                    className="flex gap-3 justify-center"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`stopbang-${item.id}-yes`} />
                      <Label htmlFor={`stopbang-${item.id}-yes`} className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`stopbang-${item.id}-no`} />
                      <Label htmlFor={`stopbang-${item.id}-no`} className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </td>
                <td className="px-4 py-3 border-b border-gray-300 text-center w-24 font-medium">
                  1 point
                </td>
              </tr>
            ))}
            <tr className="bg-slate-400">
              <td className="px-4 py-3 text-center font-bold" colSpan={2}>
                Total STOP BANG Score
              </td>
              <td className="px-4 py-3 text-center font-bold">
                <span className="text-lg">{score}</span> Points
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3 border border-gray-300 rounded-b-lg p-3">
        {STOPBANG_QUESTIONS.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border ${item.highlighted ? 'bg-blue-200' : 'bg-white'}`}
          >
            <Label className="text-sm font-normal block mb-3">
              {item.question}
            </Label>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">1 point</span>
              <RadioGroup
                value={getAnswer(item.id)}
                onValueChange={(value) => onAnswerChange(item.id, value as 'yes' | 'no')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`stopbang-${item.id}-yes`} />
                  <Label htmlFor={`stopbang-${item.id}-yes`} className="font-normal cursor-pointer text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`stopbang-${item.id}-no`} />
                  <Label htmlFor={`stopbang-${item.id}-no`} className="font-normal cursor-pointer text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ))}

        <div className="bg-slate-400 p-3 rounded-lg text-center font-bold">
          <div className="text-sm">Total STOP BANG Score</div>
          <div className="text-lg mt-1">{score} Points</div>
        </div>
      </div>
    </div>
  );
}
