import { useState, useEffect, useContext } from 'react';
import { Button } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ProjectDetailModal from "../ProjectDetailModal/ProjectDetailModal";
import ProjectCard from "../ProjectCard/ProjectCard";
import { getAllProjects } from "../services/projectAPI";
import { UserContext } from "../../contexts/UserContext";
import { PROJECTS, CREATE_PROJECT } from '../../utils/constants';
import './Home.scss'


const Home = () => {

    const [open, setOpen] = useState(false);
    let [projectList, setProjectList] = useState([]);
    const [count, setCount] = useState(0);

    // User context
    let { user, } = useContext(UserContext);

    // All projects user is part of.
    let userProjectsList = projectList?.filter(project => project?.users?.includes(user.id))

    useEffect(() => {
        // Fetch all projects
        getAllProjects()
            .then(projects => {
                setProjectList(projects)
                setCount(count + 1);
            })
            .catch(err => { console.error(err); }) // TODO: alert 
    }, [count, projectList.length]);

    // handling modal open/close
    const handleModalOpen = () => {
        setOpen(!open);
    };
    return (<>

        <div className="heading">
            <h1>{PROJECTS}
            </h1>
        </div>

        <div className="projects" style={{ display: 'flex', flexDirection: 'row-reverse', marginLeft: '30px', marginBottom: '15px' }}>
            <Button
                color="primary"
                variant="contained"
                endIcon={<AddOutlinedIcon fontSize="small" />}
                onClick={handleModalOpen}
                sx={{ marginRight: '48px' }}
            >{CREATE_PROJECT}</Button>
        </div>
        {
            open ? (
                <ProjectDetailModal open={open} handleClose={handleModalOpen} />
            ) : null
        }
        {
            userProjectsList?.map((project) => {
                return <ProjectCard key={project.id} id={project.id} title={project.title} description={project.description} project={project} />
            })
        }
    </>)
}

export default Home;


