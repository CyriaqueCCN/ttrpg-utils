from scenarios import config

median_ac = {
    0 : 16,
    1 : 17,
    2 : 18,
    3 : 19,
    4 : 21,
    5 : 22,
    6 : 24,
    7 : 25,
    8 : 27,
    9 : 28,
    10 : 30,
    11 : 31,
    12 : 33,
    13 : 34,
    14 : 36,
    15 : 37,
    16 : 39,
    17 : 40,
    18 : 42,
    19 : 44,
    20 : 46,
    21 : 47,
}

attack_template = {
    'name' : None,
    'hit_bonus' : 0,
    'damage_bonus' : 0,
    'damage_die_number' : 0,
    'damage_die_size' : 0,
    'sneak_attack_number' : 0,
    'sneak_attack_size' : 0,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 0,
    'noncrit_die_size' : 0,
    'noncrit_damage_bonus' : 0,
    'fatal': 0,
    'deadly': 0,
    'critspec_flatfoot': False,
    'critspec_damage' : 0
}

def die_avg(number, size):
    if number == 0 or size == 0:
        return 0
    return (number * (size + 1)) / 2

def deadly_die(die):
    if die >= 4:
        return 3
    if die == 3:
        return 2
    return 1

def get_attack_damage(a, ac):
    crit_chance = round(min(0.95, max(0.05, (11 + a['hit_bonus'] - ac) / 20)), 2)
    hit_chance = round(min(0.95, max(0.05, (21 + a['hit_bonus'] - ac) / 20)) - crit_chance, 2)
    #print(f"ac : {ac}, to hit : {a['hit_bonus']}, crit : {crit_chance}, hit : {hit_chance}")
    hit_dpr = die_avg(a['damage_die_number'], a['damage_die_size']) + a['damage_bonus'] \
        + die_avg(a['enchants_die_number'], a['enchants_die_size']) + a['enchants_damage_bonus'] \
            + die_avg(a['noncrit_die_number'], a['noncrit_die_size'])
    crit_die = a['damage_die_size'] if a['fatal'] == 0 else a['fatal']
    crit_dpr = 2 * (die_avg(a['damage_die_number'], crit_die) + a['damage_bonus'] \
        + die_avg(a['enchants_die_number'], a['enchants_die_size']) + a['enchants_damage_bonus']) \
            + die_avg(deadly_die(a['damage_die_number']), a['deadly']) + die_avg(1, a['fatal']) + a['critspec_damage'] \
                + die_avg(a['noncrit_die_number'], a['noncrit_die_size'])
    return round(hit_dpr * hit_chance + crit_dpr * crit_chance, 2)

def get_ac(lvl):
    if lvl < 0:
        lvl = 0
    elif lvl > 21:
        lvl = 21
    return median_ac[lvl]

def display_attack_result(att):
    # deleted the sublevel ['dpr'] of rmin, rmed, rmax
    print(f"{att['num']} - {att['name']}  |  {att['rmin']}  |  {att['rmed']}  |  {att['rmax']}")

def display_attacks(atts, pc_level):
    minac = get_ac(pc_level - 2)
    medac = get_ac(pc_level)
    maxac = get_ac(pc_level + 2)
    dprmin, dprmed, dprmax = 0, 0, 0
    print(f"Attack | Against Low AC ({minac}) |  Against Median AC ({medac}) |  Against High AC ({maxac})")
    for a in atts:
        display_attack_result(a)
        dprmin += a['rmin']#['dpr']
        dprmed += a['rmed']#['dpr']
        dprmax += a['rmax']#['dpr']
    print(f"Total  |  {round(dprmin, 2)}  |  {round(dprmed, 2)}  |  {round(dprmax, 2)}")

def get_attack_damage_turn(n, att, level, penalty):
    res = {'name' : att['name'], 'num':n, 'rmin':{}, 'rmed':{}, 'rmax':{}, 'pc_level':level, 'monster_ac_penalty':penalty}
    res['rmin'] = get_attack_damage(att, get_ac(level-2) - penalty)
    res['rmed'] = get_attack_damage(att, get_ac(level) - penalty)
    res['rmax'] = get_attack_damage(att, get_ac(level+2) - penalty)
    return res

def build_attack_results(t, level, penalty):
    res = []
    i = 1
    for att in t:
        res.append(get_attack_damage_turn(i, att, level, penalty))
        i += 1
    return res

def turn(t, level, penalty):
    atts = build_attack_results(t, level, penalty)
    display_attacks(atts, level)

def main():
    for t in config['possible_turns']:
        print(f"*** Turn : {t}***")
        turn(config['possible_turns'][t], config['pc_level'], config['monster_ac_penalty'])
        print(" --- ")

main()