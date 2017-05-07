
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }
        
        if(creep.ticksToLive<1200){
        var room_name=creep.room;
        for(var spawn_name in Game.spawns) {
      var spawn = Game.spawns[spawn_name];
        if (spawn.room==creep.room) {
           spawn.renewCreep(creep);
        }
        }
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
            if (!creep.feedSpawnOrExtension()) {
                if(!creep.feedTower()) {
                    if (!creep.feedUpgraderContainer()) {
                        structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: function (s) {
                                return (s.structureType == STRUCTURE_STORAGE)
                            }
                        });
                        // try to deposit energy, if the source is not in range
                        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            // move towards the source
                            creep.moveTo(structure);
                        }
                    }
                }

            }
        }
        // if creep is supposed to harvest energy from source
        else {
           // if(!creep.getDroppedEnergy()) {
                if (!creep.getEnergyFromMaxContainerS()) {
                    creep.getEnergyFromStorage();
                }
          //  }
        }
    }
};