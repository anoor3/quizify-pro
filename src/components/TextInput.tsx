import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface TextInputProps {
  onGenerate: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onGenerate }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (text.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please enter at least 50 characters to generate meaningful questions.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    onGenerate(text);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Textarea
        placeholder="Enter your text here to generate MCQs..."
        className="min-h-[200px] p-4 text-lg"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {text.length} characters (minimum 50)
        </span>
        <Button 
          onClick={handleGenerate}
          disabled={isLoading || text.trim().length < 50}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Generating..." : "Generate MCQs"}
        </Button>
      </div>
    </div>
  );
};

export default TextInput;