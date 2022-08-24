// TODO : tidy up constructors
//const ActionCost = ["one", "two", "three", "reaction", "free", "full", "other"];
//const ActionType = ["Spell", "Attack", "Buff", "Debuff", "Other"];

class Action {
    constructor(a_id, a_name, a_cost, a_type) {
        this.id = a_id || unique_id();
        this.name = a_name || null;
        this.cost = a_cost || "one";
        this.type = a_type || "Other";
    }
}

class Spell extends Action {
    // shim
    constructor (params) {
        super(params.id, params.name, params.cost, this.constructor.name);
        this.damage_die_number = to_int(params.damage_die_number) || 0;
        this.damage_die_size = to_int(params.damage_die_size) || 0;
        this.generate();
        if (!is_empty(params)) {
            this.build_from(params);
        }
        this.bind_inputs();
    }

    dpr() {
        // testing purposes
        return die_avg(this.damage_die_number, this.damage_die_size);
    }

    generate() {
        return true;
    }

    build_from(p) {
        return p;
    }

    is_valid() {
        return true;
    }

    bind_inputs() {
        return true;
    }
}

class Buff extends Action {
    // shim
}

class Debuff extends Action {
    // shim
}

class Attack extends Action {
    constructor(params) {
        // TODO add damage typing and enchants distinction
        super(params.id, params.name, params.cost, params.action_type);
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
                $("#" + this.id).find("input[name='act_" + i + "']").val(p[i]);
            }
        }
    }

    bind_inputs() {
        // dynamically modify object attributes
        $('#' + this.id).on("input", ".act-info", this, function(e) {
            let attr = $(this).attr("name").replace("act_", "");
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
        let $act = $($('#act-tmpl').html());
        $act.attr("id", this.id);
        // bind to turn referencing actions
        $act.on('input', function() {
            let $a = $(this);
            $('.turn-act-item').each(function(){
                if ($(this).attr('data-wep-id') === $a.attr('id')) {
                    $(this).find('.turn-act-name').text($a.find('.act-name').val());
                }
            });
        });
        $('#act-div').append($act);
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
        // TODO build action tree instead of naive multiplication
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
            console.log("action ", this);
            console.log("hit chance ", hit_chance);
            console.log("crit chance ", crit_chance);
            console.log("hit dpr ", hit_dpr);
            console.log("crit die ", crit_die);
            console.log("crit dpr ", crit_dpr);
        }
        return round2(hit_dpr * hit_chance + crit_dpr * crit_chance);
    }
}

// mapping
const action_mapping = {"Attack" : Attack, "Spell" : Spell, "Buff" : Buff, "Debuff" : Debuff};

class Turn {
    constructor(params) {
        this.id = params.id || unique_id();
        this.name = params.name || null;
        this.actions = params.actions || [];
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
        if ((p.actions !== undefined) && (p.actions instanceof Array)) {
            for (let a of p.actions) {
                this.link_action("", a, false);
            }
        }
    }

    bind_inputs() {
        // kind of a problem here : we only want to remove THAT occurrence of the turn-act
        // solution : keep how many occurrences of it we have
        $('#' + this.id).on("click", ".turn-act-remove", this, function(e) {
            let $rem = $(this).closest('.turn-act-item');
            let a_id = $rem.attr('data-wep-id');
            let a_oc = to_int($rem.attr("data-wep-occur"));
            e.data.actions.splice(e.data.actions.nth_index(a_id, to_int(a_oc)), 1);
            $rem.siblings(".turn-act-item").each(function() {
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

        $('#' + this.id).on("click", ".turn-act-add", this, function(e) {
            let add_name = $(this).closest(".turn-act-infos").find('.turn-act-add-name').val().toLowerCase().trim();
            e.data.link_action(add_name, 0, true);
            return false;
        });
    }

    link_action(a_nm, a_id, cmp_name) {
        let wep_name = "__UNKNOWN__";
        let wep_id = -1;
        $('.act').each(function() {
            let wep_n = $(this).find('.act-name').val().toLowerCase().trim();
            let wep_i = $(this).attr("id");
            if((cmp_name && (wep_n === a_nm)) || (a_id === wep_i)) {
                wep_name = wep_n;
                wep_id = wep_i;
                return false; // equivalent to break in a jQuery each
            }
        });
        if (wep_id === -1 || wep_name === "__UNKNOWN__") {
            if (DEBUG) {
                console.log("No turn-act found for name " + a_nm + " or id " + a_id);
            }
            return false;
        }
        // update actions
        let occur = this.actions.filter(value => value === wep_id).length + 1;
        if (cmp_name) {
            this.actions.push(wep_id);
        }
        // populate DOM
        let $wep = $($('#turn-act-tmpl').html());
        $('#' + this.id).find('.turn-act-list').append($wep);
        $wep.attr('data-wep-id', wep_id);
        $wep.attr('data-wep-occur', occur);
        let $target = $('#' + wep_id).find('.act-name');
        $wep.find('.turn-act-name').text($target.val());
        $wep.attr("id", unique_id());
        $('#' + this.id).find('.turn-act-add-name').val("");
    }

    generate() {
        let $turn = $($('#turn-tmpl').html());
        $turn.attr("id", this.id);
        $('#turn-div').append($turn);
    }

    is_valid() {
        return this.id && this.name && !is_empty(this.actions);
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
        for (let a_id of this.actions) {
            if (!app.actions[a_id].is_valid()) {
                if (DEBUG) {
                    console.log("Invalid action : ", app.actions[a_id]);
                }
                continue;
            }
            let $att = $($('#card-tmpl').html());
            let dpr = app.actions[a_id].dpr(app.monster);
            $att.find('.res-att-name').html(app.actions[a_id].name);
            $att.find('.res-att-dpr').html(dpr);
            $res.find('.res-content').append($att);
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
        this.actions = {};
        this.turns = {};
        if (!is_empty(params.actions) && (params.actions instanceof Object)) {
            for (let act in params.actions) {
                this.create_action(params.actions[act].type, params.actions[act]);
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
        // create action
        $(".create-action-btn").on("click", null, this, function(e) {
            let act = $(this).attr("data-action-type");
            e.data.create_action(act, {"action_type" : act});
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
        // delete all actions, propagate to the turn-binded ones
        $("#clear-actions").on("click", null, this, function(e) {
            $('.del-act').trigger('click');
            e.data.actions = {};
        });

        // delete 1 turn
        $(document).on("click", ".del-turn", this, function(e) {
            let id = $(this).closest('.turn').attr("id");
            $("#" + id).remove();
            delete e.data.turns[id];
        });

        $("#create-action").on("click", function() {
            $(this).toggleClass("is-active");
        });

        // delete 1 action, propagate to the turn binded ones
        $(document).on("click", ".del-act", this, function(e) {
            let id = $(this).closest('.act').attr("id");
            // delete all action links from the DOM
            $('.turn-act-item').each(function() {
                if ($(this).attr('data-wep-id') === id) {
                    $(this).remove();
                }
            });
            // delete all action references in the turns
            for (let key in e.data.turns) {
                e.data.turns[key].actions = e.data.turns[key].actions.filter(function (tid) {
                    return tid !== id;
                });
            }
            $("#" + id).remove();
            delete e.data.actions[id];
        });

        // dropdown elements
        $(document).on("click", '.dpd-button', function() {
            let $sib = $(this).closest('.dpd-parent').find(".dpd");
            let $but = $(this).closest('.dpd-parent').find(".but-dpd")
            if ($sib.is(':visible')) {
                $sib.slideUp("fast");
                $but.hide();
                $(this).find("[data-fa-i2svg]").addClass("fa-angle-down").removeClass("fa-angle-up");
            } else {
                $sib.slideDown("fast");
                $but.show();
                $(this).find("[data-fa-i2svg]").removeClass("fa-angle-down").addClass("fa-angle-up");
            }
        });

        // deepclone the act object, insert it and keep it on the app list
        $(document).on("click", ".dup-act", this, function(e) {
            let a_id = $(this).closest(".act").attr("id");
            let new_info = deep_copy(e.data.actions[a_id]);
            new_info.id = unique_id();
            new_info.name += " Copy";
            let new_act = new Attack(new_info);
            e.data.actions[new_act.id] = new_act;
        });

        // deepclone the turn object, insert it and keep it on the app list
        $(document).on("click", ".dup-turn", this, function(e) {
            let t_id = $(this).closest(".turn").attr("id");
            let new_info = deep_copy(e.data.turns[t_id]);
            new_info.id = unique_id();
            new_info.name += " Copy";
            let new_turn = new Turn(new_info);
            e.data.turns[new_turn.id] = new_turn;
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

    create_action(a_type, a) {
        let nact = new action_mapping[a_type](a);
        this.actions[nact.id] = nact;
    }
}