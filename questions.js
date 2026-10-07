// questions from backend_procedures
// note: the questions are generated from ai, as mentioned in the announcment, we can use ai for
// generation questions, regards.

(() => {
    window.QUESTIONS = [
  {
    "q": "You start a new game. What do you do first?",
    "options": [
      "Collect items",
      "Build/customize",
      "Test yourself",
      "Learn the mechanics",
      "Explore",
      "Find players"
    ]
  },
  {
    "q": "What feels most satisfying?",
    "options": [
      "Completing collections",
      "Creating something",
      "Winning",
      "Solving problems",
      "Discovering secrets",
      "Playing with friends"
    ]
  },
  {
    "q": "You find a locked area. What do you do?",
    "options": [
      "Search for the key",
      "Build a way in",
      "Challenge yourself to enter",
      "Figure out the mechanism",
      "Look for another entrance",
      "Ask someone to help"
    ]
  },
  {
    "q": "You have free time in a game. What do you do?",
    "options": [
      "Hunt rare items",
      "Build a project",
      "Practice combat",
      "Optimize your setup",
      "Explore the map",
      "Join your friends"
    ]
  },
  {
    "q": "What motivates you most?",
    "options": [
      "Completion",
      "Creativity",
      "Competition",
      "Mastery",
      "Discovery",
      "Friendship"
    ]
  },
  {
    "q": "Your favorite reward is?",
    "options": [
      "A rare collectible",
      "A new building/custom item",
      "A rank or trophy",
      "A powerful upgrade",
      "Access to a new area",
      "A reward shared with teammates"
    ]
  },
  {
    "q": "Your team is struggling. You do,",
    "options": [
      "Gather resources",
      "Create a better setup",
      "Take the lead in combat",
      "Make a strategy",
      "Find a different route",
      "Coordinate everyone"
    ]
  },
  {
    "q": "Which achievement would make you proudest?",
    "options": [
      "100% completion",
      "An incredible build",
      "A top leaderboard position",
      "Mastering a difficult system",
      "Finding a secret nobody noticed",
      "Building a great team"
    ]
  },
  {
    "q": "You lose a difficult challenge. You...",
    "options": [
      "Improve your equipment",
      "Change your setup",
      "Try again immediately",
      "Analyze your mistake",
      "Try a different approach",
      "Ask teammates what happened"
    ]
  },
  {
    "q": "Pick a game activity.",
    "options": [
      "Hunting collectibles",
      "Building",
      "Ranked matches",
      "Puzzle solving",
      "Exploring an open world",
      "Multiplayer sessions"
    ]
  },
  {
    "q": "You discover a rare item.",
    "options": [
      "Add it to your collection",
      "Use it in a creation",
      "Use it to gain an advantage",
      "Figure out its best use",
      "Investigate where it came from",
      "Show your friends"
    ]
  },
  {
    "q": "What type of game world attracts you most?",
    "options": [
      "A world with huge amounts of loot",
      "A creative sandbox",
      "A competitive arena",
      "A world with complex systems",
      "A massive unexplored world",
      "A shared multiplayer world"
    ]
  },
  {
    "q": "When playing with others, you usually...",
    "options": [
      "Share useful items",
      "Build things for everyone",
      "Try to outperform others",
      "Plan the team's actions",
      "Lead everyone into new areas",
      "Keep everyone involved"
    ]
  },
  {
    "q": "Which challenge sounds best?",
    "options": [
      "Find every hidden collectible",
      "Build something amazing",
      "Defeat highly skilled players",
      "Solve a complex challenge",
      "Find a secret location",
      "Complete it with friends"
    ]
  },
  {
    "q": "At the end of a game, you'd rather say...",
    "options": [
      "I collected everything.",
      "Look what I created.",
      "I became one of the best.",
      "I mastered the game.",
      "I discovered everything.",
      "I met some awesome people."
    ]
  }
];

    window.ARCH = [
      { n: 'Creator',    x: -.55, y: .6,   d: 'Makes things from nothing' },
      { n: 'Explorer',   x: .1,   y: .8,   d: 'Chases the next unknown' },
      { n: 'Socializer', x: .7,   y: .45,  d: 'Brings people together' },
      { n: 'Competitor', x: .65,  y: -.5,  d: 'Plays to win, thrives on stakes' },
      { n: 'Strategist', x: -.1,  y: -.75, d: 'Plans three moves ahead' },
      { n: 'Collector',  x: -.7,  y: -.45, d: 'Curates, organizes, completes' }
    ];

    // frontend comments from @arctrus  
    // Mapping each choice (A-F) to its archetype from backend_procedures.py
    const ROLE_COORDS = {
      'A': { x: -.7,  y: -.45, n: 'Collector' },
      'B': { x: -.55, y: .6,   n: 'Creator' },
      'C': { x: .65,  y: -.5,  n: 'Competitor' },
      'D': { x: -.1,  y: -.75, n: 'Strategist' },
      'E': { x: .1,   y: .8,   n: 'Explorer' },
      'F': { x: .7,   y: .45,  n: 'Socializer' }
    };

    const clamp = v => Math.max(-.95, Math.min(.95, v));

    window.locate = ans => {
      let sx = 0, sy = 0;
      ans.forEach(a => {
        const r = ROLE_COORDS[a];
        if (r) { sx += r.x; sy += r.y; }
      });

      // User coordinate is the center-of-mass of all chosen archetypes
      const x = clamp(sx / ans.length);
      const y = clamp(sy / ans.length);

      // Proximity to all 6 archetypes
      const near = ARCH.map(a => ({ ...a, dist: Math.hypot(a.x - x, a.y - y) }))
        .map(a => ({ ...a, pct: Math.round(100 * Math.max(0, 1 - a.dist / 1.3)) }))
        .sort((a, b) => a.dist - b.dist);

      return { x, y, near };
    };
    })();
    