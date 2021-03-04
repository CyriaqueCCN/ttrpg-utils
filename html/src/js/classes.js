// JS sucks
function isEmpty(obj) {
    return obj === null || Object.keys(obj).length === 0;
}

// utils
debug = true;

function die_avg(number, size) {
    if (number === 0 || size === 0) {
        return 0;
    }
    return (number * (size + 1)) / 2;
}

function deadly_die(die) {
    if (die >= 4) {
        return 3;
    }
    if (die == 3) {
        return 2;
    }
    return 1;
}

function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

// Classes TODO : move logic as class methods. Maybe template class attributes insertion ?
class Attack {
    constructor(params) {
        this.id = params.id || null;
        this.name = params.name || null;
        this.hit_bonus = parseInt(params.hit_bonus) || 0;
        this.damage_bonus = parseInt(params.damage_bonus) || 0;
        this.damage_die_number = parseInt(params.damage_die_number) || 0;
        this.damage_die_size = parseInt(params.damage_die_size) || 0;
        this.precision_die_number = parseInt(params.precision_die_number) || 0;
        this.precision_die_size = parseInt(params.precision_die_size) || 0;
        this.precision_damage_bonus = parseInt(params.precision_damage_bonus) || 0;
        this.enchants_die_number = parseInt(params.enchants_die_number) || 0;
        this.enchants_die_size = parseInt(params.enchants_die_size) || 0;
        this.enchants_damage_bonus = parseInt(params.enchants_damage_bonus) || 0;
        this.noncrit_die_number = parseInt(params.noncrit_die_number) || 0;
        this.noncrit_die_size = parseInt(params.noncrit_die_size) || 0;
        this.noncrit_damage_bonus = parseInt(params.noncrit_damage_bonus) || 0;
        this.fatal = parseInt(params.fatal) || 0;
        this.deadly = parseInt(params.deadly) || 0;
        this.critspec_flatfoot = params.critspec_flatfoot || false;
        this.critspec_damage = parseInt(params.critspec_damage) || 0;
        this.is_valid = this.validate();
    }

    validate() {
        let properties_ok = this.damage_bonus ||
            (this.damage_die_number && this.damage_die_size) ||
            (this.precision_die_number  && this.precision_die_size)  ||
            this.precision_damage_bonus  ||
            (this.enchants_die_number  && this.enchants_die_size)  ||
            this.enchants_damage_bonus  ||
            (this.noncrit_die_number && this.noncrit_die_size)  ||
            this.noncrit_damage_bonus;
        return (this.id && this.name && this.hit_bonus && properties_ok);
    }

    buildFromHTML($a) {
        this.id = $a.attr('id') || null;
        this.name = $a.find('.atk-name').val() || null;
        this.hit_bonus = parseInt($a.find('.atk-hit-bonus').val()) || 0;
        this.damage_bonus = parseInt($a.find('.atk-wep-flat').val()) || 0;
        this.damage_die_number = parseInt($a.find('.atk-wep-number').val()) || 0;
        this.damage_die_size = parseInt($a.find('.atk-wep-size').val()) || 0;
        this.precision_die_number = parseInt($a.find('.atk-prec-number').val()) || 0;
        this.precision_die_size = parseInt($a.find('.atk-prec-size').val()) || 0;
        this.precision_damage_bonus = parseInt($a.find('.atk-prec-flat').val()) || 0;
        this.enchants_die_number = parseInt($a.find('.atk-echt-number').val()) || 0;
        this.enchants_die_size = parseInt($a.find('.atk-echt-size').val()) || 0;
        this.enchants_damage_bonus = parseInt($a.find('.atk-echt-flat').val()) || 0;
        this.noncrit_die_number = parseInt($a.find('.atk-nc-number').val()) || 0;
        this.noncrit_die_size = parseInt($a.find('.atk-nc-size').val()) || 0;
        this.noncrit_damage_bonus = parseInt($a.find('.atk-nc-flat').val()) || 0;
        this.fatal = parseInt($a.find('.atk-fatal').val()) || 0;
        this.deadly = parseInt($a.find('.atk-deadly').val()) || 0;
        this.critspec_flatfoot = $a.find('.atk-crit-flatfoot').val() || false;
        this.critspec_damage = parseInt($a.find('.atk-crit-flat').val()) || 0;
        this.is_valid = this.validate();
    }

    dpr(monster) {
        let ac = monster.ac;
        let crit_chance = Math.min(0.95, Math.max(0.05, (11 + this.hit_bonus - ac) / 20));
        let hit_chance = Math.min(0.95, Math.max(0.05, (21 + this.hit_bonus - ac) / 20)) - crit_chance;
        let hit_dpr = die_avg(this.damage_die_number, this.damage_die_size) + this.damage_bonus
            + die_avg(this.enchants_die_number, this.enchants_die_size) + this.enchants_damage_bonus
            + die_avg(this.precision_die_number, this.precision_die_size) + this.precision_damage_bonus
            + die_avg(this.noncrit_die_number, this.noncrit_die_size);
        let crit_die = this.fatal ? this.fatal : this.damage_die_size;
        let crit_dpr = 2 * (die_avg(this.damage_die_number, crit_die) + this.damage_bonus
            + die_avg(this.enchants_die_number, this.enchants_die_size) + this.enchants_damage_bonus
            + die_avg(this.precision_die_number, this.precision_die_size) + this.precision_damage_bonus)
            + die_avg(deadly_die(this.damage_die_number), this.deadly) + die_avg(1, this.fatal) + this.critspec_damage
            + die_avg(this.noncrit_die_number, this.noncrit_die_size);
        if (debug) {
            console.log("att ", this);
            console.log("hit chance ", hit_chance);
            console.log("crit chance ", crit_chance);
            console.log("hit dpr ", hit_dpr);
            console.log("crit die ", crit_die);
            console.log("crit dpr ", crit_dpr);
        }
        return round2(hit_dpr * hit_chance + crit_dpr * crit_chance);
    }
}

class Turn {
    constructor(params) {
        this.id = params.id || null;
        this.name = params.name || null;
        this.attacks = params.attacks || [];
        this.is_valid = this.validate();
    }

    validate() {
        return this.id && this.name && !isEmpty(this.attacks);
    }

    buildFromHTML($t, atts) {
        this.id = $t.attr('id') || null;
        this.name = $t.find('.turn-name').val() || null;
        let c_attacks = [];
        $t.find('.weapon-item').each(function(){
            let aid = $(this).attr('data-wep-id');
            if (typeof(atts[aid]) !== 'undefined') {
                c_attacks.push(atts[aid]);
            }
        });
        this.attacks = c_attacks.reverse();
        this.is_valid = this.validate();
    }

    compute(monster) {
        let $res = $($('#res-tmpl').html());
        $res.find('.res-name').text(this.name);
        let total_dpr = 0;
        for (let a of this.attacks) {
            console.log(a);
            let $att = $($('#card-tmpl').html());
            let dpr = a.dpr(monster);
            $att.find('.att-name').html(a.name);
            $att.find('.att-dpr').html(dpr);
            $res.find('.res-content').prepend($att);
            total_dpr += dpr;
        }
        $res.find('.res-total').text(round2(total_dpr));
        $('#res-div').append($res);
    }
}

class Monster {
    constructor(params) {
        this.name = params.name || null;
        this.ac = parseInt(params.ac) || 0;
        this.flatfooted = params.flatfooted || false;
        this.resistances = params.resistances || null;
        this.immunities = params.immunities || null;
    }
}

class Result {
    constructor(params) {
        this.id = params.id || null;
        this.pc_level = parseInt(params.pc_level) || 0;
        this.monster = params.monster || null;
        this.turns = params.turns || null;
        this.is_valid = this.validate();
    }

    validate() {
        return (!isEmpty(this.monster) && (!isEmpty(this.turns)));
    }

    compute() {
        for (let elem of this.turns) {
            elem.compute(this.monster);
        }
    }
}