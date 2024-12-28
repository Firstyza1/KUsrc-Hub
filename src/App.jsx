import Navbar from "./components/Navbar/Navbar"
import {Link} from 'react-router-dom'
import './App.css'
function App() {
  return (
    <>
        <Navbar/>
        <div className="review-subject-container">
          <h1>รีวิวรายวิชา</h1>
           <Link className='requset-button' to="/Requestform"><i class='bx bx-send'></i>คำร้องขอเพิ่มรายวิชา</Link>
        </div>
       
    </>
  )
}

export default App
