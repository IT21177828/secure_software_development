import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa"; // Import icons
const backendUrl = process.env.REACT_APP_BACKEND_URL;
export default function Registration() {
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [passwordHash, setPassword] = useState("");
  const [cnfirmPassword, setCnfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const google = () => {
    window.open(`${backendUrl}/auth/google`, "_self");
  };

  const github = () => {
    window.open(`${backendUrl}/auth/github`, "_self");
  };

  const facebook = () => {
    window.open(`${backendUrl}/auth/facebook`, "_self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    if (passwordHash !== cnfirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      console.log("heeee" + gender);
      const response = await axios.post(`${backendUrl}/user`, {
        firstName,
        lastName,
        email,
        passwordHash,
        gender,
        age,
        address,
      });
      console.log(response);
      navigate("/login");
    } catch (error) {
      setError(error.response.data);
      console.log(error);
    }
  };

  return (
    <div className=" w-full h-full bg-white rounded-md overflow-auto">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register Here
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-row place-content-between">
              <div>
                <label
                  htmlFor="fname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    autoComplete="first name"
                    required
                    onChange={(e) => setFname(e.target.value)}
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    autoComplete="last name"
                    onChange={(e) => setLname(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row place-content-between">
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Gender
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    required
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-40 rounded-md border-0 px-1.5 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 max-sm:w-32 sm:text-sm sm:leading-6"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="Age"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Age
                </label>
                <div className="mt-2">
                  <input
                    id="Age"
                    name="Age"
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    required
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="cnfirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="cnfirmPassword"
                  name="cnfirmPassword"
                  type="password"
                  onChange={(e) => setCnfirmPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address{" "}
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="current-address"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <span className="text-red-600">{error}</span>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-1.5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <hr className="w-full border-gray-300" />
              <span className="mx-2 text-gray-500">OR</span>
              <hr className="w-full border-gray-300" />
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={google}
                className="flex w-full justify-center items-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600"
              >
                <FaGoogle className="mr-2" /> Register with Google
              </button>
              <button
                onClick={github}
                className="flex w-full justify-center items-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-900"
              >
                <FaGithub className="mr-2" /> Register with GitHub
              </button>
              <button
                onClick={facebook}
                className="flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700"
              >
                <FaFacebook className="mr-2" /> Register with Facebook
              </button>
            </div>
            <p className="mt-10 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href=""
                className="font-semibold pl-2 leading-6 text-indigo-600 hover:text-indigo-500"
                onClick={() => navigate("/login")}
              >
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
