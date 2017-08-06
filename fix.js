'use strict'

/*

this is some crazy messy code. don't judge me

*/

const jsonPath = require('jsonpath');
const obj = require('./data/plotto.json');
const _ = require('underscore');

/*
let added = obj.conflicts;
for(let ck of Object.keys(obj.conflicts)) {
    let conflict = obj.conflicts[ck];
    
    let rg = /\[(\d+)\]/g;
    let idxs = [];
    let m;
    while(m = rg.exec(conflict.description)) {
        idxs.push({
            index1: m.index,
            index2: m.index + m[1].length + 2,
            name: ck + '-' + m[1]
        });
    }
    
    if(idxs.length == 0){
        continue;
    }
    
    delete obj.conflicts[ck];
    
    //console.log(ck, ':', conflict.description);
    
    let prefix = conflict.description.slice(0, idxs[0].index1);
    
    for(let i=0; i<idxs.length; i++) {
        
        let data = '';
        if(i + 1 < idxs.length) {
            data = conflict.description.slice(idxs[i].index2, idxs[i+1].index1).trim();
        } else {
            data = conflict.description.slice(idxs[i].index2).trim();
        }
        
        if(data.indexOf(' or') === data.length-3) {
            data = data.slice(0, data.length-3);
        } else if(data.indexOf(' or,') === data.length-4) {
            data = data.slice(0, data.length-4);
        }
        
        added[idxs[i].name] = Object.assign({}, conflict, {
            description: prefix.trim() + ' ' + data.trim(),
            conflictid: idxs[i].name
        });
        
        //console.log(idxs[i].name, ':',  data);
    }
}
*/
//console.log(JSON.stringify(added, null, '\t'));
let allKeys = Object.keys(obj.conflicts);

let stk = [];
for(let o of jsonPath.query(obj, '$.conflicts.*')) {
    stk.push(o.conflictid);
    
    expandDesc(o);
    
    /*
    for(let arrt of ['leadIns', 'carryOns']) {
        stk.push(arrt);
        o[arrt] = expand(o[arrt]);
        stk.pop();
    }
    */
    stk.pop();
}

function expandDesc(item) {
    
    if(typeof(item.description) != "string") {
        return;
    }
    
    let rg = /\{([^}]+)\}/g;
    let m = rg.exec(item.description);
    if(!m) {
        return;
    }
    
    let desc = item.description;
    let repl = [];
    let prevStart = 0;
    
    do {
        
        let s = desc.slice(prevStart, m.index);
        if(s) { repl.push(s); }
        
        let refNodes = expand(_.map(m[1].split("|"), function(idstr) {
            
            let addOp = idstr.split(';');
            if(addOp.length > 1) {
                return { op:'+', v:addOp};
            }
            
            return idstr;
            
        }));
        
        repl.push(refNodes);
        
        prevStart = m.index + m[0].length + 1;
        
    } while((m = rg.exec(item.description)));
    
    item.description = repl;
    //console.log(item.conflictid, ':', desc);
    //console.log('===', JSON.stringify(repl));
    
}

function expand(item) {
    
    if(typeof(item) == "string") {
        item = fixToCh(item);
    }
    
    if(typeof(item) == "string") {
        
        let ret = item;
        let rg = /^(\d+[a-z]?)\s+(\**)-(\**)/g;
        let m = rg.exec(item);
        if(m) {
            
            ret = {
                v: m[1]
            };
            
            if(m[0].length < item.length) {
                ret.v = ret.v + ' ' + item.slice(m[0].length).trim();
            }
            ret.v = ret.v.trim();
            ret.start = m[2];
            ret.end = m[3];
            
            //console.log(item, ' ---> ', JSON.stringify(ret));
        }
        let k = ret.v || ret;
        if(!obj.conflicts[k]) {
            
            let mm = k.match(/^\d+[a-z]? /);
            let d = '';
            if(mm) {
                d = obj.conflicts[mm[0].trim()];
                if(d) {
                    d = d.description;
                }
            }
            
            mm = _.filter(allKeys, function(ak){
                let rg = new RegExp('^'+k+'(?:(?:[a-z]?-\\d+)|[a-z])$','g');
                return rg.test(ak);
            });
            
            if(mm && mm.length > 0) {
                
                let ret2 = {};
                if(ret !== item) {
                    ret2 = {
                        op: '?',
                        v: _.map(mm, function(x, y) {
                            return Object.assign({}, ret, {v: x});
                        })
                    };
                } else {
                    
                    ret2 = {
                        op: '?',
                        v: mm
                    };
                }
                
                if(ret2.length == 1){
                    ret2 = ret2[0];
                }
                
                //console.log('OUTLIER!!', stk.join('/'), '[' + k + ']:', item, ' ---> ', JSON.stringify(ret), ' ____ ', JSON.stringify(ret2));
                ret = ret2;
            } else {
                console.log('!!!!!OUTLIER!!', stk.join('/'), '[' + k + ']:', item, ' ---> ', JSON.stringify(ret), ' ____ ', d);
            }
            
            
            //console.log('"' + k + '",');
        }
        
        return ret;
        
    } else if(Array.isArray(item)) {
        
        return item.map(expand);
        
    } else if(item.v) {
        
        item.v = expand(item.v);
        
    }
    
    return item;
}
 
function fixToCh(tmpl) {
    let orig = tmpl;
    let didChange = false;
    let ret = {
        v: tmpl
    };
    
    let ch = /\s+ch (?:(?:[a-zA-Z0-9-]+|“[^”]+”) to (?:[a-zA-Z0-9-]+|“[^”]+”))(?:(?: &|,| and) (?:[a-zA-Z0-9-]+|“[^”]+”) to (?:[a-zA-Z0-9-]+|“[^”]+”))*(?: &|,| and)?/;
    let m = ch.exec(tmpl);
    
    if(m) {
        
        let val = [];
        val.push(tmpl.slice(0, m.index));
        didChange = true;
        
        let tfm = ret.tfm = ret.tfm|| {};
        
        let dat = m[0];
        let ch2 = /(?:([a-zA-Z0-9-]+)|“([^”]+)”) to (?:([a-zA-Z0-9-]+)|“([^”]+)”)/g;
        let m2;
        while(m2 = ch2.exec(dat)) {
            tfm[(m2[1] || m2[2]).trim()] = (m2[3] || m2[4]).trim();
        }
        
        val.push(tmpl.slice(m.index + m[0].length));
        
        ret.v = val.join(' ').trim();
        tmpl = ret.v;
    }
    
    let tr = / tr ([A-Z-0-9]+) & ([A-Z-0-9]+)(?:&| |,)*(?= |$)/;
    m = tr.exec(tmpl);
    if(m) {
        
        let val = [];
        val.push(tmpl.slice(0, m.index));
        
        
        let tfm = ret.tfm = ret.tfm || {};
        
        let dat = m[0];
        tfm[m[1].trim()] = m[2].trim();
        tfm[m[2].trim()] = m[1].trim();
        
        val.push(tmpl.slice(m.index + m[0].length));
        
        ret.v = val.join(' ').trim();
        tmpl = ret.v;
        
        didChange = true;
    }
    
    if(!didChange)
        return tmpl;
    return ret;
}

console.log(JSON.stringify(obj, null, '\t'));
