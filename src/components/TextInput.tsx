import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface TextInputProps {
  onGenerate: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onGenerate }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const { toast } = useToast();

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isWithinFreeLimit = wordCount <= 200;
  const isWithinPaidLimit = wordCount <= 1000;

  const handleGenerate = () => {
    if (!isWithinFreeLimit && !hasPaid) {
      return;
    }
    
    if (!isWithinPaidLimit) {
      toast({
        title: "Text too long",
        description: "Please keep your text under 1000 words.",
        variant: "destructive",
      });
      return;
    }

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

  const handlePayment = () => {
    // Here you would integrate actual payment processing
    setHasPaid(true);
    toast({
      title: "Payment successful!",
      description: "You can now use up to 1000 words.",
      variant: "success",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Textarea
        placeholder="Enter your text here to generate MCQs..."
        className="min-h-[200px] p-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-primary/50"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <span className={`text-sm transition-colors duration-200 ${
          !isWithinFreeLimit && !hasPaid ? 'text-error' : 'text-gray-500'
        }`}>
          {wordCount} words 
          {!isWithinFreeLimit && !hasPaid && " (Exceeds free limit of 200 words)"}
          {hasPaid && " (Premium: 1000 words limit)"}
        </span>
        
        {!isWithinFreeLimit && !hasPaid ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="animate-pulse hover:animate-none">
                Upgrade to Premium ($2)
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Upgrade to Premium</AlertDialogTitle>
                <AlertDialogDescription>
                  Get access to generate MCQs from texts up to 1000 words for just $2.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handlePayment}>
                  Pay $2
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button 
            onClick={handleGenerate}
            disabled={isLoading || text.trim().length < 50 || (!isWithinFreeLimit && !hasPaid)}
            className={`bg-primary hover:bg-primary/90 transition-all duration-200 ${
              isLoading ? 'animate-pulse' : ''
            }`}
          >
            {isLoading ? "Generating..." : "Generate MCQs"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TextInput;