import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestionProps {
  question: string;
  options: Option[];
  onAnswer: (isCorrect: boolean) => void;
  answered?: boolean;
  selectedOption?: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  onAnswer,
  answered,
  selectedOption,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto p-6 space-y-4">
      <h3 className="text-xl font-semibold">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={answered ? (option.isCorrect ? "success" : "destructive") : "outline"}
            className={`w-full justify-start p-4 h-auto text-left ${
              selectedOption === index ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => !answered && onAnswer(option.isCorrect)}
            disabled={answered}
          >
            <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
            {option.text}
            {answered && option.isCorrect && (
              <Check className="ml-auto h-5 w-5" />
            )}
            {answered && selectedOption === index && !option.isCorrect && (
              <X className="ml-auto h-5 w-5" />
            )}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuizQuestion;