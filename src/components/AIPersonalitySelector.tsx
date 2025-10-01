import { motion } from 'framer-motion';
import { useAIPersonalities } from '@/hooks/useAIPersonalities';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AIPersonalitySelectorProps {
  onPersonalityChange?: (personalityId: string) => void;
}

export const AIPersonalitySelector = ({ onPersonalityChange }: AIPersonalitySelectorProps) => {
  const { activePersonality, switchPersonality, getAllPersonalities } = useAIPersonalities();
  const personalities = getAllPersonalities();

  const handleSelect = (personalityId: any) => {
    switchPersonality(personalityId);
    onPersonalityChange?.(personalityId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {personalities.map((personality) => {
        const isActive = personality.id === activePersonality;
        
        return (
          <motion.div
            key={personality.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`p-4 cursor-pointer transition-all ${
                isActive 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSelect(personality.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`text-4xl w-16 h-16 flex items-center justify-center rounded-lg bg-gradient-to-br ${personality.color}`}>
                  {personality.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{personality.name}</h3>
                    {isActive && (
                      <Badge variant="default" className="text-xs">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {personality.description}
                  </p>
                </div>
              </div>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t"
                >
                  <p className="text-sm italic text-muted-foreground">
                    "{personality.greeting}"
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
