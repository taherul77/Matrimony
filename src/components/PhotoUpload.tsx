"use client";
import React, { useState, useEffect } from 'react';
import { FiCamera, FiX, FiUpload, FiLock } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useBusinessLogic } from '@/hooks/useBusinessLogic';

interface PhotoUploadProps {
  currentUserId: string;
  existingPhotos: string[];
  onPhotosUpdate?: (photos: string[]) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  currentUserId, 
  existingPhotos = [], 
  onPhotosUpdate 
}) => {
  const { permissions, usage, checkAction } = useBusinessLogic(currentUserId);
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setPhotos(existingPhotos);
  }, [existingPhotos]);

  const handleFileUpload = async (file: File) => {
    if (!permissions || !usage) return;

    // Check photo limit
    const canUpload = await checkAction('upload_photo');
    if (!canUpload.allowed) {
      alert(canUpload.message || 'Photo upload limit reached');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', currentUserId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newPhotos = [...photos, data.url];
        setPhotos(newPhotos);
        onPhotosUpdate?.(newPhotos);
      } else {
        const error = await response.json();
        alert(error.error || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removePhoto = async (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosUpdate?.(newPhotos);

    // TODO: Call API to update user profile photos
  };

  if (!permissions || !usage) {
    return <div className="animate-pulse bg-gray-200 h-40 rounded"></div>;
  }

  const { photos: photoUsage } = usage;
  const canUploadMore = photoUsage.limit === -1 || photos.length < photoUsage.limit;
  const remainingUploads = photoUsage.limit === -1 ? '∞' : photoUsage.limit - photos.length;

  return (
    <div className="space-y-4">
      {/* Package Info */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">Profile Photos</h3>
        <div className="text-sm">
          <span className={`font-medium ${canUploadMore ? 'text-green-600' : 'text-red-600'}`}>
            {photos.length}/{photoUsage.limit === -1 ? '∞' : photoUsage.limit}
          </span>
          <span className="text-gray-500 ml-1">photos</span>
        </div>
      </div>

      {/* Package-specific messaging */}
      {photoUsage.limit === 2 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            📸 Free Package: Upload up to 2 photos
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Upgrade to Silver (5 photos) or Gold (unlimited) for more
          </p>
        </div>
      )}

      {photoUsage.limit === 5 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            📸 Silver Package: Upload up to 5 photos
          </p>
          <p className="text-xs text-green-600 mt-1">
            Upgrade to Gold for unlimited photo uploads
          </p>
        </div>
      )}

      {photoUsage.limit === -1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center">
            <HiSparkles className="w-4 h-4 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              Gold+ Package: Unlimited photo uploads
            </p>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {canUploadMore && (
          <div
            className={`border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragOver 
                ? 'border-pink-400 bg-pink-50' 
                : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            {uploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Uploading...</p>
              </div>
            ) : (
              <div className="text-center">
                <FiCamera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Add Photo</p>
                <p className="text-xs text-gray-500">{remainingUploads} left</p>
              </div>
            )}
          </div>
        )}

        {/* Limit Reached */}
        {!canUploadMore && (
          <div className="border-2 border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center bg-gray-50">
            <FiLock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Limit Reached</p>
            <button 
              onClick={() => window.location.href = '/packages'}
              className="text-xs bg-pink-600 text-white px-2 py-1 rounded mt-1 hover:bg-pink-700"
            >
              Upgrade
            </button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default PhotoUpload;
