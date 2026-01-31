const Job = require('../models/jobModel')


const addJob = async (req, res, next) => {
    try {
        const { jobNo, jobName } = req.body ;
        if (!jobNo || !jobName) {
            res.status(400).json({ success: false, message:'Please provide job name and job number' })
        }

        const isJobPresent  = await Job.findOne({ jobName }) 
        if (isJobPresent) {
            res.status(400).json({ status: false, message: 'Sorry this job description is already exist' });
        
        } else{
            const job = { jobNo, jobName, user: req.body.user }
            const newJob = Job(job)
            await newJob.save();

            res.status(200).json({ status: true, message: 'Job description added Successfully', data: newJob });

        }

    

    } catch (error) {
        next(error)
    }
};


const getJobs = async( req, res, next ) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({ message: 'All jobs descriptions fetched successfully', success :true , jobs, data: jobs })
    } catch (error) {
        
    }
};


const removeJob = async (req, res, next) => {
    try {

        await Job.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Job description removed Successfully' });

    } catch (error) {
        next(error)
    }

}



module.exports = { addJob, getJobs, removeJob }
