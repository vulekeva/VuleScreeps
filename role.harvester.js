var roleBuilder = require('role.builder');
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

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not 
                
                structure1 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: function(structure){
                            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                            _.sum(structure.store) < structure.storeCapacity
                }
                });
                
            

            // if we found one
            if (structure1 != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure1);
                }
            }else{

                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            });
                //if you cant deposit anywhere be builder
                if (structure ==undefined)
                {
                    roleBuilder.run(creep);
                }
            else if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                creep.moveTo(structure); 
            }
        }
 
        }
        // if creep is supposed to harvest energy from source
        else {
            creep.getEnergyFromSource();
            }
    }
};