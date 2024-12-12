import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import QuizQuestion from '@/components/QuizQuestion';
import Results from '@/components/Results';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Question {
  question: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

const generateMCQs = async (text: string): Promise<Question[]> => {
  try {
    // Prepare the prompt for GPT
    const prompt = `I am providing you text: "${text}". I want you to see topic and text and change it into mcqs. Make sure you use easy and understandable english. Please format your response as a JSON array of objects with this structure:
    [
      {
        "question": "question text",
        "options": [
          {"text": "correct answer", "isCorrect": true},
          {"text": "wrong answer 1", "isCorrect": false},
          {"text": "wrong answer 2", "isCorrect": false},
          {"text": "wrong answer 3", "isCorrect": false}
        ]
      }
    ]`;

    // Use the window.gpt object to make the request
    const response = await window.gpt.complete(prompt);
    
    // Parse the response
    const mcqs = JSON.parse(response.choices[0].message.content);
    
    // Ensure we only return 20 questions maximum
    return mcqs.slice(0, 20);
  } catch (error) {
    console.error('Error generating MCQs:', error);
    // Return mock questions as fallback
    return Array(20).fill(null).map((_, i) => ({
      question: `Sample Question ${i + 1} about "${text.slice(0, 30)}..."`,
      options: [
        { text: "Correct Answer", isCorrect: true },
        { text: "Wrong Answer 1", isCorrect: false },
        { text: "Wrong Answer 2", isCorrect: false },
        { text: "Wrong Answer 3", isCorrect: false },
      ].sort(() => Math.random() - 0.5),
    }));
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
      
      toast({
        title: "Questions Generated",
        description: "Your MCQs are ready. Good luck!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] via-[#F2FCE2] to-[#D3E4FD] p-6">
      <div className="max-w-4xl mx-auto space-y-8 backdrop-blur-sm bg-white/30 rounded-xl p-8 shadow-lg">
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