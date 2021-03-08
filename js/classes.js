// TODO : tidy up constructors
class Attack {
    constructor(params) {
        // TODO add damage typing and enchants distinction
        this.id = params.id || unique_id();
        this.name = params.name || null;
        this.hit_bonus = to_int(params.hit_bonus) || 0;
        this.damage_bonus = to_int(params.damage_bonus) || 0;
        this.damage_die_number = to_int(params.damage_die_number) || 0;
        this.damage_die_size = to_int(params.damage_die_size) || 0;
        this.precision_die_number = to_int(params.precision_die_number) || 0;
        this.precision_die_size = to_int(params.precision_die_size) || 0;
        this.precision_damage_bonus = to_int(params.precision_damage_bonus) || 0;
        this.enchants_die_number = to_int(params.enchants_die_number) || 0;
        this.enchants_die_size = to_int(params.enchants_die_size) || 0;
        this.enchants_damage_bonus = to_int(params.enchants_damage_bonus) || 0;
        this.noncrit_die_number = to_int(params.noncrit_die_number) || 0;
        this.noncrit_die_size = to_int(params.noncrit_die_size) || 0;
        this.noncrit_damage_bonus = to_int(params.noncrit_damage_bonus) || 0;
        this.fatal = to_int(params.fatal) || 0;
        this.deadly = to_int(params.deadly) || 0;
        this.critspec_flatfoot = params.critspec_flatfoot || false;
        this.critspec_damage = to_int(params.critspec_damage) || 0;
        this.generate();
        if (!is_empty(params)) {
            this.build_from(params);
        }
        this.bind_inputs();
    }

    build_from(p) {
        for (let i in p) {
            if (this[i] !== undefined) {
                $("#" + this.id).find("input[name='atk_" + i + "']").val(p[i]);
            }
        }
    }

    bind_inputs() {
        // dynamically modify object attributes
        $('#' + this.id).on("input", ".atk-info", this, function(e) {
            let attr = $(this).attr("name").replace("atk_", "");
            if (attr === undefined || !Reflect.has(e.data, attr)) {
                return false;
            }
            else if (attr === "critspec_flatfoot" || attr === "name") {
                e.data[attr] = $(this).val();
            } else {
                // TODO : better parsing, mutability overloads
                e.data[attr] = to_int($(this).val());
            }
        });
    }

    generate() {
        let $atk = $($('#atk-tmpl').html());
        $atk.attr("id", this.id);
        // bind to turn referencing attacks
        $atk.on('input', function() {
            let $a = $(this);
            $('.turn-atk-item').each(function(){
                if ($(this).attr('data-wep-id') === $a.attr('id')) {
                    $(this).find('.turn-atk-name').text($a.find('.atk-name').val());
                }
            });
        });
        $('#atk-div').append($atk);
    }

    is_valid() {
        let properties_ok = this.damage_bonus ||
            (this.damage_die_number && this.damage_die_size) ||
            (this.precision_die_number  && this.precision_die_size)  ||
            this.precision_damage_bonus  ||
            (this.enchants_die_number  && this.enchants_die_size)  ||
            this.enchants_damage_bonus  ||
            (this.noncrit_die_number && this.noncrit_die_size)  ||
            this.noncrit_damage_bonus;
        return (this.id && this.name && properties_ok);
    }

    dpr(m) {
        // TODO build attack tree instead of naive multiplication
        let ac = m.ac;
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
        if (DEBUG && DEBUG_DPR) {
            console.log("attack ", this);
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
        this.id = params.id || unique_id();
        this.name = params.name || null;
        this.attacks = params.attacks || [];
        this.generate();
        if (!is_empty(params)) {
            this.build_from(params);
        }
        this.bind_inputs();
    }

    build_from(p) {
        if (p.name !== undefined) {
            $("#" + this.id).find("input[name='turn_name']").val(p.name);
        }
        if ((p.attacks !== undefined) && (p.attacks instanceof Array)) {
            for (let a of p.attacks) {
                this.link_attack("", a, false);
            }
        }
    }

    bind_inputs() {
        // kind of a problem here : we only want to remove THAT occurrence of the turn-atk
        // solution : keep how many occurrences of it we have
        $('#' + this.id).on("click", ".turn-atk-remove", this, function(e) {
            let $rem = $(this).closest('.turn-atk-item');
            let a_id = $rem.attr('data-wep-id');
            let a_oc = to_int($rem.attr("data-wep-occur"));
            e.data.attacks.splice(e.data.attacks.nth_index(a_id, to_int(a_oc)), 1);
            $rem.siblings(".turn-atk-item").each(function() {
                let t_oc = to_int($(this).attr("data-wep-occur"))
                if ($(this).attr("data-wep-id") === a_id && t_oc > a_oc) {
                    $(this).attr("data-wep-occur", t_oc - 1);
                }
            });
            $rem.remove();
            // also dereference it
        });

        $('#' + this.id).on("input", ".turn-name", this, function(e) {
            e.data.name = $(this).val();
        });

        $('#' + this.id).on("click", ".turn-atk-add", this, function(e) {
            let add_name = $(this).closest(".turn-atk-infos").find('.turn-atk-add-name').val().toLowerCase().trim();
            e.data.link_attack(add_name, 0, true);
            return false;
        });
    }

    link_attack(a_nm, a_id, cmp_name) {
        let wep_name = "__UNKNOWN__";
        let wep_id = -1;
        $('.atk').each(function() {
            let wep_n = $(this).find('.atk-name').val().toLowerCase().trim();
            let wep_i = $(this).attr("id");
            if((cmp_name && (wep_n === a_nm)) || (a_id === wep_i)) {
                wep_name = wep_n;
                wep_id = wep_i;
                return false; // equivalent to break in a jQuery each
            }
        });
        if (wep_id === -1 || wep_name === "__UNKNOWN__") {
            if (DEBUG) {
                console.log("No turn-atk found for name " + a_nm + " or id " + a_id);
            }
            return false;
        }
        // update attacks
        let occur = this.attacks.filter(value => value === wep_id).length + 1;
        if (cmp_name) {
            this.attacks.push(wep_id);
        }
        // populate DOM
        let $wep = $($('#turn-atk-tmpl').html());
        $('#' + this.id).find('.turn-atk-list').append($wep);
        $wep.attr('data-wep-id', wep_id);
        $wep.attr('data-wep-occur', occur);
        let $target = $('#' + wep_id).find('.atk-name');
        $wep.find('.turn-atk-name').text($target.val());
        $wep.attr("id", unique_id());
        $('#' + this.id).find('.turn-atk-add-name').val("");
    }

    generate() {
        let $turn = $($('#turn-tmpl').html());
        $turn.attr("id", this.id);
        $('#turn-div').append($turn);
    }

    is_valid() {
        return this.id && this.name && !is_empty(this.attacks);
    }

    compute(app) {
        if (!this.is_valid()) {
            if (DEBUG) {
                console.log("Invalid turn : ", this);
            }
            return false;
        }
        let $res = $($('#res-tmpl').html());
        $res.find('.res-name').text(this.name);
        let total_dpr = 0;
        for (let a_id of this.attacks) {
            if (!app.attacks[a_id].is_valid()) {
                if (DEBUG) {
                    console.log("Invalid attack : ", app.attacks[a_id]);
                }
                continue;
            }
            let $att = $($('#card-tmpl').html());
            let dpr = app.attacks[a_id].dpr(app.monster);
            $att.find('.att-name').html(app.attacks[a_id].name);
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
        this.id = params.id || unique_id();
        this.name = params.name || "Custom Monster";
        this.ac = to_int(params.ac) || 0;
        this.debuffs = params.debuffs || {};
        this.vulns = params.vulns || {};
        this.resists = params.resists || {};
        this.immuns = params.immuns || {};
        this.fort = to_int(params.fort) || 0;
        this.will = to_int(params.will) || 0;
        this.ref = to_int(params.ref) || 0;
        if (!is_empty(params)) {
            this.build_from(params);
        }
        this.bind_inputs();
    }

    build_from(p) {
        for (let i in p) {
            if (i === "ac" || i === "fort" || i === "will" || i === "ref" || i === "name") {
                $(document).find("input[name='monster_" + i + "']").val(p[i]);
            } else if (i !== "id" && p[i] instanceof Object) {
                $(document).find("input[name='monster_" + i + "']").val(
                    JSON.stringify(p[i]).replace(/\{|\}|\"/g, "").replace(/:/g, " ")
                );
            }
        }
    }

    bind_inputs() {
        // TODO : save state on reload ? try a cookie-less session
        $(document).on("input", ".monster-info", this, function(e) {
            let attr = $(this).attr("name").replace("monster_", "");
            //console.log("monster, ", e.data.id);
            //console.log('attr', attr);
            if (attr === undefined || !Reflect.has(e.data, attr)) {
                return false;
            }
            else if (attr === "ac" || attr === "fort" || attr === "will" || attr === "ref") {
                e.data[attr] = to_int($(this).val());
            } else if (attr === "name") {
                e.data[attr] = $(this).val();
            } else {
                // TODO : better parsing, mutability overloads
                e.data[attr] = {};
                let toplevel = $(this).val().split(TOPLEVEL_SEP);
                for (let elem of toplevel) {
                    let sublevel = elem.trim().split(SUBLEVEL_SEP);
                    if (!is_empty(elem)) {
                        e.data[attr][sublevel[0]] = sublevel.length > 1 ? to_int(sublevel[1]) : 1;
                    }
                }
            }
        });
    }
}

class Result {
    constructor(params) {
        this.id = params.id || unique_id();
        this.pc_level = to_int(params.pc_level) || 0;
        this.bind_inputs();
    }

    bind_inputs() {
        $("#clear-results").on("click", function() {
            $('.res-col').remove();
        });
    }

    compute(app) {
        if (is_empty(app.turns)) {
            if (DEBUG) {
                console.log("No turns for app ", app);
            }
            return false;
        }
        for (let key in app.turns) {
            app.turns[key].compute(app);
        }
    }
}

class App {
    constructor(params) {
        this.monster = new Monster(params.monster || {});
        this.result = new Result(params.result || {});
        this.attacks = {};
        this.turns = {};
        if (!is_empty(params.attacks) && (params.attacks instanceof Object)) {
            for (let atk in params.attacks) {
                this.create_attack(params.attacks[atk]);
            }
        }
        if (!is_empty(params.turns) && (params.turns instanceof Object)) {
            for (let turn in params.turns) {
                this.create_turn(params.turns[turn]);
            }
        }
        this.bind_inputs();
    }

    // some of them should be in their own classes but I need the App object to update it, and I won't create a reference to it in its own children.
    bind_inputs() {
        // create attack
        $("#create-attack").on("click", null, this, function(e) {
            e.data.create_attack({});
        });
        // create turn
        $("#create-turn").on("click", null, this, function(e) {
            e.data.create_turn({});
        });
        // delete all turns
        $("#clear-turns").on("click", null, this, function(e) {
            $('.del-turn').trigger('click');
            e.data.turns = {};
        });
        // delete all attacks, propagate to the turn-binded ones
        $("#clear-attacks").on("click", null, this, function(e) {
            $('.del-atk').trigger('click');
            e.data.attacks = {};
        });

        // delete 1 turn
        $(document).on("click", ".del-turn", this, function(e) {
            let id = $(this).closest('.turn').attr("id");
            $("#" + id).remove();
            delete e.data.turns[id];
        });

        // delete 1 attack, propagate to the turn binded ones
        $(document).on("click", ".del-atk", this, function(e) {
            let id = $(this).closest('.atk').attr("id");
            // delete all attack links from the DOM
            $('.turn-atk-item').each(function() {
                if ($(this).attr('data-wep-id') === id) {
                    $(this).remove();
                }
            });
            // delete all attack references in the turns
            for (let key in e.data.turns) {
                e.data.turns[key].attacks = e.data.turns[key].attacks.filter(function (tid) {
                    return tid !== id;
                });
            }
            $("#" + id).remove();
            delete e.data.attacks[id];
        });

        // dropdown elements
        $(document).on("click", '.dpd-button', function() {
            let $sib = $(this).closest('.dpd-parent').find(".dpd");
            if ($sib.is(':visible')) {
                $sib.slideUp();
                $(this).find("[data-fa-i2svg]").addClass("fa-angle-down").removeClass("fa-angle-up");
            } else {
                $sib.slideDown();
                $(this).find("[data-fa-i2svg]").removeClass("fa-angle-down").addClass("fa-angle-up");
            }
        });

        // launch simulation
        $("#simulate").on("click", null, this, function(e) {
            $("#clear-results").trigger("click");
            e.data.result.compute(e.data);
        });

        // save page state on url
        $("#save").on("click", null, this, function(e) {
            let url = (window.location.protocol ? window.location.protocol : "")
                + (window.location.host ? window.location.host : "")
                + (window.location.pathname ? window.location.pathname : "/")
                + "?" + btoa((JSON.stringify(e.data)));
            copy_clipboard(url);
        });
    }

    create_turn(t) {
        let nturn = new Turn(t);
        this.turns[nturn.id] = nturn;
    }

    create_attack(a) {
        let natk = new Attack(a);
        this.attacks[natk.id] = natk;
    }
}