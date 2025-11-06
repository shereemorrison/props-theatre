# Props Theatre - Event brochure

## What's Included

✅ **Curtains Opening Animation** - Curtain split animation on page load
✅ **Menu Navigation** - Grid menu with day/stage cards
✅ **Stage & Day Pages** - Full detail pages for each stage and day
✅ **Cast Information** - Performer names and awards
✅ **Gallery Images** - Stage photos for each performance
✅ **Contact & Credits Pages** - Additional information pages

## Project Structure

```
props-theatre/
├── src/
│   ├── App.tsx              # Main app with curtains animation
│   ├── main.tsx             # Entry point
│   ├── pages/
│   │   ├── LandingPage.tsx  # Menu page
│   │   ├── DayPage.tsx      # Day detail page
│   │   ├── StagePage.tsx    # Stage detail page
│   │   ├── Credits.tsx      # Credits/Onwards page
│   │   ├── Contact.tsx      # Contact page
│   │   └── ThankYou.tsx     # Thank you page
│   ├── components/
│   │   ├── Menu.tsx         # Menu grid component
│   │   ├── Header.tsx       # Header component
│   │   └── ...              # Other components
│   ├── data/
│   │   ├── performances.ts # Stage and day data
│   │   ├── performers.ts   # Performer data
│   │   └── gallery.ts       # Gallery image data
│   └── styles/              # SCSS styles
├── public/
│   ├── theatre/             # Menu background images
│   ├── stageone/            # Stage one gallery images
│   ├── stagetwo/            # Stage two gallery images
│   └── stagethree/          # Stage three gallery images
└── package.json
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```


