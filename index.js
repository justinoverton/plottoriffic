'use strict'
const seedrandom = require('seedrandom');
const plotto = require("./data/plotto.json");

function regEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function pick(rng, arr) {
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
    //console.log(i, ':', JSON.stringify(ret), '!!!!', JSON.stringify(arr));
    return ret;
}

class PlotGenerator {

    constructor({ seed=null, flipGenders=undefined } = {}) {
        this._rng = seedrandom(seed);
        
        if(flipGenders === undefined) {
            this._flipGenders = this._rng() < 0.5; //50% chance true/false 
        } else {
            this._flipGenders = flipGenders;
        }
    }

    get flipGenders() { return this._flipGenders; }
    set flipGenders(flip) { this._flipGenders = flip; }
    
    generate() {
        
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

        let preamble = pick(this._rng, plotto.masterClauseA);
        let resolution = pick(this._rng, plotto.masterClauseC);
        let masterPlot = pick(this._rng, plotto.masterClauseB);
        
        let subject = [masterPlot.group, ' / ', masterPlot.subgroup, ': ', masterPlot.description].join('');
        
        let conflict = plotto.conflicts[pick(this._rng, masterPlot.nodes)];
        
        return [
            subject,
            preamble,
            this._expand(conflict, rootTransform, {leadIns:3, carryOns:3}).replace(/\*/g, ''),
            resolution
            ].join('\n\n').trim();
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
            ret.push(this._expand(pick(this._rng, item), null, ctx));
        } else if(item.conflictid) {
            ret.push(item.description);
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


exports.PlotGenerator = PlotGenerator;

let g = new PlotGenerator();
console.log(g.generate());
