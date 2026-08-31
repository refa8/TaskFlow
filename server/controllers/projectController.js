const { getAllProjects, createProject, getProjectById, updateProject, deleteProject } = require("../services/projectService");


const getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const projects = await getAllProjects(page, limit);
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

const addProject = async (req, res) => {
    try {
        const {name, description} = req.body;
        const owner_id = req.user.id; // Assuming the user ID is stored in req.user after authentication

        const project = await createProject(name, description, owner_id);
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create project' });
    }   
};

const getProject = async (req, res) => {
    try {
        const { id } = req.params;
        
        const project = await getProjectById(id);
        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        } 
        if (project.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to view this project' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch project' });
    }
}; 

const editProject = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, description, status } = req.body;
        
        const project = await getProjectById(id);
        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to edit this project' });
        }

        const updatedProject = await updateProject(id, name, description, status);
        
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update project' });
    }
};

const removeProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await getProjectById(id);
        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this project' });
        }

        await deleteProject(id);
        
        res.status(200).json({message: 'Project deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete project' });
    }
};


module.exports = {
    getProjects,
    addProject,
    getProject,
    editProject,
    removeProject
};
