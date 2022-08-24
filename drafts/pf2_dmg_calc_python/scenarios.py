pick1 = {
    'name' : "Pick",
    'hit_bonus' : 16,
    'damage_bonus' : 6,
    'damage_die_number' : 2,
    'damage_die_size' : 6,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 0,
    'noncrit_die_size' : 0,
    'fatal': 10,
    'deadly': 0,
    'critspec_flatfoot': False,
    'critspec_damage' : 4
}

pick1b = {
    'name' : "Pick + Supp",
    'hit_bonus' : 16,
    'damage_bonus' : 6,
    'damage_die_number' : 2,
    'damage_die_size' : 6,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 1,
    'noncrit_die_size' : 8,
    'fatal': 10,
    'deadly': 0,
    'critspec_flatfoot': False,
    'critspec_damage' : 4
}

rapier2 = {
    'name' : "Rapier",
    'hit_bonus' : 14,
    'damage_bonus' : 6,
    'damage_die_number' : 2,
    'damage_die_size' : 6,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 0,
    'noncrit_die_size' : 0,
    'fatal': 0,
    'deadly': 8,
    'critspec_flatfoot': True,
    'critspec_damage' : 0
}

rapier2b = {
    'name' : "Rapier + Supp",
    'hit_bonus' : 14,
    'damage_bonus' : 6,
    'damage_die_number' : 2,
    'damage_die_size' : 6,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 1,
    'noncrit_die_size' : 8,
    'fatal': 0,
    'deadly': 8,
    'critspec_flatfoot': True,
    'critspec_damage' : 0
}

rapier3 = {
    'name' : "Rapier",
    'hit_bonus' : 12,
    'damage_bonus' : 6,
    'damage_die_number' : 2,
    'damage_die_size' : 6,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 0,
    'noncrit_die_size' : 0,
    'fatal': 0,
    'deadly': 8,
    'critspec_flatfoot': True,
    'critspec_damage' : 0
}

rapier3b = {
    'name' : "Rapier + Supp",
    'hit_bonus' : 12,
    'damage_bonus' : 6,
    'damage_die_number' : 2,
    'damage_die_size' : 6,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 1,
    'noncrit_die_size' : 8,
    'fatal': 0,
    'deadly': 8,
    'critspec_flatfoot': True,
    'critspec_damage' : 0
}

bear1 = {
    'name' : "Bear Bite",
    'hit_bonus' : 13,
    'damage_bonus' : 4,
    'damage_die_number' : 2,
    'damage_die_size' : 8,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 0,
    'noncrit_die_size' : 0,
    'fatal': 0,
    'deadly': 0,
    'critspec_flatfoot': False,
    'critspec_damage' : 0
}

bear2 = {
    'name' : "Bear Claws",
    'hit_bonus' : 11,
    'damage_bonus' : 4,
    'damage_die_number' : 2,
    'damage_die_size' : 6,
    'enchants_die_number' : 0,
    'enchants_die_size' : 0,
    'enchants_damage_bonus' : 0,
    'noncrit_die_number' : 0,
    'noncrit_die_size' : 0,
    'fatal': 0,
    'deadly': 0,
    'critspec_flatfoot': False,
    'critspec_damage' : 0
}

turns = {
    "Supp / Twin / Strike" : [pick1b, rapier2b, rapier3b],
    "Twin / Strike / Strike / Mature Bear action" : [pick1, rapier2, rapier3, rapier3, bear1],
    "Twin / Strike / Command" : [pick1, rapier2, rapier3, bear1, bear2]
}

config = {
    'pc_level' : 7,
    'monster_ac' : 27,
    'monster_ac_penalty' : 0,
    'possible_turns' : turns
}