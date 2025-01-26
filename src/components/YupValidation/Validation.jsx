import * as yup from "yup";

export const LoginValidate = {
  email: "",
  password: "",
};

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("* กรุณากรอกอีเมล")
    .email("* รูปแบบอีเมลไม่ถูกต้อง"),
  password: yup
    .string()
    .required("* กรุณากรอกรหัสผ่าน")
    .min(4, "* รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร"),
});

export const requestForm = {
  subjectID: "",
  subjectThai: "",
  subjectEnglish: "",
  credit: "",
  selectedSubject: "",
};

export const requestFormSchema = yup.object({
  subjectID: yup.string().required("* กรุณากรอกรหัสวิชา"),
  subjectThai: yup.string().required("* กรุณากรอกชื่อรายวิชา ภาษาไทย"),
  subjectEnglish: yup.string().required("* กรุณากรอกชื่อรายวิชา ภาษาอังกฤษ"),
  credit: yup
    .number("* กรุณาเลือกหมวดหมู่ศึกษาทั่วไป")
    .typeError("* กรุณากรอกหน่วยกิตเป็นตัวเลข")
    .positive("* หน่วยกิตต้องเป็นตัวเลขบวก")
    .integer("* หน่วยกิตต้องเป็นจำนวนเต็ม"),
  selectedSubject: yup
    .number("* กรุณาเลือกหมวดหมู่ศึกษาทั่วไป")
    .typeError("* กรุณาเลือกหมวดหมู่ศึกษาทั่วไป")
    .oneOf([1, 2, 3, 4, 5], "* กรุณาเลือกหมวดหมู่ที่ถูกต้อง")
    .required("* กรุณาเลือกหมวดหมู่ศึกษาทั่วไป"),
});
