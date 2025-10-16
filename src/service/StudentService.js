import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8181/api";

//create a student when signing up: Sign up
export const captureStudentDetails = (student) => {
  return axios.post(REST_API_BASE_URL + "/auth/register/student", student);
};

//get all student for administrator: Student mangement
export const listRegisteredStudents = () => {
  const token = localStorage.getItem("token");
  return axios.get(REST_API_BASE_URL + "/student/getAll", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Login function - authenticate student/admin
export const authenticateUser = (loginData) => {
  return axios.post(REST_API_BASE_URL + "/auth/login", loginData);
};

export const getStudentById = () => {
  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");
  if (studentId) {
    return axios.get(`${REST_API_BASE_URL}/student/read/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return Promise.reject(new Error("No student is logged in."));
};

export const updateStudent = (studentId, multipartData) => {
  const token = localStorage.getItem("token");
  return axios.patch(
    `${REST_API_BASE_URL}/student/update/${studentId}`,
    multipartData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteStudent = (studentId) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${REST_API_BASE_URL}/student/delete/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
