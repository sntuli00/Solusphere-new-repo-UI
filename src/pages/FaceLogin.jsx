import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CameraIcon, 
  ArrowLeftIcon,
  FaceSmileIcon 
} from '@heroicons/react/24/outline';
import api from '../services/api';

export default function FaceLogin() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Cannot access webcam:', err);
        setError('Cannot access camera. Please check permissions.');
      }
    };
    startWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Camera not ready yet. Please try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError('Failed to capture image');
        return;
      }
      setCapturedImage({ blob, url: URL.createObjectURL(blob) });
      setError('');
    }, 'image/jpeg');
  };

  const handleFaceLogin = async () => {
    if (!capturedImage) {
      setError('Please capture your face first');
      return;
    }
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('face', capturedImage.blob, 'face.jpg');

    try {
      const res = await api.post('/auth/face-login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Face not recognized. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent-blue to-accent-purple flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Login
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-accent-purple rounded-full mb-4">
              <FaceSmileIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Face Recognition Login</h2>
            <p className="text-gray-600 mt-2">
              Position your face in the frame and capture your image
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Video Preview */}
            <div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-dashed border-white/30 m-4 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 border-2 border-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <button
                onClick={captureFace}
                disabled={loading}
                className="btn btn-secondary w-full mt-4 flex items-center justify-center gap-2"
              >
                <CameraIcon className="w-5 h-5" />
                Capture Face
              </button>
            </div>

            {/* Preview & Login */}
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
                        Ready to Login
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleFaceLogin}
                    disabled={loading}
                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Authenticating...' : 'Login with Face'}
                  </button>
                  <button
                    onClick={() => setCapturedImage(null)}
                    disabled={loading}
                    className="btn btn-secondary w-full mt-2"
                  >
                    Retake Photo
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center p-6">
                    <FaceSmileIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">
                      No face captured yet
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Click "Capture Face" to take a photo
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for best results:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure good lighting on your face</li>
              <li>• Look directly at the camera</li>
              <li>• Remove glasses or accessories if possible</li>
              <li>• Keep your face centered in the frame</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}