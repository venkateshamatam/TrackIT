import { useState, useEffect, useContext } from 'react';
import { Button, TextField, Divider, Modal, Typography, Box } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import * as moment from 'moment';
import Multiselect from 'multiselect-react-dropdown';
import { getAllUsersByProjectId, updateProject, createProject } from '../services/projectAPI';
import { getAllRegisteredUsers } from '../services/userAPI';
import { UserContext } from "../../contexts/UserContext.js";
import "./ProjectDetailModal.scss"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    height: 470,
    bgcolor: 'background.paper',
    borderRadius: '0.5rem',
    boxShadow: 24,
    p: 4,
};

export default function ProjectDetailModal({ props, open, handleClose }) {

    // Format Date to validate Date Inputs
    const currDate = new Date().toLocaleDateString();
    const formattedDate = moment(currDate).format("YYYY-MM-DD")

    let { id, title, description, project } = props ? props : { id: '', title: '', description: '', project: {} };

    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext)
    let initialUsers = users.filter(u => (project.users?.includes(u.id)))
    let projectAdmin = props ? project.adminUser : user.id
    let isProjectAdmin = user.id === projectAdmin
    
    // Setting initial values for form modal for EDIT/CREATE
    const defaultInitialValues = props ? initialUsers : [{ id: user?.id, userName: user.userName, email: user?.email }]
    const [projectUsers, setProjectUsers] = useState([]);
    const [modalHeading, setModalHeading] = useState("");

    useEffect(() => {
        console.log("useEffect: ", defaultInitialValues)
        // Setter to set initial users
        setProjectUsers(defaultInitialValues);
    }, [defaultInitialValues[0]?.id])

    let initialValues = {
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        adminUser: user.id,  // Fetch admin user from context
        users: [user.id], // Fetch admin user from context
        taskIds: []
    }

    let initialPropValues = {
        title: title,
        description: description,
        adminUser: project.adminUser,
        users: project.users,
        taskIds: project.taskIds,
        startDate: project.startDate ? project.startDate.split('T')[0] : "",
        endDate: project.endDate ? project.endDate.split('T')[0] : "",
    }

    let initialFormValues = props ? initialPropValues : initialValues

    const [formValues, setFormValues] = useState(initialFormValues);

    useEffect((props) => {
        if (props) {
            // Fetch users based on Project ID
            getAllUsersByProjectId(props.id).then(users => {
                setProjectUsers(users)
            }).catch(err => {
                console.error(err);
                // TODO: alert
            })
        }
    }, [])

    useEffect(() => {
        // Fetch all users
        getAllRegisteredUsers().then(users => {
            setUsers(users)
        }).catch(err => {
            console.error(err);
            // TODO: alert
        })

        if (props) {
            setModalHeading("Edit Project");
        }
        else {
            setModalHeading("Create Project");
        }

    }, [])
    
    // onSelect handler for user multiselect
    const onSelect = (selectedList, selectedItem) => {
        console.log("selectedList", selectedList);
        console.log("selectedItem", selectedItem);
        projectUsers.push(selectedItem);
        setProjectUsers(projectUsers);
        let project_user_ids = selectedList.map(user => user.id)
        setFormValues({
            ...formValues,
            users: project_user_ids
        })
    }

    // onRemove handler for user multiselect
    const onRemove = (selectedList, removedItem) => {
        console.log("selectedList", selectedList);
        console.log("removedItem", removedItem);
        setProjectUsers(selectedList)
        let project_user_ids = selectedList.map(user => user.id)
        setFormValues({
            ...formValues,
            users: project_user_ids
        })
    }

    // Handling form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("name", name, "value", value);
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    // Handling form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("payload", formValues);
        if (props) {
            // API call to update Project given its ID and Payload
            updateProject(formValues, props.id)
                .then((res) => {
                    console.log("update successful")
                })
                .catch((err) => console.log(err))
        }
        else {
            // API call to create Project, given form Payload
            createProject(formValues)
                .then((res) => {
                    console.log("create successful")
                })
                .catch((err) => console.log(err))
        }
        // Close Modal after API call
        handleClose()
    };


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}
                    noValidate
                    autoComplete="off">
                    <div className='form'>
                        <Typography variant='h5' align='center'>{modalHeading}</Typography>
                        <Divider sx={{ marginBottom: 4 }} />
                        <form onSubmit={handleSubmit}>
                            <TextField
                                id="name"
                                label="Project Name"
                                size="small"
                                style={{ width: 600, marginBottom: 20 }}
                                value={formValues.title}
                                name="title"
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                id="Project Description"
                                label="Project Description"
                                multiline
                                name="description"
                                rows={3}
                                onChange={handleInputChange}
                                style={{ width: 595, marginBottom: 25, marginLeft: 9 }}
                                defaultValue={formValues.description}
                                variant="standard"
                                required
                            />
                            <TextField
                                id="date"
                                label="Project Start Date"
                                type="date"
                                defaultValue={formValues.startDate}
                                inputProps={{ min: formattedDate }}
                                sx={{ width: 220, marginBottom: 4, marginRight: 1 }}
                                size="small"
                                name="startDate"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                id="date"
                                label="Project End Date"
                                type="date"
                                defaultValue={formValues.endDate}
                                size="small"
                                name="endDate"
                                inputProps={{ min: formValues.startDate }}
                                sx={{ width: 220, marginBottom: 4 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={handleInputChange}
                                required
                            />
                            <Multiselect
                                onSelect={onSelect} // Function will trigger on select event
                                onRemove={onRemove} // Function will trigger on remove event
                                selectedValues={projectUsers} // Preselected values to persist in dropdown
                                options={users} // Options to display in the dropdown
                                displayValue="userName" // Property name to display in the dropdown options
                                required
                                // loading = {true}
                                // disablePreSelectedValues={ props ? true : false }
                                placeholder="Select User"
                            />
                            <div className='button-section'>
                                <Button sx={{ marginLeft: 2 }} onClick={handleClose} color="error" variant="outlined" endIcon={<ClearOutlinedIcon fontSize="small" />} > CANCEL </Button>
                                <Button variant="contained" type="submit" color="primary" endIcon={<ChevronRightOutlinedIcon fontSize="small" />}> SAVE </Button>
                            </div>
                        </form>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
