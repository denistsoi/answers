var debug = require('debug');
var battle = debug('battle');
var result = debug('result');
var checkarray = debug('checkarray');
var answer = debug('answer');

var weapons = [
  [0,  1],
  [8,  4],
  [10, 5],
  [25, 6],
  [40, 7],
  [74, 8]
];

// weapons[0] c/d=2
// weapons[1] c/d=2
// weapons[2] c/d=4.167
// weapons[3] c/d=5.7
// weapons[4] c/d=9.25

var armours = [
  [0,   0],
  [13,  1], 
  [31,  2], 
  [53,  3],
  [75,  4],
  [102, 5]
];

// armour[0] c/d=13
// armour[1] c/d=15.5
// armour[2] c/d=17.67
// armour[3] c/d=18.75
// armour[4] c/d=20.4

var damageUp = [
  [0,   0],
  [25,  1],
  [50,  2],
  [100, 3]
]

var armourUp = [
  [0,  0],
  [20, 1],
  [40, 2],
  [80, 3]
];

/**
 * [Player description]
 * @param {[type]} opts [description]
 */
function Player(opts) {
  if (!opts) {
    opts = {
      hp: 100,
      attack: 0,
      armour: 0
    }
  }
  this.hp = opts.hp;
  this.attack =  opts.attack;
  this.defence = opts.defence;
  
  this.cost = 0;

  this.weapon = 0;
  this.armour = 0;
  this.damup = 0;
  this.armup = 0;
}

/**
 * [Boss description]
 * @param {[type]} opts [description]
 */
function Boss(opts) {
  if (!opts) {
    opts = {
      hp: 104,
      attack: 8,
      defence: 1
    }
  }
  this.hp = opts.hp;
  this.attack = opts.attack;
  this.defence = opts.defence;
}

/**
 * Instantiate New Players
 */
var me = new Player();
var bowser = new Boss();

var minWinArr = [];
var maxLosArr = [];

/**
 * [genBattle description]
 * @param  {[type]} player [description]
 * @param  {[type]} boss   [description]
 * @return {[type]}        [description]
 */
function genBattle(player, boss) {
  // result(player, boss);

  var rounds = 1;

  function attack(defender, attacker) {
    var diff = ((attacker.attack - defender.defence) > 0) ? (attacker.attack - defender.defence) : 1;
    defender.hp = defender.hp - diff;
  }

  // simulate attack exchange
  while (player.hp > 0 && boss.hp > 0) {
    battle("-----");
    battle("Round: %s", rounds);

    attack(player, boss);
    battle("Player attacks: %s", me.attack);
    battle("Boss has %s remaining", boss.hp);
    
    attack(boss, player);
    battle("Boss attacks: %s", boss.attack);
    battle("Player has %s remaining", player.hp);
    
    rounds++;
  }


  if (player.hp <= 0) {
    // result('Boss');
    maxLosArr.push(player.cost);
  } else if (boss.hp <= 0) {
    result('Player');
    result("[rounds: %s] [player] hp: %s, A/D, %s/%s, weapon: %s, armour: %s, damup: %s, armup: %s, total: %s", 
    rounds, player.hp, player.attack, player.defence, player.weapon, player.armour, player.damup, player.armup, player.cost);
    result("[boss] hp: %s", boss.hp);
    minWinArr.push(player.cost);
  }
}

function resetBattle(player, boss) {
  me = new Player();
  bowser = new Boss();
}

// Generate every possible scenario (based on one max Damage+ and one max Armour+ rings)
weapons.forEach(function(weapon) {
  armours.forEach(function(armour) {
    damageUp.forEach(function(damup) {
      armourUp.forEach(function(armup) {
        me.weapon = weapon[1];
        me.armour = armour[1];
        me.damup  = damup[1];
        me.armup  = armup[1];

        me.attack = weapon[1] + damup[1];
        me.defence = armour[1] + armup[1];
        
        me.cost = weapon[0] + armour[0] + damup[0] + armup[0];

        genBattle(me, bowser);
        resetBattle();
      })
    })
  });
});

checkarray(minWinArr);
checkarray(maxLosArr);

var min = Math.min.apply(null, minWinArr);
var max = Math.max.apply(null, maxLosArr);

answer("min gold win %s, max gold loss %s", min, max);