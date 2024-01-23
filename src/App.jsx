import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Monitoring from "./components/Monitoring/Monitoring";
import AddCategory from "./components/addcategory/addcategory";
import Category from "./components/category/category";
import Header from "./components/Header/Header";
import News from "./components/News/News";
import Users from "./components/users/users";
import Moderator from "./components/Moderator/Moderator";
import Banner from "./components/Banner/Banner";
import Contact from "./components/Contact/Contact";
import FAQ from "./components/FAQ/FAQ";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Monitoring" element={<Monitoring />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/category" element={<Category />} />
        <Route path="/adminAdd" element={<Header />} />
        <Route path="/news" element={<News />} />
        <Route path="/users" element={<Users />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/Moderator" element={<Moderator />} />
        <Route path="/image-upload" element={<Banner />} />
        <Route path="/Contact" element={<Contact/>} />
      </Routes>
    </div>
  );
}

export default App;