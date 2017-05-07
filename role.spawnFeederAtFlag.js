module.exports = {
    // a function to run the logic for this role
    run: function(creep, flagTarget) {
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

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            if (creep.room != Game.spawns.Spawn1.room){
                creep.moveTo(Game.spawns.Spawn1);
            }else{
                
            
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => ((s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER
                             || s.structureType == STRUCTURE_LINK)
                             && s.energy < s.energyCapacity) || s.structureType == STRUCTURE_STORAGE
            });

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }else {
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: function(s){
                            return s.structureType == STRUCTURE_CONTAINER &&
                            _.sum(s.store)<s.storeCapacity && s.pos.x != 31
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
        // if creep is supposed to harvest energy from source
        else {
            if (creep.room!=flagTarget.room){
                creep.moveTo(flagTarget);
            }else{
                
            
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: function(s){
                            return s.structureType == STRUCTURE_CONTAINER &&
                            _.sum(s.store) > 0
                }
                });
            // try to harvest energy, if the source is not in range
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source);
            }
        }
        }
    }
};