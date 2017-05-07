module.exports = {
    // a function to run the logic for this role
    run: function(creep,flagTarget) {
        if (creep.room!=flagTarget.room){
            creep.moveTo(flagTarget);
        }
        else{
            
            var enemies= creep.room.find(FIND_HOSTILE_CREEPS);
            
            if (creep.attack(enemies[0])==ERR_NOT_IN_RANGE){
               creep.moveTo(enemies[0]); 
            }else{
                creep.rangedAttack(enemies[0]);
            }
                
            }
        }
};