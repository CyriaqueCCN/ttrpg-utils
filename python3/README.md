# PF2 DPR Calculator - Python POC

Here is an early draft of the calculations needed for the Web version. It was meant to serve a front-end, but I realized I might as well write it all client-side in JS.

The `scenarios.py` file hosts the parameters : the different attacks, the round combos you are testing and the config object which ties them together.

The `attack_custom.py` file simulates your possible turns given the config files.

The `attack_median.py` file does the same, but instead of inputing a custom AC it compares against the Low, Median and High AC for a given level (using [https://paizo.com/threads/rzs42o1o?Bestiary-Stats-Spreadsheet](this spreadsheet)).

This probably won't be updated, see the `Web src` folder for an up-to-date, hostable version.