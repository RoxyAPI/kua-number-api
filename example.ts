import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

/**
 * Kua Number API: the Ming Gua for one person, the east or west life group, the
 * personal trigram, and all eight compass sectors classified into the four
 * favourable Eight Mansions stars and the four unfavourable ones. Then the same
 * map from the Ba Zhai endpoint, ranked best to worst with a reading per sector.
 * Only the Chinese year of birth enters the formula, so there is no birth time,
 * no birthplace and no coordinates to collect.
 */
async function main() {
  // 1. The kua number calculator. This birth date is one the formula answers 5 on,
  //    which is the case worth showing: 5 belongs to the centre and has no trigram
  //    of its own, so it is reassigned by sex and both values come back.
  const { data: kua, error } = await roxy.fengShui.calculateKuaNumber({
    body: { date: '1986-07-15', gender: 'male', yearBoundary: 'li-chun' },
  });

  if (error) throw new Error(error.error);

  console.log(`Kua ${kua.kua}  (${kua.group} group)`);
  console.log(`  formula output   ${kua.rawKua}, reassigned: ${kua.reassigned}`);
  console.log(`  personal trigram ${kua.trigram.english} ${kua.trigram.symbol} ${kua.trigram.chinese}, ${kua.trigram.element}, ${kua.trigram.direction}`);
  console.log(`  Chinese year     ${kua.solarYear}, boundary ${kua.boundaryDate} (${kua.conventions.yearBoundary})`);

  console.log('\nEight sectors in compass order:');
  for (const s of kua.sectors) {
    console.log(`  ${s.direction.padEnd(10)} ${s.starName.padEnd(10)} ${s.nature.padEnd(13)} rank ${s.rank}  ${s.domain}`);
  }

  // 2. The feng shui year starts at Li Chun in early February, not on 1 January.
  //    The same person born a few months earlier sits in the previous Chinese year
  //    and gets a different Kua entirely. This is where a calendar year calculator
  //    goes wrong.
  const { data: january, error: januaryError } = await roxy.fengShui.calculateKuaNumber({
    body: { date: '1986-01-20', gender: 'male' },
  });

  if (januaryError) throw new Error(januaryError.error);

  console.log('\nWhy the boundary matters, same year on the calendar:');
  console.log(`  born 1986-07-15  Chinese year ${kua.solarYear}  Kua ${kua.kua}`);
  console.log(`  born 1986-01-20  Chinese year ${january.solarYear}  Kua ${january.kua}`);
  console.log(`  the boundary between them fell on ${january.boundaryDate}`);

  // 3. The full Eight Mansions (Ba Zhai) map, ranked best to worst, with the star
  //    sitting on the direction a main door faces.
  const { data: mansions, error: mansionsError } = await roxy.fengShui.generateEightMansions({
    body: { date: '1986-07-15', gender: 'male', facing: 'Southeast' },
  });

  if (mansionsError) throw new Error(mansionsError.error);

  console.log(`\nEight Mansions map for Kua ${mansions.kua}, ranked best to worst:`);
  for (const s of mansions.sectors) {
    console.log(`  ${s.direction.padEnd(10)} ${s.starName.padEnd(10)} ${s.pinyin.padEnd(11)} ${s.chinese}  ${s.nature} ${s.rank}`);
  }

  console.log(`\n  best  ${mansions.bestSector}`);
  console.log(`  worst ${mansions.worstSector}`);
  if (mansions.facingSector) {
    console.log(`  a door facing ${mansions.facingSector.direction} sits on ${mansions.facingSector.star}, which is ${mansions.facingSector.nature}`);
  }

  console.log(`\nStrongest sector reading:\n  ${mansions.sectors[0]?.reading}`);
}

main().catch(console.error);
