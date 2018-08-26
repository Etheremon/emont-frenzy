### Emont Frenzy on Zilliqa

- To be updated on website: http://frenzy.emontalliance.com/

#### Changelog 13/08/2018

- Created public repo
- Add frontend code
- Add first version of Scillia contract 

### Changelog 15/08/2018

- Update contract for buy and move fish

### Changelog 25/08/2018

- Update smart contract logic:
    - Put a fish at a random location when spawn instead of default location
    - Put a bait in the ocean
    - Move a fish to another cell
        - If cell has a bait, eat the bait
        - If cell has a smaller fish, eat the fish
        - if cell has a bigger fish, suicide and generate baits randomly
- Helper functions to mod, loop, randomize        