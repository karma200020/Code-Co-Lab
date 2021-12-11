import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
// import MyCode from './components/MyCode'
import {BrowserRouter, Route} from 'react-router-dom'
import Button from '@material-ui/core/Button';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import EditIcon from '@material-ui/icons/Edit';
import "./Profile.css"

import axios from 'axios'

const Profile = () => {

    const [mycode, setmycode] = useState([]);

    const config = {
        headers:{
            'userId':localStorage.userid
        }
    }

    useEffect(() => {
        axios.get("http://localhost:5000/code/mycodes", config).then(response => {setmycode(response.data)} )
    }, [])
    
    return (
        <div className="pItems row">
            <div className="titleMp col-12">
                <h1>SAVED PROGRAMS</h1>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<NoteAddIcon />}
                >
                <Link to='/textEditor'>Create New File</Link>
                    
                </Button>                        
            </div>
            {mycode.map((code) => {
       return(
           <>
            <div className="col-6">
                <div className="pItem">
                    <div className="myC">
                        <li>{code.codetitle}</li>
                        <Link to={`/mycode/${code._id}`}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                            >
                            Edit                     
                            </Button>  
                        </Link>   
                    </div>
                </div>
            </div>
            </>

            )
        })}
        </div>
    )
}

export default Profile
