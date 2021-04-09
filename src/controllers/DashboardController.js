const Job = require('../model/Job')
const jobUtils = require('../utils/jobUtils')
const Profile  = require('../model/Profile')

module.exports = {
    async index(req,res) {
        const Jobs = await Job.get();
        const profile = await Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: Jobs.length
        } 

        let jobTotalHours = 0

        const updateJobs = Jobs.map((job) => {
            const remaining = jobUtils.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress'

            statusCount[status] += 1;
    
            jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours
            

            return {
                ...job,
                remaining,
                status,
                budget: jobUtils.calculateBudget(job, profile["value-hour"])
            }
        })

        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return res.render("index", {jobs: updateJobs, profile: profile, statusCount: statusCount, freeHours: freeHours})
    }
}