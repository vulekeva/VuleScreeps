/**
 * Created by Vukasin on 6.5.2017.
 */
//import modules
require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');
//main game loop
module.exports.loop = function(){

    //clear memory from dead creeps and run alive creeps with their roles
    for (let name in Memory.creeps){
        if(Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }else{
            Game.creeps[name].runRole();
        }
    }

    //find all towers
    var towers =  _.filter(Game.structures, s=> s.structureType == STRUCTURE_TOWER);
    //towers defend
    for (let tower of towers){
        tower.defend();
    }

    //go through all spawns and if necessary spawn new creeps
    for (let spawnName in Game.spawns){
        Game.spawns[spawnName].spawnCreeps();
    }

}