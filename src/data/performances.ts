export interface Stage {
  id: string;
  stageNumber: string; // "Stage One", "Stage Two", "Stage Three"
  title: string;
  writtenBy: string;
  summary: string;
  cast: Array<{ name: string; role: string }>;
  awards: Array<{ icon: string; name: string; recipient: string }>;
  images?: string[]; // Array of image paths
}

export interface Day {
  id: string;
  day: string; // "Monday 24th", "Tuesday 25th", etc.
  year: number; // 2025
  stages: Stage[];
  hasThankYou?: boolean; // For Friday which has Thank You section
}

// Play templates - define once, reuse across days
interface PlayTemplate {
  title: string;
  writtenBy: string;
  summary: string;
  defaultCast: Array<{ name: string; role: string }>;
}

const plays: Record<string, PlayTemplate> = {
  'five-minutes': {
    title: 'FIVE MINUTES',
    writtenBy: 'Olivia Jacobs and Alise Amarant',
    summary: 'Brody lives in a thousand worlds complete with adventures, main characters and invisible friends. What is the cost of five minutes? Inspired by the worlds that the young at heart can make up and the power of being distracted within our everyday lives.',
    defaultCast: [
      { name: 'Example 1', role: 'Actor' },
      { name: 'Example 2', role: 'Actor' },
      { name: 'Example 3', role: 'Director' },
      { name: 'Example 4', role: 'Actor' },
      { name: 'Example 5', role: 'Actor' },
      { name: 'Example 6', role: 'Producer' }
    ]
  },
  'the-bad-side': {
    title: 'THE BAD SIDE',
    writtenBy: 'Alise Amarant',
    summary: "At the annual meeting of the Bad Wolves Club, we're given a behind-the-scenes look into the secret world of wolves. Gathered from fables, TV shows, comics, and films, these famous \"bad wolves\" come together to challenge their notorious reputation and explore what it takes to be seen as good once again.",
    defaultCast: [
      { name: 'Example 1', role: 'Actor' },
      { name: 'Example 2', role: 'Actor' },
      { name: 'Example 3', role: 'Actor' },
      { name: 'Example 4', role: 'Producer' },
      { name: 'Example 5', role: 'Actor' },
      { name: 'Example 6', role: 'Director' },
      { name: 'Example 7', role: 'Actor' }
    ]
  },
  'the-bad-side-alt': {
    title: 'THE BAD SIDE',
    writtenBy: 'Alise Amarant, Olivia Jacobs and special guest Darcy Gibson',
    summary: "At the annual meeting of the Bad Wolves Club, we're given a behind-the-scenes look into the secret world of wolves. Gathered from fables, TV shows, comics, and films, these famous \"bad wolves\" come together to challenge their notorious reputation and explore what it takes to be seen as good once again.",
    defaultCast: [
      { name: 'Example 1', role: 'Actor' },
      { name: 'Example 2', role: 'Actor' },
      { name: 'Example 3', role: 'Actor' },
      { name: 'Example 4', role: 'Producer' },
      { name: 'Example 5', role: 'Actor' },
      { name: 'Example 6', role: 'Director' },
      { name: 'Example 7', role: 'Actor' }
    ]
  },
  'ferriers-shoes': {
    title: 'FERRIER\'S SHOES',
    writtenBy: 'Alise Amarant, Olivia Jacobs and special guest Darcy Gibson',
    summary: "In Ferrier's Shoes, we spend a day with Stanley in his family's old shoe shop — passed down through generations from his father's father's father. It's just Stanley now, serving everyone from teenagers to toddlers to grannies. But something strange is afoot: all the left shoes have mysteriously vanished. As the mystery deepens, it might take a detective — or something more — to uncover the real reason behind the missing shoes.",
    defaultCast: [
      { name: 'Example 1', role: 'Actor' },
      { name: 'Example 2', role: 'Actor' },
      { name: 'Example 3', role: 'Actor' },
      { name: 'Example 4', role: 'Director' },
      { name: 'Example 5', role: 'Producer' }
    ]
  },
  'pirated': {
    title: 'PIRATED',
    writtenBy: 'Alise Amarant, Olivia Jacobs and special guest Jacob Amarant',
    summary: "What happens when a band of pirates finally discovers the land they've always dreamed of finding? And once their dream comes true—what comes next? Through the use of song lyrics and storytelling, this play explores the pirates' hopes, struggles, and the unexpected reality of achieving their long-sought dream when piracy is a crime.",
    defaultCast: [
      { name: 'Example 1', role: 'Actor' },
      { name: 'Example 2', role: 'Actor' },
      { name: 'Example 3', role: 'Actor' },
      { name: 'Example 4', role: 'Producer' },
      { name: 'Example 5', role: 'Actor' },
      { name: 'Example 6', role: 'Director' },
      { name: 'Example 7', role: 'Actor' }
    ]
  },
  'pirated-alt': {
    title: 'PIRATED',
    writtenBy: 'Alise Amarant, Olivia Jacobs and special guest Jacob Amarant',
    summary: "What happens when a band of pirates finally discovers the land they've always dreamed of finding? And once their dream comes true—what comes next? Through the use of song lyrics and storytelling, this play explores the pirates' hopes, struggles, and the unexpected reality of achieving their long-sought dream when piracy is a crime.",
    defaultCast: [
      { name: 'Example 1', role: 'Actor' },
      { name: 'Example 2', role: 'Actor' },
      { name: 'Example 3', role: 'Director' },
      { name: 'Example 4', role: 'Actor' },
      { name: 'Example 5', role: 'Actor' },
      { name: 'Example 6', role: 'Producer' }
    ]
  },
  'our-space': {
    title: 'OUR SPACE',
    writtenBy: 'Alise Amarant',
    summary: "OUR SPACE takes us aboard the Titanic in 1912, in the midst of chaos as the crew faces the unimaginable. Amid the rising panic, they each search for their own sense of personal space — even as they're literally surrounded by it. A story about the strength of friendship, the boundaries of humor, and what happens when a joke goes too far.",
    defaultCast: [
      { name: 'Example 1', role: 'Actor' },
      { name: 'Example 2', role: 'Actor' },
      { name: 'Example 3', role: 'Actor' },
      { name: 'Example 4', role: 'Director' },
      { name: 'Example 5', role: 'Producer' },
      { name: 'Example 6', role: 'Actor' }
    ]
  }
};

// Helper function to create a stage from a play template
function createStage(
  id: string,
  stageNumber: string,
  playKey: string,
  castOverride?: Array<{ name: string; role: string }>
): Stage {
  const play = plays[playKey];
  if (!play) {
    throw new Error(`Play template "${playKey}" not found`);
  }
  
  return {
    id,
    stageNumber,
    title: play.title,
    writtenBy: play.writtenBy,
    summary: play.summary,
    cast: castOverride || play.defaultCast,
    awards: []
  };
}

export const days: Day[] = [
  {
    id: 'monday-24th',
    day: 'Monday 24th',
    year: 2025,
    stages: [
      createStage('stage-one-monday', 'Stage One', 'five-minutes'),
      createStage('stage-two-monday', 'Stage Two', 'the-bad-side'),
      createStage('stage-three-monday', 'Stage Three', 'ferriers-shoes')
    ]
  },
  {
    id: 'tuesday-25th',
    day: 'Tuesday 25th',
    year: 2025,
    stages: [
      createStage('stage-one-tuesday', 'Stage Two', 'the-bad-side', [
        { name: 'Example 1', role: 'Actor' },
        { name: 'Example 2', role: 'Actor' },
        { name: 'Example 3', role: 'Director' },
        { name: 'Example 4', role: 'Actor' },
        { name: 'Example 5', role: 'Actor' },
        { name: 'Example 6', role: 'Producer' }
      ]),
      createStage('stage-two-tuesday', 'Stage Two', 'pirated'),
      createStage('stage-three-tuesday', 'Stage Three', 'ferriers-shoes')
    ]
  },
  {
    id: 'wednesday-26th',
    day: 'Wednesday 26th',
    year: 2025,
    stages: [
      createStage('stage-one-wednesday', 'Stage One', 'five-minutes'),
      createStage('stage-two-wednesday', 'Stage Two', 'the-bad-side'),
      createStage('stage-three-wednesday', 'Stage Three', 'ferriers-shoes')
    ]
  },
  {
    id: 'thursday-27th',
    day: 'Thursday 27th',
    year: 2025,
    stages: [
      createStage('stage-one-thursday', 'Stage One', 'five-minutes'),
      createStage('stage-two-thursday-pirated', 'Stage Two', 'pirated-alt'),
      createStage('stage-two-thursday-our-space', 'Stage Two', 'our-space'),
      createStage('stage-two-thursday-bad-side', 'Stage Two', 'the-bad-side-alt')
    ]
  },
];
