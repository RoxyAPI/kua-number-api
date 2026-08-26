"""
Kua Number API: the Ming Gua for one person, the east or west life group, the
personal trigram, and all eight compass sectors classified into the four
favourable Eight Mansions stars and the four unfavourable ones. Then the same map
from the Ba Zhai endpoint, ranked best to worst with a reading per sector.

Only the Chinese year of birth enters the formula, so there is no birth time, no
birthplace and no coordinates to collect.
"""

import os

from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])


def main():
    # 1. The kua number calculator. This birth date is one the formula answers 5
    #    on, which is the case worth showing: 5 belongs to the centre and has no
    #    trigram of its own, so it is reassigned by sex and both values come back.
    kua = roxy.feng_shui.calculate_kua_number(
        date="1986-07-15",
        gender="male",
        year_boundary="li-chun",
    )

    trigram = kua["trigram"]
    print(f"Kua {kua['kua']}  ({kua['group']} group)")
    print(f"  formula output   {kua['rawKua']}, reassigned: {kua['reassigned']}")
    print(f"  personal trigram {trigram['english']} {trigram['symbol']} {trigram['chinese']}, {trigram['element']}, {trigram['direction']}")
    print(f"  Chinese year     {kua['solarYear']}, boundary {kua['boundaryDate']} ({kua['conventions']['yearBoundary']})")

    print("\nEight sectors in compass order:")
    for s in kua["sectors"]:
        print(f"  {s['direction']:<10} {s['starName']:<10} {s['nature']:<13} rank {s['rank']}  {s['domain']}")

    # 2. The feng shui year starts at Li Chun in early February, not on 1 January.
    #    The same person born a few months earlier sits in the previous Chinese
    #    year and gets a different Kua entirely. This is where a calendar year
    #    calculator goes wrong.
    january = roxy.feng_shui.calculate_kua_number(date="1986-01-20", gender="male")

    print("\nWhy the boundary matters, same year on the calendar:")
    print(f"  born 1986-07-15  Chinese year {kua['solarYear']}  Kua {kua['kua']}")
    print(f"  born 1986-01-20  Chinese year {january['solarYear']}  Kua {january['kua']}")
    print(f"  the boundary between them fell on {january['boundaryDate']}")

    # 3. The full Eight Mansions (Ba Zhai) map, ranked best to worst, with the star
    #    sitting on the direction a main door faces.
    mansions = roxy.feng_shui.generate_eight_mansions(
        date="1986-07-15",
        gender="male",
        facing="Southeast",
    )

    print(f"\nEight Mansions map for Kua {mansions['kua']}, ranked best to worst:")
    for s in mansions["sectors"]:
        print(f"  {s['direction']:<10} {s['starName']:<10} {s['pinyin']:<11} {s['chinese']}  {s['nature']} {s['rank']}")

    print(f"\n  best  {mansions['bestSector']}")
    print(f"  worst {mansions['worstSector']}")
    facing = mansions.get("facingSector")
    if facing:
        print(f"  a door facing {facing['direction']} sits on {facing['star']}, which is {facing['nature']}")

    print(f"\nStrongest sector reading:\n  {mansions['sectors'][0]['reading']}")


if __name__ == "__main__":
    main()
