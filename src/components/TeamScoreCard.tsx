
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamData } from '../utils/teamData';
import ScoreTable from './ScoreTable';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TeamScoreCardProps {
  team: TeamData;
}

const TeamScoreCard: React.FC<TeamScoreCardProps> = ({ team }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      layout
      className="team-card glass-card rounded-xl overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="px-6 py-4 cursor-pointer flex items-center justify-between"
        onClick={toggleExpand}
      >
        <h2 className="text-xl font-medium text-gray-800">{team.name}</h2>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-6 pb-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <ScoreTable day="Friday" scores={team.fridayScores} />
              <ScoreTable day="Saturday" scores={team.saturdayScores} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeamScoreCard;
