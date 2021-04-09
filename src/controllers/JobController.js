const Job = require('../model/Job')
const jobUtils = require('../utils/jobUtils')
const Profile  = require('../model/Profile')

module.exports =  {
    create(req,res) {
        return res.render("job")
    },

    async save(req,res) {
        const jobs = await Job.get()

        await Job.create({
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            created_at: Date.now(),
        })
        
        return res.redirect("/")
    },

    async show(req,res) {
        const jobs = await Job.get()
        const jobId = req.params.id
        
        const job = jobs.find((job) => Number(job.id) === Number(jobId))
        
        if(!job) {
            return res.send("job not found")
        }
        const profile = await Profile.get()

        job.budget = jobUtils.calculateBudget(job, profile["value-hour"])

        return res.render("job-edit", { job })
    },

    async update(req,res) {
        const jobId = req.params.id

        const updateJob = {
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"],
        }

        await Job.update(updateJob, jobId)

        res.redirect('/job/' + jobId)
    },

    async delete(req,res) {
        const jobId = req.params.id
        await Job.delete(jobId)
        return res.redirect('/')
    }
}