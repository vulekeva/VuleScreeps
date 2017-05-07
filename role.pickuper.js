module.exports = {
    // a function to run the logic for this role
    run: function(creep, dropLocation) {
        //try to pickup energy, if it is not in
        if (creep.pickup(dropLocation[0]) == ERR_NOT_IN_RANGE) {
            //move towards it
           // creep.moveTo(dropLocation[0].pos);
            //creep.say('dont move!');
        }
        //state is always false, if creep is full goes to true
        if ((creep.carry.energy == creep.carryCapacity) && (creep.memory.working == false)) {
            // switch state
            creep.memory.working = true;
            creep.say('pick end!');
        }
    }
};