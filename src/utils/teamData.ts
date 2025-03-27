import { J } from "node_modules/framer-motion/dist/types.d-B50aGbjN";

export interface GameScore {
  opponent: string;
  score: string;
}

export interface TeamData {
  id: number;
  name: string;
  fridayScores: GameScore[];
  saturdayScores: GameScore[];
}

// Generate random score between 0-99
const generateRandomScore = (): string => {
  const teamScore = Math.floor(Math.random() * 100);
  const opponentScore = Math.floor(Math.random() * 100);
  return `${teamScore}-${opponentScore}`;
};

// Generate game scores for a team
const generateTeamScores = () => {
  const fridayScores: GameScore[] = [];
  const saturdayScores: GameScore[] = [];
  
  // Generate 5 scores for Friday
  for (let j = 1; j <= 5; j++) {
    fridayScores.push({
      opponent: `Opponent F${j}`,
      score: generateRandomScore()
    });
  }
  
  // Generate 5 scores for Saturday
  for (let j = 1; j <= 5; j++) {
    saturdayScores.push({
      opponent: `Opponent S${j}`,
      score: generateRandomScore()
    });
  }
  
  return { fridayScores, saturdayScores };
};

// Fetch team data from remote endpoint
export const fetchTeamData = async (): Promise<TeamData[]> => {
  console.log("Attempting to fetch scores_submitted data from: http://192.168.0.135:8765/scores_submitted");
  
  try {
    // Use a 5-second timeout for the fetch operation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('http://127.0.0.1:8765/scores_submitted', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch scores_submitted data: ${response.status} ${response.statusText}`);
    }
    
    const scoresData = await response.json();
    console.log("Successfully fetched scores_submitted data:", scoresData);
    
    // Create full team data with scores
    // The keys in scoresData are the team names
    return Object.keys(scoresData).map((teamName, index) => {
      // const { fridayScores, saturdayScores } = generateTeamScores();
      // console.log("team: ",teamName," value: ",fridayScores)
	  const fridayScores: GameScore[] = [];
	  const saturdayScores: GameScore[] = [];
    const rounds = Object.keys(scoresData[teamName]);
  
    // console.log(teamName[0])
      // Object.keys(scoresData).map((round, index) => {
      //   console.log("team: ",teamName," value: ", Object.keys(scoresData[teamName][0])
      // }
    

    // 5 scores for Friday
      for (let j = 0; j <= 4; j++) {
        let value: string
        value = "bye"
        // console.log(teamName, value)
        if(scoresData[teamName][rounds[j]]=="submitted" || scoresData[teamName][j]=="scheduled")
        {
          value = scoresData[teamName][rounds[j]]
        }
        fridayScores.push({
          opponent: `Opponent F${j}`,
          score: value
        });
        console.log(value)
        }

      // 5 scores for Saturday
      for (let j = 5; j <= 9; j++) {
        let value: string
        value = "bye"
        // console.log(teamName, value)
        if(scoresData[teamName][rounds[j]]=="submitted" || scoresData[teamName][j]=="scheduled")
        {
          value = scoresData[teamName][rounds[j]]
        }
        saturdayScores.push({
          opponent: `Opponent F${j}`,
          score: value
        });
        console.log(value)
        }

      // // 5 scores for Saturday
      // for (let j = 5; j <= 9; j++) {
      //   let value: string
      //   if(scoresData[teamName][key]==undefined)
      //   {
      //     value = "Bye"
      //   }
      //   else
      //   {
      //     value = scoresData[teamName][key]
      //   }
      //   saturdayScores.push({
      //     opponent: `Opponent S${j}`,
      //     score: value
      //   });
      // }

    // }
    
      return {
        id: index + 1,
        name: teamName, // Use the team name from the API response keys
        fridayScores,
        saturdayScores
      };
    });
  } catch (error) {
    console.error("Error fetching scores_submitted data:", error);
    // Fallback to generate data if fetch fails
    return generateTeamData();
  }
};

// Generate mock data for 40 teams (fallback)
export const generateTeamData = (): TeamData[] => {
  const teams: TeamData[] = [];
  
  for (let i = 1; i <= 40; i++) {
    const { fridayScores, saturdayScores } = generateTeamScores();
    
    teams.push({
      id: i,
      name: `Team ${i}`,
      fridayScores,
      saturdayScores
    });
  }
  
  return teams;
};

// Pre-generate the team data as a fallback
export const teamData = generateTeamData();
