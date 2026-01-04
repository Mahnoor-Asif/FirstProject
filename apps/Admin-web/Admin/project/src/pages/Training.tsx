// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Play, Upload, X, Trash2 } from 'lucide-react';
// import SuccessModal from '../components/ui/SuccessModal';
// import ConfirmModal from '../components/ui/ConfirmModal';

// const Training: React.FC = () => {
//   const [trainingVideos, setTrainingVideos] = useState<any[]>([]);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [deletingVideo, setDeletingVideo] = useState<any>(null);
//   const [newVideo, setNewVideo] = useState({ 
//     title: '', description: '', category: '', duration: '', mandatory: false 
//   });

//   // ✅ Fetch all training videos from backend
//   useEffect(() => {
//     const fetchTrainings = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/api/training");
//         setTrainingVideos(response.data);
//       } catch (err) {
//         console.error("Failed to load training videos:", err);
//       }
//     };
//     fetchTrainings();
//   }, []);

//   // ✅ Upload new training video
//   const handleUploadVideo = async () => {
//     if (!newVideo.title || !newVideo.description) return alert("All fields required!");

//     try {
//       const response = await axios.post("http://localhost:5001/api/training", newVideo);
//       setTrainingVideos([...trainingVideos, response.data.training]);
//       setNewVideo({ title: '', description: '', category: '', duration: '', mandatory: false });
//       setShowUploadModal(false);
//       setSuccessMessage("Video uploaded successfully!");
//       setShowSuccessModal(true);
//     } catch (err) {
//       console.error("Failed to upload video:", err);
//       alert("Failed to upload video. Try again.");
//     }
//   };

//   // ✅ Delete video
//   const confirmDeleteVideo = async () => {
//     try {
//       await axios.delete(`http://localhost:5001/api/training/${deletingVideo._id}`);
//       setTrainingVideos(trainingVideos.filter(v => v._id !== deletingVideo._id));
//       setSuccessMessage("Video deleted successfully!");
//       setShowDeleteModal(false);
//       setShowSuccessModal(true);
//     } catch (err) {
//       console.error("Failed to delete video:", err);
//       alert("Failed to delete video. Try again.");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Training Videos</h1>
//         <button 
//           onClick={() => setShowUploadModal(true)}
//           className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
//           style={{ backgroundColor: '#05f51d' }}
//         >
//           <Upload className="w-4 h-4" />
//           <span>Upload New Video</span>
//         </button>
//       </div>

//       {/* Training List */}
//       <div className="space-y-4">
//         {trainingVideos.map((video) => (
//           <div key={video._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-semibold" style={{ color: '#19034d' }}>{video.title}</h3>
//               <p className="text-gray-600">{video.description}</p>
//               <p className="text-sm text-gray-500">{video.category} | {video.duration}</p>
//             </div>
//             <button 
//               onClick={() => { setDeletingVideo(video); setShowDeleteModal(true); }}
//               className="text-red-500 hover:text-red-700"
//             >
//               <Trash2 className="w-5 h-5" />
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold" style={{ color: '#19034d' }}>Upload New Training Video</h3>
//               <button onClick={() => setShowUploadModal(false)}>
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <input type="text" placeholder="Title" className="w-full border p-2 rounded mb-2"
//               value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} />
//             <textarea placeholder="Description" className="w-full border p-2 rounded mb-2"
//               value={newVideo.description} onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })} />
//             <input type="text" placeholder="Category" className="w-full border p-2 rounded mb-2"
//               value={newVideo.category} onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })} />
//             <input type="text" placeholder="Duration" className="w-full border p-2 rounded mb-2"
//               value={newVideo.duration} onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })} />

//             <button onClick={handleUploadVideo} className="w-full text-white py-2 rounded" style={{ backgroundColor: '#05f51d' }}>
//               Upload
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Success + Delete Modals */}
//       {showSuccessModal && (
//         <SuccessModal
//           isOpen={showSuccessModal}
//           onClose={() => setShowSuccessModal(false)}
//           title="Success"
//           message={successMessage}
//         />
//       )}

//       {showDeleteModal && deletingVideo && (
//         <ConfirmModal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           title="Delete Video"
//           message={`Are you sure you want to delete "${deletingVideo.title}"?`}
//           onConfirm={confirmDeleteVideo}
//         />
//       )}
//     </div>
//   );
// };

// export default Training;







import React, { useState } from 'react';
import { Play, Upload, Eye, BarChart3, X, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import SuccessModal from '../components/ui/SuccessModal';

const Training: React.FC = () => {
  const [trainingVideos, setTrainingVideos] = useState([
    {
      id: 1,
      title: 'Platform Introduction & Safety Guidelines',
      description: 'Essential orientation for new service providers',
      duration: '15 minutes',
      category: 'Onboarding',
      mandatory: true,
      completionRate: 87,
      totalViews: 1089,
      uploadDate: '2024-11-15'
    },
    {
      id: 2,
      title: 'Professional Communication Standards',
      description: 'How to communicate effectively with service seekers',
      duration: '12 minutes',
      category: 'Communication',
      mandatory: true,
      completionRate: 76,
      totalViews: 945,
      uploadDate: '2024-11-20'
    },
    {
      id: 3,
      title: 'Emergency Procedures & Safety Protocols',
      description: 'What to do in emergency situations',
      duration: '18 minutes',
      category: 'Safety',
      mandatory: true,
      completionRate: 92,
      totalViews: 1156,
      uploadDate: '2024-12-01'
    },
  ]);

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [newVideo, setNewVideo] = useState({ title: '', description: '', category: '', duration: '', mandatory: false });

  const handlePreview = (video: any) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleUploadVideo = () => {
    if (newVideo.title && newVideo.description) {
      setTrainingVideos([...trainingVideos, {
        id: Date.now(),
        ...newVideo,
        completionRate: 0,
        totalViews: 0,
        uploadDate: new Date().toISOString().split('T')[0]
      }]);
      setNewVideo({ title: '', description: '', category: '', duration: '', mandatory: false });
      setShowUploadModal(false);
      setSuccessMessage('Video uploaded successfully!');
      setShowSuccessModal(true);
    }
  };

  const handleDeleteVideo = (videoId: number) => {
    const video = trainingVideos.find(v => v.id === videoId);
    setDeletingVideo(video);
    setShowDeleteModal(true);
  };

  const confirmDeleteVideo = () => {
    setTrainingVideos(trainingVideos.filter(v => v.id !== deletingVideo.id));
    setSuccessMessage('Video deleted successfully!');
    setShowDeleteModal(false);
    setShowSuccessModal(true);
    setDeletingVideo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Training Videos</h1>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" 
          style={{ backgroundColor: '#05f51d' }}
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Video</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Training Videos</p>
          <p className="text-3xl font-bold" style={{ color: '#19034d' }}>{trainingVideos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Avg Completion Rate</p>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(trainingVideos.reduce((acc, v) => acc + v.completionRate, 0) / trainingVideos.length)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-3xl font-bold text-blue-600">
            {trainingVideos.reduce((acc, v) => acc + v.totalViews, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Training Videos */}
      <div className="space-y-4">
        {trainingVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold" style={{ color: '#19034d' }}>{video.title}</h3>
                  {video.mandatory && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      Mandatory
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{video.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>⏱️ {video.duration}</span>
                  <span>📁 {video.category}</span>
                  <span>👁️ {video.totalViews.toLocaleString()} views</span>
                </div>
              </div>

              <div className="lg:w-48 space-y-3">
                <button 
                  onClick={() => handlePreview(video)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button 
                  onClick={() => handleDeleteVideo(video.id)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Preview Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>{selectedVideo.title}</h3>
              <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p>Video Preview</p>
                  <p className="text-sm opacity-75">{selectedVideo.duration}</p>
                </div>
              </div>
              <p className="text-gray-600">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Video Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>Upload New Training Video</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                  placeholder="Enter video title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                  placeholder="Enter video description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newVideo.category}
                    onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                  >
                    <option value="">Select category</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Safety">Safety</option>
                    <option value="Communication">Communication</option>
                    <option value="Skills">Skills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo({...newVideo, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                    placeholder="e.g., 15 minutes"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newVideo.mandatory}
                  onChange={(e) => setNewVideo({...newVideo, mandatory: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label className="text-sm text-gray-700">Mandatory for all providers</label>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click to upload video file or drag and drop</p>
                <p className="text-sm text-gray-500">MP4, MOV up to 500MB</p>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUploadVideo}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: '#05f51d' }}
                >
                  Upload Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Success"
          message={successMessage}
        />
      )}

      {/* Confirm Delete Modal */}
      {showDeleteModal && deletingVideo && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Video"
          message={`Are you sure you want to delete "${deletingVideo.title}"?`}
          onConfirm={confirmDeleteVideo}
        />
      )}
    </div>
  );
};

export default Training;
