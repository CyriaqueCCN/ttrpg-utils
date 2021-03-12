# PF2 DPR Calculator

## About
This tool is an attempt to build a fully functional DPR calculator for all things PF2.
It is intended to be all client-side for ease of use and to reduce server strain.
Only weapons are supported at the moment, this is primarily for martial classes.
I might expand this one for all classes to use (spells, buffs...) but the sheer number of missing features, even only for martials, make it unlikely to happen soon.

### Usage
* Set monster stats in the first box. As of now, only AC is supported.
* Create an attack and input its caracteristics. To be valid, an attack need to have a name, a hit bonus and at least either a pair of {die number, die size} or a flat bonus.
* The MAP isn't automatically added. It's probably not going to be, because it's both hard to track (almost every martial class can reduce them by an arbitrary amount, on top of the agile enchant) and not always relevant. For example, animal companions don't share their owner's MAP but you might want to add their attacks to the turn simulation, so the way to go currently is to include it in the weapon hit bonus, even if it means creating multiple times the same weapon with a different hit bonus for each.
* Create a turn. To be valid, a turn needs to have a name and at least one linked attack.
* Link an attack to a turn by typing its name in the `Add attack` box. A turn can contain any positive number of attacks. The same attack can be included multiple times.
* Duplicate attacks and turns by clicking the `Clone` button.
* Launch the simulation by clicking the green `Calculate` button, results will be added at the bottom of the page. Red buttons are kinda self-explanatory.
* The `Save to Clipboard` button saves the page state as a base64-encoded URL, which can be shared (preferably minified via tinyurl). It may fail on a large number of attacks/turns as it doesn't perform much data compression. This is really ugly but it's the best I can do without server-side storage, hit me up if you have a better solution !

### Features
- [x] Create any number of attacks
- [x] Create any number of possible turns
- [x] Link any attack to any turn, possibly multiple times
- [x] Weapon normal damage
- [x] Enchantments damage (all grouped for now, since types aren't taken into account yet)
- [x] Precision damage
- [x] Any damage not multiplied on a crit (such as the [Bear Support ability](https://2e.aonprd.com/AnimalCompanions.aspx?ID=2) for example)
- [x] Fatal and deadly weapon traits
- [x] Critical specialisation damage (flat bonus only for now. As a rule of thumb any persistent damage die can be added as their die size with roughly the same damage accuracy)

### To do
- [x] Save page state in an URL / Build page from an URL to easily share/save scenarios
- [x] Solve the MAP problem, either by automating its calculation (but that would require more inputs from the user to give their current MAP) or at least add the possibility to clone an attack to make the setup less cumbersome (duplicate only for now)
- [x] Enhance the classes structure for ease of maintainability. A JS framework would be a good idea, but I don't have the time to learn one at the moment. Kinda OK.
- [x] Create a number form control with input-error highlighting
- [ ] Update design and color code to match Pathfinder aesthetics
- [ ] Monster immunities, vulnerabilities and resistances
- [ ] Support damage types, others weapon traits and weapon groups
- [ ] Take into account PF2 crit system instead of the simplified version "crit=autohit" (irrelevant for near-PC-level monsters)
- [ ] Refine the enchantments section (separate the damage types if there is more than one damaging enchantment)
- [ ] Set an AC range instead of an AC for calculations with limited information
- [ ] Add support for nondamage enchants such as keen, grievous or the various debuffs
- [ ] Add a "crit precision" field for precision damage that only procs on a crit, as some Rogue feats give. For now, it's safe to put them in the crit spec damage field
- [ ] Take into account the potential debuffs as they go. Example : Axes flat-foot the target on a crit, which increases the next attack(s) DPR. A way to go would be to build an attack tree instead of simply multiplying and adding attacks DPR
- [ ] Add resources (such as [the median AC table](https://paizo.com/threads/rzs42o1o?Bestiary-Stats-Spreadsheet)) for reference
- [ ] Import monster stats from an external link (such as [Archive of Nethys](https://2e.aonprd.com/) or [d20pfsrd](https://pf2.d20pfsrd.com/))
- [ ] Import weapon stats from an external link (such as [Archive of Nethys](https://2e.aonprd.com/) or [d20pfsrd](https://pf2.d20pfsrd.com/))
- [ ] Add the possible debuffs to the result tab (with a probability to apply them ?)
- [ ] Change the cumbersome "type the name" attack-turn linkage to something more intuitive like a drag'n'drop
- [ ] Return better infos than DPR : variance, standard deviation, graphs, chance to hit/crit...
- [ ] Change "Attack" to "Action" -> support spells and other various actions (buffs, debuffs, maneuvers, consumables, heal...)

Don't hesitate to submit any improvement you might want, or any use case I might've missed.

### Requirements
* [Bulma](https://bulma.io/) >=0.9
  * [Plugin : Bulma Divider](https://github.com/CreativeBulma/bulma-divider) by CreativeBulma
* [jQuery](https://jquery.com/) >=3.6
* [FontAwesome](https://fontawesome.com/) >=4.7

For the moment, these libraries are self-hosted for offline testing purposes. This might be changed to a CDN in the near future.

### License

MIT. See `LICENSE.md`.