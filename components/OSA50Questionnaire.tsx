'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OSA50Answer } from '@/lib/types/referral';

const OSA50_QUESTIONS = [
  {
    id: 1,
    question: "Waist circumference* - Male >102cm or Female > 88cm",
    points: 3,
    highlighted: true,
  },
  {
    id: 2,
    question: "Snoring bothers others?",
    points: 3,
    highlighted: false,
  },
  {
    id: 3,
    question: "Witnessed apnoeas?",
    points: 2,
    highlighted: true,
  },
  {
    id: 4,
    question: "Age 50 or over?",
    points: 2,
    highlighted: false,
  },
];

interface OSA50QuestionnaireProps {
  answers: OSA50Answer[];
  onAnswerChange: (questionId: number, answer: 'yes' | 'no' | 'maybe') => void;
}

export default function OSA50Questionnaire({ answers, onAnswerChange }: OSA50QuestionnaireProps) {
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
          OSA50 Screening Questions - circle all that apply
        </h3>
        <p className="text-xs sm:text-sm text-center mt-1">
          (Score out of 10 and the <span className="border-2 border-brand-blue px-1 rounded whitespace-nowrap">referral requires 5+</span>)
        </p>
      </div>

      <div className="hidden md:block border border-gray-300 rounded-b-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-400">
              <th className="px-4 py-2 text-left font-bold border-b border-gray-300"></th>
              <th className="px-4 py-2 text-center font-bold border-b border-gray-300">If "yes" circle</th>
            </tr>
          </thead>
          <tbody>
            {OSA50_QUESTIONS.map((item) => (
              <tr key={item.id} className={item.highlighted ? 'bg-blue-200' : 'bg-white'}>
                <td className="px-4 py-3 border-b border-gray-300">
                  <Label className="text-base font-normal">
                    {item.question}
                  </Label>
                </td>
                <td className="px-4 py-3 border-b border-gray-300 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <span className="font-medium">{item.points} points</span>
                    <RadioGroup
                      value={getAnswer(item.id)}
                      onValueChange={(value) => {
                        onAnswerChange(item.id, value as 'yes' | 'no' | 'maybe');
                      }}
                      className="flex gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`osa50-${item.id}-yes`} />
                        <Label htmlFor={`osa50-${item.id}-yes`} className="font-normal cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`osa50-${item.id}-no`} />
                        <Label htmlFor={`osa50-${item.id}-no`} className="font-normal cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-slate-400">
              <td className="px-4 py-3 text-center font-bold">
                Total OSA50 Score
              </td>
              <td className="px-4 py-3 text-center font-bold">
                <span className="text-lg">{score}</span> Points
              </td>
            </tr>
          </tbody>
        </table>
        <div className="bg-white px-4 py-2 border-t border-gray-300">
          <p className="text-sm text-brand-blue-light italic">
            *Waist measurement to be measured at the level of the umbilicus
          </p>
        </div>
      </div>

      <div className="md:hidden space-y-3 border border-gray-300 rounded-b-lg p-3">
        {OSA50_QUESTIONS.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border ${item.highlighted ? 'bg-blue-200' : 'bg-white'}`}
          >
            <Label className="text-sm font-normal block mb-3">
              {item.question}
            </Label>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">{item.points} points</span>
              <RadioGroup
                value={getAnswer(item.id)}
                onValueChange={(value) => {
                  onAnswerChange(item.id, value as 'yes' | 'no' | 'maybe');
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`osa50-${item.id}-yes`} />
                  <Label htmlFor={`osa50-${item.id}-yes`} className="font-normal cursor-pointer text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`osa50-${item.id}-no`} />
                  <Label htmlFor={`osa50-${item.id}-no`} className="font-normal cursor-pointer text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ))}

        <div className="bg-slate-400 p-3 rounded-lg text-center font-bold">
          <div className="text-sm">Total OSA50 Score</div>
          <div className="text-lg mt-1">{score} Points</div>
        </div>

        <div className="bg-white p-3 rounded-lg border">
          <p className="text-xs text-brand-blue-light italic">
            *Waist measurement to be measured at the level of the umbilicus
          </p>
        </div>
      </div>
    </div>
  );
}
