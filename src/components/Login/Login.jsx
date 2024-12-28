import {React,useState} from 'react'
import Navbar from '../Navbar/Navbar'
import './Login.css';
function Login() {
  const [isHide, setIsHide] = useState(true);
  const clickButton = ()=> setIsHide(!isHide);
 
  return (
    <>
        <Navbar/>
        <div className='login-page'>
              <form className="login-container">
                  <h1>เข้าสู่ระบบ</h1>
                  <div className="email-control">
                      <label>อีเมล</label>
                      <input type="text" />
                  </div>
                    <div className="password-control">
                      <label>รหัสผ่าน</label>
                      <input type={isHide ? "password":"text"} />
                      <div className='icon-hide' onClick={clickButton}>
                       {isHide ?<i class='bx bx-hide'></i> :<i class='bx bx-show'></i>}
                      </div>
                      
                    </div>
                  <div className='submit-button'>
                    <button type="submit">เข้าสู่ระบบ</button>
                  </div>
              </form>
        </div>
    </>
  )
}

export default Login