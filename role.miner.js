module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        //find source from creepmemory
        let source = Game.getObjectById(creep.memory.sourceId);
        //find container adjacent to source
        let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (s) => s.structureType === STRUCTURE_CONTAINER
        })[0];
        //creep will harvest source only when it is on top of container
        if(creep.pos.isEqualTo(container.pos)){
            creep.harvest(source);
        }else{
            creep.moveTo(container);
        }
    }

};