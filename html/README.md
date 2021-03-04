# PF2 DPR Calculator - Web version

### About
This directory hosts the main version of the calculator.
It is intended to be all client-side for ease of use and to reduce server strain.
Only weapons are supported at the moment, this is a tool for martial classes.
I might make a spell-based one in the future or expand this one for all classes to use but the sheer number of missing features, even only for martials, make it unlikely to happen soon.

### Usage
* Set monster stats in the first box. As of now, only AC is supported.
* Create an attack and input its caracteristics. To be valid, an attack need to have a name, a hit bonus and at least either a pair of {die number, die size} or a flat bonus.
* The MAP isn't automatically added. It's probably not going to be, because it's both hard to track (almost every martial class can reduce them by an arbitrary amount, on top of the agile enchant) and not always relevant. For example, animal companions don't share their owner's MAP but you might want to add their attacks to the turn simulation, so the way to go currently is to include it in the weapon hit bonus, even if it means creating multiple times the same weapon with a different hit bonus for each.
* Create a turn. To be valid, a turn needs to have a name and at least one linked attack.
* Link an attack to a turn by typing its name in the `Add attack` box. A turn can contain any positive number of attacks. The same attack can be included multiple times.
* Launch the simulation by clicking the green `Calculate` button, results will be added at the bottom of the page. Red buttons are kinda self-explanatory.

### Features
- [x] Create any number of attacks
- [x] Create any number of possible turns
- [x] Link any attack to any turn, possibly multiple times
- [x] Weapon normal damage
- [x] Enchantments damage (all grouped for now, since types aren't taken into account yet)
- [x] Precision damage
- [x] Any damage not multiplied on a crit (such as the [https://2e.aonprd.com/AnimalCompanions.aspx?ID=2](Bear Support ability) for example)
- [x] Fatal and deadly weapon traits
- [x] Critical specialisation damage (flat bonus only for now. As a rule of thumb any persistent damage die can be added as their die size with roughly the same damage accuracy)

### To do
- [ ] Refactor this mess into a more class-oriented approach for ease of maintainability. A JS framework would be a good idea, but I don't have the time to learn one at the moment.
- [ ] Create a number form control with more explicit errors
- [ ] Monster immunities, vulnerabilities and resistances
- [ ] Support damage types, others weapon traits and weapon groups
- [ ] Take into account PF2 crit system instead of the simplified version "crit=autohit" (irrelevant for near-PC-level monsters)
- [ ] Refine the enchantments section (separate the damage types if there is more than one damaging enchantment)
- [ ] Add support for nondamage enchants such as keen, grievous or the various debuffs
- [ ] Solve the MAP problem, either by automating its calculation (but that would require more inputs from the user to give their current MAP) or at least add the possibility to clone an attack to make the setup less cumbersome
- [ ] Add a "crit precision" field for precision damage that only procs on a crit, as some Rogue feats give. For now, it's safe to put them in the crit spec damage field
- [ ] Save page state in an URL / Build page from an URL to easily share/save scenarios
- [ ] Take into account the potential debuffs as they go. Example : Axes flat-foot the target on a crit, which increases the next attack(s) DPR. A way to go would be to build an attack tree instead of simply multiplying and adding attacks DPR
- [ ] Add resources (such as [https://paizo.com/threads/rzs42o1o?Bestiary-Stats-Spreadsheet](the median AC table)) for reference
- [ ] Import monster stats from an external link (such as [https://2e.aonprd.com/](Archive of Nethys) or [https://pf2.d20pfsrd.com/](d20pfsrd))
- [ ] Import weapon stats from an external link (such as [https://2e.aonprd.com/](Archive of Nethys) or [https://pf2.d20pfsrd.com/](d20pfsrd))
- [ ] Add the possible debuffs to the result tab (with a probability to apply them ?)
- [ ] Change the cumbersome "type the name" attack-turn linkage to something more intuitive like a drag'n'drop

Don't hesitate to submit any improvement you might want, or any use case I might've missed.

### Requirements
* [https://bulma.io/](Bulma) >=0.9
  * [https://github.com/CreativeBulma/bulma-divider](Plugin : Bulma Divider by CreativeBulma)
* [https://jquery.com/](jQuery) >=3.6
* [https://fontawesome.com/](FontAwesome) >=4.7

For the moment, these libraries are self-hosted for offline testing purposes. This might be changed to a CDN in the near future.

### License

MIT. See `LICENSE.md`.