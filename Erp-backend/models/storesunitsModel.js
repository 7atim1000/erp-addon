const mongoose = require('mongoose');

const storesunitsSchema = new mongoose.Schema ({

    storeunitNo :{ type :String, require :[true, 'Unit number is required']},
    storeunitName :{ type: String, required :[true, 'Unit name is required']},
    
    user : { type : mongoose.Schema.Types.ObjectId, ref :'User'},
    

},  { timestamps :true });



module.exports = mongoose.model('Storesunits', storesunitsSchema); 