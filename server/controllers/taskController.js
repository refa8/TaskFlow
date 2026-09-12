const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('../services/taskService');
const { getProjectById } = require('../services/projectService');
const { createActivityLog } = require('../services/activityLogService');

const getTasks = async (req, res) => {
    try {
        const user_id = req.user.id; // Assuming the user ID is stored in req.user after authentication
        const {role} = req.user;
        const page = req.query.page !== undefined ? Number(req.query.page) : 1;
        const limit = req.query.limit !== undefined ? Number(req.query.limit) : 5;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const priority = req.query.priority || '';
        const sortBy = req.query.sortBy || 'task_id';
        const order = req.query.order || 'asc';
        const allowedSortFields = ['task_id', 'name', 'status', 'priority', 'created_at'];
        const allowedOrder = ['asc', 'desc'];
        const sortOrder = order.toLowerCase();
        const validStatuses = ["todo", "in_progress", "completed"];
        const validPriorities = ["low", "medium", "high"];



        if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
            return res.status(400).json({ message: 'Page and limit must be positive integers' });
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority' });
        }
        
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ message: 'Invalid sortBy field' });
        }
        
        if (!allowedOrder.includes(sortOrder)) {
            return res.status(400).json({ message: 'Invalid sort order' });
        }

        const { tasks, totalTasks } = await getAllTasks(user_id,role, search, status, priority, page, limit, sortBy, sortOrder);

        const totalPages = Math.ceil(totalTasks / limit);
        
        res.status(200).json({ tasks, pagination: { page, limit, totalTasks, totalPages } });
    } catch (error) {
        console.error(error);
        res.status(500).json({  message: "Failed to fetch tasks" });
    }
};

const addTask = async (req, res) => {
    try {
        const { name, project_id, assigned_to, status, priority } = req.body;
        const owner_id = req.user.id; // Assuming the user ID is stored in req.user after authentication
        const project = await getProjectById(project_id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (project.owner_id !== owner_id) {
            return res.status(403).json({ message: "You are not authorized to create a task for this project" });
        }

        const task = await createTask(name, project_id, assigned_to, status, priority, owner_id);
        if (!task) {
            return res.status(400).json({ message: "You are not allowed to create a task for this project" });
        }

        await createActivityLog(owner_id, 'created', 'task', task.task_id, `Task ${name} created`);
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create task" });
    }
};

const getTask = async (req, res) => {
    try{
        const { id } = req.params;
        
        const task = await getTaskById(id);
        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }

        const {id:userId, role} =req.user;
        if(role ==="admin"){
            return res.status(200).json(task);
        }
        
        if(role === "manager") {
            const project = await getProjectById(task.project_id);

            if(!project){
                return res.status(404).json({ message: "Associated project not found" });
            }
            if(project.owner_id !== userId){
                return res.status(403).json({ message: "You are not authorized to view this task" });
            }
            return res.status(200).json(task);
        }
        
        if(role === "member") {
            if(task.assigned_to !== userId){
                return res.status(403).json({ message: "You are not authorized to view this task" });
            }
            return res.status(200).json(task);
        }
        return res.status(403).json({ message: "Invalid user role" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch task" });
    }
};

const editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, project_id, assigned_to, status, priority } = req.body;
        const user_id = req.user.id;
        const { role } = req.user;
        const task = await getTaskById(id);

        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }
        
        if (role === "admin"){

        }

        else if (role === "manager") {
            const currentProject = await getProjectById(task.project_id);
            if (currentProject.owner_id !== user_id) {
                return res.status(403).json({ message: "You are not authorized to update this task" });
            }

            const newProject = await getProjectById(project_id);
            if (!newProject){
                return res.status(404).json({ message: "New project not found" });
            }

            if (newProject.owner_id !== user_id) {
                return res.status(403).json({ message: "You are not authorized to move this task to the specified project" });  
            }
        }

        else if(role === "member") {
            if (task.assigned_to !== user_id) {
                return res.status(403).json({ message: "You are not authorized to update this task" });
            }
            
            if(name !== task.name || project_id !== task.project_id || assigned_to !== task.assigned_to ||priority !== task.priority){
                return res.status(403).json({ message: "You are not authorized to update this task" });

            }

        }

        else{
            return res.status(403).json({ message: "Invalid role" });
        }


        const updatedTask = await updateTask(id, name, project_id, assigned_to, status, priority);
        
        await createActivityLog(user_id, 'updated', 'task', updatedTask.task_id, `Task ${name} updated`);

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update task" });
    }
};

const removeTask = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { role } = req.user;

        const task = await getTaskById(id);
        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }

        if (role === "admin") {
            await deleteTask(id);
            await createActivityLog(user_id, 'deleted', 'task', task.task_id, `Task ${task.name} deleted`);
            return res.status(200).json({ message: "Task deleted successfully" });
        }

        if (role === "manager") {
            const project = await getProjectById(task.project_id);
            if (!project) {
                return res.status(404).json({ message: "Associated project not found" });
            }

            if (project.owner_id !== user_id) {
                return res.status(403).json({ message: "You are not authorized to delete this task" });
            }
            await deleteTask(id);
            await createActivityLog(user_id, 'deleted', 'task', task.task_id, `Task ${task.name} deleted`);
            return res.status(200).json({ message: "Task deleted successfully" });
        }


        return res.status(403).json({ message: "You are not authorized to delete this task" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete task" });
    }
};

module.exports = {
    getTasks,
    addTask,
    getTask,
    editTask,
    removeTask
};
    


    
