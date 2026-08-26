# AGENTS.md for Kua Number API

This repo teaches AI coding agents (Cursor, Claude Code, Aider, Codex, Windsurf, RooCode, Gemini CLI) how to use the RoxyAPI feng shui Kua number and Eight Mansions endpoints.

## Endpoints

### Calculate Kua number
- Method: `POST`
- URL: `https://roxyapi.com/api/v2/feng-shui/kua`
- Auth: `X-API-Key` header
- Domain: `feng-shui` (one of 14+ in the RoxyAPI catalog)
- Operation ID: `calculateKuaNumber` matches the SDK method name in camelCase
- MCP tool: `post_feng_shui_kua` on `https://roxyapi.com/mcp/feng-shui`

### Generate Eight Mansions map
- Method: `POST`
- URL: `https://roxyapi.com/api/v2/feng-shui/eight-mansions`
- Auth: `X-API-Key` header
- Operation ID: `generateEightMansions`
- MCP tool: `post_feng_shui_eight_mansions` on `https://roxyapi.com/mcp/feng-shui`

## TypeScript SDK
```ts
import { createRoxy } from '@roxyapi/sdk';
const roxy = createRoxy(process.env.ROXY_API_KEY!);

const { data: kua } = await roxy.fengShui.calculateKuaNumber({
  body: { date: '1986-07-15', gender: 'male', yearBoundary: 'li-chun' },
});

const { data: mansions } = await roxy.fengShui.generateEightMansions({
  body: { date: '1986-07-15', gender: 'male', facing: 'Southeast' },
});
```

## Python SDK
```python
import os
from roxy_sdk import create_roxy
roxy = create_roxy(os.environ["ROXY_API_KEY"])

kua = roxy.feng_shui.calculate_kua_number(
    date="1986-07-15",
    gender="male",
    year_boundary="li-chun",
)

mansions = roxy.feng_shui.generate_eight_mansions(
    date="1986-07-15",
    gender="male",
    facing="Southeast",
)
```

## Setup step (coordinates not required)
Neither endpoint takes coordinates, and neither takes a birth time. Only the Chinese YEAR the birth date falls in enters the Kua formula, so a date plus a sex is the whole input. Do not call `/location/search` for these endpoints and do not ask a user for a birthplace: no field on either request accepts a latitude, a longitude or a timezone, so a geocoding step would produce values with nowhere to go. The same holds across the feng shui family and the Chinese astrology family, where latitude and longitude appear only as optional inputs on the Four Pillars routes and only matter when a non-clock hour convention is selected.

## Request fields, POST /feng-shui/kua
- `date` (string, required): birth date YYYY-MM-DD. Only the Chinese year enters the formula. A date is read at the start of its day and the boundary falls part-way through its own day, so a birth date landing exactly on the boundary day is placed in the outgoing year
- `gender` (string, required): `male` or `female`. Selects the formula variant. The two formulas are different arithmetic on the same year, and they differ in where a raw result of 5 is reassigned
- `yearBoundary` (string, optional): `li-chun` (default) or `lunar-new-year`. Which boundary starts the Chinese year. Li Chun is the astronomical start of spring in early February and is the classical position feng shui uses for periods, annual stars and afflictions alike. The two settings disagree for anyone born between the two dates
- `lang` (query string, optional): `en`, `tr`, `de`, `es`, `hi`, `pt`, `fr`, `ru`, `zh-Hans`, `zh-Hant`. Defaults to `en`

## Request fields, POST /feng-shui/eight-mansions
- `kua` (number, optional): 1 to 9. Build the map from a Kua you already have. A Kua of 5 is read as the Kua 2 chart
- `date` (string, optional): birth date YYYY-MM-DD, to derive the Kua. Requires `gender` alongside it
- `gender` (string, optional): `male` or `female`. Required when deriving the Kua from a birth date
- `yearBoundary` (string, optional): `li-chun` (default) or `lunar-new-year`. Applies only when deriving from a birth date, and is echoed back either way
- `facing` (string, optional): `North`, `Northeast`, `East`, `Southeast`, `South`, `Southwest`, `West`, `Northwest`. Names the star sitting on that sector in `facingSector`
- `lang` (query string, optional): same ten values
- **Send either `kua`, or both `date` and `gender`. Sending neither is a 400**, because the formula differs by sex and a birth date alone is not enough

## Response top level keys, POST /feng-shui/kua
- `kua`: the Kua number, 1 to 9 excluding 5
- `rawKua`: the formula output before reassignment. Equal to `kua` except when the formula produced 5
- `reassigned`: boolean. True when the raw result was 5 and had to be moved onto a trigram, to 2 for a man and to 8 for a woman
- `gender`: echo of the sex sent
- `group`: `east` or `west` life group
- `solarYear`: the Chinese year the date fell in under the boundary applied. The previous calendar year for an early-in-the-year birthday
- `boundaryDate`: calendar date of the boundary that decided the year, computed astronomically rather than assumed
- `trigram`: `number`, `chinese`, `english`, `pinyin`, `symbol`, `binary`, `element`, `direction`, `familyMember`
- `sectors[]`: all eight, in compass order from North. Each has `direction`, `star`, `starName`, `starNameLocalized` (only when `lang` is not English), `nature`, `rank`, `domain`
- `conventions`: `{ yearBoundary }`, the resolved switch

## Response top level keys, POST /feng-shui/eight-mansions
- `kua`, `group`, `trigram`: as above
- `sectors[]`: all eight, ordered BEST TO WORST rather than by compass. Each carries everything the Kua endpoint returns plus `chinese`, `pinyin`, its own sector `trigram` and a composed `reading`
- `bestSector`: the strongest compass sector, first in the ranked list
- `worstSector`: the most serious sector, last in the ranked list
- `facingSector`: `{ direction, star, nature }` for the sector sent as `facing`. Absent when no facing was sent
- `conventions`: `{ yearBoundary }`

## Domain rules
- No coordinates, no birth time, no geocoding. A date and a sex is the entire input.
- **The Chinese year does not start on 1 January.** Under the default it starts at Li Chun, in early February, so a January or early February birth date belongs to the previous Chinese year and produces a different Kua. Always read `solarYear` back and show it to the user rather than assuming the calendar year, and store `conventions.yearBoundary` with any result you persist.
- Li Chun is commonly quoted as 4 February and lands on the 3rd or the 5th in roughly one year in four, which is why `boundaryDate` is returned rather than assumed.
- `lunar-new-year` starts the year two to four weeks later than `li-chun` and matches popular zodiac tables. Offer it as a switch, never as a silent default.
- **Never print `kua` alone when `reassigned` is true.** The formula gave `rawKua` of 5, which belongs to the centre and has no trigram or direction of its own, so it was moved to 2 for a man and 8 for a woman. Showing `rawKua` and the reassignment is what stops a user thinking the arithmetic is wrong.
- `group`, `direction`, `star`, `starName` and `nature` are stable English values, never localized. Branch and style on them safely under any language. Only `starNameLocalized` and `reading` follow `lang`.
- `rank` runs 1 to 4 WITHIN a nature. Among auspicious sectors 1 is the strongest. Among inauspicious sectors 1 is the mildest and 4 the most serious, which is what tells you which affliction to accept when no favourable sector is reachable.
- Exactly four sectors are auspicious and four are inauspicious, and the two sets partition the compass. East group Kuas are 1, 3, 4 and 9 and share North, East, Southeast and South. West group Kuas are 2, 6, 7 and 8 and share Northeast, Southwest, West and Northwest.
- For a ranked map with readings, call `/feng-shui/eight-mansions` rather than sorting the Kua endpoint sectors yourself. It returns the order, the star characters, the sector trigram and the composed reading in one call.
- For a Kua chart with no birth data at all, use `GET /feng-shui/kua/{number}`. It is the reference lookup behind a per-Kua page or a picker.

## Related endpoints
- `GET /feng-shui/kua/{number}` (`getKuaNumber`): one Kua in full with no birth data, `number`, `group`, `trigram` and eight classified `sectors`
- `POST /feng-shui/flying-stars/natal` (`generateFlyingStarChart`): the chart for a BUILDING rather than a person. Period plus facing gives the nine palaces with base, mountain and water stars. Note that `facing` here is one of the 24 mountains, addressed by pinyin id or by compass label such as `S2`, not the eight-sector word the Eight Mansions endpoint takes
- `GET /feng-shui/bagua` (`listBaguaSectors`): the eight life areas of the bagua map as a catalogue
- `GET /feng-shui/bagua/{id}` (`getBaguaSector`): one sector in full, `palace`, `direction`, `element`, `colors`, `trigram`, `earlierHeavenTrigram`, `focus`, `meaning`

## Verified
2026-Q3 against `https://roxyapi.com/api/v2/openapi.json`. Re-fetch the spec for ground truth before changing this file.

## Discovery
- Full catalog: https://roxyapi.com/AGENTS.md
- LLM index: https://roxyapi.com/llms.txt
- Methodology: https://roxyapi.com/methodology
