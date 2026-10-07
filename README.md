<div align="center">

<h1>Gameup-leveler</h1>

<p>
Ever taken a gaming personality quiz only to get hit with a boring generic title like <em>"You're a Slayer"</em> or <em>"You're a Builder"</em>?
😫 <strong>Feels kinda dull and inaccurate, right?</strong>
</p>

<p>
<strong>Gameup-leveler</strong> takes a different approach: an interactive, Arch Linux-inspired desktop environment running right in your web browser. Instead of clicking standard web forms, you run the assessment as a CLI program inside a retro Konsole terminal. Your choices are evaluated across six core gamer archetypes and plotted onto an interactive 2D coordinate plane so you can see exactly where your playstyle lands 🎮💻
</p>

</div>

---

## Important Notices <!-- omit in toc -->

> [!IMPORTANT]
> This is a hackathon project created for [Manware](https://www.youtube.com/@IAmManware) as part of a specific challenge topic.
See the Proofs Page for more information and supporting evidence.

> [!NOTE]
> If you edit question mappings or archetype structures in `backend_procedures.py`, make sure to run `python test_converter.py` to compile the updated data into `questions.js`.

---

## Table of Contents

* [Important Notices](#important-notices)
* [Design Inspiration & Architecture](#design-inspiration--architecture)
* [How it Works?](#how-it-works)
* [Archetypes & 2D Mapping](#archetypes--2d-mapping)
* [Setup & Running Locally](#setup--running-locally)
* [Terminal Commands & Controls](#terminal-commands--controls)
* [Project Structure](#project-structure)
* [Credits & Acknowledgments](#credits--acknowledgments)

---

## Design Inspiration & Architecture

The entire frontend interface was modeled directly after a customized **Arch Linux** desktop setup:
* **Desktop UI**: Features the classic Oxygen/KDE look, Candy icons, and JetBrains Mono Nerd Font styling.
* **Terminal Experience**: Simulated Sweet-themed Konsole terminal with a responsive ANSI color parser, custom banner graphics, animated progress bars, bash history (arrow key navigation), and command execution.
* **Interactive Elements**: Snapping desktop grid icons, draggable & resizable windows with macOS/KDE style buttons, a working system clock, and taskbar window management.
* **Result Plotter**: A dedicated window (`plot2d.png — quiz`) powered by HTML5 Canvas that supports panning, zooming with mouse wheel, and auto-centering.

---

## How it Works?

Instead of relying on rigid, one-dimensional quiz outputs, Gameup-leveler treats gamer profiling as a continuous spectrum:

1. **Launch the Quiz**: Double-click the `quiz` desktop icon or launch it from the Konsole terminal (`./Desktop/quiz` or `./quiz`).
2. **Answer Scenario-Based Questions**: 15 multi-choice questions covering real in-game instincts (tactics, problem-solving, collaboration, exploration, and resource management).
3. **Simulated Processing Pipeline**: Simulates kernel checks, dependency verification, one-hot vector encoding, and dimensionality reduction right inside the terminal screen.
4. **2D Coordinate Projection**: Computes your center-of-mass across the archetypes and opens an interactive coordinate plane highlighting your primary class, affinity percentages, and nearest secondary traits.

---

## Archetypes & 2D Mapping

The quiz measures player motivations across two main axes:
* **X-Axis**: Inward (solitary / introspective) $\longleftrightarrow$ Outward (competitive / social)
* **Y-Axis**: Planned (tactical / structured) $\longleftrightarrow$ Spontaneous (creative / exploratory)

| Archetype | Focus & Description | Coordinate Target $(X, Y)$ |
| :--- | :--- | :--- |
| **Creator** | Builds, customizes, and creates systems from scratch | $(-0.55, +0.60)$ |
| **Explorer** | Chases mysteries, lore, and unexplored map zones | $(+0.10, +0.80)$ |
| **Socializer** | Connects players, leads teams, and values camaraderie | $(+0.70, +0.45)$ |
| **Competitor** | Drives to win, ranked climb, tests mechanical skill | $(+0.65, -0.50)$ |
| **Strategist** | Plans three moves ahead, analyzes mechanics and builds | $(-0.10, -0.75)$ |
| **Collector** | 100% completionist, collects rare items, organizes gear | $(-0.70, -0.45)$ |

---

## Setup & Running Locally

You don't need any complex toolchains to run the desktop app. A local static web server or direct browser open works out of the box.

### 1. Clone the repository

```bash
git clone https://github.com/sarimgamerop-cloud/Gameup-leveler.git
cd Gameup-leveler
```

### 2. Run the Web App

#### Option A: Quick open (Direct)
Simply open `index.html` in your favorite web browser (Chrome, Firefox, Brave, Edge).

#### Option B: Using Python's built-in HTTP server (Recommended)
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

### Updating Questions & Backend Data (Optional)

If you modify questions, choices, or archetypes in `backend_procedures.py`:

```bash
python test_converter.py
```
This automatically updates `questions.js` with the fresh question sets and vector mappings.

---

## Terminal Commands & Controls

Once the Konsole window is open, you can interact with it just like a Linux shell:

| Command | Action |
| :--- | :--- |
| `./Desktop/quiz` or `./quiz` | Launches the skill categorizer assessment |
| `ls` | Lists items in current directory (`Desktop` / `quiz`) |
| `cd Desktop` / `cd ..` | Changes directory |
| `pwd` | Prints current working directory |
| `echo [text]` | Prints input back to terminal |
| `clear` | Clears terminal screen |
| `Ctrl + C` | Aborts the active quiz session |

### Plot Controls
* **Drag / Click + Move**: Pan across the 2D plane.
* **Scroll Wheel**: Zoom in and out.
* **Double Click**: Reset zoom and center view.

---

## Project Structure

```text
Gameup-leveler/
├── assets/                  # SVG assets for desktop tray and window icons
│   ├── app.svg
│   ├── audio.svg
│   ├── image-x-generic.svg
│   ├── network-wireless-on.svg
│   └── terminal.svg
├── app.js                   # Desktop environment (window manager, icons, bash shell)
├── index.html               # Main application container
├── icons.js                 # Inlined vector icons registry
├── plot.js                  # 2D plane canvas renderer, zoom, pan, coordinates
├── questions.js             # Compiled assessment questions and math coordinates
├── quiz.js                  # Terminal quiz runner, ANSI art, animations
├── style.css                # KDE / Arch-inspired styling, Sweet theme, fonts
├── backend_procedures.py    # Python source for questions, options, and archetypes
├── test_converter.py        # Converter script syncing python backend to questions.js
└── README.md                # Project documentation
```

---

## Credits & Acknowledgments

* **Concept & Frontend Design**: Developed by [@sarimgamerop-cloud](https://github.com/sarimgamerop-cloud) and [@specialcodes](https://github.com/specialcodes).
* **Desktop UI Styling**: Inspired by classic Arch Linux / KDE desktop rice (Oxygen & Sweet themes, Candy icons, JetBrains Mono font).
* **AI Usage**: Claude was used to help polish details, fix minor edge cases, and refine questions as noted in project discussions.

---

<div align="center">

<strong>Gameup-leveler</strong>

<p>A retro desktop terminal experience to discover your true gamer archetype.</p>

</div>
