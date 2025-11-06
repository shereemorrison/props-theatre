// Performer/Student data structure
export interface Performer {
  id: string; // Unique identifier (normalized name)
  name: string;
  commitment: string;
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

// Helper function to normalize names for IDs
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Helper function to map date string to dayId
function mapDateToDayId(date: string): string {
  const dateMap: Record<string, string> = {
    'Monday, 3 November 2025': 'monday-24th',
    'Tuesday, 4 November 2025': 'tuesday-25th',
    'Wednesday, 5 November 2025': 'wednesday-26th',
    'Thursday, 6 November 2025': 'thursday-27th',
    'Friday, 7 November 2025': 'friday-7th',
  };
  return dateMap[date] || date.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Helper function to generate stageId from dayId, stage, and time
function generateStageId(dayId: string, stage: string, date: string, time: string): string {
  const stageNumber = stage.replace('Stage ', '').toLowerCase();
  const dayPart = dayId.split('-')[0]; // "monday", "tuesday", etc.
  
  // Special handling for Thursday Stage Two (multiple performances)
  if (dayId === 'thursday-27th' && stage === 'Stage Two') {
    if (time === '5:00 PM to 6:00 PM') {
      return 'stage-two-thursday-our-space';
    } else if (time === '5:30 PM to 6:30 PM') {
      return 'stage-two-thursday-bad-side';
    } else if (time === '6:00 PM to 7:00 PM') {
      return 'stage-two-thursday-pirated';
    }
  }
  
  return `stage-${stageNumber}-${dayPart}`;
}

// Helper function to create a performer entry
function createPerformer(
  name: string,
  commitment: string,
  date: string,
  time: string,
  stage: string,
  awards?: string[]
): Performer {
  const dayId = mapDateToDayId(date);
  return {
    id: normalizeName(name),
    name,
    commitment,
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

// Performer data extracted from spreadsheet
export const performers: Performer[] = [
  // MONDAY - Stage One (4:00 PM to 5:00 PM)
  createPerformer('Arie Pope', 'First Year Pin Nov', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Ava Hawkey', '1 year of drama', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Chaise Pellas', 'Beginner', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Dakota East', '2 years of drama', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Eadie Glatz', '3 years of drama', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'), //3 years of drama
  createPerformer('Ella Henshall', '5 years of drama', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Gabrielle Hall', '(None)', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Leo Epps', '3 years of drama', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Lydia Deepan', '4 years of drama', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Penelope Hall', 'First Year Pin June', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Sara Bates', 'Intermediate', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Willow Fuamatu', 'Beginner', 'Monday, 3 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),

  // MONDAY - Stage Two (5:00 PM to 6:00 PM)
  createPerformer('Cora Critch', 'Beginner', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Dante Jameson', '2 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Darby Scott-Anderson', '3 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Ella Fagan', '5 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Ella Singe', '(None)', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('George Clohesy', '3 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Isla Mealmaker', '4 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Ivy Burdeu', 'First Year Pin June', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Jackson Petty-Willis', 'Intermediate', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Kennedy Murphey', 'Beginner', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Lilly Nadin', '2 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Logan Shard', '3 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Maggie Amarant', '5 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Nellie Ratcliffe', '(None)', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Olivia Osborne', '3 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Sofia Masullo', '4 years of drama', 'Monday, 3 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),

  // MONDAY - Stage Three (6:00 PM to 7:00 PM)
  createPerformer('Amelia Watkins', 'Beginner', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Ella Bailey', '2 years of drama', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Ewan Dellar', '3 years of drama', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Indiana Houghton', '5 years of drama', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Isabella Wiegard', '(None)', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Keira Heath', '3 years of drama', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Lucy Cummings', '4 years of drama', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Maggie Deacon', 'First Year Pin June', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Milla Gregg', 'Intermediate', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Peyton Bish', 'Beginner', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Tahlia Giffard', '2 years of drama', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Zarah Mealmaker', '3 years of drama', 'Monday, 3 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),

  // TUESDAY - Stage One (4:00 PM to 5:00 PM)
  createPerformer('Billie Lothian', 'Beginner', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Charlee Russell', '2 years of drama', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Emily Ede', '3 years of drama', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('George Dewhurst', '5 years of drama', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Hannah Rodd', '(None)', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Isla Rorke', '3 years of drama', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Matilda Engi', '4 years of drama', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Mila McMillan', 'First Year Pin June', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Poppy Stanaway', 'Intermediate', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Ruby Sait', 'Beginner', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Sophie Breewel', '2 years of drama', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Teddy Thomson', '3 years of drama', 'Tuesday, 4 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),

  // TUESDAY - Stage Two (5:00 PM to 6:00 PM)
  createPerformer('Arlie Allen', '5 years of drama', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Eliza Hepburn', '(None)', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Elsie Rice', '3 years of drama', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Freddy Campbell', '4 years of drama', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Grace Beattie', 'First Year Pin June', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Greta Sbaglia', 'Intermediate', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Kaia Langeder', 'Beginner', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Leila Skan', '2 years of drama', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Letty Sendy', '3 years of drama', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Memphis June Meggs', '5 years of drama', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Olivia Ogeimi', '(None)', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Otto Luedecke', '3 years of drama', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Sam Miller', '4 years of drama', 'Tuesday, 4 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),

  // TUESDAY - Stage Three (6:00 PM to 7:00 PM)
  createPerformer('Amelia O\'Rielly', 'First Year Pin June', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Athena Jones', 'Intermediate', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Bailey Norton', 'Beginner', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Charlotte Perryman', '2 years of drama', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Ellen Frigerio', '3 years of drama', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'), // was 3 years of drama - check this means 3 years
  createPerformer('Eve Martin', '5 years of drama', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),// was 5 years of drama - check this means 5 years
  createPerformer('Finn Beattie', '(None)', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('George Macumber', '3 years of drama', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Georgina Sbaglia', '4 years of drama', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Hazel Zifler', 'First Year Pin June', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Liam Westbury', 'Intermediate', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Olivia Wells', 'Beginner', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Ruby Robson', '2 years of drama', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Taleitha Perrow', '3 years of drama', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),  // was 3 years of drama - check this means 3 years
  createPerformer('Victoria Tomkins', '5 years of drama', 'Tuesday, 4 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'), // was 5 years of drama - check this means 5 years

  // WEDNESDAY - Stage One (4:00 PM to 5:00 PM)
  createPerformer('Amelia Greening', '(None)', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Harper Ridgeway', '3 years of drama', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Henry Beal', '4 years of drama', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Ivy Spicer', 'First Year Pin June', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Josie White', 'Intermediate', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Leo Turner', 'Beginner', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Lilly Foster', '2 years of drama', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Millie Haydock', '3 years of drama', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'), //was 3 years of drama - check this means 3 years
  createPerformer('Reyansh Thaker', '5 years of drama', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'), // was 5 year 2025 - check this means 3 years
  createPerformer('Scarlett Besley', '(None)', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Talia Roe', '3 years of drama', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Ziggy Naidoo', '4 years of drama', 'Wednesday, 5 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),

  // WEDNESDAY - Stage Two (5:00 PM to 6:00 PM)
  createPerformer('Alex Hicks', 'First Year Pin June', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Alice Stockx', 'Intermediate', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Ava Giffard', 'Beginner', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Charles Smith', '2 years of drama', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Charlotte McAuliffe', '3 years of drama', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Clementine Gray', '5 years of drama', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'), //was 3 years of drama - check this means 3 years
  createPerformer('Jackson Spicer', '(None)', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'), //was 5 year 2025 - check this means 3 years
  createPerformer('Jed Strickland', '3 years of drama', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Lucy Mclean', '4 years of drama', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Malis Worrell', 'First Year Pin June', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Matilda Robertson', 'Intermediate', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Matilda Stubbins', 'Beginner', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Olive Gladstone', '2 years of drama', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Oliver Grange', '3 years of drama', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Paige Delong', '5 years of drama', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Rebekah Mclean', '(None)', 'Wednesday, 5 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),

  // WEDNESDAY - Stage Three (6:00 PM to 7:00 PM)
  createPerformer('Arlo Sergi', '3 years of drama', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Eva Lees', '4 years of drama', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Hannah Torney', 'First Year Pin June', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Innes Downie', 'Intermediate', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Jack Carter', 'Beginner', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Jaymen Mannix Pascoe', '2 years of drama', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Neve Duthie', '3 years of drama', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Sara Douglas', '5 years of drama', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Tamati McLarty', '(None)', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),
  createPerformer('Trinity Parker', '3 years of drama', 'Wednesday, 5 November 2025', '6:00 PM to 7:00 PM', 'Stage Three'),

  // THURSDAY - Stage One (4:00 PM to 5:00 PM)
  createPerformer('Dominic Petterlin', '4 years of drama', 'Thursday, 6 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Dominica Mangantulao', 'First Year Pin June', 'Thursday, 6 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Elsie Sharp', 'Intermediate', 'Thursday, 6 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Elsie Untwan', 'Beginner', 'Thursday, 6 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Ingrid Campbell', '2 years of drama', 'Thursday, 6 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Millie Jensen', '3 years of drama', 'Thursday, 6 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Minnie Petterlin', '5 years of drama', 'Thursday, 6 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),
  createPerformer('Trixie Hepburn', '(None)', 'Thursday, 6 November 2025', '4:00 PM to 5:00 PM', 'Stage One'),

  // THURSDAY - Stage Two (5:00 PM to 6:00 PM) - OUR SPACE
  createPerformer('April Muscovich', '3 years of drama', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Avery Murtagh', '4 years of drama', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Blaise Carr', 'First Year Pin June', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Brock Kostos', 'Intermediate', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Corazon Mangantulao', 'Beginner', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Ella Manypenny', '2 years of drama', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Isabella Gill', '3 years of drama', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Jasper Walton', '5 years of drama', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Logan Crothers', '(None)', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Marcelle Varma', '3 years of drama', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Phillipa Kohlman', '4 years of drama', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),
  createPerformer('Sophie Pedrotti', 'First Year Pin June', 'Thursday, 6 November 2025', '5:00 PM to 6:00 PM', 'Stage Two'),

  // THURSDAY - Stage Two (5:30 PM to 6:30 PM) - THE BAD SIDE
  createPerformer('Charlie Flack', 'Intermediate', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Erin Mills', 'Beginner', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Eve Sheldrick', '2 years of drama', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('James Johnson', '3 years of drama', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Jane Lonsdale', '5 years of drama', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Kayleigh White', '(None)', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Lotti Anstee', '3 years of drama', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Macy Camm', '4 years of drama', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Sienna Davey', 'First Year Pin June', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Susannah Mayne Mayne', 'Intermediate', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Thomas McColl', 'Beginner', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),
  createPerformer('Willow Johnson', '2 years of drama', 'Thursday, 6 November 2025', '5:30 PM to 6:30 PM', 'Stage Two'),

  // THURSDAY - Stage Two (6:00 PM to 7:00 PM) - PIRATED
  createPerformer('Charlotte Bysouth', '3 years of drama', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Isabelle Smith', '5 years of drama', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Kaylee Hitchcock', '(None)', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Layla Ware', '3 years of drama', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Mila Holmfield', '4 years of drama', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Nora Thompson', 'First Year Pin June', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Olivia Akers', 'Intermediate', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Rachel Toifl', 'Beginner', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Skylar Shard', '2 years of drama', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
  createPerformer('Victoria May Yong', '3 years of drama', 'Thursday, 6 November 2025', '6:00 PM to 7:00 PM', 'Stage Two'),
];

// Helper functions to query performers
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
