import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Question {
  question: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

interface ResultsProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  wrongQuestions: Question[];
}

const Results: React.FC<ResultsProps> = ({ 
  score, 
  totalQuestions, 
  onRetry,
  wrongQuestions 
}) => {
  const percentage = (score / totalQuestions) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Quiz Results</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-bold text-primary">
            {score}
          </span>
          <span className="text-2xl text-gray-500">/{totalQuestions}</span>
        </div>
        
        <Progress value={percentage} className="h-3" />
        
        <p className="text-center text-gray-600">
          You scored {percentage.toFixed(1)}%
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Areas to Focus:</h3>
        {wrongQuestions.length > 0 ? (
          <div className="space-y-4">
            <p className="text-gray-600">Review these topics:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {wrongQuestions.map((q, index) => (
                <li key={index}>
                  {q.question}
                  <div className="ml-6 text-sm text-green-600">
                    Correct answer: {q.options.find(opt => opt.isCorrect)?.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-green-600">Perfect score! Keep up the great work!</p>
        )}
        
        {percentage < 70 && (
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Review the content carefully and try to understand key concepts</li>
            <li>Take notes of questions you found challenging</li>
          </ul>
        )}
      </div>

      <Button 
        onClick={onRetry}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Try Again
      </Button>
    </Card>
  );
};

export default Results;