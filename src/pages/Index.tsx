import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import QuizQuestion from '@/components/QuizQuestion';
import Results from '@/components/Results';
import { Progress } from "@/components/ui/progress";

interface Question {
  question: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

// Mock function to generate MCQs (replace with actual implementation)
const generateMCQs = (text: string): Question[] => {
  // This is a mock implementation
  return Array(20).fill(null).map((_, i) => ({
    question: `Sample Question ${i + 1} about "${text.slice(0, 30)}..."`,
    options: [
      { text: "Correct Answer", isCorrect: true },
      { text: "Wrong Answer 1", isCorrect: false },
      { text: "Wrong Answer 2", isCorrect: false },
      { text: "Wrong Answer 3", isCorrect: false },
    ].sort(() => Math.random() - 0.5),
  }));
};

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = (text: string) => {
    const generatedQuestions = generateMCQs(text);
    setQuestions(generatedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(undefined);
    setShowResults(false);
  };

  const handleAnswer = (isCorrect: boolean, optionIndex: number) => {
    setSelectedOption(optionIndex);
    setAnswered(true);
    if (isCorrect) setScore(score + 1);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswered(false);
        setSelectedOption(undefined);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const handleRetry = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(undefined);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-primary">
          MCQ Generator & Quiz
        </h1>
        
        {questions.length === 0 ? (
          <TextInput onGenerate={handleGenerate} />
        ) : showResults ? (
          <Results 
            score={score}
            totalQuestions={questions.length}
            onRetry={handleRetry}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                Score: {score}
              </span>
            </div>
            
            <Progress 
              value={(currentQuestion / questions.length) * 100}
              className="h-2"
            />
            
            <QuizQuestion
              question={questions[currentQuestion].question}
              options={questions[currentQuestion].options}
              onAnswer={(isCorrect) => handleAnswer(isCorrect, selectedOption!)}
              answered={answered}
              selectedOption={selectedOption}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;