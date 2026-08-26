[![Kua Number API](banner.png)](https://roxyapi.com/products/feng-shui-api)

# Kua Number API

> Kua number API for feng shui directions. One birth date and sex returns the Kua, also called the Ming Gua, the east or west life group, the personal trigram, and all eight compass sectors classified best to worst. The Chinese year resolves at Li Chun, and the raw formula output ships alongside the final number. One key covers 14+ spiritual domains. MCP-first, ten languages including Simplified and Traditional Chinese.

[![Get API Key](https://img.shields.io/badge/Get_API_Key-RoxyAPI-14b8a6?style=for-the-badge&logo=key&logoColor=white)](https://roxyapi.com/pricing)
[![Try Live](https://img.shields.io/badge/Try_API_Live-Free_in_browser-22c55e?style=for-the-badge&logo=swagger&logoColor=white)](https://roxyapi.com/api-reference)
[![Methodology](https://img.shields.io/badge/Methodology-Typed_conventions-f59e0b?style=for-the-badge&logo=readthedocs&logoColor=white)](https://roxyapi.com/methodology)
[![MCP Server](https://img.shields.io/badge/MCP_Server-Streamable_HTTP-8b5cf6?style=for-the-badge&logo=anthropic&logoColor=white)](https://roxyapi.com/docs/mcp)
[![SDK](https://img.shields.io/badge/SDK-TypeScript_+_Python_+_PHP_+_C%23_+_Go_+_WordPress-3b82f6?style=for-the-badge&logo=npm&logoColor=white)](https://roxyapi.com/docs/sdk)

## What is Kua Number API

A Kua number, also called the Ming Gua or life gua, is the single value every personal feng shui calculation keys on. It comes from the Chinese year a person was born in plus their sex, and it places them in the east group (Kua 1, 3, 4 and 9) or the west group (Kua 2, 6, 7 and 8). From there the Eight Mansions system, Ba Zhai, splits the compass into four favourable sectors, Sheng Chi, Tian Yi, Yan Nian and Fu Wei, and four unfavourable ones, Huo Hai, Wu Gui, Liu Sha and Jue Ming. Those eight sectors are the personal feng shui directions a placement tool actually needs: which way to face a desk, where to seat a main door, which wall a bed head belongs against.

This repo ships working TypeScript, JavaScript, and Python samples against two RoxyAPI feng shui endpoints. `POST /feng-shui/kua` is the kua number calculator: send a date and a sex, get the number, the life group, the personal trigram, and all eight sectors classified. `POST /feng-shui/eight-mansions` returns the same map **ranked best to worst**, with a composed reading per sector, the best and worst sector named, and the star sitting on a facing direction you pass in. The ranking is the part a static chart image cannot give you, because it is what tells a room-by-room tool which affliction to accept when no favourable sector is reachable.

Three things are worth knowing before you wire this in.

**The raw formula output is published, not hidden.** The formula produces a 5 for some births, and 5 belongs to the centre, so it has no trigram and no direction of its own. It gets reassigned by sex, to Kua 2 for a man and Kua 8 for a woman. The response carries `rawKua` and a `reassigned` flag beside `kua`, so a product can show its working rather than printing a number that does not match the arithmetic a user just did on paper.

**The feng shui year starts at Li Chun, in early February.** Not on 1 January, and not at the lunar new year either, which lands two to four weeks later. A January or early February birthday usually belongs to the *previous* Chinese year and produces a different Kua, which is exactly where a calculator that reads the calendar year goes wrong. `yearBoundary` is a typed request parameter with `li-chun` as the default, `solarYear` and `boundaryDate` come back so you can see which year the formula actually used, and `conventions` echoes the boundary that was applied. The boundary date is computed astronomically rather than assumed, so it comes back on the 3rd, 4th or 5th of February as the year genuinely falls.

**Ten languages, including both Chinese scripts.** Add `?lang=zh-Hans` or `?lang=zh-Hant` and every star gets a `starNameLocalized` sibling, while `star`, `group`, `nature` and `direction` stay canonical English so your code can keep comparing against them.

One subscription unlocks 14+ spiritual domains: Western astrology, Vedic astrology, Forecast, Human Design, Chinese astrology, Feng Shui, numerology, tarot, biorhythm, I Ching, crystals, dreams, angel numbers, and location.

## Why this API

| Property | Value |
|----------|-------|
| Coverage | 14+ spiritual domains in one subscription |
| Conventions | `yearBoundary` is a typed request parameter and the resolved value is echoed in `conventions` on every response, so a stored chart is reproducible years later |
| Transparency | `rawKua` and `reassigned` ship beside `kua`, and `solarYear` plus `boundaryDate` show which Chinese year the formula used |
| Languages | Ten, English plus tr, de, es, hi, pt, fr, ru, zh-Hans and zh-Hant |
| MCP server | `https://roxyapi.com/mcp/feng-shui` (Streamable HTTP, no local setup) |
| SDKs | TypeScript on npm `@roxyapi/sdk`, Python on PyPI `roxy-sdk`, PHP on Packagist `roxyapi/sdk`, C# on NuGet `RoxyApi.Sdk`, Go `github.com/RoxyAPI/sdk-go`, WordPress plugin `roxyapi` |
| Pricing | One key, flat per call, from $39/mo |
| Licensing | Personal and commercial use, including closed source apps. No AGPL or GPL entanglement. [Full terms](https://roxyapi.com/policy/license) |
| Last verified | 2026-Q3 |

## Quick start

1. Get a key at [roxyapi.com/pricing](https://roxyapi.com/pricing)
2. Pick a language below
3. Copy the snippet, run, ship

Neither endpoint needs a birth time, a birth place, latitude or longitude. Only the Chinese year the birth date falls in enters the formula, so a date and a sex is the whole input. There is no geocoding step here.

Both snippets below use a birth date whose formula output is 5, so you can watch the reassignment happen: `rawKua` comes back 5, `reassigned` comes back true, and `kua` comes back 2.

### cURL

```bash
# Kua number, life group, trigram and all eight sectors
curl -X POST https://roxyapi.com/api/v2/feng-shui/kua \
  -H "X-API-Key: $ROXY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1986-07-15",
    "gender": "male",
    "yearBoundary": "li-chun"
  }'

# The full Eight Mansions map, ranked best to worst, with a facing sector read
curl -X POST https://roxyapi.com/api/v2/feng-shui/eight-mansions \
  -H "X-API-Key: $ROXY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1986-07-15",
    "gender": "male",
    "facing": "Southeast"
  }'
```

### Python

```python
import os
from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])

# Kua number calculator: one date plus one sex, no birth time and no coordinates
kua = roxy.feng_shui.calculate_kua_number(
    date="1986-07-15",
    gender="male",
    year_boundary="li-chun",
)

print("Kua", kua["kua"], "group", kua["group"], "trigram", kua["trigram"]["english"])
print("raw", kua["rawKua"], "reassigned", kua["reassigned"])
print("Chinese year", kua["solarYear"], "boundary", kua["boundaryDate"])

# The full Ba Zhai map, ranked best to worst, plus the star on the facing sector
mansions = roxy.feng_shui.generate_eight_mansions(
    date="1986-07-15",
    gender="male",
    facing="Southeast",
)

print("Best", mansions["bestSector"], "worst", mansions["worstSector"])
for s in mansions["sectors"]:
    print(f"  {s['direction']:<10} {s['starName']:<10} {s['nature']:<13} rank {s['rank']}  {s['domain']}")
```

### JavaScript (Node)

```js
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

// Kua number calculator: one date plus one sex, no birth time and no coordinates
const kua = await roxy.fengShui.calculateKuaNumber({
  body: { date: '1986-07-15', gender: 'male', yearBoundary: 'li-chun' },
});

if (kua.error) throw new Error(kua.error.error);

console.log('Kua', kua.data.kua, 'group', kua.data.group, 'trigram', kua.data.trigram.english);
console.log('raw', kua.data.rawKua, 'reassigned', kua.data.reassigned);
console.log('Chinese year', kua.data.solarYear, 'boundary', kua.data.boundaryDate);

// The full Ba Zhai map, ranked best to worst, plus the star on the facing sector
const mansions = await roxy.fengShui.generateEightMansions({
  body: { date: '1986-07-15', gender: 'male', facing: 'Southeast' },
});

if (mansions.error) throw new Error(mansions.error.error);

console.log('Best', mansions.data.bestSector, 'worst', mansions.data.worstSector);
mansions.data.sectors.forEach(s =>
  console.log(' ', s.direction, s.starName, s.nature, 'rank', s.rank, s.domain)
);
```

### TypeScript

```ts
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

// Kua number calculator: one date plus one sex, no birth time and no coordinates
const { data: kua, error } = await roxy.fengShui.calculateKuaNumber({
  body: { date: '1986-07-15', gender: 'male', yearBoundary: 'li-chun' },
});

if (error) throw new Error(error.error);

console.log(`Kua ${kua.kua} (${kua.group} group), trigram ${kua.trigram.english}`);
console.log(`Formula gave ${kua.rawKua}, reassigned: ${kua.reassigned}`);
console.log(`Chinese year ${kua.solarYear}, boundary ${kua.boundaryDate}`);

// The full Ba Zhai map, ranked best to worst, plus the star on the facing sector
const { data: mansions, error: mansionsError } = await roxy.fengShui.generateEightMansions({
  body: { date: '1986-07-15', gender: 'male', facing: 'Southeast' },
});

if (mansionsError) throw new Error(mansionsError.error);

console.log(`Best ${mansions.bestSector}, worst ${mansions.worstSector}`);
for (const s of mansions.sectors) {
  console.log(`  ${s.direction.padEnd(10)} ${s.starName.padEnd(10)} rank ${s.rank}  ${s.domain}`);
}
```

## Request schema

### POST /feng-shui/kua

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | yes | Birth date in YYYY-MM-DD format. Only the Chinese year this date falls in enters the formula, so no birth time, latitude or longitude is needed. A January or early February birthday is the case that matters: it usually belongs to the previous Chinese year and produces a different Kua. A date is read at the start of its day, and the boundary falls part-way through its own day, so a birth date landing exactly on the boundary day is placed in the outgoing year |
| `gender` | string | yes | `male` or `female`. Selects the Kua formula variant. The two formulas are different arithmetic on the same year, and they also differ in where a raw result of 5 is reassigned |
| `yearBoundary` | string | no | `li-chun` or `lunar-new-year`. Which boundary starts the Chinese year. Defaults to `li-chun`, the astronomical start of spring in early February, which is the classical position and the one feng shui uses for periods, annual stars and afflictions alike. Send `lunar-new-year` to match popular zodiac tables, which start the year two to four weeks later. The two disagree for anyone born between the two dates |
| `lang` | query string | no | `en`, `tr`, `de`, `es`, `hi`, `pt`, `fr`, `ru`, `zh-Hans` or `zh-Hant`. Adds `starNameLocalized` to every sector. Defaults to `en` |

### POST /feng-shui/eight-mansions

Send either a `kua` number, or a `date` and a `gender` so the Kua can be derived. Sending neither is a 400.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `kua` | number | no | Kua number 1 to 9 to build the map for, if you already have one. A Kua of 5 is read as the Kua 2 chart, since 5 has no direction of its own |
| `date` | string | no | Birth date in YYYY-MM-DD format, used to derive the Kua when no `kua` is sent. Requires `gender` alongside it |
| `gender` | string | no | `male` or `female`. Selects the Kua formula variant. Required when the Kua is being derived from a birth date |
| `yearBoundary` | string | no | `li-chun` or `lunar-new-year`. Which boundary starts the Chinese year when the Kua is derived from a birth date. Defaults to `li-chun`. Ignored when a `kua` is sent directly, and echoed back either way |
| `facing` | string | no | Compass sector the main door faces: `North`, `Northeast`, `East`, `Southeast`, `South`, `Southwest`, `West` or `Northwest`. When sent, the response names the star sitting on that sector so a caller can judge an entrance without scanning the whole map |
| `lang` | query string | no | Same ten values as above. Adds `starNameLocalized` to every sector |

## Response shape

### POST /feng-shui/kua

```json
{
  "kua": 2,
  "rawKua": 5,
  "reassigned": true,
  "gender": "male",
  "group": "west",
  "solarYear": 1986,
  "boundaryDate": "1986-02-04",
  "trigram": {
    "number": 2,
    "chinese": "坤",
    "english": "Earth",
    "pinyin": "Kūn",
    "symbol": "☷",
    "binary": "000",
    "element": "Earth",
    "direction": "Southwest",
    "familyMember": "Mother"
  },
  "sectors": [
    { "direction": "North", "star": "jue-ming", "starName": "Jue Ming", "nature": "inauspicious", "rank": 4, "domain": "Total loss" },
    { "direction": "Northeast", "star": "sheng-chi", "starName": "Sheng Chi", "nature": "auspicious", "rank": 1, "domain": "Growth and income" },
    { "direction": "East", "star": "huo-hai", "starName": "Huo Hai", "nature": "inauspicious", "rank": 1, "domain": "Mishaps and friction" },
    { "direction": "Southeast", "star": "wu-gui", "starName": "Wu Gui", "nature": "inauspicious", "rank": 2, "domain": "Betrayal and loss" },
    { "direction": "South", "star": "liu-sha", "starName": "Liu Sha", "nature": "inauspicious", "rank": 3, "domain": "Disputes and entanglement" },
    { "direction": "Southwest", "star": "fu-wei", "starName": "Fu Wei", "nature": "auspicious", "rank": 4, "domain": "Stability and clarity" },
    { "direction": "West", "star": "tian-yi", "starName": "Tian Yi", "nature": "auspicious", "rank": 2, "domain": "Health and support" },
    { "direction": "Northwest", "star": "yan-nian", "starName": "Yan Nian", "nature": "auspicious", "rank": 3, "domain": "Relationships and longevity" }
  ],
  "conventions": { "yearBoundary": "li-chun" }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `kua` | number | Kua number, 1 to 9 excluding 5. This is the value every other feng shui calculation about a person keys on |
| `rawKua` | number | The formula output before any reassignment. Equal to `kua` except when the formula produced 5, which has no trigram and no direction and must be moved |
| `reassigned` | boolean | Whether the raw result was 5 and had to be moved onto a trigram, to 2 for a man and to 8 for a woman |
| `gender` | string | Echo of the sex sent, which selected the formula variant |
| `group` | string | Life group, `east` or `west`. East group Kuas are 1, 3, 4 and 9 and share North, East, Southeast and South as their favourable sectors; west group Kuas are 2, 6, 7 and 8 and share Northeast, Southwest, West and Northwest. Always English, safe to compare against |
| `solarYear` | number | The Chinese year the birth date fell in under the boundary applied. This is the year the formula actually used, which is the previous calendar year for an early-in-the-year birthday |
| `boundaryDate` | string | Calendar date of the boundary that decided the year, computed astronomically rather than assumed. Li Chun is commonly quoted as 4 February and lands on the 3rd or the 5th in roughly one year in four |
| `trigram` | object | The personal trigram: `number`, `chinese`, `english`, `pinyin`, `symbol`, `binary`, `element`, `direction` and `familyMember`. The same identifiers the I-Ching trigram endpoints publish |
| `trigram.binary` | string | Three lines bottom to top, 1 for yang and 0 for yin. The Eight Mansions classification of any sector is decided by which of these three lines differ from your own trigram |
| `sectors` | array | All eight sectors classified for this Kua, in compass order from North. Exactly four are auspicious and four are inauspicious, and the two sets partition the compass |
| `sectors[].direction` | string | Compass sector. Always English, whatever `lang` says, so it stays safe to compare against |
| `sectors[].star` | string | Eight Mansions star for this sector, one of `sheng-chi`, `tian-yi`, `yan-nian`, `fu-wei`, `huo-hai`, `wu-gui`, `liu-sha`, `jue-ming`. Always English, safe to compare against and to key styling on |
| `sectors[].starName` | string | Display name of the star. Always English, whatever `lang` says |
| `sectors[].starNameLocalized` | string | Star name in the requested language, for display only. Present only when `lang` is set to a language other than English. Never compare against this value |
| `sectors[].nature` | string | Whether the sector helps or harms: `auspicious` or `inauspicious` |
| `sectors[].rank` | number | Order within its nature, 1 to 4. Among auspicious sectors 1 is the strongest; among inauspicious sectors 1 is the mildest and 4 the most serious, which is what tells you which affliction to accept when no favourable sector is reachable |
| `sectors[].domain` | string | The life domain this sector governs, in a few words |
| `conventions` | object | The resolved school switches for this calculation. `conventions.yearBoundary` echoes whichever boundary decided the Chinese year, whether it was sent or defaulted |

### POST /feng-shui/eight-mansions

Same eight sectors, ordered best to worst instead of by compass, each with the star characters, its tone marked pinyin, its own trigram and a composed reading.

```json
{
  "kua": 2,
  "group": "west",
  "trigram": { "number": 2, "chinese": "坤", "english": "Earth", "pinyin": "Kūn", "symbol": "☷", "binary": "000", "element": "Earth", "direction": "Southwest", "familyMember": "Mother" },
  "sectors": [
    {
      "direction": "Northeast",
      "star": "sheng-chi",
      "starName": "Sheng Chi",
      "chinese": "生氣",
      "pinyin": "Shēng Qì",
      "nature": "auspicious",
      "rank": 1,
      "domain": "Growth and income",
      "trigram": { "number": 7, "chinese": "艮", "english": "Mountain", "pinyin": "Gèn", "symbol": "☶", "binary": "001", "element": "Earth", "direction": "Northeast", "familyMember": "Youngest Son" },
      "reading": "The Northeast sector reads Sheng Chi for Kua 2. This is one of the four favourable sectors for Kua 2, ranked 1 of four. The generating breath, and the strongest of the four favourable sectors. It is the direction to face while working, to seat a main door in, and to put a desk against, because it reads as advancement, new business and the kind of momentum that compounds. Where a household has to choose one sector to get right, this is the one."
    }
  ],
  "bestSector": "Northeast",
  "worstSector": "North",
  "facingSector": { "direction": "Southeast", "star": "wu-gui", "nature": "inauspicious" },
  "conventions": { "yearBoundary": "li-chun" }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `kua` | number | The Kua number this map was built for, whether it was sent directly or derived from the birth date |
| `group` | string | Life group, `east` or `west`. Always English, safe to compare against and to key styling on |
| `trigram` | object | The personal trigram for this Kua, same shape as above |
| `sectors` | array | All eight sectors, ordered best to worst rather than by compass, because the question this map answers is which sector to use next. Read down the list until you reach one the building actually has |
| `sectors[].chinese` | string | Chinese characters for the star. Data, identical in every language |
| `sectors[].pinyin` | string | Tone-marked pinyin for the star, so `sheng-chi` renders as Shēng Qì |
| `sectors[].trigram` | object | The trigram of the sector itself, which is what pairs with your own trigram to produce the classification |
| `sectors[].reading` | string | Composed reading for this sector: which star it holds, where that star ranks for this Kua, and what the star means in practice |
| `bestSector` | string | The single strongest compass sector for this Kua, first in the ranked list |
| `worstSector` | string | The single most serious sector for this Kua, last in the ranked list |
| `facingSector` | object | The classification of the sector sent as `facing`: its `direction`, the `star` sitting on it and that star `nature`. Absent when no facing was sent |
| `conventions` | object | The resolved school switches, echoed the same way as on the Kua endpoint |

## Common use cases

| Use case | Endpoint flow |
|----------|---------------|
| Kua number calculator page | POST to `/feng-shui/kua`, render `kua`, `group` and `trigram`, and show `rawKua` beside it when `reassigned` is true |
| Desk and bed placement tool | POST to `/feng-shui/eight-mansions`, walk `sectors[]` top down and stop at the first direction the room can actually offer |
| Front door assessment | POST to `/feng-shui/eight-mansions` with `facing` set to the door direction, read `facingSector.nature` for a one-glance verdict |
| Floor plan overlay | POST to `/feng-shui/eight-mansions`, colour each room on the plan by the `nature` and `rank` of the sector it sits in |
| Personalised feng shui report | Combine `sectors[].reading` from the Eight Mansions map with `bestSector` and `worstSector` for the summary block |
| Early February birthday correction | Read `solarYear` and `boundaryDate` and tell the user which Chinese year their date belongs to before showing the number |
| Popular zodiac table parity | Send `yearBoundary` as `lunar-new-year` and store `conventions.yearBoundary` with the result so the chart stays reproducible |
| Nine static Kua pages | GET `/feng-shui/kua/{number}` once per number, cache, and link each page at the calculator |
| Localised placement app | Add `?lang=zh-Hans` or `?lang=zh-Hant` and display `starNameLocalized` while branching on `star` |

## Related endpoints in this domain

- `GET /feng-shui/kua/{number}` (`getKuaNumber`) - one Kua in full with no birth data at all: its trigram, its east or west life group, and how it classifies all eight compass sectors. This is what backs the nine per-Kua reference pages and any picker UI
- `POST /feng-shui/flying-stars/natal` (`generateFlyingStarChart`) - the flying star chart for a building rather than a person: period plus facing gives the nine palaces with base, mountain and water stars and the combination reading
- `GET /feng-shui/bagua` (`listBaguaSectors`) - the eight life areas of the bagua map, the wealth corner and the rest, as a catalogue
- `GET /feng-shui/bagua/{id}` (`getBaguaSector`) - one bagua sector in full, with `palace`, `direction`, `element`, `colors`, `trigram`, `earlierHeavenTrigram`, `focus` and `meaning`

## Use this in your AI agent

Connect Claude, GPT, Gemini, or Cursor to RoxyAPI through the remote MCP server. No Docker. No self hosting. The full MCP tool catalog for this domain is at `https://roxyapi.com/mcp/feng-shui`.

```json
{
  "mcpServers": {
    "feng-shui": {
      "url": "https://roxyapi.com/mcp/feng-shui",
      "headers": { "X-API-Key": "$ROXY_API_KEY" }
    }
  }
}
```

The two tools this repo demonstrates are `post_feng_shui_kua` and `post_feng_shui_eight_mansions`. See [docs/mcp](https://roxyapi.com/docs/mcp) for Claude Desktop, Cursor, Windsurf, VS Code, and Claude Code setup.

## For AI coding agents

This repo ships an [AGENTS.md](AGENTS.md) execution playbook. Cursor, Claude Code, Aider, Codex, Windsurf, RooCode, and Gemini CLI will pick it up automatically. Top level overview lives at [roxyapi.com/AGENTS.md](https://roxyapi.com/AGENTS.md).

## Resources

- [Methodology and gold standard tests](https://roxyapi.com/methodology)
- [Full API reference](https://roxyapi.com/api-reference) interactive Scalar UI
- [TypeScript SDK on npm](https://www.npmjs.com/package/@roxyapi/sdk)
- [Python SDK on PyPI](https://pypi.org/project/roxy-sdk/)
- [PHP SDK on Packagist](https://packagist.org/packages/roxyapi/sdk)
- [C# SDK on NuGet](https://www.nuget.org/packages/RoxyApi.Sdk)
- [Go SDK on pkg.go.dev](https://pkg.go.dev/github.com/RoxyAPI/sdk-go)
- [WordPress plugin](https://wordpress.org/plugins/roxyapi/)
- [llms.txt](https://roxyapi.com/llms.txt) full LLM citation index
- [Top level AGENTS.md](https://roxyapi.com/AGENTS.md)

## Other RoxyAPI samples

[![Natal Chart API](https://img.shields.io/badge/Natal_Chart_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/natal-chart-api)
[![Human Design API](https://img.shields.io/badge/Human_Design_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/human-design-api)
[![Numerology API](https://img.shields.io/badge/Numerology_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/numerology-api)
[![Tarot API](https://img.shields.io/badge/Tarot_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/tarot-api)
[![Transit Forecast API](https://img.shields.io/badge/Transit_Forecast_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/transit-forecast-api)

## License

MIT for this sample repo. See [LICENSE](LICENSE).

**Catalog licensing:** Personal and commercial use, including closed source proprietary apps. No AGPL or GPL entanglement. RoxyAPI APIs and SDKs are safe to embed in commercial products. Full terms at [roxyapi.com/policy/license](https://roxyapi.com/policy/license).

## Contact

- Site: [roxyapi.com](https://roxyapi.com)
- Status: [roxyapi.com/api-reference](https://roxyapi.com/api-reference)
