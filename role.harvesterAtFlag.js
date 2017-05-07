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

             if(creep.room!=Game.spawns.Spawn1.room) {
                 creep.moveTo(Game.spawns.Spawn1);
             }else {

                 if (!creep.feedContainerStorage()) {
                     creep.feedSpawnOrExtension();
                 }
             }

        }
        // if creep is supposed to harvest energy from source
        else {
            if(creep.room !=Game.flags['Flag1'].room){
                creep.moveTo(Game.flags['Flag1']);
            }
            else{
                creep.getEnergyFromSource();
            }

        }
    }
};