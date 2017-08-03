# Plottoriffic

Generate plots based on [___Plotto: A New Method of Plot Suggestion for Writers of Creative Fiction___](https://archive.org/stream/plottonewmethodo00cook). This work was helped immensely by the [Plotto GitHub project](http://garykac.github.io/plotto/plotto-mf.html).

## Install

Plottoriffic uses ES6 features. If you need it in ES5 babel or some other transform would come in handy. Open a ticket if you don't know how to do that and I may add the translation to the project.

```bash
npm install plottoriffic
```

## Usage

```javascript
const PlotGenerator = require('plottoriffic');
//specifying a specific seed is helpful for testing
const gen = new PlotGenerator({seed: 20170802, flipGenders: true}); //params optional. random values used if missing
//if you didn't pass a seed get the default for test reproduction

let plot = 'Seed:' + gen.seed + '\n\n' + gen.generate();

```

Output
```
Seed:20170802

Enterprise / Deliverance: Seeking to Save a Person who is Accused of Transgression

A Person Subjected to Adverse Conditions

A has seen aer spouse, B, secretly as ae thought, exchange a pair of muddy shoes for the clean shoes of SN  A’s evident purpose is to shift the responsibility for a crime to the shoulders of innocent SN

B, spouse of A, vanishes mysteriously  B, spouse of A, and A-3, both vanish mysteriously at the same time  Gossip has it that B, spouse of A, has eloped with A-3

A learns that aer son, SN, is suspected of having committed a crime  A knows that aer son, SN, is innocent of the crime of which ae is accused, and ae knows who is guilty, but this knowledge makes the task of protecting SN dangerous and difficult

Undertakes a role that leads straight to catastrophe.
```

### Character Map

Symbol  |   Role    |   Symbol |   Role | Can FlipGenders? 
:-------|:----------|:-------|:----------|-------:
A	|male protagonist	|B	|female protagonist	| yes
A-2	|male friend of A	|B-2	|female friend of B	| yes
A-3	|male rival or enemy of A	|B-3	|female rival or enemy of B	| yes
A-4	|male stranger	|B-4	|female stranger	| yes
A-5	|male criminal	|B-5	|female criminal	| yes
A-6	|male officer of the law	|B-6	|female officer of the law	| yes
A-7	|male inferior, employee	|B-7	|female inferior, employee	| yes
A-8	|male utility symbol	|B-8	|female utility symbol	| yes
A-9	|male superior, employer, one in authority	|B-9	|female superior, employer. one in authority	| yes
F-A	|father of A	| F-B	|father of B	|
M-A	|mother of A	|M-B	|mother of B	|
BR-A	|brother of A	|BR-B	|brother of B	|
SR-A	|sister of A	|SR-B	|sister of B	|
SN-A	|son of A	|SN-B	|son of B	|
D-A	|daughter of A	|D-B	|daughter of B	|
U-A	|uncle of A	|U-B	|uncle of B	|
AU-A	|aunt of A	|AU-B	|aunt of B	|
CN-A	|male cousin of A	|CN-B	|female cousin of B	|
NW-A	|nephew of A	|NW-B	|nephew of B	|
NC-A	|niece of A	|NC-B	|niece of B	|
GF-A	|grandfather of A	|GF-B	|grandfather of B	|
GM-A	|grandmother of A	|GM-B	|grandmother of B	|
SF-A	|stepfather of A	|SF-B	|stepfather of B	|
SM-A	|stepmother of A	|SM-B	|stepmother of B	|
GCH-A	|grandchild of A	|GCH-B	|grandchild of B	|
BR	|brother	|
SR	|sister	|
SN	|son	|
D	|daughter	|
CN	|cousin	|
CH	|a child	|
AX	|a mysterious male person, or one of unusual character	|
BX	|a mysterious female person, or one of unusual character	|
X	|an inanimate object, an object of mystery, an uncertain quantity	|

## 1928 and Civil Rights Discrepancies

Plotto was written in 1928 decades before the civil rights area in the US. Therefore the generated plots may seem to favor males and have some references to race.

### Protagonist Gender

Plottoriffic, by default, has a 50% chance of flipping the protagonist roles. The gender pronouns `he`, `she`, `him`, `her`, and `his` have been replaced (somewhat crudely since `his` and `her` are both used in multiple conjugations) with gender neutral pronouns to aid in making a gender switch less jarring to read. The table of character symbols is further below, but anywhere you see the symbol `A` refers to a male character and `B` refers to a female character.

The following example is a normal, male centric, plot conflict ([1075b](https://www.archive.org/stream/plottonewmethodo00cook?ref=ol#page/140/mode/2up)) from the book:

Book|Plottoriffic|Plottoriffic (flipped)
:---|:---------|:------------------
<div style="text-align: justify">A’s admiration for his friend, B, and his desire to please her, inspires him to bring out the best in his nature</div>|<div style="text-align: justify">A’s admiration for aer friend, B, and aer desire to please aer, inspires aer to bring out the best in aer nature</div>|<div style="text-align: justify">B’s admiration for aer friend, A, and aer desire to please aer, inspires aer to bring out the best in aer nature</div>

### Gender Neutral Pronouns

There are many variations out there, but the following is close enough to they, them, their, theirs that it seems like a good fit.

| | Subject | Object | Dependent Possessive | Independent Possessive | Reflexive | |
|--|--|--|--|--|--|--|
|**Male**|he|him|his|his|himself|`He broke his bone. I saw him. The bone is his. He hurt himself`|
|**Female**|she|her|her|hers|herself|`She broke her bone. I saw her. The bone is hers. She hurt herself.`|
|**Neuter** (inanimate)|it|it|its|its|itself|`It broke its bone. I saw it. The bone is its. It hurt itself.`|
|[**Epicene**](https://en.wikipedia.org/wiki/Epicene) (no gender, or gender unknown)|ae|aer|aer|aers|aerself|`Ae broke aer bone. I saw aer. The bone is aers. Ae hurt aerself.`|

There ~~may be~~ are cases where the pronouns and context do not make any sense. If you find one, please open an issue.

## Citation

Cook, William Wallace. _Plotto: A New Method of Plot Suggestion for Writers of Creative Fiction_. Battle Creek, MI: Ellis, 1928.
