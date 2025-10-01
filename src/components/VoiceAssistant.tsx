import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceInterface } from '@/hooks/useVoiceInterface';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface VoiceAssistantProps {
  onTranscript?: (text: string) => void;
  personalityGreeting?: string;
}

export const VoiceAssistant = ({ onTranscript, personalityGreeting }: VoiceAssistantProps) => {
  const {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  } = useVoiceInterface();

  const [displayedTranscript, setDisplayedTranscript] = useState('');

  useEffect(() => {
    if (transcript) {
      setDisplayedTranscript(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript?.(transcript);
    }
  }, [transcript, isListening]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakGreeting = () => {
    if (personalityGreeting && !isSpeaking) {
      speak(personalityGreeting);
    }
  };

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Voice features are not supported in your browser. Please use Chrome, Edge, or Safari.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Voice Assistant</h3>
          {personalityGreeting && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeakGreeting}
              disabled={isSpeaking}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isSpeaking ? 'Speaking...' : 'Hear Greeting'}
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1,
              opacity: isListening ? [1, 0.8, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isListening ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Button
              size="lg"
              onClick={handleVoiceToggle}
              className={`w-20 h-20 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
          </motion.div>

          <p className="text-sm text-muted-foreground">
            {isListening ? 'Listening...' : 'Click to speak'}
          </p>

          <AnimatePresence>
            {displayedTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full p-4 bg-muted rounded-lg"
              >
                <p className="text-sm">
                  <span className="font-semibold">You said:</span> {displayedTranscript}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>AI is speaking...</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={stopSpeaking}
              >
                Stop
              </Button>
            </motion.div>
          )}
        </div>

        <div className="text-xs text-center text-muted-foreground pt-4 border-t">
          <p>Tip: Speak clearly and wait for the AI to finish before speaking again</p>
        </div>
      </div>
    </Card>
  );
};
