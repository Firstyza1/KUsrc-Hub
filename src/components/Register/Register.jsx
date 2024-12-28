import {React,useState} from 'react'
import Navbar from '../Navbar/Navbar'
import './Register.css';
function Register() {
    const [isPasswordHide, setIsPasswordHide] = useState(true);
    const showPassword = ()=> setIsPasswordHide(!isPasswordHide);
    const [isConfirmPasswordHide, setIsConfirmPasswordHide] = useState(true);
    const showConfirmPassword = ()=> setIsConfirmPasswordHide(!isConfirmPasswordHide);
  return (
    <>
    <Navbar/>
    <div className='register-page'>
          <form className="register-container">
              <h1>ลงทะเบียน</h1>
              <div className="register-email-control">
                  <label>อีเมล</label>
                  <input type="text" />
              </div>
              <div className="register-username-control">
                  <label>ชื่อผู้ใช้</label>
                  <input type="text" />
              </div>
                <div className="register-password-control">
                  <label>รหัสผ่าน</label>
                  <input type={isPasswordHide ? "password":"text"} />
                  <div className='icon-hide' onClick={showPassword}>
                   {isPasswordHide ?<i class='bx bx-hide'></i> :<i class='bx bx-show'></i>}
                  </div>
                  
                </div>
                <div className="register-confirm-password-control">
                  <label>ยืนยันรหัสผ่าน</label>
                  <input type={isPasswordHide ? "password":"text"} />
                  <div className='icon-hide' onClick={showConfirmPassword}>
                   {isConfirmPasswordHide ?<i class='bx bx-hide'></i> :<i class='bx bx-show'></i>}
                  </div>
                  
                </div>
              <div className='submit-button'>
                <button type="submit">ลงทะเบียน</button>
              </div>
          </form>
    </div>
</>
  )
}

export default Register