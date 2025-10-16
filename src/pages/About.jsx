import React from "react";
import team1 from "../assets/logoSt.png"; // replace with actual image paths
import team2 from "../assets/logoSt.png";
import team3 from "../assets/logoSt.png";
import team4 from "../assets/logoSt.png";
import Header from "../components/Header.jsx";


const teamMembers = [
  {
    name: "Asanda T Ndhlela",
    role: "Frontend Developer & Team Leader",
    experience: "2 years Experience",
    bio: "Asanda led the Student Marketplace project, ensuring all components align with the vision and technical standards. Specializes in responsive UI design, React development, and integrating frontend with backend APIs.",
    specialties: ["ReactJS", "UI/UX Design", "Team Coordination"],
    image: team1,
  },
  {
    name: "Nkululeko F Ndlovu",
    role: "Backend Developer",
    experience: "1.5 years Experience",
    bio: "Joe was responsible for developing the backend logic, managing user authentication, and creating secure RESTful APIs using Spring Boot. He ensured data consistency and security throughout the system.",
    specialties: ["Java", "Spring Boot", "Database Management"],
    image: team2,
  },
  {
    name: "Lehlohonolo Mokoena",
    role: "Database Designer",
    experience: "1 year Experience",
    bio: "Lerato focused on designing and normalizing the database schema for efficient data storage. She implemented and optimized SQL queries to ensure smooth application performance.",
    specialties: ["SQLite", "Database Design", "Data Normalization"],
    image: team3,
  },
  {
    name: "Judina M Moleko",
    role: "Full Stack Developer",
    experience: "2 years Experience",
    bio: "Thabo contributed to both frontend and backend development, bridging the gap between user interfaces and server logic. He ensured smooth API communication and robust functionality.",
    specialties: ["React", "Node.js", "API Integration"],
    image: team4,
  },
  {
    name: "Lehlohonolo A Motseneng",
    role: "Full Stack Developer",
    experience: "2 years Experience",
    bio: "Thabo contributed to both frontend and backend development, bridging the gap between user interfaces and server logic. He ensured smooth API communication and robust functionality.",
    specialties: ["React", "Node.js", "API Integration"],
    image: team4,
  },
  {
    name: "Zamandlovu C Ndlovu",
    role: "Full Stack Developer",
    experience: "2 years Experience",
    bio: "Thabo contributed to both frontend and backend development, bridging the gap between user interfaces and server logic. He ensured smooth API communication and robust functionality.",
    specialties: ["React", "Node.js", "API Integration"],
    image: team4,
  },
];

const About = () => {
  return (
    <>
     <Header />
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">Meet Our Development Team</h2>
      <div className="row justify-content-center">
        {teamMembers.map((member, index) => (
          <div key={index} className="col-md-6 col-lg-5 mb-4">
            <div className="card border-0 shadow-sm text-center p-4 rounded-4 h-100">
              <img
                src={member.image}
                alt={member.name}
                className="rounded-circle mx-auto mb-3"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  border: "4px solid #34b0e2",
                }}
              />
              <h4 className="fw-bold">{member.name}</h4>
              <h6 className="text-warning fw-semibold mb-2">
                {member.role}
              </h6>
              <span className="badge bg-light text-dark mb-3">
                {member.experience}
              </span>
              <p className="text-muted small mb-3">{member.bio}</p>

              <h6 className="fw-bold">Specialties:</h6>
              <div className="d-flex justify-content-center flex-wrap gap-2 mt-2">
                {member.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="badge bg-warning-subtle text-dark fw-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default About;
