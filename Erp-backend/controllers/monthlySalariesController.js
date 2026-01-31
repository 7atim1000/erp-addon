const  MonthlySalaries = require('../models/monthlySalariesModel')

const addMonthlySalaries = async(req, res, next) => {

    try {

        const monthlySalaries = new MonthlySalaries(req.body);
        await monthlySalaries.save();
        res.status(201).json({ success: true, message: 'Monthly salaries created!', data: monthlySalaries });

    } catch (error) {
        next(error)
    }
};



const getMonthlySalaries = async (req, res, next) => {

    try {
        
        const {  month } = req.body ; 
        
        const monthlySalaries = await MonthlySalaries.find(

            { 
            ...(month !== 'all' && {month} ),
            }
        );
     
        
        res.status(200).json(monthlySalaries);
      

    } catch (error) {
        next(error)
    }
}


module.exports = { addMonthlySalaries, getMonthlySalaries }
