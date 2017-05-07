var roleRepairer = require('role.repairer');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
            
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // find closest structure with less than max hits
            // Exclude walls because they have way too many max hits and would keep
            // our repairers busy forever. We have to find a solution for that later.
            var repairit = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
   filter: (s) => { 
       return ((s.hits < 10000*creep.room.controller.level) && (s.hits > 0)) && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
   }
});

            // if we find one
            if (repairit != undefined) {
                
                // try to repair it, if it is out of range
                if (creep.repair(repairit) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(repairit);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleRepairer.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            if(!creep.getEnergyFromContainerStorage()){
                creep.getEnergyFromSource();
            }
        }
    }
};