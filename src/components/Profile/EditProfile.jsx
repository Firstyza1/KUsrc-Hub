import { React, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Navbar from "../Navbar/Navbar";
import SideBar from "../../components-admin/SideBar/SideBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditProfile.css";
import { useUser } from "../UserContext/User";
import { useNavigate } from "react-router-dom";
import { usernameFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function EditProfile() {
  const location = useLocation();
  const { type } = location.state || {};
  const { myProfile } = location.state || {};
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    user_profile: "",
  });
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(usernameFormSchema),
    defaultValues: {
      username: "",
      email: "",
    },
    reValidateMode: "onSubmit",
  });

  const fetchAPI = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/userProfile/${id}`,
        {
          headers: {
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      const fetchedUser = response.data.user;
      setUserData(fetchedUser);
      setPreview(fetchedUser.user_profile);
      reset({ username: fetchedUser.username, email: fetchedUser.email });
    } catch (err) {
      showToast("ไม่สามารถดึงข้อมูลได้", "error");
    }
  };

  useEffect(() => {
    if (user && id != user?.user_id && user?.role != "admin") {
      navigate(`/Profile/${user?.user_id}`, { replace: true });
    }
  }, [user?.user_id, id, navigate]);

  useEffect(() => {
    fetchAPI();
  }, [id]);

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const cancelButton = () => {
    reset({ username: userData.username });
    setPreview(userData.user_profile);
    setFile(null);
  };

  const showToast = (message, type) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleEditProfile = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("username", formData.username);
      if (file) {
        data.append("file", file);
      }

      const response = await axios.put(
        `http://localhost:3000/updateUserProfile/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authtoken: `Bearer ${user?.token}`,
          },
        }
      );
      const updatedUserData = response.data.user;
      if (myProfile || user.user_id === userData.user_id) {
        const updatedUser = {
          ...user,
          username: updatedUserData.username,
          user_profile: updatedUserData.user_profile,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setFile(null);
      setUserData(updatedUserData);
      showToast("อัปเดตโปรไฟล์สำเร็จ", "success");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "เกิดข้อผิดพลาด";
      showToast(`${errorMessage}`, "error");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const formValues = watch();
  const isButtonDisabled =
    (formValues.username === userData.username && !file) ||
    !formValues.username ||
    formValues.username.trim() === "";

  return (
    <>
      {type === "admin" ? <SideBar /> : <Navbar />}

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader">
            <ClipLoader color="#02BC77" size={50} />
            <p>กำลังอัปเดตข้อมูล...</p>
          </div>
        </div>
      )}

      <div className="editprofile-card">
        <div className="editprofile-header">
          <i
            className="bx bx-chevron-left back-icon"
            onClick={() => navigate(-1)}
          ></i>
          <h1>เเก้ไขโปรไฟล์</h1>
        </div>
        <div className="editprofile-container">
          <div className="img-profile">
            <img src={preview} alt="Profile" />
          </div>
          <label className="upload-button">
            อัปโหลดรูปภาพ
            <input
              type="file"
              accept=".png, .jpeg, .jpg"
              onChange={handleFileChange}
              hidden
            />
          </label>
          <div className="form-group">
            <label>อีเมล</label>
            <input type="text" maxLength="40" {...register("email")} disabled />
          </div>
          <div className="form-group">
            <label>ชื่อผู้ใช้</label>
            <div className="input-container">
              <input
                type="text"
                {...register("username")}
                placeholder={userData.username || "กรอกชื่อผู้ใช้ใหม่..."}
                maxLength={15}
              />
            </div>
            {errors.username && (
              <div className="text-error">{errors.username.message}</div>
            )}
          </div>
          <div className="button-container">
            <button className="cancel-button" onClick={cancelButton}>
              <i className="bx bxs-x-circle"></i>
              <p>ยกเลิก</p>
            </button>
            <button
              className="edit-profile-button"
              onClick={handleSubmit(handleEditProfile)}
              disabled={isButtonDisabled}
              style={{ backgroundColor: isButtonDisabled ? "gray" : "" }}
            >
              <i className="bx bx-edit"></i>
              <p>เเก้ไข</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
