'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EpworthAnswer } from '@/lib/types/referral';

const EPWORTH_SITUATIONS = [
  { text: 'Sitting and Reading', highlighted: true },
  { text: 'Watching TV', highlighted: false },
  { text: 'Sitting inactive in a public place', highlighted: true },
  { text: 'As a passenger in a car for an hour with no break', highlighted: false },
  { text: 'Lying down in the afternoon', highlighted: true },
  { text: 'Sitting and talking to someone', highlighted: false },
  { text: 'Sitting quietly after lunch (without alcohol)', highlighted: true },
  { text: 'Stopping in traffic for a few minutes while driving a car', highlighted: false },
];

interface EpworthScaleProps {
  answers: EpworthAnswer[];
  onAnswerChange: (questionId: number, score: number) => void;
}

export default function EpworthScale({ answers, onAnswerChange }: EpworthScaleProps) {
  const getScore = (questionId: number): string => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.score.toString() || '';
  };

  const calculateTotalScore = () => {
    return answers.reduce((total, answer) => total + answer.score, 0);
  };

  const totalScore = calculateTotalScore();

  return (
    <div className="space-y-2">
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-white p-4 border-b border-gray-300">
          <h3 className="text-base font-bold">Epworth Sleepiness Scale (ESS) -circle all that apply <span className="text-sm">(Score out of 24 and the <span className="border-2 border-brand-blue px-1 rounded">referral requires 8+</span>)</span></h3>
          <p className="text-sm mt-2">
            In the following situations, how likely is the patient to doze off or fall asleep, in contrast to just feeling tired?
          </p>
          <p className="text-sm">
            Use the numeric scale below to determine the likelihood of dozing off in each of the situations below.
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-400">
              <th className="px-4 py-2 text-left font-bold border-b border-gray-300">
                <div className="italic">0 = No Chance</div>
                <div className="italic">1 = Slight Chance</div>
              </th>
              <th className="px-4 py-2 text-center font-bold border-b border-gray-300" colSpan={4}>
                <div className="italic">2 = Moderate Chance</div>
                <div className="italic">3 = High Chance</div>
              </th>
            </tr>
            <tr className="bg-slate-400">
              <th className="px-4 py-2 text-left font-bold border-b border-gray-300">Situations</th>
              <th className="px-4 py-2 text-center font-bold border-b border-gray-300" colSpan={4}>Numeric Scale</th>
            </tr>
            <tr className="bg-slate-400">
              <th className="px-4 py-2 border-b border-gray-300"></th>
              <th className="px-4 py-2 text-center font-bold border-b border-gray-300">0</th>
              <th className="px-4 py-2 text-center font-bold border-b border-gray-300">1</th>
              <th className="px-4 py-2 text-center font-bold border-b border-gray-300">2</th>
              <th className="px-4 py-2 text-center font-bold border-b border-gray-300">3</th>
            </tr>
          </thead>
          <tbody>
            {EPWORTH_SITUATIONS.map((situation, index) => {
              const questionId = index + 1;
              return (
                <tr key={questionId} className={situation.highlighted ? 'bg-blue-200' : 'bg-white'}>
                  <td className="px-4 py-3 border-b border-gray-300">
                    <Label className="text-base font-normal">
                      {situation.text}
                    </Label>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 text-center">
                    <RadioGroup
                      value={getScore(questionId)}
                      onValueChange={(value) => onAnswerChange(questionId, parseInt(value))}
                      className="flex justify-center"
                    >
                      <RadioGroupItem value="0" id={`epworth-${questionId}-0`} />
                    </RadioGroup>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 text-center">
                    <RadioGroup
                      value={getScore(questionId)}
                      onValueChange={(value) => onAnswerChange(questionId, parseInt(value))}
                      className="flex justify-center"
                    >
                      <RadioGroupItem value="1" id={`epworth-${questionId}-1`} />
                    </RadioGroup>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 text-center">
                    <RadioGroup
                      value={getScore(questionId)}
                      onValueChange={(value) => onAnswerChange(questionId, parseInt(value))}
                      className="flex justify-center"
                    >
                      <RadioGroupItem value="2" id={`epworth-${questionId}-2`} />
                    </RadioGroup>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 text-center">
                    <RadioGroup
                      value={getScore(questionId)}
                      onValueChange={(value) => onAnswerChange(questionId, parseInt(value))}
                      className="flex justify-center"
                    >
                      <RadioGroupItem value="3" id={`epworth-${questionId}-3`} />
                    </RadioGroup>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-400">
              <td className="px-4 py-3 text-center font-bold">Total ESS Score</td>
              <td className="px-4 py-3 text-center font-bold" colSpan={2}>Out of 24</td>
              <td className="px-4 py-3 text-center font-bold" colSpan={2}>
                <span className="text-lg">{totalScore}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
