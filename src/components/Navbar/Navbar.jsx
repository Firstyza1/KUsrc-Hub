import React from 'react'
import './Navbar.css'
import {Link} from 'react-router-dom'
const Navbar = () => {
  return (
    <header className='header'>
        <img className="logo-image" src="src/assets/images/logo.png"/>
        <nav className='navbar'>
            <Link to="/">รีวิวรายวิชา</Link>
            <Link to="/Community">ชุมชน</Link>
            <Link to="/About">เกี่ยวกับเรา</Link>
        </nav>
        <div className="navbar-button">
            <a className='notification' href="#">
                <i class='bx bxs-bell'></i>
            </a>
            
                <Link className='register-button' to="/Register">ลงทะเบียน</Link>
            
                <Link className='login-button' to="/Login">เข้าสู่ระบบ</Link>
            
            
        </div>
    </header>
  )
}

export default Navbar