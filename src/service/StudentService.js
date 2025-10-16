import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api";

//create a student when signing up: Sign up
export const captureStudentDetails = (student) => {
  return axios.post(REST_API_BASE_URL + "/student/create", student);
};

//get all student for administrator: Student mangement
export const listRegisteredStudents = () => {
  return axios.get(REST_API_BASE_URL + "/student/getAll");
};

// Login function - authenticate student/admin
export const authenticateUser = (loginData) => {
  return axios.get(REST_API_BASE_URL + "/student/login", { params: loginData });
};

export const getStudentById = () => {
  const studentId = localStorage.getItem("studentId");
  if (studentId) {
    return axios.get(`${REST_API_BASE_URL}/student/read/${studentId}`);
  }

  return Promise.reject(new Error("No student is logged in."));
};

export const updateStudent = (studentId, multipartData) => {
  return axios.patch(
    `${REST_API_BASE_URL}/student/update/${studentId}`,
    multipartData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const deleteStudent = (studentId) => {
  return axios.delete(`${REST_API_BASE_URL}/student/delete/${studentId}`);
};

// Forgot Password - Send OTP
export const sendOtp = (email) => {
  return axios.post(`${REST_API_BASE_URL}/student/forgot-password/send-otp`, null, {
    params: { email },
  });
};

// Forgot Password - Reset Password
export const resetPassword = (email, otp, newPassword) => {
  return axios.post(`${REST_API_BASE_URL}/student/forgot-password/reset`, null, {
    params: { email, otp, newPassword },
  });
};

