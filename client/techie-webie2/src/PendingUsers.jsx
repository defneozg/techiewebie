import { useState, useEffect } from "react";
import axios from "./axiosConfig.js";
import { Link, useNavigate } from "react-router-dom";

const PendingUsers = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/user/pending"
        );
        console.log(response.data);
        setPendingRegistrations(response.data);
      } catch (error) {
        console.error("Error fetching pending registrations:", error);
      }
    };

    fetchPendingRegistrations();
  }, []);

  const handleApprove = async (username) => {
    try {
      await axios.post(`http://localhost:4000/api/user/approve/${username}`);
      setPendingRegistrations(
        pendingRegistrations.filter((user) => user.username !== username)
      );
    } catch (error) {
      console.error("Error approving registration:", error);
    }
  };

  return (
    <div className="pendingPage">
      <section className="headerPending">
        <h2 className="pendingTitle">Pending Registrations</h2>
        <button className="backButton" onClick={() => navigate("/admin")}>
          Back
        </button>
      </section>
      <ul>
        {pendingRegistrations.map((user) => (
          <li className="listItemAdmin" key={user.username}>
            <div>Last name : {user.lastName}</div>
            <div>First name : {user.firstName}</div>
            <div>Username : {user.username}</div>
            <button
              className="approveButton"
              onClick={() => handleApprove(user.username)}
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingUsers;
