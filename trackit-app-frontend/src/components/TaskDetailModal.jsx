import { useState, useEffect, useContext } from 'react';
import { Box, Modal, Button, Divider, TextField, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import * as moment from 'moment';
import { UserContext } from "../../src/contexts/UserContext";
import { getAllUsersByProjectId, updateTask, createTask } from '../components/services/projectAPI';
import "../components/TaskDetailModal.scss"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    height: 500,
    bgcolor: 'background.paper',
    borderRadius: '0.5rem',
    boxShadow: 24,
    p: 4,
};

export default function TaskDetailModal(propObject) {

    let { props, open, handleClose, pid, projectStartDate, projectEndDate } = propObject;

    let { id, projectId, taskName, description, taskStatus, dueDate, taskLabel, taskCreatedBy, taskAssignedTo, userName } = props ? props : { id: '', projectId: pid, taskName: '', description: '', taskStatus: ['Created'], dueDate: '', taskLabel: ['FEATURE'], taskCreatedBy: '', taskAssignedTo: '', userName: '' };

    const { user } = useContext(UserContext)
    const [project_users, setProjectUsers] = useState([]);
    const [modalHeading, setModalHeading] = useState("");

    // To validate Date Inputs
    let formattedStartDate = moment(projectStartDate).add(1, 'days').format("YYYY-MM-DD")
    let formattedEndDate = moment(projectEndDate).add(1, 'days').format("YYYY-MM-DD")
    const [validDate,] = useState({ formattedStartDate, formattedEndDate })

    const projId = props ? props.projectId : pid;

    let initialValues = {
        "taskName": "",
        "projectId": projId,
        "description": "",
        "dueDate": formattedStartDate,
        "taskStatus": [
            "CREATED"
        ],
        "taskLabel": [
            "FEATURE"
        ],
        "taskAssignedTo": "",
        "taskCreatedBy": user.id,
        "lastModifiedBy": user.id
    }

    let statusOptions = [
        { label: "CREATED", value: "Created" },
        { label: "IN_PROGRESS", value: "In Progress" },
        { label: "DONE", value: "Done" }
    ]

    let featureOptions = [
        { label: "FEATURE", value: "FEATURE" },
        { label: "BUG", value: "BUG" }
    ]

    const assignee = props ? props.userName : "";
    const status = props ? statusOptions.filter((statusObject) => statusObject.label === props?.taskStatus[0])[0]["value"] : ['Created'];
    const label = props ? featureOptions.filter((labelObj) => labelObj.label === props?.taskLabel[0])[0]["value"] : ['FEATURE'];

    var [task_user, setUser] = useState(assignee);
    var [task_status, setTaskStatus] = useState(status);
    var [task_label, setTaskLabel] = useState(label);

    let initialPropValues = {
        taskName: taskName,
        projectId: projectId,
        description: description,
        dueDate: dueDate.split('T')[0],
        taskStatus: taskStatus,
        taskLabel: taskLabel,
        taskAssignedTo: taskAssignedTo,
        taskCreatedBy: taskCreatedBy,
        lastModifiedBy: user.id
    }

    let initialFormValues = props ? initialPropValues : initialValues

    const [formValues, setFormValues] = useState(initialFormValues);

    useEffect(() => {
        // Fetch users in the given project
        getAllUsersByProjectId(projId).then(users => {
            setProjectUsers(users)
        }).catch(err => {
            console.error(err);
            // TODO: alert
        })
        if (props) {
            setModalHeading("Edit Task");
        }
        else {
            setModalHeading("Create Task");
        }
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("name", name, "value", value);
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    let handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser(value)
        setFormValues({
            ...formValues,
            [name]: project_users.filter((user) => user.userName === value)[0]["id"],
        });
    }

    let handleStatusChange = (e) => {
        const { name, value } = e.target;
        setTaskStatus([value]);
        let status = statusOptions.filter((statusObject) => statusObject.value === value)[0]["label"];
        setFormValues({
            ...formValues,
            [name]: [status]
        });
    }

    let handleLabelChange = (e) => {
        const { name, value } = e.target;
        setTaskLabel([value]);
        setFormValues({
            ...formValues,
            [name]: [value],
        });
    }

    const onKeyDown = (e) => {
        e.preventDefault();
    };

    // On form Submmission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (props) {
            updateTask(formValues, props.projectId, props.id)
                .then((res) => console.log("update successful"))
                .catch((err) => console.log(err))
        }
        else {
            createTask(formValues, projId)
                .then((res) => console.log("create successful"))
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
                    <Typography variant='h5' align='center'>{modalHeading}</Typography>
                    <Divider sx={{ marginBottom: 4 }} />
                    <form onSubmit={handleSubmit}>
                        <TextField
                            aria-label="Task Name"
                            placeholder="Please enter the task name."
                            defaultValue={formValues.taskName}
                            name="taskName"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ width: 600, marginBottom: 20 }}
                            onChange={handleInputChange}
                            required
                            id="name"
                            label="Task Name"
                        />
                        <TextField
                            aria-label="Task Description"
                            placeholder="Please enter the task description."
                            defaultValue={formValues.description}
                            name="description"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ width: 600, marginBottom: 20 }}
                            onChange={handleInputChange}
                            required
                            id="outlined-multiline-static"
                            label="Task Description"
                            multiline
                            rows={4}
                        />
                        <div className = "date-field">
                            <TextField
                                id="date"
                                label="Due Date"
                                type="date"
                                defaultValue={formValues.dueDate}
                                sx={{ width: 220, marginBottom: 2, marginRight: 100 }}
                                size="small"
                                name="dueDate"
                                inputProps={{ min: validDate.formattedStartDate, max: validDate.formattedEndDate }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onKeyDown={onKeyDown}
                                onChange={handleInputChange}
                                required
                            />

                        </div>
                        <FormControl
                            variant="outlined"
                            margin={"0.5"}
                            style={{ width: "50%", marginBottom: 1 }}
                        >
                            <InputLabel id="select-status">Task Status</InputLabel>
                            <Select
                                sx={{ width: 220, marginTop: 0.1, height: 40 }}
                                variant="outlined"
                                value={task_status}
                                name="taskStatus"
                                onChange={handleStatusChange}
                                labelId="select-status"
                                label={"Task Status"}
                                required
                            >
                                {statusOptions.map((options) => <MenuItem key={options.label} value={options.value}>{options.value}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl
                            variant="outlined"
                            margin={"0.5"}
                            style={{ width: "50%" }}
                        >
                            <InputLabel id="select-user">Assignee</InputLabel>
                            <Select
                                sx={{ width: 220, marginTop: 0.34, height: 40 }}
                                variant="outlined"
                                defaultValue={formValues.taskAssignedTo}
                                value={task_user}
                                name="taskAssignedTo"
                                onChange={handleUserChange}
                                labelId="select-user"
                                label={"Select User"}
                                required
                            >
                                {project_users?.map((options) => <MenuItem key={options.id} value={options.userName}>{options.userName}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl
                            variant="outlined"
                            margin={"0.5"}
                            style={{ width: "50%" }}
                        >
                            <InputLabel id="select-label">Task Label</InputLabel>
                            <Select
                                sx={{ width: 220, marginTop: 0.1, height: 40, marginBottom: 2 }}
                                variant="outlined"
                                value={task_label}
                                onChange={handleLabelChange}
                                name="taskLabel"
                                labelId="select-label"
                                label={"Select Label"}
                                required
                            >
                                {featureOptions.map((options) => <MenuItem key={options.label} value={options.value}>{options.value}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <div className='button-section'>
                            <Button sx={{ marginLeft: 2 }} onClick={handleClose} color="error" variant="outlined" endIcon={<ClearOutlinedIcon fontSize="small" />} > CANCEL </Button>
                            <Button variant="contained" type="submit" color="primary" endIcon={<ChevronRightOutlinedIcon fontSize="small" />}> SAVE </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
