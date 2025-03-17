import React, { useEffect } from "react";
import styles from "./PostPopup.module.css";
import stylesCommu from "./Community.module.css";
import { useUser } from "../User";
import { PostFormSchema } from "../YupValidation/Validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
function PostPopup({ onClose, post_id }) {
  const { user } = useUser();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm({
    resolver: yupResolver(PostFormSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3000/createPost", {
        user_id: user.user_id,
        post_desc: data.post_desc,
        post_id: post_id,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error occurred:", error.response || error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      // setLoading(false);
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
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาด :", error);
      }
    };
    fetchPost();
  }, [post_id, setValue]);

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
              ></textarea>
              {errors.post_desc && (
                <div className="text-error">{errors.post_desc.message}</div>
              )}
            </div>
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
    </>
  );
}

export default PostPopup;
