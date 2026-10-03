(() => {
const X = [
  ['Your ideal Saturday looks like…', ['Out where the crowd is', 'Alone, deep in a project', 'Dinner with a few people', 'One close friend, no plans'], [2, -2, 1, -1]],
  ['You walk into a party knowing only one person. You…', ['Find a quiet corner', 'Work the whole room', 'Stay near your one person', 'Chat with a few new faces'], [-2, 2, -1, 1]],
  ['After a long week you recharge by…', ['Calling friends', 'Going somewhere busy', 'Closing the door and going silent', 'A quiet evening with one person'], [1, 2, -2, -1]],
  ['You get great news. You…', ['Post it for everyone', 'Tell no one yet', 'Tell a couple of people', 'Tell the group chat'], [2, -2, -1, 1]],
  ['You learn best…', ['On my own, at my pace', 'In a study group', 'By teaching it to others', 'With one mentor'], [-2, 1, 2, -1]],
  ['A free evening suddenly opens up. You…', ['Start something on your own', 'Ask who is around', 'Organize an event', 'Save it for a quiet night in'], [-2, 1, 2, -1]],
  ['Your ideal work setup is…', ['Headphones on, solo', 'Constant talk with the team', 'Mostly solo, quick check-ins', 'A mix, leaning team'], [-2, 2, -1, 1]],
  ['Your circle of friends is…', ['Huge and always growing', 'A handful of lifelong people', 'A few tight groups', 'Tiny, and that is enough'], [2, -1, 1, -2]],
  ['Someone hands you the mic for a toast. You…', ['Rather pass', 'Love it', 'Avoid it at all costs', 'Do it if I can prepare'], [-1, 2, -2, 1]],
  ['On a trip you would pick…', ['A hostel full of travelers', 'A private cabin', 'A hotel with a few friends', 'A quiet room, one travel partner'], [2, -2, 1, -1]]
];
const Y = [
  ['Before a trip you…', ['Book everything weeks ahead', 'Pick a direction and wing it', 'Plan only the big stops', 'Keep a loose plan with free days'], [-2, 2, -1, 1]],
  ['Your desk looks like…', ['Everything has a place', 'Organized chaos', 'A creative explosion', 'Tidy enough'], [-2, 1, 2, -1]],
  ['A deadline is two weeks away. You…', ['Finish early with a schedule', 'Work in bursts of inspiration', 'Start the night before', 'Do a little every few days'], [-2, 1, 2, -1]],
  ['A new tool arrives. You…', ['Read the manual first', 'Dive in and click everything', 'Watch a quick tutorial', 'Try it, check docs when stuck'], [-2, 2, -1, 1]],
  ['Your plans fall apart. You feel…', ['Stressed, I need a new plan', 'Excited, new path ahead', 'Annoyed but I adapt', 'Fine, improvising is fun'], [-2, 2, -1, 1]],
  ['You pick where to eat by…', ['A menu I researched earlier', 'Walking by and smelling', 'My usual spot', 'Whatever sounds fun today'], [-2, 2, -1, 1]],
  ['Your to-do list is…', ['Detailed and ranked', 'It does not exist', 'Short and simple', 'Scribbled, loosely followed'], [-2, 2, -1, 1]],
  ['For big decisions you…', ['Build a pros and cons table', 'Go with my gut', 'Ask advisors, then decide', 'Sleep on it, then follow instinct'], [-2, 2, -1, 1]],
  ['You want your career to be…', ['A clear ladder', 'A surprise every year', 'Stable with some variety', 'A zigzag of experiments'], [-2, 2, -1, 1]],
  ['A free afternoon. You…', ['Follow the schedule I set', 'Wander and see what happens', 'Finish pending chores first', 'Start a spontaneous project'], [-2, 2, -1, 1]]
];
const mk = (axis, [q, options, s]) => ({ q, axis, options, s });
// interleave x / y questions -> 20 total
window.QUESTIONS = X.flatMap((x, i) => [mk('x', x), mk('y', Y[i])]);
 
window.ARCH = [
  { n: 'Creator',    x: -.55, y: .6,   d: 'Makes things from nothing' },
  { n: 'Explorer',   x: .1,   y: .8,   d: 'Chases the next unknown' },
  { n: 'Socializer', x: .7,   y: .45,  d: 'Brings people together' },
  { n: 'Competitor', x: .65,  y: -.5,  d: 'Plays to win, thrives on stakes' },
  { n: 'Strategist', x: -.1,  y: -.75, d: 'Plans three moves ahead' },
  { n: 'Collector',  x: -.7,  y: -.45, d: 'Curates, organizes, completes' }
];
const clamp = v => Math.max(-.95, Math.min(.95, v));
window.locate = ans => {
  let sx = 0, sy = 0, nx = 0, ny = 0;
  ans.forEach((a, i) => {
    const q = QUESTIONS[i], v = q.s['ABCD'.indexOf(a)];
    if (q.axis === 'x') { sx += v; nx++; } else { sy += v; ny++; }
  });
  const x = clamp(sx / (2 * nx) * 1.25), y = clamp(sy / (2 * ny) * 1.25);
  const near = ARCH.map(a => ({ ...a, dist: Math.hypot(a.x - x, a.y - y) }))
    .map(a => ({ ...a, pct: Math.round(100 * Math.max(0, 1 - a.dist / 1.3)) })).sort((a, b) => a.dist - b.dist);
  return { x, y, near };
};
})();
