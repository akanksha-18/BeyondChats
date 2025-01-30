// // eslint-disable-next-line no-unused-vars
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const OrganizationSetup = () => {
//   const navigate = useNavigate();
//   const [orgData, setOrgData] = useState({
//     companyName: "",
//     websiteUrl: "",
//     description: "",
//   });
//   const [metaDescription, setMetaDescription] = useState("");
//   const [isScrapingComplete, setIsScrapingComplete] = useState(false);
//   const [selectedPage, setSelectedPage] = useState(null);
//   // eslint-disable-next-line no-unused-vars
//   const [pages, setPages] = useState([
//     {
//       id: 1,
//       url: "/home",
//       status: "completed",
//       chunks: ["Welcome to our company", "We provide innovative solutions", "Contact us for more information"]
//     },
//     {
//       id: 2,
//       url: "/about",
//       status: "pending",
//       chunks: []
//     },
//     {
//       id: 3,
//       url: "/products",
//       status: "scraping",
//       chunks: ["Our product lineup", "Featured items"]
//     }
//   ]);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     setOrgData({ ...orgData, [e.target.name]: e.target.value });
//   };

//   // Simulate meta description fetch
//   useEffect(() => {
//     if (orgData.websiteUrl) {
//       // Simulate API call
//       setTimeout(() => {
//         setMetaDescription("Your trusted partner in business solutions. We provide innovative services to help your business grow.");
//       }, 1000);
//     }
//   }, [orgData.websiteUrl]);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Simulate API call
//     setTimeout(() => {
//       setIsScrapingComplete(true);
//     }, 2000);
//   };

//   const handleContinue = () => {
//     navigate("/chatbot-integration");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">Setup Organization</h2>

//       {/* Organization Details Form */}
//       <form onSubmit={handleSubmit} className="mb-8 space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Company Name</label>
//           <input
//             type="text"
//             name="companyName"
//             className="w-full p-2 border rounded"
//             value={orgData.companyName}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Website URL</label>
//           <input
//             type="url"
//             name="websiteUrl"
//             className="w-full p-2 border rounded"
//             value={orgData.websiteUrl}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {metaDescription && (
//           <div className="p-3 bg-gray-50 rounded">
//             <p className="text-sm text-gray-600">
//               <strong>Detected Description:</strong> {metaDescription}
//               <button 
//                 className="ml-2 text-blue-600 hover:text-blue-800"
//                 onClick={() => setOrgData(prev => ({ ...prev, description: metaDescription }))}
//               >
//                 Use this description
//               </button>
//             </p>
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium mb-1">Company Description</label>
//           <textarea
//             name="description"
//             className="w-full p-2 border rounded h-32"
//             value={orgData.description}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <button 
//           type="submit" 
//           className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Start Website Scanning
//         </button>
//       </form>

//       {/* Website Scraping Status */}
//       <div className="mt-8 border rounded-lg p-6 bg-white shadow-sm">
//         <h3 className="text-xl font-semibold mb-4">Website Scanning Progress</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Pages List */}
//           <div className="border rounded-lg p-4">
//             <h4 className="font-medium mb-4">Detected Pages</h4>
//             <div className="space-y-2">
//               {pages.map((page) => (
//                 <div
//                   key={page.id}
//                   onClick={() => setSelectedPage(page)}
//                   className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 
//                     ${selectedPage?.id === page.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border'}
//                   `}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="truncate">{page.url}</span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium
//                       ${page.status === 'completed' ? 'bg-green-100 text-green-800' : 
//                         page.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                         'bg-blue-100 text-blue-800'}
//                     `}>
//                       {page.status}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Content Preview */}
//           <div className="border rounded-lg p-4">
//             <h4 className="font-medium mb-4">
//               {selectedPage ? `Content from ${selectedPage.url}` : 'Select a page to view content'}
//             </h4>
//             {selectedPage ? (
//               <div className="space-y-2">
//                 {selectedPage.chunks.map((chunk, idx) => (
//                   <div key={idx} className="p-3 bg-gray-50 rounded-lg">
//                     {chunk}
//                   </div>
//                 ))}
//                 {selectedPage.chunks.length === 0 && (
//                   <p className="text-gray-500">No content available yet</p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-gray-500">Click on a page to view its content</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Continue Button */}
//       <div className="mt-8 flex justify-between items-center">
//         <p className="text-sm text-gray-600">
//           {isScrapingComplete ? 
//             "Website scanning complete! You can proceed to chatbot setup." : 
//             "You can proceed to the next step while we continue scanning your website."}
//         </p>
//         <button
//           onClick={handleContinue}
//           className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//         >
//           Continue to Chatbot Setup
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrganizationSetup;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import './organizationsetup.css'; 

const OrganizationSetup = () => {
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState({
    companyName: "",
    websiteUrl: "",
    description: "",
  });
  const [metaDescription, setMetaDescription] = useState("");
  const [isScrapingComplete, setIsScrapingComplete] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pages, setPages] = useState([
    {
      id: 1,
      url: "/home",
      status: "completed",
      chunks: ["Welcome to our company", "We provide innovative solutions", "Contact us for more information"]
    },
    {
      id: 2,
      url: "/about",
      status: "pending",
      chunks: []
    },
    {
      id: 3,
      url: "/products",
      status: "scraping",
      chunks: ["Our product lineup", "Featured items"]
    }
  ]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setOrgData({ ...orgData, [e.target.name]: e.target.value });
  };

  // Simulate meta description fetch
  useEffect(() => {
    if (orgData.websiteUrl) {
      setTimeout(() => {
        setMetaDescription("Your trusted partner in business solutions. We provide innovative services to help your business grow.");
      }, 1000);
    }
  }, [orgData.websiteUrl]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeout(() => {
      setIsScrapingComplete(true);
    }, 2000);
  };

  const handleContinue = () => {
    navigate("/chatbot-integration");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/register");
  };

  // Function to generate bubbles
  const generateBubbles = () => {
    const bubbleCount = 20; // Number of bubbles to create
    const bubblesContainer = document.querySelector('.bubbles-background');
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      // Random size and position
      const size = Math.random() * 30 + 10; // Size between 10px and 40px
      const positionX = Math.random() * 100; // Random horizontal position
      const animationDuration = Math.random() * 5 + 5; // Random animation duration between 5s and 10s
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${positionX}%`;
      bubble.style.animationDuration = `${animationDuration}s`;
      bubblesContainer.appendChild(bubble);
    }
  };

  // Generate bubbles on component mount
  useEffect(() => {
    generateBubbles();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Animation */}
      <div className="bubbles-background">
        {/* Bubbles will be created dynamically in JS */}
      </div>

      <div className="max-w-4xl mx-auto p-6 relative z-10">
        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors sm:px-6 sm:py-3 md:px-8 md:py-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Logout
        </motion.button>

        <motion.h2
          className="text-3xl font-bold mb-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Setup Organization
        </motion.h2>

        {/* Organization Details Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-sm font-medium mb-1 text-white">Company Name</label>
            <input
              type="text"
              name="companyName"
              className="w-full p-2 border rounded bg-gray-800 text-white"
              value={orgData.companyName}
              onChange={handleInputChange}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-sm font-medium mb-1 text-white">Website URL</label>
            <input
              type="url"
              name="websiteUrl"
              className="w-full p-2 border rounded bg-gray-800 text-white"
              value={orgData.websiteUrl}
              onChange={handleInputChange}
              required
            />
          </motion.div>

          {metaDescription && (
            <motion.div
              className="p-3 bg-gray-700 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-gray-300">
                <strong>Detected Description:</strong> {metaDescription}
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setOrgData(prev => ({ ...prev, description: metaDescription }))}>
                  Use this description
                </button>
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-sm font-medium mb-1 text-white">Company Description</label>
            <textarea
              name="description"
              className="w-full p-2 border rounded bg-gray-800 text-white h-32"
              value={orgData.description}
              onChange={handleInputChange}
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Website Scanning
          </motion.button>
        </form>

        {/* Website Scraping Status */}
        <motion.div
          className="mt-8 border rounded-lg p-6 bg-white shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-xl font-semibold mb-4">Website Scanning Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pages List */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Detected Pages</h4>
              <div className="space-y-2">
                {pages.map((page) => (
                  <motion.div
                    key={page.id}
                    onClick={() => setSelectedPage(page)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 
                      ${selectedPage?.id === page.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{page.url}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${page.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          page.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>{page.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Content Preview */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">
                {selectedPage ? `Content from ${selectedPage.url}` : 'Select a page to view content'}
              </h4>
              {selectedPage ? (
                <div className="space-y-2">
                  {selectedPage.chunks.map((chunk, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      {chunk}
                    </div>
                  ))}
                  {selectedPage.chunks.length === 0 && (
                    <p className="text-gray-500">No content available yet</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Click on a page to view its content</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          className="mt-8 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-sm text-gray-600">
            {isScrapingComplete ? 
              "Website scanning complete! You can proceed to chatbot setup." : 
              "You can proceed to the next step while we continue scanning your website."}
          </p>
          <motion.button
            onClick={handleContinue}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Continue to Chatbot Setup
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizationSetup;

