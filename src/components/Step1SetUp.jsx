import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import InterviewLoading from "./InterviewLoading";
import { ServerUrl } from "../App.jsx";
import { useNavigate } from "react-router-dom";

import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaArrowLeft,
} from "react-icons/fa";
import { useState } from "react";

//const serverUrl = import.meta.env.VITE_SERVER_URL;// yahan kuch karna hai

const Step1SetUp = ({ onStart }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical"); 
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formData,
        { withCredentials: true },
      );
      
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);

      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      // NEW: Added jobDescription in the payload sent to backend
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        {
          role,
          experience,
          mode,
          jobDescription,
          resumeText,
          projects,
          skills,
        },
        { withCredentials: true },
      );

      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }

      setLoading(false);
      onStart(result.data);
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  // NEW: Functions to remove extra skills or projects extracted by AI
  const removeSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  const removeProject = (indexToRemove) => {
    setProjects(projects.filter((_, index) => index !== indexToRemove));
  };

  if (loading) {
    return <InterviewLoading />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 dark:from-gray-950 dark:to-gray-900 py-10"
    >
      <div className="w-full max-w-2xl h-[500px] bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden  dark:bg-gray-900">
        {/* LEFT SECTION (Information) */}
        <div
          className="relative bg-gradient-to-br from-green-100 to-green-300 p-4 flex flex-col justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-700 hover:text-green-800 transition font-medium bg-white/50 hover:bg-white/80 px-4 py-2 rounded-full shadow-sm"
          >
            <FaArrowLeft /> Back
          </button>

          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your AI Interview
          </h2>

          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence
          </p>

          <div className="space-y-5">
            {[
              {
                icon: <FaUserTie className="text-green-600 text-xl" />,
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
                text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine className="text-green-600 text-xl" />,
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <div
                key={index}   // yahan change kara hai ye line add kari hai
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer"
              >
                {item.icon}
                <span className="text-gray-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION (Form) */}
        <div
          className="p-9 bg-white dark:bg-gray-900 h-full max-h-[85vh] overflow-y-auto custom-scrollbar"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 dark:text-white">
            Interview SetUp
          </h2>

          <div className="space-y-4">
            {/* Role Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Role
              </label>
              <FaUserTie className="absolute top-10 left-4 text-gray-400 dark:text-white" />
              <input
                type="text"
                placeholder="e.g. Software Developer"
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition  dark:border-gray-700 dark:bg-gray-700 dark:text-white text-semibold"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            {/* Experience Dropdown (Replaced Text Input) */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience Level
              </label>
              <FaBriefcase className="absolute top-10 left-4 text-gray-400 dark:text-white z-10" />
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full pl-12 py-2 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition dark:border-gray-700 dark:bg-gray-700 dark:text-white text-semibold appearance-none relative"
              >
                <option value="" disabled>
                  Select Experience
                </option>
                <option value="Fresher (0 years)">Fresher (0 years)</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            {/* Mode Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interview Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full py-2 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition dark:border-gray-700 dark:bg-gray-700 dark:text-white text-semibold"
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR Interview</option>
              </select>
            </div>


            {/* Resume Upload Section */}
            {!analysisDone && (
              <div
                onClick={() => {
                  document.getElementById("resumeUpload").click();
                }}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl p-2 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition mt-2"
              >
                <FaFileUpload className="text-2xl mx-auto text-green-600 mb-1" />

                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />

                <p className="text-gray-600 font-medium dark:text-white">
                  {resumeFile
                    ? resumeFile.name
                    : "click to upload resume (optional)"}
                </p>

                {resumeFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="mt-1 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition dark:hover:bg-gray-600"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </button>
                )}
              </div>
            )}

            {/* Editable Resume Analysis Result */}
            {analysisDone && (
              <div
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Resume Analysis
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Remove items AI shouldn't ask
                  </span>
                </div>

                {projects.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-200 mb-2 text-sm">
                      Projects:
                    </p>
                    <ul className="space-y-2 text-sm">
                      {projects.map((p, i) => (
                        <li
                          key={i}
                          className="flex justify-between items-start bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-2.5 rounded-lg text-gray-700 dark:text-gray-300"
                        >
                          <span className="pr-4">{p}</span>
                          <button
                            onClick={() => removeProject(i)}
                            className="text-gray-400 hover:text-red-500 transition font-bold text-lg leading-none"
                            title="Remove Project"
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-200 mb-2 text-sm mt-4">
                      Skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-2 bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm"
                        >
                          {s}
                          <button
                            onClick={() => removeSkill(i)}
                            className="text-green-600 hover:text-red-500 dark:text-green-400 dark:hover:text-red-400 font-bold text-lg leading-none"
                            title="Remove Skill"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => handleStart()}
              disabled={!role || !experience || loading}
              className="w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-4 rounded-full text-lg font-semibold transition duration-300 shadow-md mt-4"
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1SetUp;
