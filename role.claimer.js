module.exports = {
    // a function to run the logic for this role
    run: function (creep, flagTarget) {
        if (creep.room != flagTarget.room) {
            creep.moveTo(flagTarget);
        }
        else {

            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(flagTarget.room.controller);


            }
        }
    }
};