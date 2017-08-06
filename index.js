'use strict'
const seedrandom = require('seedrandom');
const plotto = require("./data/plotto.json");

function regEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

//seedrandom doesn't expose the seed used, so generate one here
const defaultSeed = seedrandom()(); ;
const defaultRng = seedrandom(defaultSeed);

const genderMap = {
		"A": "male",
		"A-2": "male",
		"A-3": "male",
		"A-4": "male",
		"A-5": "male",
		"A-6": "male",
		"A-7": "male",
		"A-8": "male",
		"A-9": "male",
		"B": "female",
		"B-2": "female",
		"B-3": "female",
		"B-4": "female",
		"B-5": "female",
		"B-6": "female",
		"B-7": "female",
		"B-8": "female",
		"B-9": "female",
		"F-A": "father",
		"M-A": "mother",
		"BR-A": "male",
		"SR-A": "female",
		"SN-A": "male",
		"D-A": "female",
		"U-A": "male",
		"AU-A": "female",
		"CN-A": "male",
		"NW-A": "male",
		"NC-A": "female",
		"GF-A": "male",
		"GM-A": "female",
		"SF-A": "male",
		"SM-A": "female",
		"GCH-A": "any",
		"F-B": "male",
		"M-B": "female",
		"BR-B": "male",
		"SR-B": "female",
		"SN-B": "male",
		"D-B": "female",
		"U-B": "male",
		"AU-B": "female",
		"CN-B": "female",
		"NW-B": "male",
		"NC-B": "female",
		"GF-B": "male",
		"GM-B": "female",
		"SF-B": "male",
		"SM-B": "female",
		"GCH-B": "any",
		"BR": "male",
		"SR": "female",
		"SN": "male",
		"D": "female",
		"CN": "any",
		"CH": "any",
		"AX": "male",
		"BX": "female",
		"X": "none"
};

function createRandomPicker(rng=defaultRng) {
    return function randomPicker(arr) {
        if(!arr) {
            return null;
        }
        if(arr.length == 0)
            return null;
        if(arr.length == 1)
            return arr[0];
        
        let min = 0;
        let max = arr.length;
        let i =Math.floor(rng() * (max - min)) + min;
        let ret = arr[i];
        
        return ret;
    };
}

let maleNames = [];
let femaleNames = [];

function createRandomNamer(rng=defaultRng) {
    
    return function randomNamer(characterSymbol, symbolDescription, gender) {
        
        let arr;
        if(gender == 'male') {
            arr = maleNames;
        } else if(gender == 'female') {
            arr = femaleNames;
        } else if(gender == 'any') {
            
            if(rng() < 0.5) {
                arr = maleNames;
            } else {
                arr = femaleNames;
            }
            
        } else {
            return characterSymbol;
        }
        
        let min = 0;
        let max = arr.length;
        let i =Math.floor(rng() * (max - min)) + min;
        let ret = arr[i];
        
        arr.splice(i,1);
        
        return ret || characterSymbol;
    };
}

class PlotGenerator {

    constructor({ picker=undefined, namer=undefined, rng=undefined, flipGenders=undefined } = {}) {
        
        this._namer = namer || createRandomNamer();
        this._picker = picker || createRandomPicker();
        this._flipGenders = flipGenders;
    }
    
    get flipGenders() { return this._flipGenders; }
    set flipGenders(flip) { this._flipGenders = flip; }
    
    generate() {
        
        let flip = this._flipGenders;
        if(flip === undefined) {
            flip = this._picker([true, false], 'flip genders');
        }
        
        let rootTransform = {};
        if(this._flipGenders) {
            rootTransform = {
                "A"  : "B",
                "A-2": "B-2",
                "A-3": "B-3",
                "A-4": "B-4",
                "A-5": "B-5",
                "A-6": "B-6",
                "A-7": "B-7",
                "A-8": "B-8",
                "A-9": "B-9",
                "B"  : "A",
                "B-2": "A-2",
                "B-3": "A-3",
                "B-4": "A-4",
                "B-5": "A-5",
                "B-6": "A-6",
                "B-7": "A-7",
                "B-8": "A-8",
                "B-9": "A-9"
            };
        }
        
        let preamble = this._picker(plotto.masterClauseA, 'master clause A');
        let resolution = this._picker(plotto.masterClauseC, 'master clause C');
        let masterPlot = this._picker(plotto.masterClauseB, 'master clause B');
        
        let subject = [masterPlot.group, ' / ', masterPlot.subgroup, ': ', masterPlot.description].join('');
        
        let conflict = plotto.conflicts[this._picker(masterPlot.nodes, 'main conflict')];
        let cast = [];
        let plot = this._expand(conflict, rootTransform, {leadIns:1, carryOns:1}).replace(/\*/g, '');
        
        plot = this._applyNames(plot, cast);
        
        return {
            group: masterPlot.group,
            subgroup: masterPlot.subgroup,
            description: masterPlot.description,
            cast: cast,
            plot: [
                preamble,
                plot,
                resolution
            ].join('\n\n').trim()
        };
    }
    
    _applyNames(text, cast) {
        
        //reset default name lists
        maleNames = require('./data/names_male.json').slice(0);
        femaleNames = require('./data/names_female.json').slice(0);
        
        //randomNamer(characterSymbol, symbolDescription, gender)
        
        let nameCache = {};
        
        let ks = Object.keys(plotto.characters);
        if(ks.length > 0) {
            let pattern = '\\b(?:' + ks.map(function(s) {
                return '(?:' + regEscape(s) + ')';
            }).join('|') + ')(?=^|$| |,|\\.)';
            
            let rg = new RegExp(pattern, 'g');
            
            text = text.replace(rg,(match) => {
                if(!match || match.length == 0)
                    return '';
                
                let t = plotto.characters[match];
                if(!t) {
                    console.log('Could not replace match in template: ' + match);
                    return match;
                }
                
                let ret = nameCache[match];
                if(!ret) {
                    
                    ret = this._namer(match, t, genderMap[match]);
                    nameCache[match] = ret;
                    
                    cast.push({
                        symbol: match,
                        name: ret,
                        description: t
                    });
                }
                
                return ret;
            });
        }
        
        return text;
        
    }
    
    _expand(item, transform, ctx, start, end) {
        
        let ret = [];
        
        if(!item)
            return 'NULL';
        
        if(ctx.leadIns > 0 && item.leadIns) {
            ctx.leadIns -= 1;
            ret.push(this._expand(item.leadIns, null, ctx));
        }
        
        let carryon = null;
        if(ctx.carryOns > 0 && item.carryOns) {
            ctx.carryOns -= 1;
            carryon = this._expand(item.carryOns, transform, ctx);
        }
        
        if(typeof(item) == "string") {
            ret.push(this._expand(plotto.conflicts[item], null, ctx));
        } else if(Array.isArray(item)) {
            ret.push(this._expand(this._picker(item, 'plot option'), null, ctx));
        } else if(item.conflictid) {
            
            if(typeof(item.description) == "string") {
                ret.push(item.description);
            } else {
                for(let subdesc of item.description) {
                    
                    if(typeof(subdesc) == "string") {
                        ret.push(subdesc);
                    } else {
                        ret.push(this._expand(subdesc, null, ctx));
                    }
                    
                }
            }
            
            
        } else if(item.v) {
            
            if(item.start || item.end) {
                ret.push(this._expand(plotto.conflicts[item.v], item.tfm, ctx, item.start, item.end));
            } else if(item.op == '+') {
                for(let sub of item.v) {
                    ret.push(this._expand(sub, item.tfm, ctx));
                }
            } else {
                ret.push(this._expand(item.v, item.tfm, ctx));
            }
        }
        
        if(carryon) {
            ret.push(carryon);
        }
        
        let str = ret.join('\n\n').trim();
        
        if(transform) {
            let ks = Object.keys(transform);
            if(ks.length > 0) {
                let pattern = '\\b(?:' + ks.map(function(s) {
                    return '(?:' + regEscape(s) + ')';
                }).join('|') + ')(?=^|$| |,|\\.)';
                
                let rg = new RegExp(pattern, 'g');
                
                let cmp = {
                    before: str,
                    transform: transform
                };
                str = str.replace(rg,function(match) {
                    if(!match || match.length == 0)
                        return '';
                    let t = transform[match];
                    if(!t) {
                        console.log('Could not replace match in template: ' + match);
                        return match;
                    }
                    
                    return t;
                });
                
                cmp.after = str;
                //console.log(cmp);
            }
        }
        
        return str;
    }
}

module.exports = PlotGenerator;
module.exports.defaultSeed = defaultSeed;
