import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import QuizQuestion from '@/components/QuizQuestion';
import Results from '@/components/Results';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  question: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

const generateMCQs = async (text: string): Promise<Question[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-mcqs', {
      body: { text }
    });

    if (error) throw error;
    if (!Array.isArray(data)) throw new Error('Invalid response format');
    
    return data.slice(0, 20); // Ensure maximum 20 questions
  } catch (error) {
    console.error('Error generating MCQs:', error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate questions");
  }
};

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const { toast } = useToast();

  const handleGenerate = async (text: string) => {
    setIsGenerating(true);
    try {
      const generatedQuestions = await generateMCQs(text);
      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setScore(0);
      setAnswered(false);
      setSelectedOption(undefined);
      setShowResults(false);
      setWrongAnswers([]);
      
      toast({
        title: "Questions Generated",
        description: "Your MCQs are ready. Good luck!",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
      setQuestions([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (isCorrect: boolean, optionIndex: number) => {
    setSelectedOption(optionIndex);
    setAnswered(true);
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, currentQuestion]);
    }
    
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
    setWrongAnswers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] via-[#F2FCE2] to-[#D3E4FD] p-6">
      <div className="max-w-4xl mx-auto space-y-8 backdrop-blur-sm bg-white/30 rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-center text-primary">
          MCQ Generator & Quiz
        </h1>
        
        {questions.length === 0 ? (
          <TextInput onGenerate={handleGenerate} isLoading={isGenerating} />
        ) : showResults ? (
          <Results 
            score={score}
            totalQuestions={questions.length}
            onRetry={handleRetry}
            wrongQuestions={wrongAnswers.map(index => questions[index])}
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
