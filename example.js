import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

/**
 * Kua Number API: the Ming Gua for one person, the east or west life group, the
 * personal trigram, and the eight compass sectors classified. Then the Ba Zhai map
 * ranked best to worst. Only the Chinese year of birth enters the formula, so no
 * birth time, no birthplace and no coordinates.
 */
async function main() {
  // The kua number calculator. This date is one the formula answers 5 on, so the
  // reassignment is visible: 5 has no trigram of its own and moves by sex.
  const kua = await roxy.fengShui.calculateKuaNumber({
    body: { date: '1986-07-15', gender: 'male', yearBoundary: 'li-chun' },
  });

  if (kua.error) throw new Error(kua.error.error);

  console.log(`Kua ${kua.data.kua} (${kua.data.group} group), trigram ${kua.data.trigram.english}`);
  console.log(`  formula output ${kua.data.rawKua}, reassigned: ${kua.data.reassigned}`);
  console.log(`  Chinese year ${kua.data.solarYear}, boundary ${kua.data.boundaryDate}`);

  console.log('\nEight sectors in compass order:');
  for (const s of kua.data.sectors) {
    console.log(`  ${s.direction} ${s.starName} ${s.nature} rank ${s.rank} ${s.domain}`);
  }

  // The feng shui year starts at Li Chun in early February. A January birthday in
  // the same calendar year belongs to the previous Chinese year and gets a
  // different Kua.
  const january = await roxy.fengShui.calculateKuaNumber({
    body: { date: '1986-01-20', gender: 'male' },
  });

  if (january.error) throw new Error(january.error.error);

  console.log('\nWhy the boundary matters, same year on the calendar:');
  console.log(`  born 1986-07-15  Chinese year ${kua.data.solarYear}  Kua ${kua.data.kua}`);
  console.log(`  born 1986-01-20  Chinese year ${january.data.solarYear}  Kua ${january.data.kua}`);

  // The full Eight Mansions map, ranked best to worst, with a facing sector read.
  const mansions = await roxy.fengShui.generateEightMansions({
    body: { date: '1986-07-15', gender: 'male', facing: 'Southeast' },
  });

  if (mansions.error) throw new Error(mansions.error.error);

  console.log(`\nEight Mansions map for Kua ${mansions.data.kua}, ranked best to worst:`);
  for (const s of mansions.data.sectors) {
    console.log(`  ${s.direction} ${s.starName} ${s.chinese} ${s.nature} ${s.rank}`);
  }

  console.log(`\n  best ${mansions.data.bestSector}, worst ${mansions.data.worstSector}`);
  if (mansions.data.facingSector) {
    console.log(`  a door facing ${mansions.data.facingSector.direction} sits on ${mansions.data.facingSector.star}, which is ${mansions.data.facingSector.nature}`);
  }
}

main().catch(console.error);
