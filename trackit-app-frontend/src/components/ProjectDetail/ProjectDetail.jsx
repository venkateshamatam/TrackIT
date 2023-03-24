import { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Button, Grid, Typography, FormControl, Select, InputLabel, MenuItem, Modal, Box } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { IN_PROGRESS, DONE } from '../../utils/constants';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import TaskDetailModal from "../TaskDetailModal";
import { getAllUsersByProjectId, getAllTasksByProjectId, getAllUserTasksByProjectId } from '../services/projectAPI.js'
import TaskCard from "../TaskCard";
import '../ProjectDetail/ProjectDetail.scss'
ChartJs.register(
    Tooltip, Title, ArcElement, Legend
);
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 380,
    height: 400,
    bgcolor: 'background.paper',
    borderRadius: '0.5rem',
    boxShadow: 24,
    p: 4,
};

const ProjectDetail = () => {
    const [users, setUsers] = useState([]);
    let { id } = useParams();
    let { state } = useLocation();
    const [count, setCount] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [filteredUser, setFilteredUser] = useState("");
    const [percentage, setPercentage] = useState(null);

    let doneTaskCount = 0
    let inProgressTaskCount = 0
    let createdTaskCount = 0
    useEffect(() => {
        if (filteredUser) {
            getAllUserTasksByProjectId(id, filteredUser)
                .then(tasks => {
                    setTasks(tasks)
                    setCount(count + 1)
                }).catch(err => {
                    console.error(err);
                    // TODO: alert
                })
        } else {
            getAllTasksByProjectId(id).then(tasks => {
                setTasks(tasks)
                setCount(count + 1)
            }).catch(err => {
                console.error(err);
                // TODO: alert
            })
        }

        getAllUsersByProjectId(id).then(users => {
            setUsers(users)
            setCount(count - 1)
        }).catch(err => {
            console.error(err);
            // TODO: alert
        })

    }, [count, filteredUser, tasks])


    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
    const handleAnalyticsModalOpen = () => {
        setAnalyticsModalOpen(true);
    };
    const handleAnalyticsModalClose = () => {
        setAnalyticsModalOpen(false);
    };
    const getTaskUser = (user_id) => {
        return users.filter((user) => user.id === user_id)
    }
    const handleUserFilterChange = (e) => {
        let { name, value } = e.target;
        if (!value) {
            setFilteredUser("")
            return
        }
        const { id } = users.filter((user) => user.userName === value)[0]
        const user_id = id ? id : ""
        setFilteredUser(user_id);
    }

    if (tasks && tasks.length > 0) {
        // Calculate the count of tasks by each status category (IN_PROGRESS, DONE, CREATED)
        doneTaskCount = tasks.filter((obj) => obj.taskStatus[0] === DONE).length
        inProgressTaskCount = tasks.filter((obj) => obj.taskStatus[0] === IN_PROGRESS).length
        createdTaskCount = tasks.length - (inProgressTaskCount + doneTaskCount)
    }

    let pieChartData = {
        datasets: [{
            data: [doneTaskCount, inProgressTaskCount, createdTaskCount],
            backgroundColor: [
                'green',
                'orange',
                'blue'
            ],
            borderColor: 'black',
            borderwidth:'100px',
        },
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'DONE',
            'IN_PROGRESS',
            'CREATED'
        ],
    }

    var config = {
        plugins: {
            datalabels: {
                formatter: function (value) {
                    return value + '%';
                },
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    padding: 10,
                }
            }
        },
        delay: 0,
        onHover: function (click, elements, chart) {
            var value = pieChartData.datasets[0].data[elements[0]?.index];
            if(value){
                setPercentage(Math.round(((value / tasks.length) * 100) * 100) / 100);
                var divShow = document.getElementsByClassName('percentage-text');
                divShow[0].style.display = 'block';
        } else {
            var divHide = document.getElementsByClassName('percentage-text');
                divHide[0].style.display = 'none';
        }
    }
}
    return (<>

        <div className="heading">
            <Typography> <h1>Project Tasks </h1> </Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '30rem', marginBottom: '2rem' }}>
            <FormControl
                variant="standard"
            >
                <InputLabel id="select-user">Select User</InputLabel>
                <Select
                    IconComponent={() => <FilterAltIcon sx={{ fontSize: 30 }} />}
                    id="select-user"
                    sx={{ minWidth: 140, marginRight: 2 }}
                    name="filteredUser"
                    onChange={handleUserFilterChange}
                    labelId="select-user"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {users?.map((options) => <MenuItem key={options.id} value={options.userName}>{options.userName}</MenuItem>)}
                </Select>
            </FormControl>
            <Button
                style={{ marginRight: '1.5rem', marginLeft: "1rem" }}
                color="warning"
                variant="contained"
                endIcon={<DonutLargeOutlinedIcon fontSize="small" />}
                onClick={(e) => handleAnalyticsModalOpen()}
            >
                View Analytics
            </Button>
            <Button
                color="primary"
                variant="contained"
                endIcon={<AddOutlinedIcon fontSize="small" />}
                onClick={(e) => handleOpen()}
            >
                Create Task
            </Button>
        </div>

        {
            open ? (
                <TaskDetailModal open={open} handleClose={handleClose} pid={id} projectStartDate={state?.project?.startDate} projectEndDate={state?.project?.endDate} />
            ) : null
        }
        <Grid className="task-grid" container spacing={1}>
            {
                tasks?.map((task) => {
                    let user = getTaskUser(task.taskAssignedTo);
                    return <Grid item spacing={1}>
                        <TaskCard key={task.id} id={task.id} projectId={task.projectId} taskName={task.taskName} description={task.description} taskStatus={task.taskStatus} dueDate={task.dueDate} taskLabel={task.taskLabel} taskCreatedBy={task.taskCreatedBy} taskAssignedTo={task.taskAssignedTo} userName={user[0]?.userName} projectStartDate={state?.project?.startDate} projectEndDate={state?.project?.endDate} />
                    </Grid>
                })
            }
        </Grid>

        <Modal
            open={analyticsModalOpen}
            onClose={handleAnalyticsModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{ display: 'inline' }}>
                    <h2 style={{ textAlign: 'center' }}>ANALYTICS </h2>
                </div>

                {/* Section to display Doughnut chart */}
                <div className="analytics" style={{ width: '79%', height: '75%', marginLeft: '12%', marginTop:'6%'}}>
            <Doughnut  data={pieChartData} options={config} >
            </Doughnut>
            {percentage && <h2 className= "percentage-text">{`${percentage}%`}</h2>}
            
        </div>
            </Box>
        </Modal>
    </>)
}

export default ProjectDetail;