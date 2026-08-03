# 🦕 Dino Rescue Clinic - Visual Math Learning Game

An interactive, adaptive, and extensible web-based educational game designed for 6-year-olds (and adaptable across ages 4–8) to master visual math concepts like **Ten-Frames**, counting, regrouping, and addition ($10 + N$).

---

## 🌟 Key Features

1. **Ten-Frame Visual Math Workspace**:
   - Interactive 10-frame & 20-frame grids.
   - Tap-to-count audio feedback using pitch-scaling Web Audio synthesizer tones.
   - Visual distinction between base ten (10) and extra addends ($N$).

2. **Dino Rescue Clinic Game Loop**:
   - Dirty/injured dinosaur patients (Baby T-Rex, Triceratops, Stegosaurus, Pterodactyl).
   - Solving math equations washes off mud spots, removes bandages, and heals the patient.
   - Victory celebration featuring happy dino roars, fanfare sound effects, and confetti particle explosions!

3. **Adaptive Difficulty Engine (`AdaptiveEngine`)**:
   - **Junior (Age 4-5)**: Counting 1–10 on a single ten-frame.
   - **Medic (Age 6)**: Ten-Frame addition ($10 + N$).
   - **Chief Vet (Age 7-8)**: Double Ten-Frame ($10 + N \rightarrow 20$) and missing addend equations ($10 + ? = 17$).

4. **Extensible Theme System (`ThemeRegistry`)**:
   - Easily extendable to other themes and child interests (e.g. **Space Rescue Clinic** 🚀, **Ocean Sanctuary** 🐢) with custom patients, icons, tools, and visual tokens.

5. **Zero Dependencies**:
   - Native HTML5, CSS3, Web Audio API, and Speech Synthesis.
   - Runs out of the box in any modern browser without any node/npm build step required.

---

## 🚀 Quick Start

1. Open `index.html` directly in your browser:
   ```bash
   open index.html
   ```
2. Or serve it locally with Python or an HTTP server:
   ```bash
   python3 -m http.server 8080
   ```
   Then visit `http://localhost:8080` in your web browser.

---

## 🏗️ Architecture & Extensibility

- **`index.html`**: Contains the complete self-contained single-file prototype.
- **Adding New Themes**:
  To add a new theme (e.g. Fantasy Dragons), simply register a new object in `ThemeRegistry`:
  ```javascript
  ThemeRegistry.dragon = {
    id: 'dragon',
    name: 'Dragon Sanctuary',
    brandIcon: '🐉',
    tokenIcon: '🔥',
    patients: [ ... ]
  };
  ```
- **Adding New Math Operations**:
  Extend `AdaptiveEngine.generateQuestion()` to support subtraction, multiplication, or place value blocks.

---

## 📁 Repository Setup

This repository is initialized with Git for simple versioning and sharing on GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/dino-rescue-clinic.git
git branch -M main
git push -u origin main
```
