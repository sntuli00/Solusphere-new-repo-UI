import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CameraIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CloudArrowUpIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setUser(res.data.user);
      } catch (err) {
        alert('Unauthorized or token expired');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    let stream;
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Webcam error:', err);
      }
    };

    if (!user?.face_status) {
      startWebcam();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user?.face_status]);

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Camera not ready yet. Please try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) return alert('Failed to capture image!');
      const url = URL.createObjectURL(blob);
      setCapturedImage({ blob, url });
    }, 'image/jpeg');
  };

  const uploadFace = async () => {
    if (!capturedImage) return alert('Please capture an image first');
    if (user.face_status) return alert('Your face is already uploaded');

    setUploading(true);
    const formData = new FormData();
    formData.append('face', capturedImage.blob, 'face.jpg');

    try {
      const res = await api.post('/upload-face', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert(res.data.message);
      setUser(prev => ({ ...prev, face_status: true, image_url: res.data.image_url }));
      setCapturedImage(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {user.face_status && user.image_url ? (
                <img
                  src={user.image_url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-secondary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent-purple flex items-center justify-center">
                  <UserCircleIcon className="w-16 h-16 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-3">
                  {user.face_status ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-4 h-4" />
                      Face Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <XCircleIcon className="w-4 h-4" />
                      Face Not Captured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Face Capture Card */}
        {!user.face_status && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Set Up Face Recognition
            </h3>
            <p className="text-gray-600 mb-6">
              Capture your face to enable quick and secure face recognition login.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Video Preview */}
              <div>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-white/30 m-4 rounded-lg pointer-events-none"></div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
                
                <button
                  onClick={captureFace}
                  disabled={uploading}
                  className="btn btn-secondary w-full mt-4 flex items-center justify-center gap-2"
                >
                  <CameraIcon className="w-5 h-5" />
                  Capture Face
                </button>
              </div>

              {/* Preview & Upload */}
              <div>
                {capturedImage ? (
                  <>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video mb-4">
                      <img
                        src={capturedImage.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                          Ready to Upload
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={uploadFace}
                      disabled={uploading}
                      className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <CloudArrowUpIcon className="w-5 h-5" />
                      {uploading ? 'Uploading...' : 'Upload Face'}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center p-6">
                      <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        Capture your face using the camera
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-primary to-accent-blue text-white">
            <h4 className="text-sm font-medium opacity-90">Account Status</h4>
            <p className="text-2xl font-bold mt-2">Active</p>
          </div>
          <div className="card bg-gradient-to-br from-secondary to-accent-blue text-white">
            <h4 className="text-sm font-medium opacity-90">Security Level</h4>
            <p className="text-2xl font-bold mt-2">
              {user.face_status ? 'High' : 'Medium'}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-accent-purple to-primary text-white">
            <h4 className="text-sm font-medium opacity-90">Member Since</h4>
            <p className="text-2xl font-bold mt-2">2025</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}