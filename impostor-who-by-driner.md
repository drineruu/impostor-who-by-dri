Build a complete, polished, mobile-friendly party game web application called:

"Impostor Who? by Dri"

The game should be a static frontend application that can be deployed entirely to GitHub Pages.

==================================================
1. CORE REQUIREMENTS
==================================================

Tech stack:

- Vue 3
- Vite
- JavaScript or TypeScript
- CSS or Tailwind CSS
- JSON for game content
- localStorage for temporary player-name persistence

The application must NOT require:

- Backend
- Database
- API server
- Authentication
- Server-side code

Everything should run in the browser.

The application should be deployable to GitHub Pages.

Keep the project simple and maintainable. Do not over-engineer it.

==================================================
2. GAME CONCEPT
==================================================

"Impostor Who?" is a social deduction party game.

A group of players shares one phone.

Most players are given a secret word.

One or more players are randomly selected as the IMPOSTOR and do NOT see the secret word.

Players privately view their roles one at a time.

Once every player has seen their role, the actual game begins.

The players then put the phone down and continue the game themselves.

The application does NOT currently manage:

- Clue giving
- Discussion
- Voting
- Vote results
- Impostor final guess

Those parts happen outside the application for now.

The app's responsibility is to:

1. Set up the players.
2. Select the secret word.
3. Randomly assign the impostor(s).
4. Privately reveal each player's role.
5. Start the game once everyone has seen their role.
6. Allow the group to reveal the impostor(s) when they are finished.
7. Allow the group to quit the game.

==================================================
3. DEFAULT GAME RULES
==================================================

Players:

- Minimum: 4
- Maximum: 12
- Default: 4

Impostors:

- Default: 1
- Allow multiple impostors.
- Never allow impostors to equal or exceed the number of players.

Suggested default:

- 4–6 players: 1 impostor
- 7–9 players: 2 impostors
- 10–12 players: 2 impostors

The user may manually change the impostor count.

For the initial version, do NOT implement voting.

Voting will be handled by the players themselves outside the application.

==================================================
4. GAME FLOW
==================================================

The application should have these main screens/phases:

1. Home
2. Player Setup
3. Game Settings
4. Role Reveal
5. Game Started
6. Reveal Impostor(s)
7. Final Result

Do NOT create a voting phase yet.

Do NOT create a clue phase yet.

Do NOT create a discussion phase yet.

Those may be added in a future version.

==================================================
5. HOME SCREEN
==================================================

Display:

Impostor Who?
by Dri

Short description:

"One secret word. One or more impostors. Can you find them?"

Buttons:

- Start Game
- How to Play

Keep the screen simple and visually appealing.

==================================================
6. HOW TO PLAY
==================================================

Create a short instructions screen.

Explain the current game flow:

1. Add the players.
2. The game secretly chooses a word.
3. One or more players are secretly selected as impostors.
4. Pass the phone around.
5. Each player privately reveals their role.
6. Once everyone has seen their role, the game begins.
7. Put the phone down and play the social deduction part of the game yourselves.
8. When the group is ready, use "Reveal Impostor(s)" to see who the impostors were.

Do NOT describe voting as an application feature yet.

You may mention that players can discuss and decide who they suspect themselves, but the app does not manage voting.

==================================================
7. PLAYER SETUP
==================================================

Allow users to:

- Add a player
- Remove a player
- Edit a player name
- Reorder players if practical

Example:

Players

1. John
2. Mary
3. Peter
4. David

Buttons:

+ Add Player
Continue

Requirements:

- Minimum 4 players
- Maximum 12 players
- Do not allow empty names
- Prefer preventing duplicate player names
- Show the current player count

==================================================
8. PLAYER NAME CACHING
==================================================

Player names should be saved to localStorage.

IMPORTANT:

The cached names should expire after exactly 24 hours.

Use an expiration timestamp.

Example:

{
  "players": [
    "John",
    "Mary",
    "Peter",
    "David"
  ],
  "expiresAt": 123456789
}

When the application loads:

1. Read cached player data.
2. Check expiresAt.
3. If valid:
   - Restore the players.
4. If expired:
   - Remove the cached data.
   - Start with an empty/default player list.

Player names are the ONLY information that should be persistently cached by default.

Do NOT persist:

- Secret word
- Impostor assignments
- Current game state
- Game results

==================================================
9. GAME SETTINGS
==================================================

Allow the user to configure:

- Number of impostors
- Category
- Difficulty

For now, DO NOT include:

- Voting settings
- Voting timer
- Impostor final guess settings
- Clue timer

Those features are not part of the current version.

Defaults:

Category:
All

Difficulty:
All

Impostors:
Automatically choose a sensible number based on player count.

Prevent invalid configurations.

==================================================
10. WORD DATA
==================================================

Store all words in JSON.

Example:

src/data/words.json

Structure:

[
  {
    "word": "Pizza",
    "category": "Food",
    "difficulty": "easy"
  },
  {
    "word": "Beach",
    "category": "Places",
    "difficulty": "easy"
  }
]

Do NOT hardcode words inside Vue components.

Create an initial dataset of at least 100 words.

Suggested categories:

- Food
- Animals
- Places
- Objects
- Activities
- Entertainment
- Everyday Life
- Nature
- Transportation
- Technology

Difficulty levels:

- easy
- medium
- hard

The JSON should be easy to edit later.

==================================================
11. SECRET WORD SELECTION
==================================================

When starting a new game:

1. Filter words according to category and difficulty.
2. Randomly select one word.
3. Randomly select the impostor(s).
4. Assign every other player the normal role.

Avoid selecting the same word repeatedly during the current browser session when reasonably possible.

Do NOT store the secret word in localStorage.

Do NOT store the impostor assignments in localStorage.

==================================================
12. ROLE REVEAL
==================================================

This is the most important part of the application.

Players physically pass one phone around.

Before revealing the role, display:

PASS THE PHONE TO

JOHN

Then:

"John, tap below when you're ready."

[ Reveal My Role ]

When tapped:

NORMAL PLAYER:

YOUR ROLE

PLAYER

SECRET WORD

Pizza

IMPOSTOR:

YOUR ROLE

IMPOSTOR

Do NOT show the secret word.

After viewing the role:

[ Hide & Pass Phone ]

When pressed:

- Completely hide the previous player's role.
- Move to the next player.
- Show a neutral transition screen.

Example:

ROLE HIDDEN

Pass the phone to Mary.

[ Continue ]

Then Mary can reveal her role.

IMPORTANT:

The next player must not accidentally see the previous player's role.

Use a neutral screen between players.

==================================================
13. FINAL PLAYER REVEAL
==================================================

After the final player has seen their role:

Do NOT immediately show the secret word or impostors.

Instead show:

EVERYONE HAS THEIR ROLE

"Everyone has seen their role."

Then:

[ Start Game ]

Once pressed, transition to the Game Started screen.

==================================================
14. GAME STARTED SCREEN
==================================================

This is the main screen after role assignment is complete.

Display:

GAME STARTED

"Put the phone down and start playing!"

The application should NOT manage the clue/discussion/voting process yet.

The players can now:

- Give clues
- Discuss
- Decide who they suspect
- Play the social deduction portion themselves

outside the application.

The screen should have two primary options:

[ Reveal Impostor(s) ]

[ Quit Game ]

Make "Reveal Impostor(s)" the main action.

Make "Quit Game" a secondary/danger action.

==================================================
15. REVEAL IMPOSTOR(S)
==================================================

When the players are ready to see the answer, pressing:

[ Reveal Impostor(s) ]

should first show a confirmation screen.

Example:

REVEAL IMPOSTORS?

"Are you sure you want to reveal the impostor(s)?"

"Make sure everyone is ready."

Buttons:

[ Reveal ]

[ Cancel ]

This prevents accidental reveals.

After confirmation, show the results.

Example:

THE IMPOSTOR WAS...

JOHN

If there are multiple impostors:

THE IMPOSTORS WERE...

JOHN
MARY

Also display:

SECRET WORD

Pizza

The secret word should be shown only at this point after the game has been revealed.

==================================================
16. FINAL RESULT SCREEN
==================================================

Show:

GAME OVER

Secret Word:
Pizza

Impostor:
John

or:

Impostors:
John
Mary

Provide:

[ Play Again ]

[ New Game ]

[ Home ]

Play Again:

- Keep the same players.
- Keep the same settings.
- Select a new word.
- Randomly assign new impostor(s).
- Start the role reveal again.

New Game:

- Return to player setup.
- Allow players/settings to be changed.

Home:

- Return to the home screen.

==================================================
17. QUIT GAME
==================================================

The Quit Game button should also have confirmation.

Example:

QUIT GAME?

"Are you sure you want to end this game?"

Buttons:

[ Quit Game ]

[ Cancel ]

If confirmed:

- Clear current in-memory game state.
- Do NOT clear the 24-hour cached player names.
- Return to the Home screen.

The user should be able to start a new game afterward.

==================================================
18. GAME STATE
==================================================

Use centralized in-memory game state.

Example conceptual state:

players
settings
secretWord
impostors
currentPhase
currentPlayerIndex

Possible phases:

HOME
PLAYER_SETUP
SETTINGS
ROLE_REVEAL
GAME_STARTED
REVEAL_CONFIRMATION
RESULTS

Do NOT persist the game state.

Do NOT persist:

- secretWord
- impostors
- current player reveal state
- results

This means accidentally refreshing during a game can safely reset the current game.

The cached player names should remain available.

==================================================
19. MULTIPLE IMPOSTORS
==================================================

Support multiple impostors.

Each impostor should only see:

YOUR ROLE

IMPOSTOR

They should NOT see:

- The secret word
- Other impostors
- Other players' roles

When the final result is revealed, show all impostors.

==================================================
20. VISUAL DESIGN
==================================================

The app should feel like a polished party game.

Brand:

Impostor Who?
by Dri

Style:

- Modern
- Fun
- Slightly mysterious
- Clean
- Playful
- Mobile-first

Use:

- Large typography
- Rounded cards
- Large touch-friendly buttons
- Clear visual hierarchy
- Subtle animations
- Smooth transitions
- Good spacing

Avoid:

- Corporate dashboard appearance
- Dense layouts
- Tiny controls
- Excessive animations
- Overly complicated UI

==================================================
21. MOBILE UX
==================================================

The primary target is smartphones.

Support:

- iPhone-sized screens
- Android phones
- Small screens
- Larger phones
- Tablets where practical

Requirements:

- No horizontal scrolling
- Large touch targets
- Comfortable spacing
- Easy-to-read text
- Portrait-first layout
- Responsive design

The role reveal experience should be particularly polished because the phone is passed from person to person.

==================================================
22. ACCESSIBILITY
==================================================

Implement basic accessibility:

- Semantic HTML
- Proper buttons
- Form labels
- Keyboard navigation where practical
- Visible focus states
- Good contrast
- aria-labels where appropriate

Do not rely only on color to communicate meaning.

==================================================
23. GITHUB PAGES
==================================================

The application MUST work on GitHub Pages.

Use Vite.

The application should support a project URL such as:

https://USERNAME.github.io/impostor-who/

Configure Vite's base path appropriately.

The base path should be easy to change.

Do not scatter hardcoded GitHub Pages paths throughout the application.

Avoid server-side routing requirements.

If Vue Router is unnecessary, do not use it.

Prefer a simple state-based screen/phase system if that makes GitHub Pages deployment easier.

==================================================
24. GITHUB ACTIONS
==================================================

Create:

.github/workflows/deploy.yml

The workflow should:

1. Checkout the repository.
2. Set up Node.js.
3. Install dependencies.
4. Build the Vite application.
5. Deploy the dist folder to GitHub Pages.

Include clear instructions in README.md for enabling GitHub Pages.

==================================================
25. PROJECT STRUCTURE
==================================================

Use a clean structure similar to:

src/
  assets/
  components/
    AppHeader.vue
    PrimaryButton.vue
    PlayerList.vue
    PlayerSetup.vue
    GameSettings.vue
    RoleReveal.vue
    GameStarted.vue
    RevealConfirmation.vue
    GameResults.vue
  composables/
    useGame.js
    usePlayerStorage.js
  data/
    words.json
  utils/
    gameUtils.js
    storageUtils.js
  App.vue
  main.js

Adjust the structure if there is a cleaner approach.

Do not create excessive components unnecessarily.

==================================================
26. README
==================================================

Create README.md containing:

- Project name
- Game description
- Game rules
- Features
- Tech stack
- Local development instructions
- Build instructions
- GitHub Pages deployment instructions
- How to modify words.json
- How player caching works
- Project structure
- Future feature ideas

Local commands should include:

npm install
npm run dev
npm run build
npm run preview

==================================================
27. ERROR HANDLING
==================================================

Gracefully handle:

- Too few players
- Too many players
- Empty player names
- Duplicate player names
- Invalid impostor count
- Empty word dataset
- No words matching selected filters
- Invalid localStorage data

Never allow the application to silently enter an invalid state.

==================================================
28. PRIVACY
==================================================

This is a client-only game.

Do not collect or transmit player names.

Do not send game information to external services.

Do not persist secret game information.

Only player names should be stored temporarily in localStorage for 24 hours.

==================================================
29. PERFORMANCE
==================================================

Keep the application lightweight.

Avoid unnecessary dependencies.

The JSON dataset should remain reasonably small.

Avoid unnecessary network requests.

Use static assets.

The application should load quickly on mobile connections.

==================================================
30. FUTURE FEATURES
==================================================

Do NOT implement these yet:

- In-app voting
- In-app clue recording
- Discussion timer
- Vote history
- Impostor final guess
- Online multiplayer
- Accounts
- Database
- Backend
- User-created accounts
- Statistics

However, structure the code so these could be added later.

The next major feature we may add is an in-app voting system, so avoid architecture choices that would make adding voting difficult.

==================================================
31. IMPORTANT GAMEPLAY PRINCIPLE
==================================================

The application is primarily a ROLE DISTRIBUTION AND REVEAL TOOL for now.

The current gameplay ends its app-managed portion after:

1. All players receive their secret roles.
2. The game starts.
3. Players play the social deduction portion themselves.
4. The group returns to the phone.
5. They press "Reveal Impostor(s)".
6. The app reveals the impostor(s) and secret word.

Do not build voting or clue management yet.

==================================================
32. TESTING CHECKLIST
==================================================

Before considering the project complete, verify:

[ ] 4-player game works
[ ] 12-player game works
[ ] 1 impostor works
[ ] Multiple impostors work
[ ] Invalid impostor count is prevented
[ ] Normal player sees the secret word
[ ] Impostor does NOT see the secret word
[ ] Previous player's role is hidden before the next player
[ ] Every player receives exactly one role
[ ] Final player completes the reveal process
[ ] Game Started screen appears
[ ] Reveal Impostor(s) requires confirmation
[ ] Impostor(s) are correctly revealed
[ ] Secret word is revealed only after confirmation
[ ] Quit Game requires confirmation
[ ] Quit Game does not delete cached player names
[ ] Play Again keeps players
[ ] Play Again generates a new word
[ ] Play Again randomizes impostors
[ ] New Game allows changing setup
[ ] Player names survive refresh within 24 hours
[ ] Player cache expires after 24 hours
[ ] Invalid localStorage data does not break the application
[ ] Category filtering works
[ ] Difficulty filtering works
[ ] Random word selection works
[ ] Same word is avoided when reasonably possible
[ ] No backend/database is required
[ ] Production build succeeds
[ ] GitHub Pages deployment works
[ ] Mobile layout works without horizontal scrolling

==================================================
33. DEVELOPMENT PROCESS
==================================================

Before implementation:

1. Review the requirements.
2. Do not ask questions that have already been answered.
3. Only ask questions if there is a genuine technical ambiguity that would materially affect implementation.
4. Otherwise proceed directly.

Then:

1. Set up Vue/Vite.
2. Create the project structure.
3. Create words.json with at least 100 words.
4. Implement player setup.
5. Implement 24-hour player caching.
6. Implement settings.
7. Implement random word selection.
8. Implement random impostor assignment.
9. Implement private role reveal.
10. Implement the transition between players.
11. Implement Game Started screen.
12. Implement Reveal Impostor(s).
13. Implement reveal confirmation.
14. Implement Results screen.
15. Implement Play Again.
16. Implement New Game.
17. Implement Quit Game.
18. Add responsive mobile styling.
19. Add accessibility.
20. Configure GitHub Pages.
21. Add GitHub Actions deployment.
22. Add README.
23. Test all major flows.

==================================================
34. FINAL EXPECTATION
==================================================

The final application should feel like a real, polished party game that a group can open on one phone and immediately play.

Brand the application consistently as:

"Impostor Who?"
"by Dri"

The experience should be:

Home
→ Add Players
→ Choose Settings
→ Secretly Reveal Roles
→ Everyone Gets Their Role
→ Game Starts
→ Players Put Phone Down
→ Play the Social Deduction Game
→ Return to Phone
→ Reveal Impostor(s)
→ See Secret Word + Results

Keep the first version intentionally simple.

The app should be a completely static frontend application suitable for GitHub Pages.

Do NOT implement the voting system yet.