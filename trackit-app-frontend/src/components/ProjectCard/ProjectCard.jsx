import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Button, Divider, Typography, Tooltip, Chip, Avatar, AvatarGroup } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import { deepOrange, deepPurple, green, cyan, red } from '@mui/material/colors';
import ProjectDetailModal from "../ProjectDetailModal/ProjectDetailModal";
import { getAllUsersByProjectId } from "../services/projectAPI";
import DeleteModal from "../DeleteModal/DeleteModal";
import { UserContext } from "../../contexts/UserContext";
import './ProjectCard.scss'

const ProjectCard = (props) => {

  let navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [is_delete_open, setDeleteOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  let projectId = props.id

  // Fetch user from Context
  const { user } = useContext(UserContext)

  // Check whether loggedin User is Project Admin
  let isProjectAdmin = props.project.adminUser === user.id

  useEffect(() => {
    // API to fetch all project users.
    getAllUsersByProjectId(projectId).then(users => {
      setUsers(users)
      setCount(count + 1)
    }).catch(err => {
      console.error(err);
      // TODO: alert
    })

  }, [count])

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteOpen = (e) => {
    setDeleteOpen(true)
  }
  const handleDeleteClose = () => {
    setDeleteOpen(false)
  }
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  // Format Date 
  const formatShortDate = (date) => {
    let newShortDate = new Date(date).toUTCString();
    return newShortDate.split(" ").slice(1, 4).join(" ");
  }

  // Avatar background colors
  const backgroundColors = [deepOrange[500], green[500], cyan[500], deepPurple[500], red[500]]

  const Avatars = () => users?.map((user, idx) => <Tooltip key={idx} title={user?.userName}>
    <Avatar sx={{ bgcolor: backgroundColors[idx], fontSize: "small" }}> {user?.userName[0]} </Avatar>
  </Tooltip>)

  const ProjectTitle = () => {
    return <div>
      {props.title}
    </div>
  };

  return (
    <Card className="card">
      <div className="float-parent-element">
        <CardHeader title={<ProjectTitle />}
          avatar={
            <AvatarGroup> {<Avatars />} </AvatarGroup>
          }
          action={
            <>
              <Button sx={{ paddingLeft: "0px" }} size="small" color="error" variant="text" disabled={!isProjectAdmin} onClick={(e) => handleDeleteOpen()}>
                <DeleteIcon />
              </Button>
              <Button sx={{ paddingRight: "0px" }} size="small" color="primary" variant="text" disabled={!isProjectAdmin} onClick={(e) => handleOpen()}>
                <EditIcon />
              </Button>
            </>

          } className="project-card-header" titleTypographyProps={{ variant: 'h5', noWrap: true }}
          sx={{
            display: "flex",
            backgroundColor: "lightblue",
            overflow: "hidden",
            "& .MuiCardHeader-content": {
              overflow: "hidden"
            }
          }}
        />
      </div>
      <Divider />
      <CardContent className="float-parent-element">
        <div className="card-description">
          <Typography>{props.description}</Typography>

          {
            open ? (
              <ProjectDetailModal props={props} open={open} handleClose={handleClose} />
            ) : null
          }

          {
            is_delete_open ? (
              <DeleteModal props={props} open={is_delete_open} handleClose={handleDeleteClose} isProject={true} />
            ) : null
          }
        </div>

      </CardContent>
      <div className="footer">
        <Chip label={"Start Date: " + formatShortDate(props.project.startDate)} onClick={handleClick} color="primary" />
        <ArrowRightAltOutlinedIcon sx={{ color: "orange", marginTop: "3px", marginRight: "2px" }} />
        <Chip label={"End Date: " + formatShortDate(props.project.endDate)} onClick={handleClick} color="success" />
        {/* Navigate to Project Detailed View */}
        <div className="detail-view-button">
          <Button size="small" color="primary" variant="text" onClick={(e) => navigate(`/project-detail/${props.id}`, { state: props })}>
            Detail View
            <ArrowForwardIcon />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;