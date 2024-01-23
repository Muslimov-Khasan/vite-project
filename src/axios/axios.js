import axios from "axios";

const url = "http://188.225.10.97:8080/api/";

export default axios.create({
  baseURL: url,
  headers: {
    "Content-type": "application/json",
  },
});
