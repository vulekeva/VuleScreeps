/**
 * Created by Vukasin on 6.5.2017.
 */
//function defend with tower
StructureTower.prototype.defend =
    function () {
    //find closest enemy
        var enemy = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy !=undefined){
            this.attack(enemy);
        }
    };