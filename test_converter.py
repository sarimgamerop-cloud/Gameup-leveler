import json
from backend_procedures import questions, answer_dict

answer_keys = list(answer_dict.keys())
formatted_questions = []


## converted the backend_procedures.py to a questions.js file
# as i didn't found any technique that can access python variables directly from javascript.

for i, q in enumerate(questions):
    key = answer_keys[i]
    options = [
            answer_dict[key]['a'][0],
            answer_dict[key]['b'][0],
            answer_dict[key]['c'][0],
            answer_dict[key]['d'][0],
            answer_dict[key]['e'][0],
            answer_dict[key]['f'][0],
    ]
    formatted_questions.append({
            "q": q,
            "options": options
        })

# 2. Template for questions.js
js_content = f"""(() => {{
    window.QUESTIONS = {json.dumps(formatted_questions, indent=2)};

    window.ARCH = [
      {{ n: 'Creator',    x: -.55, y: .6,   d: 'Makes things from nothing' }},
      {{ n: 'Explorer',   x: .1,   y: .8,   d: 'Chases the next unknown' }},
      {{ n: 'Socializer', x: .7,   y: .45,  d: 'Brings people together' }},
      {{ n: 'Competitor', x: .65,  y: -.5,  d: 'Plays to win, thrives on stakes' }},
      {{ n: 'Strategist', x: -.1,  y: -.75, d: 'Plans three moves ahead' }},
      {{ n: 'Collector',  x: -.7,  y: -.45, d: 'Curates, organizes, completes' }}
    ];

    // Mapping each choice (A-F) to its archetype from backend_procedures.py
    const ROLE_COORDS = {{
      'A': {{ x: -.7,  y: -.45, n: 'Collector' }},
      'B': {{ x: -.55, y: .6,   n: 'Creator' }},
      'C': {{ x: .65,  y: -.5,  n: 'Competitor' }},
      'D': {{ x: -.1,  y: -.75, n: 'Strategist' }},
      'E': {{ x: .1,   y: .8,   n: 'Explorer' }},
      'F': {{ x: .7,   y: .45,  n: 'Socializer' }}
    }};

    const clamp = v => Math.max(-.95, Math.min(.95, v));

    window.locate = ans => {{
      let sx = 0, sy = 0;
      ans.forEach(a => {{
        const r = ROLE_COORDS[a];
        if (r) {{ sx += r.x; sy += r.y; }}
      }});

      // User coordinate is the center-of-mass of all chosen archetypes
      const x = clamp(sx / ans.length);
      const y = clamp(sy / ans.length);

      // Proximity to all 6 archetypes
      const near = ARCH.map(a => ({{ ...a, dist: Math.hypot(a.x - x, a.y - y) }}))
        .map(a => ({{ ...a, pct: Math.round(100 * Math.max(0, 1 - a.dist / 1.3)) }}))
        .sort((a, b) => a.dist - b.dist);

      return {{ x, y, near }};
    }};
    }})();
    """

with open("questions.js", "w", encoding="utf-8") as f:
        f.write(js_content)

print("done converted!")