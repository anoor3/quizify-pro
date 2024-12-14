import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      throw new Error('No text provided');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating MCQs for text:', text.substring(0, 50) + '...');

    const prompt = `Generate multiple choice questions based on this text: "${text}". 
    Create questions that test understanding of key concepts. 
    Make sure to use simple, clear English.
    Format your response as a JSON array with this exact structure:
    [
      {
        "question": "What is the main topic discussed?",
        "options": [
          {"text": "correct answer", "isCorrect": true},
          {"text": "wrong answer 1", "isCorrect": false},
          {"text": "wrong answer 2", "isCorrect": false},
          {"text": "wrong answer 3", "isCorrect": false}
        ]
      }
    ]
    Generate at least 5 questions, maximum 20 questions.
    Ensure each question has exactly one correct answer.
    Make the wrong answers plausible but clearly incorrect.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates multiple choice questions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate questions');
    }

    const data = await response.json();
    console.log('Received response from OpenAI');
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const mcqs = JSON.parse(data.choices[0].message.content);
    console.log(`Generated ${mcqs.length} questions successfully`);

    return new Response(JSON.stringify(mcqs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-mcqs function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});