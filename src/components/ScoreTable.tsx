
import React from 'react';
import { GameScore } from '../utils/teamData';

interface ScoreTableProps {
  day: string;
  scores: GameScore[];
}

const ScoreTable: React.FC<ScoreTableProps> = ({ day, scores }) => {
  // Function to get status based on score
  const getGameStatus = (score: string): 'Submitted' | 'Scheduled' | 'Bye' => {
    // We'll use a deterministic approach based on the score string
    // const [teamScore, opponentScore] = score.split('-').map(Number);
    
    if (score == "submitted") return 'Submitted';
    if (score == "scheduled") return 'Scheduled';
    return 'Bye';
  };

  // Function to get row background color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Bye':
        return 'bg-gray-100'; // light grey
      case 'Submitted':
        return 'bg-green-50'; // light green
      case 'Scheduled':
        return 'bg-red-50'; // light red
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{day}</h3>
      <div className="overflow-hidden rounded-lg border border-gray-200/70 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200/60">
          <thead className="bg-gray-50/80">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Round
              </th>
              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/60">
            {scores.map((score, index) => {
              const status = getGameStatus(score.score);
              const rowColorClass = getStatusColor(status);
              
              return (
                <tr key={index} className={`hover:bg-gray-50/50 transition-colors ${rowColorClass}`}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    Round {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreTable;
