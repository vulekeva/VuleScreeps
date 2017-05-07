/**
 * Created by Vukasin on 6.5.2017.
 */
var roles = {
    harvester : require('role.harvester'),
    upgrader : require('role.upgrader'),
    builder : require('role.builder'),
    repairer : require('role.repairer'),
    wallRepairer : require('role.wallRepairer'),
    spawnFeeder : require('role.spawnFeeder'),
    claimer : require('role.claimer'),
    builderAtFlag : require('role.builderAtFlag'),
    harvesterAtFlag : require('role.harvesterAtFlag'),
    repairerAtFlag : require('role.repairerAtFlag'),
    miner: require('role.miner')
}

Creep.prototype.runRole =
    function(){
    roles[this.memory.role].run(this);
    };

/*
Function for creep to get energy from Source
 */
Creep.prototype.getEnergyFromSource=
    function(){
        let source;
        source= this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (this.harvest(source) === ERR_NOT_IN_RANGE){
            this.moveTo(source);
        }
    };
/*
 Function for creep to pickup energy from ground
 */

Creep.prototype.getDroppedEnergy=
    function() {
        const energyDrop = this.pos.findInRange(
            FIND_DROPPED_ENERGY,
            5
        );
        if ((energyDrop.length) && (energyDrop[0].energy > 49)) {

                if (this.pickup(energyDrop[0]) == ERR_NOT_IN_RANGE) {
                    this.moveTo(energyDrop[0].pos);
                }
                //state is always false, if creep is full goes to true
                if ((this.carry.energy == this.carryCapacity) && (this.memory.working == false)) {
                    // switch state
                    this.memory.working = true;
                    this.say('pickup end!');
                }
            return true;
        }else{
            return false;
        }

    }

/*
 Function for creep to get energy from closest container
 or storage with energy >0
 */


Creep.prototype.getEnergyFromContainerStorage=
    function(){
        let container;
        container=this.pos.findClosestByPath(FIND_STRUCTURES,{
            filter : s=> (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE)
            && s.store[RESOURCE_ENERGY]>0
        });
        //if there is such structure go grab energy
        if (container != undefined){
            if (this.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.moveTo(container);
            }
            return true;
        }else{
            return false;
        }
    };
/*
Function for creep to get energy from storage with energy >0
 */

Creep.prototype.getEnergyFromStorage=
    function(){
        let container;
        container=this.pos.findClosestByPath(FIND_STRUCTURES,{
            filter : s=> (s.structureType == STRUCTURE_STORAGE)
            && s.store[RESOURCE_ENERGY]>0
        });
        //if there is such structure go grab energy
        if (container != undefined){
            if (this.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.moveTo(container);
            }
            return true;
        }else{
            return false;
        }
    };
/*
Function to get energy from miner container (the ones we use for mining, next to source)
  **/
Creep.prototype.getEnergyFromMaxContainerS=
    function() {
        let containers;
        //get containers that are in range 1 from sources (adjacent to source used for mining)
        containers = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.pos.findInRange(FIND_SOURCES, 1).length != 0
        });
        //if there is such structure go grab energy
        if (containers.length) {
            let maxStructure = containers[0]; //structure with maximum amount of resource
            let maxAmount = containers[0].store[RESOURCE_ENERGY]; //maximum amount of resource

            // Find structure with maximum
            for (let i = 0; i < containers.length; i++) {

                if (containers[i].store[RESOURCE_ENERGY] > maxAmount) {
                    maxAmount = containers[i].store[RESOURCE_ENERGY];
                    maxStructure = containers[i];
                }
            }
            if (maxStructure != undefined) {
                if (this.withdraw(maxStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(maxStructure);
                }
                return true;
            } else {
                return false;
            }
        }
    };
/*
 Function to get energy from upgrader container (the ones we use for mining, next to source)
 **/
Creep.prototype.getEnergyFromContainerU=
    function() {
        let container;
        //find closest container to controller
        container= this.room.controller.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
        });
        if (container != undefined){
            if (this.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.moveTo(container);
            }
            return true;
        }else{
            return false;
        }
    };
/*
Funtion to feed closest spawn or extension
 */
Creep.prototype.feedSpawnOrExtension=
    function(){
    let structure = this.pos.findClosestByPath(FIND_STRUCTURES,{
        filter: (s) => (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN)
        && s.energyCapacity > s.energy
    });

    if (structure != undefined) {
        if (this.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(structure);
        }
        return true;
    }else{
            return false;
        }

    };
/*
Function to feed container where upgraders get their energy(closest to controler)
 */
Creep.prototype.feedUpgraderContainer=
    function(){
    let container;
        //find closest container to controller
        container= this.room.controller.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity
        });
        if(container !=undefined){
            if(this.transfer(container,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                this.moveTo(container);
            }
            return true;
        }else{
            return false;
        }

    };
/*
Function to feed closest container or storage
 */
Creep.prototype.feedContainerStorage=
    function(){
        let container = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE)
            && s.store[RESOURCE_ENERGY]<s.storeCapacity
        });
        if (container !=undefined){

            if (this.transfer(container,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                this.moveTo(container);
            }
            return true;
        }else{
            console.log(this.name);
            return false;
        }
    };
/*
Function to feed tower
 */
Creep.prototype.feedTower=
    function(){
    let tower=this.pos.findClosestByPath(FIND_STRUCTURES,{
        filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy<s.energyCapacity
    });
    if (tower !=undefined){
        if (this.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
            this.moveTo(tower);
        }
        return true;
    }else{
        return false;
    }
    };
