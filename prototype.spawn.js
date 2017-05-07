/**
 * Created by Vukasin on 6.5.2017.
 */
var listOfRoles = ['harvester','spawnFeeder','upgrader','builder','repairer',
    'wallRepairer','miner','harvestersAtFlag'];

StructureSpawn.prototype.spawnCreeps=
    function(){
    //Room where spawn is
    let room = this.room;
    //all Creeps in spawns room
    let roomCreeps = room.find(FIND_MY_CREEPS);

    //number of creeps with each role
    let numberOfCreeps = {};
    for(let role of listOfRoles){
        numberOfCreeps[role]= _.sum(roomCreeps, (c) => c.memory.role === role);
    }
    numberOfCreeps['harvestersAtFlag']=_.sum(Game.creeps, c=> c.memory.role === 'harvestersAtFlag');


    /*
    energy in spawn and all extensions
     */
    let roomEnergyCapacity = room.energyAvailable;
    /*
    name of new creep is undefined at start
    */
    let name=undefined;
    /*
    Emergency of no harvesters and no spawnFeeders
    First check if there are miners and if there is some energy in storage
    If not we spawn harvester
     */
    if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['spawnFeeder'] == 0){
        if (numberOfCreeps['miner']>0 || (room.storage!= undefined && room.storage.store[RESOURCE_ENERGY]>1000)){
            name=this.createSpawnFeeder();

        }
        else {
            name = this.createCustomCreep(room.energyCapacityAvailable, 'harvester');
        }
    }
    //no emergency
    else{
        //check if all miners are there
        if (numberOfCreeps['miner']<_.size(room.find(FIND_SOURCES)) && roomEnergyCapacity>=650){
            //find all sources
            let sources = room.find(FIND_SOURCES);
            for(let source of sources){
                //there are no miners next to that source, and there is a container next to it
                if (!_.some(roomCreeps, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    //there is a container next to source
                    if (containers.length){
                        name=this.createMiner(source.id);
                        break;
                    }

                }
            }
        }

    }
    if (name == undefined){
        for(let role of listOfRoles){
            //create claimer
            if(role === 'claimer' && this.memory.claimRoom != undefined){
                name= this.createClaimer(this.memory.claimRoom)
                //if succesfull
                if(name !=undefined && _.isString(name)){
                    //delete that claim from memory
                    delete this.memory.claimRoom;
                }
            }
            //create all other roles
            else if(numberOfCreeps[role]<this.memory.minCreeps[role]){
                if (role=='spawnFeeder'){
                    name=this.createSpawnFeeder();
                }else{
                    name=this.createCustomCreep(roomEnergyCapacity,role);
                }
                break;
            }

        }
    }
    //console out all types
        if (name != undefined && _.isString(name)) {
            console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            for (let role of listOfRoles) {
                console.log(role + ": " + numberOfCreeps[role]);
            }
        }

    };
/*
function to create spawnFeeder
 */
StructureSpawn.prototype.createSpawnFeeder=
    function(){
    var body = [];
    if (this.room.energyAvailable>=500){
        body.push(CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE);
    }
    else {
        body.push(CARRY, CARRY, CARRY, CARRY, MOVE);
    }
        return this.createCreep(body, undefined, { role: 'spawnFeeder', working: false });
    };
/*
function to create miner (650 energy)
 */

StructureSpawn.prototype.createMiner =
    function (sourceId) {
        return this.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE], undefined,
            { role: 'miner', sourceId: sourceId });
    };
/*
 function to create claimer (650 energy)
 */
StructureSpawn.prototype.createClaimer =
    function (target) {
        return this.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', target: target });
    };

StructureSpawn.prototype.createCustomCreep =
    function(energy, roleName) {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / 200);
        var body = [];
        if (roleName=='spawnFeeder'){
            if (energy>=500){body.push(CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE);}
            else{
                body.push(CARRY,CARRY,CARRY,CARRY,MOVE);
            }
        }
        else if (roleName=='spawnFeederAtFlag'){
            body.push(CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE);
        }
        else if (roleName =='harvester'){
            if (energy>=700){body.push(WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE);}
            else if (energy>=600){body.push(WORK,WORK,WORK,WORK,WORK,CARRY,MOVE);}
            else if (energy>=500){body.push(WORK,WORK,WORK,WORK,CARRY,MOVE);}
            else {body.push(WORK,WORK,CARRY,MOVE);}

        }
        else if (roleName == 'harvesterAtFlag'){
            if (energy>=600){body.push(WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE);}
            else if (energy>=400){body.push(WORK,WORK,CARRY,CARRY,MOVE,MOVE);}
            else {body.push(WORK,CARRY,MOVE);}

        }
        else if (roleName == 'builder'){
            if (energy>=600){body.push(WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE);}
            else if (energy>=400){body.push(WORK,WORK,CARRY,CARRY,MOVE,MOVE);}
            else {body.push(WORK,CARRY,MOVE);}

        }
        else if (roleName == 'claimer'){
            body.push(CLAIM,MOVE);
        }
        else if (roleName == 'repairerAtFlag'){
            body.push(WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE);
        }
        else if (roleName == 'wallRepairer'){
            body.push(WORK,WORK,CARRY,CARRY,MOVE,MOVE);
        }
        else if (roleName == 'feeder'){
            body.push(CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE);
        }
        else if (roleName == 'upgrader'){
            if (energy>=700){body.push(WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE);}
            else if (energy>=600){body.push(WORK,WORK,WORK,WORK,WORK,CARRY,MOVE);}
            else if (energy>=500){body.push(WORK,WORK,WORK,WORK,CARRY,MOVE);}
            else {body.push(WORK,WORK,CARRY,MOVE);}
        }
        else if (roleName == 'attacker'){
            body.push
        }
        else{
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
        }

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, { role: roleName, working: false });
    };