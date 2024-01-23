import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Header.css";
import Nav from "../Nav/Nav";
import Edit from "../../Assets/img/edit.png";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [showButtons, setShowButtons] = useState(null);
  const [error, setError] = useState(null);

  const [newAdmin, setNewAdmin] = useState({
    fullName: "",
    phone: "",
    password: "",
    role: "ROLE_ADMIN",
  });

  const [modifiedAdmin, setModifiedAdmin] = useState({
    fullName: "",
    phone: "",
    password: "",
    role: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDataAll();
  }, []);

  const fetchDataAll = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        "https://avtowatt.uz/api/v1/admin/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setAdminData(data);
    } catch (error) {
      console.log("Error fetching admin data:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `https://avtowatt.uz/api/v1/admin/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(newAdmin),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setAdminData((prevAdminData) => [...prevAdminData, responseData]);
        setNewAdmin({
          fullName: "",
          phone: "",
          role: "",
        });
        closeModal();
        fetchDataAll();
      } else {
        // Handle non-successful response
        console.error("Error creating admin:", response.statusText);
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error creating admin:", error);
    }
  };
  const handleThreeDotClick = (adminId) => {
    setShowButtons((prevShowButtons) =>
      prevShowButtons === adminId ? null : adminId
    );
  };

  const handleDelete = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `https://avtowatt.uz/api/v1/admin/${showButtons}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  
      setAdminData((prevAdminData) =>
        prevAdminData.filter((admin) => admin.id !== showButtons)
      );
  
    setShowButtons(null);
  };
  
  const handleModify = async () => {
    setIsEditModalOpen(true);
    if (showButtons === null) {
      return;
    }
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `https://avtowatt.uz/api/v1/admin/${showButtons}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const adminDetails = await response.json();
      setModifiedAdmin(adminDetails);
      setShowButtons(null); // Close the three-dot container
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };  

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `https://avtowatt.uz/api/v1/admin/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifiedAdmin),
        }
      );

      if (response.ok) {
        setAdminData((prevAdminData) =>
          prevAdminData.map((admin) =>
            admin.id === showButtons ? { ...admin, ...modifiedAdmin } : admin
          )
        );
        setShowButtons(null);
        setIsEditModalOpen(false);
        setModifiedAdmin({
          fullName: "",
          phone: "",
          password: "",
        });

        // Fetch the latest data after updating an existing admin
        fetchDataAll();
      } else {
        // Handle non-successful response
        console.error("Error updating admin:", response.statusText);
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error updating admin:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setNewAdmin({
      fullName: "",
      phone: "",
      password: "",
      role: "",
    });
  };

  Modal.setAppElement("#root");

  return (
    <>
      <header className="header">
        <div className="container">
          <Nav />
          <div className="box">
            <h1 className="header-title">Admin qo’shish</h1>
            <button className="modal-btn" onClick={openModal}>
              +
            </button>
          </div>
          {adminData.length === 0 && (
            <p className="loading-text">Yuklanmoqda...</p>
          )}

          <Modal
            isOpen={isModalOpen}
            className="react-modal-content"
            overlayClassName="react-modal-overlay"
            onRequestClose={closeModal}
          >
            <div className="modal-content">
              <div className="modal-header">
                <button className="admin-btn" onClick={closeModal}>
                  &#10006;
                </button>
                <h2 className="modal-title">Admin qo’shish</h2>
                <form className="modal-form" onSubmit={handleFormSubmit}>
                  <label htmlFor="adminName">To'liq ism Sharif</label>
                  <input
                    type="text"
                    className="input-name"
                    id="adminName"
                    name="fullName"
                    placeholder="To'liq ism Sharif"
                    autoComplete="off"
                    value={newAdmin.fullName}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, fullName: e.target.value })
                    }
                  />
                  <label htmlFor="adminName">Parol</label>

                  <input
                    className="input-name"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Parol"
                    autoComplete="off"
                    value={newAdmin.password}
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      setNewAdmin((prevAdmin) => ({
                        ...prevAdmin,
                        password: newPassword,
                      }));
                      if (newPassword.length < 4 || newPassword.length > 8) {
                        setError(
                          "Parol 4 dan 8 tagacha belgidan iborat bo'lishi kerak"
                        );
                      } else {
                        setError("");
                      }
                    }}
                  />
                    {error && <p className="error-message">{error}</p>}

                  <label htmlFor="phone">Telefon raqami</label>
                  <input
                    className="phoneNumber"
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="off"
                    placeholder="+998"
                    value={newAdmin.phone || "+998"}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, phone: e.target.value })
                    }
                  />
                  <label htmlFor="role">Rol</label>
                  <select
                    className="select-role"
                    id="role"
                    name="role"
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, role: e.target.value })
                    }
                  >
                    <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                    <option value="ROLE_MODERATOR">ROLE_MODERATOR</option>
                  </select>
                  <button className="save-btn" type="submit">
                    Saqlash
                  </button>
                </form>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={isEditModalOpen}
            className="react-modal-content"
            overlayClassName="react-modal-overlay"
            onRequestClose={closeModal}
          >
            <div className="modal-content">
              <div className="modal-header">
                <button className="editd-btn" onClick={closeModal}>
                  &#10006;
                </button>
                <h2 className="modal-title">Admin tahrirlash</h2>
                <form className="modal-form" onSubmit={handleEditFormSubmit}>
                  <label htmlFor="editedAdminName">To'liq ism Sharif</label>
                  <input
                    type="text"
                    className="input-name"
                    id="editedAdminName"
                    name="fullName"
                    placeholder="To'liq ism Sharif"
                    autoComplete="off"
                    value={modifiedAdmin.fullName}
                    onChange={(e) =>
                      setModifiedAdmin({
                        ...modifiedAdmin,
                        fullName: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="editedPassword">Parol</label>
                  <input
                    className="input-name"
                    type="password"
                    id="editedPassword" // Corrected id here
                    name="password"
                    autoComplete="off"
                    placeholder="password"
                    value={modifiedAdmin.password}
                    onChange={(e) =>
                      setModifiedAdmin({
                        ...modifiedAdmin,
                        password: e.target.value,
                      })
                    }
                  />

                  <label htmlFor="editedPhone">Telefon raqami</label>
                  <input
                    className="phoneNumber"
                    type="tel"
                    id="editedPhone"
                    name="phone"
                    autoComplete="off"
                    placeholder="+998"
                    value={modifiedAdmin.phone}
                    onChange={(e) =>
                      setModifiedAdmin({
                        ...modifiedAdmin,
                        phone: e.target.value,
                      })
                    }
                  />

                  <button className="save-btn" type="submit">
                    Saqlash
                  </button>
                </form>
              </div>
            </div>
          </Modal>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>To'liq ism Sharif</th>
                <th>Telefon raqami</th>
                <th>Rol</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {adminData.map((admin, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{admin.fullName}</td>
                  <td>{admin.phone}</td>
                  <td>{admin.role}</td>
                  <td>
                    <div className="three-dot-container">
                      <button
                        className="three-dot"
                        onClick={() => handleThreeDotClick(admin.id)}
                      >
                        &#8942;
                      </button>
                      {showButtons === admin.id && (
                        <div className="buttons-container">
                          <button
                            className="admin-delete"
                            onClick={handleDelete}
                          >
                            <img
                              src={Trush_Icon}
                              alt="Trush Icon"
                              width={20}
                              height={20}
                            />
                            O’chirish
                          </button>
                          <button className="admin-edit" onClick={handleModify}>
                            <img src={Edit} alt="Edit" width={25} height={25} />
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </>
  );
};

export default Header;