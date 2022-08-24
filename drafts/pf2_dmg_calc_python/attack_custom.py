from scenarios import config

DEBUG = False

attack_template = {
    'name' : None,
    'hit_bonus' : 0,
    'damage_bonus' : 0,
    'damage_die_number' : 0,
    'damage_die_size' : 0,
    'precision_die_number' : 0,
    'precision_die_size' : 0,
    'precision_damage_bonus' : 0,
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
    hit_dpr = die_avg(a['damage_die_number'], a['damage_die_size']) + a['damage_bonus'] \
        + die_avg(a['enchants_die_number'], a['enchants_die_size']) + a['enchants_damage_bonus'] \
            + die_avg(a['precision_die_number'], a['precision_die_size']) + a['precision_damage_bonus'] \
            + die_avg(a['noncrit_die_number'], a['noncrit_die_size'])
    crit_die = a['damage_die_size'] if a['fatal'] == 0 else a['fatal']
    crit_dpr = 2 * (die_avg(a['damage_die_number'], crit_die) + a['damage_bonus'] \
        + die_avg(a['enchants_die_number'], a['enchants_die_size']) + a['enchants_damage_bonus']
        + die_avg(a['precision_die_number'], a['precision_die_size']) + a['precision_damage_bonus']) \
            + die_avg(deadly_die(a['damage_die_number']), a['deadly']) + die_avg(1, a['fatal']) + a['critspec_damage'] \
                + die_avg(a['noncrit_die_number'], a['noncrit_die_size'])
    if DEBUG:
        print(f"ac : {ac}, to hit : {a['hit_bonus']}, crit : {crit_chance}, hit : {hit_chance}, crit_dpr : {crit_dpr}, hit_dpr : {hit_dpr}")
    return round(hit_dpr * hit_chance + crit_dpr * crit_chance, 2)

def display_attack_result(att):
    # deleted the sublevel ['dpr'] of rmin, rmed, rmax
    print(f"{att['num']} - {att['name']}  |  {att['dpr']}")

def display_attacks(atts, ac):
    dpr = 0
    for a in atts:
        display_attack_result(a)
        dpr += a['dpr']
    print(f"Total  |  {round(dpr, 2)}")

def get_attack_damage_turn(n, att, ac, penalty):
    res = {'name' : att['name'], 'num':n, 'dpr': 0, 'monster_ac':ac, 'monster_ac_penalty':penalty}
    res['dpr'] = get_attack_damage(att, ac - penalty)
    return res

def build_attack_results(t, ac, penalty):
    res = []
    i = 1
    for att in t:
        res.append(get_attack_damage_turn(i, att, ac, penalty))
        i += 1
    return res

def turn(t, level, penalty):
    atts = build_attack_results(t, level, penalty)
    display_attacks(atts, level)

def main():
    print("Against Custom AC : ", config['monster_ac'] - config['monster_ac_penalty'])
    for t in config['possible_turns']:
        print(f"*** Turn : {t}***")
        turn(config['possible_turns'][t], config['monster_ac'], config['monster_ac_penalty'])
        print(" --- ")

main()