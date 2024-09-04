import React from 'react'
import { Link } from 'react-router-dom';
import './style.css'

const Header = () => {
    return (
        <nav className="navbar">
            <h2 className="logo">Trcker Admin</h2>
            <ul className="nav-links">
                <li>
                    <Link to="/add-user">Add New Employee</Link>
                </li>
                <li>
                    <Link to="/assign-task">Assign Task</Link>
                </li>
                <li>
                    <Link to="/track-task">Track Task</Link>
                </li>
                <li>
                    <Link to="/shots">Screen Shots</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Header