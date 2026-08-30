
const validateTask = (req, res, next) => {
    const { name, project_id, assigned_to, status, priority } = req.body;
    const validStatuses = ["todo", "in_progress", "completed"];
    const validPriorities = ["low", "medium", "high"];
    const projectId = Number(project_id);
    const assignedTo = Number(assigned_to);    
    if (!name || !project_id || !assigned_to || !status || !priority) {
        return res.status(400).json({ message: "All fields are required" });
    }  
    if (Number.isInteger(projectId) === false || Number(project_id) <= 0) {
        return res.status(400).json({ message: "Invalid project_id" });
    }
    if (Number.isInteger(assignedTo) === false || Number(assigned_to) <= 0) {
        return res.status(400).json({ message: "Invalid assigned_to" });
    }
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    } 
    if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: "Invalid priority" });
    }

    next();
    
};


module.exports = {
    validateTask
};