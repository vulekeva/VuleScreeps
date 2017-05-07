module.exports = function() {
    // create a new function for creep
        RoomPosition.prototype.findMaxBuilding =
        function(type, resource) {
            if(type=="container") {
                var target = Game.rooms[this.roomName].find(FIND_STRUCTURES, {
                        filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER);
            }
            });

                if (target.length) {
                    var maxStructure = target[0]; //structure with maximum amount of resource
                    var maxAmount = target[0].store[resource]; //maximum amount of resource

                    // Find structure with maximum
                    for (var i = 0; i < target.length; i++) {

                        if (target[i].store[resource] > maxAmount) {
                            maxAmount = target[i].store[resource];
                            maxStructure = target[i];
                        }
                    }
                    return maxStructure;
                } else return null;
            }

        };

    RoomPosition.prototype.findMinBuilding =
        function(type, resource) {
            if(type=="container") {
                var target = Game.rooms[this.roomName].find(FIND_STRUCTURES, {
                        filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER);
            }
            })
                ;

                if (target.length) {

                    var minStructure = target[0]; //structure with maximum amount of resource
                    var minAmount = target[0].store[resource]; //maximum amount of resource

                    // Find structure with minimum
                    for (var i = 1; i < target.length; i++) {

                        if (target[i].store[resource] < minAmount) {
                            minAmount = target[i].store[resource];
                            minStructure = target[i];
                        }
                    }
                    return minStructure;
                } else return null;
            }

        };
};