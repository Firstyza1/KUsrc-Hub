import React, { useEffect, useState } from "react";
import styles from "./PostPopup.module.css";
import stylesCommu from "./Community.module.css";
import { useUser } from "../UserContext/User";
import { PostFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";

function PostPopup({ onClose, post_id, refetch, showSuccessToast }) {
  const { user } = useUser();
  const [charCount, setCharCount] = useState(0); // สร้าง state สำหรับนับตัวอักษร
  const maxCharLimit = 500; // กำหนดขีดจำกัดตัวอักษร

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(PostFormSchema),
    reValidateMode: "onSubmit",
  });

  // ตรวจสอบความยาวของข้อความใน textarea
  const postDesc = watch("post_desc", "");
  useEffect(() => {
    setCharCount(postDesc?.length || 0);
  }, [postDesc]);

  const onSubmit = async (data) => {
    try {
      const token = user.token;
      await axios.post(
        "http://localhost:3000/createPost",
        {
          user_id: user.user_id,
          post_desc: data.post_desc,
          post_id: post_id,
        },
        {
          headers: {
            authtoken: `Bearer ${token}`,
          },
        }
      );
      onClose();
      if (refetch) {
        refetch();
      }
      showSuccessToast();
    } catch (error) {
      console.error("Error occurred:", error.response || error);
      toast.error("เกิดข้อผิดพลาด", {
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

  useEffect(() => {
    if (!post_id) return;
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getPostByPostId/${post_id}`
        );
        if (response.data) {
          const postData = response.data;
          setValue("post_desc", postData.post_desc);
          setCharCount(postData.post_desc?.length || 0); // ตั้งค่าจำนวนตัวอักษรเมื่อโหลดโพสต์เดิม
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาด :", error);
      }
    };
    fetchPost();
  }, [post_id, setValue]);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <>
      <div className="popup-page">
        <div className={styles.PostPopupContainer}>
          <div className={styles.header}>
            <h3 className={styles.headerName}>สร้างโพสต์</h3>
            <i className="bx bx-x" onClick={onClose}></i>
          </div>

          <div className={styles.postContent}>
            <div className={stylesCommu.profileContainer}>
              <div className={stylesCommu.profile}>
                <img
                  className={stylesCommu.profileImage}
                  src={user?.user_profile}
                  alt="Profile"
                />
                <h4>{user?.username}</h4>
              </div>
            </div>
            <div className={styles.postText}>
              <textarea
                placeholder="เขียนโพสต์ของคุณที่นี่..."
                {...register("post_desc")}
                maxLength={maxCharLimit} // จำกัดจำนวนตัวอักษร
                onChange={(e) => {
                  if (e.target.value.length > maxCharLimit) {
                    e.target.value = e.target.value.substring(0, maxCharLimit);
                  }
                  setCharCount(e.target.value.length);
                }}
              ></textarea>
              <div className={styles.charCounter} style={{right:"0"}}>
                <p>
                  {charCount}/{maxCharLimit}
                </p>
              </div>
              {errors.post_desc && (
                <div className="text-error">{errors.post_desc.message}</div>
              )}
            </div>
            <div className={styles.postSubmitContainer}>
              <button
                className={styles.postSubmit}
                onClick={handleSubmit(onSubmit)}
              >
                <h4>โพสต์</h4>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostPopup;
