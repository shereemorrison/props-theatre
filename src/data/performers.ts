// Performer/Student data structure
export interface Performer {
  id: string; // Unique identifier (normalized name)
  name: string;
  commitment: string;
  award: boolean; // True if performer is in the award list
  awards?: string[]; // Optional array of award names
  photoUrl?: string; // Optional - add this when you have photos
  performances: PerformerPerformance[];
}

export interface PerformerPerformance {
  date: string; // "Monday, 3 November 2025"
  dayId: string; // Maps to day.id in performances.ts (e.g., "monday-24th")
  time: string; // "4:00 PM to 5:00 PM"
  stage: string; // "Stage One", "Stage Two", or "Stage Three"
  stageId: string; // Maps to stage.id in performances.ts (e.g., "stage-one-monday")
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Date strings
const DATES = {
  MONDAY: 'Monday, 3 November 2025',
  TUESDAY: 'Tuesday, 4 November 2025',
  WEDNESDAY: 'Wednesday, 5 November 2025',
  THURSDAY: 'Thursday, 6 November 2025',
} as const;

// Time strings
const TIMES = {
  FOUR_TO_FIVE: '4:00 PM to 5:00 PM',
  FIVE_TO_SIX: '5:00 PM to 6:00 PM',
  FIVE_THIRTY_TO_SIX_THIRTY: '5:30 PM to 6:30 PM',
  SIX_TO_SEVEN: '6:00 PM to 7:00 PM',
} as const;

// Stage strings
const STAGES = {
  ONE: 'Stage One',
  TWO: 'Stage Two',
  THREE: 'Stage Three',
} as const;

// Award-eligible performers (from spreadsheet)
const AWARD_ELIGIBLE_PERFORMERS = new Set([
  'Kayleigh Hutchinson', 'Skylar Shard', 'Tahlia Petrie', 'Liam Westbury', 'Ella Singe',
  'George Macumber', 'Lilly Nadin', 'Keira Heath', 'Eadie Glatz', 'George Clohesy',
  'Milla Web', 'Brock Kostos', 'Charlotte McAuliffe', 'Grace Johnstone', 'Sienna Davey',
  'Ella Manypeney', 'Phillipa Kohlman', 'Dominic Petterlin', 'Madeline Petterlin', 'Arlie Allen',
  'Letty Sendy', 'Otto Luedecke', 'Taleitha Perrow', 'Emily Ede', 'Greta Sbaglia',
  'Ruby Sait', 'Alyssa Delmenico', 'Malis Worrell', 'Reyansh Thaker', 'Cora Critch',
  'Kennedy Murphey', 'Lydia Deepan', 'Millie Jensen', 'Corazon Mangantulao', 'Poppy Stanaway',
  'Marcelle Varma', 'Eve Martin', 'Georgina Sbaglia', 'Charlotte Perryman', 'Ruby Robson',
  'Matilda Robertson', 'Sara Douglas', 'Leo Epps', 'Lilly Foster', 'Charlotte Bysouth',
  'Peyton Bish', 'Scarlett Besley', 'Athena Jones', 'Henry Connolly', 'Arlo Sergi',
  'Jack Carter', 'Darby Scott-Anderson', 'Maggie Deacon', 'Paris Carr', 'Alira / Steve Hill',
  'Ivy Burdeu', 'Amelia O\'Rielly', 'Arabella McGowen', 'Ellen Frigerio', 'Macy Macumber',
  'Neve Duthie', 'Charlie Wills', 'Elsie Rice', 'Olivia Osborne', 'Nellie Ratcliffe',
  'Ewan Dellar', 'Jackson Petty-Willis', 'Abbygail Kay', 'Amy Clarkson', 'Clementine Gray',
  'Maggie Amarant', 'Hazel Ziffer', 'Audrey Savage', 'Finn Cunningham', 'Bailey Norton',
  'Victoria Tomkins', 'Alice Stockx', 'Tamati McLarty', 'Paige DeJong', 'Tahlia Giffard',
  'Darcy Gibson', 'Finn Beattie', 'Olivia Wells', 'Innes Downie', 'Isabella Wiegard', 'Sara Bates',
  'Isabella Wiegard', 'Amelia Watkins', 'Ella Bailey', 'Ewan Dellar', 'Dakota East',
  'Charles Smith', 'Jed Strickland', 'Henry Beal', 'Tahlia Roe', 'Ziggy Naidoo',
  'Alira Hill', 'Elsie Untwan', 'Alexia Read', 'Jasper Walton', 'Layla Ware'
]);

// Valid commitment values for award-eligible performers
const VALID_AWARD_COMMITMENTS = new Set([
  '2 years of drama',
  '4 years of drama',
  '5 years of drama',
  '6 years of drama',
  '7 years of drama',
  '8 years of drama',
  '9 years of drama',
  '10 years of drama',
  'First Year Pin November',
  'First Year Pin Nov', // Alternative spelling
  'First Year Pin June'
]);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function normalizeCommitment(commitment: string): string {
  // Handle "6 years" -> "6 years of drama"
  if (/^\d+\s+years?$/.test(commitment.trim())) {
    return commitment.trim() + ' of drama';
  }
  // Handle "First Year Pin Nov" -> "First Year Pin November"
  if (commitment.includes('First Year Pin Nov') && !commitment.includes('November')) {
    return commitment.replace('Nov', 'November');
  }
  return commitment;
}

function isInAwardList(name: string): boolean {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const firstName = name.split(/[\s\/]/)[0].toLowerCase();
  const lastName = name.split(/[\s\/]/).pop()?.toLowerCase() || '';
  
  return Array.from(AWARD_ELIGIBLE_PERFORMERS).some(awardName => {
    const awardNormalized = awardName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const awardFirstName = awardName.split(/[\s\/]/)[0].toLowerCase();
    const awardLastName = awardName.split(/[\s\/]/).pop()?.toLowerCase() || '';
    
    // Exact match
    if (normalizedName === awardNormalized) return true;
    
    // First name + last name match (handles "Alira Hill" vs "Alira / Steve Hill")
    if (firstName === awardFirstName && lastName === awardLastName) return true;
    
    return false;
  });
}

function isValidAwardCommitment(commitment: string): boolean {
  const normalizedCommitment = normalizeCommitment(commitment);
  return VALID_AWARD_COMMITMENTS.has(normalizedCommitment);
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function mapDateToDayId(date: string): string {
  const dateMap: Record<string, string> = {
    [DATES.MONDAY]: 'monday-24th',
    [DATES.TUESDAY]: 'tuesday-25th',
    [DATES.WEDNESDAY]: 'wednesday-26th',
    [DATES.THURSDAY]: 'thursday-27th',
  };
  return dateMap[date] || date.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function generateStageId(dayId: string, stage: string, date: string, time: string): string {
  const stageNumber = stage.replace('Stage ', '').toLowerCase();
  const dayPart = dayId.split('-')[0]; // "monday", "tuesday", etc.

  // Special handling for Thursday Stage Two (multiple performances)
  if (dayId === 'thursday-27th' && stage === STAGES.TWO) {
    if (time === TIMES.FIVE_TO_SIX) {
      return 'stage-two-thursday-pirated';
    } else if (time === TIMES.FOUR_TO_FIVE) {
      return 'stage-two-thursday-our-space';
    } else if (time === TIMES.FIVE_THIRTY_TO_SIX_THIRTY) {
      return 'stage-two-thursday-bad-side';
    }
  }

  return `stage-${stageNumber}-${dayPart}`;
}

function isFirstYearPin(commitment: string): boolean {
  return commitment.toLowerCase().includes('first year pin');
}

function createPerformer(
  name: string,
  commitment: string,
  date: string,
  time: string,
  stage: string,
  awards?: string[]
): Performer {
  const dayId = mapDateToDayId(date);
  const award = isInAwardList(name);
  
  // Show commitment if:
  // 1. Performer is in award list AND has a valid commitment, OR
  // 2. Performer has First Year Pin (regardless of award list status)
  let finalCommitment = '(None)';
  if (award && isValidAwardCommitment(commitment)) {
    finalCommitment = commitment;
  } else if (isFirstYearPin(commitment)) {
    finalCommitment = commitment;
  }
  
  return {
    id: normalizeName(name),
    name,
    commitment: finalCommitment,
    award,
    awards,
    performances: [
      {
        date,
        dayId,
        time,
        stage,
        stageId: generateStageId(dayId, stage, date, time)
      }
    ]
  };
}

// ============================================================================
// PERFORMER DATA (Organized by Day/Stage/Time)
// ============================================================================

interface PerformerEntry {
  name: string;
  commitment: string;
  awards?: string[];
}

interface PerformanceGroup {
  date: string;
  time: string;
  stage: string;
  performers: PerformerEntry[];
}

// Raw performer data organized hierarchically
const performerData: PerformanceGroup[] = [
  // MONDAY
  {
    date: DATES.MONDAY,
    time: TIMES.FOUR_TO_FIVE,
    stage: STAGES.ONE,
    performers: [
      { name: 'Amelia Beukes', commitment: 'First Year Pin June' },
      { name: 'Arie Pope', commitment: 'First Year Pin Nov' },
      { name: 'Dakota East', commitment: '2 years of drama' },
      { name: 'Eadie Glatz', commitment: '2 years of drama' },
      { name: 'Ella Henshall', commitment: '5 years of drama' },
      { name: 'Gabrielle Hall', commitment: '(None)' },
      { name: 'Leo Epps', commitment: '2 years of drama' },
      { name: 'Lydia Deepan', commitment: '2 years of drama' },
      { name: 'Penelope Hall', commitment: 'First Year Pin June' },
      { name: 'Sara Bates', commitment: '2 years of drama' },
      { name: 'Willow Fuamatu', commitment: 'Beginner' },
    ],
  },
  {
    date: DATES.MONDAY,
    time: TIMES.FIVE_TO_SIX,
    stage: STAGES.TWO,
    performers: [
      { name: 'Charlie Wills', commitment: '5 years of drama' },
      { name: 'Cora Critch', commitment: '2 years of drama' },
      { name: 'Dante Jameson', commitment: '2 years of drama' },
      { name: 'Darby Scott-Anderson', commitment: '4 years of drama' },
      { name: 'Ella Fagan', commitment: '5 years of drama' },
      { name: 'Ella Singe', commitment: '2 years of drama' },
      { name: 'George Clohesy', commitment: '2 years of drama' },
      { name: 'Isla Mealmaker', commitment: '4 years of drama' },
      { name: 'Ivy Burdeu', commitment: '4 years of drama' },
      { name: 'Jackson Petty-Willis', commitment: '5 years of drama' },
      { name: 'Kennedy Murphey', commitment: '2 years of drama' },
      { name: 'Lilly Nadin', commitment: '2 years of drama' },
      { name: 'Logan Shard', commitment: '3 years of drama' },
      { name: 'Maggie Amarant', commitment: '4 years of drama' },
      { name: 'Nellie Ratcliffe', commitment: '4 years of drama' },
      { name: 'Olivia Osborne', commitment: '5 years of drama' },
    ],
  },
  {
    date: DATES.MONDAY,
    time: TIMES.SIX_TO_SEVEN,
    stage: STAGES.THREE,
    performers: [
      { name: 'Aida Burns', commitment: 'First Year Pin November' },
      { name: 'Amelia Watkins', commitment: '2 years of drama' },
      { name: 'Ella Bailey', commitment: '2 years of drama' },
      { name: 'Ewan Dellar', commitment: '4 years of drama' },
      { name: 'Indiana Houghton', commitment: '5 years of drama' },
      { name: 'Isabella Wiegard', commitment: '9 years of drama' },
      { name: 'Keira Heath', commitment: '2 years of drama' },
      { name: 'Lucy Cummings', commitment: '4 years of drama' },
      { name: 'Maggie Deacon', commitment: '4 years of drama' },
      { name: 'Milla Gregg', commitment: 'Intermediate' },
      { name: 'Milla Web', commitment: '2 years of drama' },
      { name: 'Peyton Bish', commitment: '4 years of drama' },
      { name: 'Tahlia Giffard', commitment: '6 years of drama' },
      { name: 'Zarah Mealmaker', commitment: '3 years of drama' },
    ],
  },

  // TUESDAY
  {
    date: DATES.TUESDAY,
    time: TIMES.FOUR_TO_FIVE,
    stage: STAGES.ONE,
    performers: [
      { name: 'Billie Lothian', commitment: 'Beginner' },
      { name: 'Charlee Russell', commitment: '2 years of drama' },
      { name: 'Emily Ede', commitment: '2 years of drama' },
      { name: 'George Dewhurst', commitment: '5 years of drama' },
      { name: 'Hannah Rodd', commitment: '(None)' },
      { name: 'Isla Rorke', commitment: '3 years of drama' },
      { name: 'Matilda Engi', commitment: '4 years of drama' },
      { name: 'Mila McMillan', commitment: 'First Year Pin June' },
      { name: 'Poppy Stanaway', commitment: '2 years of drama' },
      { name: 'Ruby Sait', commitment: '2 years of drama' },
      { name: 'Sophie Breewel', commitment: '2 years of drama' },
      { name: 'Teddy Thomson', commitment: '3 years of drama' },
    ],
  },
  {
    date: DATES.TUESDAY,
    time: TIMES.FOUR_TO_FIVE,
    stage: STAGES.TWO,
    performers: [
      { name: 'Amy Clarkson', commitment: '5 years of drama' },
    ],
  },
  {
    date: DATES.TUESDAY,
    time: TIMES.FIVE_TO_SIX,
    stage: STAGES.TWO,
    performers: [
      { name: 'Anna Francis', commitment: 'First Year Pin Nov' },
      { name: 'Arlie Allen', commitment: '2 years of drama' },
      { name: 'Eliza Hepburn', commitment: '(None)' },
      { name: 'Elsie Rice', commitment: '5 years of drama' },
      { name: 'Freddy Campbell', commitment: '4 years of drama' },
      { name: 'Grace Beattie', commitment: 'First Year Pin June' },
      { name: 'Greta Sbaglia', commitment: '2 years of drama' },
      { name: 'Kaia Langeder', commitment: 'Beginner' },
      { name: 'Leila Skan', commitment: '2 years of drama' },
      { name: 'Letty Sendy', commitment: '2 years of drama' },
      { name: 'Memphis June Meggs', commitment: '5 years of drama' },
      { name: 'Olivia Ogeimi', commitment: '(None)' },
      { name: 'Otto Luedecke', commitment: '2 years of drama' },
      { name: 'Sam Miller', commitment: '4 years of drama' },
    ],
  },
  {
    date: DATES.TUESDAY,
    time: TIMES.SIX_TO_SEVEN,
    stage: STAGES.THREE,
    performers: [
      { name: 'Abbygail Kay', commitment: '4 years of drama' },
      { name: 'Amelia O\'Rielly', commitment: '4 years of drama' },
      { name: 'Athena Jones', commitment: '4 years of drama' },
      { name: 'Bailey Norton', commitment: '4 years of drama' },
      { name: 'Charlotte Perryman', commitment: '2 years of drama' },
      { name: 'Ellen Frigerio', commitment: '4 years of drama' },
      { name: 'Eve Martin', commitment: '2 years of drama' },
      { name: 'Finn Beattie', commitment: '6 years of drama' },
      { name: 'George Macumber', commitment: '2 years of drama' },
      { name: 'Georgina Sbaglia', commitment: '2 years of drama' },
      { name: 'Hazel Ziffer', commitment: '4 years of drama' },
      { name: 'Liam Westbury', commitment: '2 years of drama' },
      { name: 'Olivia Wells', commitment: '6 years of drama' },
      { name: 'Ruby Robson', commitment: '2 years of drama' },
      { name: 'Taleitha Perrow', commitment: '2 years of drama' },
      { name: 'Victoria Tomkins', commitment: '6 years of drama' },
    ],
  },

  // WEDNESDAY
  {
    date: DATES.WEDNESDAY,
    time: TIMES.FOUR_TO_FIVE,
    stage: STAGES.ONE,
    performers: [
      { name: 'Alyssa Delmenico', commitment: '2 years of drama' },
      { name: 'Amelia Greening', commitment: '(None)' },
      { name: 'Harper Ridgeway', commitment: '3 years of drama' },
      { name: 'Henry Beal', commitment: '2 years of drama' },
      { name: 'Ivy Spicer', commitment: 'First Year Pin June' },
      { name: 'Josie White', commitment: 'Intermediate' },
      { name: 'Leo Turner', commitment: 'Beginner' },
      { name: 'Lilly Foster', commitment: '2 years of drama' },
      { name: 'Millie Haydock', commitment: '3 years of drama' },
      { name: 'Reyansh Thaker', commitment: '2 years of drama' },
      { name: 'Scarlett Besley', commitment: '2 years of drama' },
      { name: 'Tahlia Roe', commitment: '2 years of drama' },
      { name: 'Ziggy Naidoo', commitment: '2 years of drama' },
    ],
  },
  {
    date: DATES.WEDNESDAY,
    time: TIMES.FIVE_TO_SIX,
    stage: STAGES.TWO,
    performers: [
      { name: 'Aaliyah O\'Meara', commitment: 'First Year Pin Nov' },
      { name: 'Alex Hicks', commitment: 'First Year Pin June' },
      { name: 'Alice Stockx', commitment: '4 years of drama' },
      { name: 'Ava Giffard', commitment: 'Beginner' },
      { name: 'Charles Smith', commitment: '2 years of drama' },
      { name: 'Charlotte McAuliffe', commitment: '2 years of drama' },
      { name: 'Clementine Gray', commitment: '4 years of drama' },
      { name: 'Jackson Spicer', commitment: '(None)' },
      { name: 'Jed Strickland', commitment: '2 years of drama' },
      { name: 'Lucy Mclean', commitment: '4 years of drama' },
      { name: 'Malis Worrell', commitment: '2 years of drama' },
      { name: 'Matilda Robertson', commitment: '2 years of drama' },
      { name: 'Matilda Stubbins', commitment: 'Beginner' },
      { name: 'Olive Gladstone', commitment: '2 years of drama' },
      { name: 'Oliver Grange', commitment: '3 years of drama' },
      { name: 'Paige DeJong', commitment: '6 years of drama' },
      { name: 'Rebekah Mclean', commitment: '(None)' },
    ],
  },
  {
    date: DATES.WEDNESDAY,
    time: TIMES.SIX_TO_SEVEN,
    stage: STAGES.THREE,
    performers: [
      { name: 'Alira Hill', commitment: '4 years of drama' },
      { name: 'Arlo Sergi', commitment: '4 years of drama' },
      { name: 'Eva Lees', commitment: '4 years of drama' },
      { name: 'Hannah Torney', commitment: 'First Year Pin June' },
      { name: 'Innes Downie', commitment: '8 years of drama' },
      { name: 'Jack Carter', commitment: '4 years of drama' },
      { name: 'Jaymen Mannix Pascoe', commitment: '2 years of drama' },
      { name: 'Neve Duthie', commitment: '4 years of drama' },
      { name: 'Sara Douglas', commitment: '2 years of drama' },
      { name: 'Tamati McLarty', commitment: '4 years of drama' },
    ],
  },

  // THURSDAY
  {
    date: DATES.THURSDAY,
    time: TIMES.FOUR_TO_FIVE,
    stage: STAGES.ONE,
    performers: [
      { name: 'Charlotte Vandervalk', commitment: '1 year of drama' },
      { name: 'Dominic Petterlin', commitment: '2 years of drama' },
      { name: 'Dominica Mangantulao', commitment: 'First Year Pin June' },
      { name: 'Elsie Sharp', commitment: 'Intermediate' },
      { name: 'Elsie Untwan', commitment: '2 years of drama' },
      { name: 'Ingrid Campbell', commitment: '2 years of drama' },
      { name: 'Millie Jensen', commitment: '2 years of drama' },
      { name: 'Minnie Petterlin', commitment: '2 years of drama' },
      { name: 'Trixie Hepburn', commitment: '(None)' },
    ],
  },
  {
    date: DATES.THURSDAY,
    time: TIMES.FOUR_TO_FIVE,
    stage: STAGES.TWO,
    performers: [
      { name: 'Arabella McGowen', commitment: '4 years of drama' },
      { name: 'Charlie Flack', commitment: 'Intermediate' },
      { name: 'Erin Mills', commitment: 'Beginner' },
      { name: 'James Johnson', commitment: '3 years of drama' },
      { name: 'Jane Lonsdale', commitment: '5 years of drama' },
      { name: 'Lotti Anstee', commitment: '3 years of drama' },
      { name: 'Macy Camm', commitment: '4 years of drama' },
      { name: 'Sienna Davey', commitment: '2 years of drama' },
      { name: 'Susannah Mayne', commitment: 'Intermediate' },
      { name: 'Thomas McColl', commitment: 'Beginner' },
      { name: 'Willow Johnson', commitment: '2 years of drama' },
    ],
  },
  {
    date: DATES.THURSDAY,
    time: TIMES.FIVE_TO_SIX,
    stage: STAGES.TWO,
    performers: [
      { name: 'Alexia Read', commitment: '2 years of drama' },
      { name: 'April Muscovich', commitment: '3 years of drama' },
      { name: 'Avery Murtagh', commitment: '4 years of drama' },
      { name: 'Blaise Carr', commitment: 'First Year Pin June' },
      { name: 'Brock Kostos', commitment: '2 years of drama' },
      { name: 'Corazon Mangantulao', commitment: '2 years of drama' },
      { name: 'Ella Manypeney', commitment: '2 years of drama' },
      { name: 'Isabella Gill', commitment: '3 years of drama' },
      { name: 'Jasper Walton', commitment: '2 years of drama' },
      { name: 'Logan Crothers', commitment: '(None)' },
      { name: 'Marcelle Varma', commitment: '2 years of drama' },
      { name: 'Phillipa Kohlman', commitment: '2 years of drama' },
      { name: 'Sophie Pedrotti', commitment: 'First Year Pin June' },
    ],
  },
  {
    date: DATES.THURSDAY,
    time: TIMES.FIVE_THIRTY_TO_SIX_THIRTY,
    stage: STAGES.TWO,
    performers: [
      { name: 'Anaïs Lyons', commitment: '2 years of drama' },
      { name: 'Charlotte Bysouth', commitment: '2 years of drama' },
      { name: 'Isabelle Smith', commitment: '5 years of drama' },
      { name: 'Kaylee Hitchcock', commitment: '(None)' },
      { name: 'Kayleigh White', commitment: '(None)' },
      { name: 'Layla Ware', commitment: '2 years of drama' },
      { name: 'Mila Holmfield', commitment: '4 years of drama' },
      { name: 'Nora Thompson', commitment: 'First Year Pin June' },
      { name: 'Olivia Akers', commitment: 'Intermediate' },
      { name: 'Rachel Toifl', commitment: 'Beginner' },
      { name: 'Skylar Shard', commitment: '2 years of drama' },
      { name: 'Victoria May Yong', commitment: '3 years of drama' },
    ],
  },
];

// ============================================================================
// PROCESS DATA INTO PERFORMERS ARRAY
// ============================================================================

// Group performers by name and merge their performances
const performersMap = new Map<string, Performer>();

performerData.forEach(group => {
  group.performers.forEach(entry => {
    const existingPerformer = performersMap.get(entry.name);
    
    if (existingPerformer) {
      // Add performance to existing performer
      const dayId = mapDateToDayId(group.date);
      existingPerformer.performances.push({
        date: group.date,
        dayId,
        time: group.time,
        stage: group.stage,
        stageId: generateStageId(dayId, group.stage, group.date, group.time)
      });
    } else {
      // Create new performer
      const performer = createPerformer(
        entry.name,
        entry.commitment,
        group.date,
        group.time,
        group.stage,
        entry.awards
      );
      performersMap.set(entry.name, performer);
    }
  });
});

// Convert map to array
export const performers: Performer[] = Array.from(performersMap.values());

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export function getPerformersByDay(dayId: string): Performer[] {
  return performers.filter(performer =>
    performer.performances.some(perf => perf.dayId === dayId)
  );
}

export function getPerformersByStage(stageId: string): Performer[] {
  return performers.filter(performer =>
    performer.performances.some(perf => perf.stageId === stageId)
  );
}

export function getPerformersByStageAndDay(stageId: string, dayId: string): Performer[] {
  return performers.filter(performer =>
    performer.performances.some(perf => perf.stageId === stageId && perf.dayId === dayId)
  );
}

export function getPerformerById(id: string): Performer | undefined {
  return performers.find(p => p.id === id);
}

export function getPerformerByName(name: string): Performer | undefined {
  return performers.find(p => p.name === name);
}
