import * as yup from "yup";

export const LoginForm = {
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
    .min(6, "* รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export const RegisterForm = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export const RegisterFormSchema = yup.object({
  email: yup
    .string()
    .required("* กรุณากรอกอีเมล")
    .email("* รูปแบบอีเมลไม่ถูกต้อง")
    .matches(/^[a-zA-Z0-9._%+-]+@ku\.th$/, "* อีเมลต้องใช้ @ku.th เท่านั้น"),
  username: yup
    .string()
    .required("* กรุณากรอกชื่อผู้ใช้")
    .matches(/^[a-zA-Z_]+$/, "* ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษ"),
  password: yup
    .string()
    .required("* กรุณากรอกรหัสผ่าน")
    .min(6, "* รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  confirmPassword: yup
    .string()
    .required("* กรุณากรอกยืนยันรหัสผ่าน")
    .oneOf([yup.ref("password")], "* รหัสผ่านไม่ตรงกัน")
    .min(6, "* รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export const requestForm = {
  subjectID: "",
  subjectThai: "",
  subjectEnglish: "",
  credit: "",
  selectedSubject: 0,
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

export const ResetPasswordForm = {
  email: "",
};

export const ResetPasswordFormSchema = yup.object({
  email: yup
    .string()
    .required("* กรุณากรอกอีเมล")
    .email("* รูปแบบอีเมลไม่ถูกต้อง"),
});

export const otpForm = {
  otp: "",
};

export const otpFormSchema = yup.object({
  otp: yup
    .string()
    .typeError("* กรุณากรอกรหัส OTP 6 หลักให้ถูกต้อง")
    .required("* กรุณากรอกรหัส OTP 6 หลัก"),
});

export const PasswordForm = {
  password: "",
  confirmPassword: "",
};

export const PasswordFormSchema = yup.object({
  password: yup
    .string()
    .required("* กรุณากรอกรหัสผ่าน")
    .min(6, "* รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  confirmPassword: yup
    .string()
    .required("* กรุณากรอกรหัสผ่าน")
    .oneOf([yup.ref("password")], "* รหัสผ่านไม่ตรงกัน")
    .min(6, "* รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});
