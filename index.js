'use strict'
const seedrandom = require('seedrandom');
const plotto = require("./data/plotto.json");

function pick(rng, arr) {
    let min = 0;
    let max = arr.length;
    return arr[Math.floor(this.fn() * (max - min)) + min];
}

let ch = /\s+ch (?:([a-zA-Z0-9-]+|“[^”]+”) to ([a-zA-Z0-9-]+|“[^”]+”))(?:(?: &|,) ([a-zA-Z0-9-]+|“[^”]+”) to ([a-zA-Z0-9-]+|“[^”]+”))*/;

function resolveConflict(id) {

    var ids = id.split(',');
    var mainId = ids[0].match(/^\d+/);

    for(let i of ids) {
        
        let conflictid = i;
        if(conflictid.indexOf(mainId) != 0)
            conflictid = mainId + i;
        
        
        
        
        
    }

}

class PlotGenerator {

    constructor({ seed=null, flipGenders=undefined, names=plotto.characters } = {}) {
        this._rng = seedrandom(seed);
        this._names = names;
        
        if(flipGenders === undefined) {
            this._flipGenders = this._rng() < 0.5; //50% chance true/false 
        } else {
            this._flipGenders = flipGenders;
        }
    }

    get flipGenders() { return this._flipGenders; }
    set flipGenders(flip) { this._flipGenders = flip; }
    
    get names() { return this._names; }
    set names(names) { this._names = Object.assign({}, plotto.characters, names); }

    generate() {

        let a = pick(this._rng, plotto.masterClauseA);
        let b = pick(this._rng, plotto.masterClauseB);
        let c = pick(this._rng, plotto.masterClauseA);

        return [
            a + ' ' + b.description,
            this._expand(b),
            c
        ].join(' ');
    }

    _expand(b) {

        let initial = plotto.conflicts[pick(this._rng, b.nodes)];

        let leadIn = pick(this._rng, initial.leadIns);
        let carryOn = pick(this._rng, initial.carryOns);



    }
}



exports.PlotGenerator = PlotGenerator;
