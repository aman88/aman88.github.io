
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTeamData, teamData as fallbackData } from '../utils/teamData';
import TeamScoreCard from '../components/TeamScoreCard';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch team data using React Query
  const { data: teamData, isLoading, isError, refetch } = useQuery({
    queryKey: ['teamData'],
    queryFn: fetchTeamData,
    initialData: fallbackData,
    onSettled: (data, error) => {
      if (error) {
        toast({
          title: "Error fetching team data",
          description: "Using fallback data instead.",
          variant: "destructive",
        });
        console.error('Error fetching team data:', error);
      }
    }
  });
  
  // Filter teams based on search term
  const filteredTeams = teamData.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadClick = async () => {
    try {
      // Call the load endpoint
      const response = await fetch('http://66.44.119.201:8765/load');
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
      }
      
      // Set the last refreshed timestamp
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString());
      
      // Refresh the data
      await refetch();
      
      toast({
        title: "Data refreshed",
        description: "The latest scores have been loaded.",
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error refreshing data",
        description: "Failed to load the latest scores.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Game Score Dashboard
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Track scores for all {teamData.length} teams
          </motion.p>
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative max-w-md mx-auto mb-6"
          >
            <input
              type="text"
              placeholder="Search for a team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
            />
          </motion.div>
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          >
            <Button 
              onClick={handleLoadClick}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Scores
            </Button>
            {lastRefreshed && (
              <span className="text-sm text-gray-500">
                Last refreshed: {lastRefreshed}
              </span>
            )}
          </motion.div>
        </header>
        
        <section>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading team data...</span>
            </div>
          ) : filteredTeams.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-500">No teams found matching "{searchTerm}"</p>
            </motion.div>
          ) : (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {filteredTeams.map((team) => (
                <TeamScoreCard key={team.id} team={team} />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default Index;