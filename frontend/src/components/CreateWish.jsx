import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { mockRelationships, mockColorSchemes } from '../mock';
import { useToast } from '../hooks/use-toast';
import { api } from '../services/api';

const CreateWish = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    personName: '',
    relationship: '',
    photos: [],
    message: '',
    customNoTexts: ['No way!', 'Not happening!', 'Try harder!', 'Nope!', 'Maybe not!']
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const colorScheme = formData.relationship ? mockColorSchemes[formData.relationship] : mockColorSchemes.friend;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
      
      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: "Please upload only images or videos",
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: "Files must be less than 50MB",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (formData.photos.length + validFiles.length > 15) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 15 photos/videos",
        variant: "destructive"
      });
      return;
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      const response = await api.uploadFiles(validFiles);
      const uploadedMedia = response.data.files;
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedMedia]
      }));
      
      setUploadedFiles(prev => [...prev, ...validFiles]);
      
      toast({
        title: "Files uploaded!",
        description: `Successfully uploaded ${uploadedMedia.length} file(s)`,
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.response?.data?.detail || "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const generateMessage = async () => {
    if (!formData.personName || !formData.relationship) {
      toast({
        title: "Missing information",
        description: "Please enter the person's name and select your relationship",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await api.generateMessage(formData.personName, formData.relationship);
      
      setFormData(prev => ({
        ...prev,
        message: response.data.message
      }));
      
      toast({
        title: "Message generated!",
        description: "Your personalized birthday message is ready. Feel free to edit it!",
      });
      
    } catch (error) {
      console.error('Message generation error:', error);
      toast({
        title: "Generation failed",
        description: error.response?.data?.detail || "Failed to generate message",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomNoTextChange = (index, value) => {
    const newTexts = [...formData.customNoTexts];
    newTexts[index] = value;
    setFormData(prev => ({
      ...prev,
      customNoTexts: newTexts
    }));
  };

  const createWish = async () => {
    if (!formData.personName || !formData.relationship || !formData.message) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const response = await api.createWish(formData);
      const createdWish = response.data;
      
      toast({
        title: "Wish created!",
        description: "Your birthday wish has been created successfully!",
      });

      navigate(`/preview/${createdWish.id}`);
      
    } catch (error) {
      console.error('Create wish error:', error);
      toast({
        title: "Creation failed",
        description: error.response?.data?.detail || "Failed to create wish",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={`min-h-screen ${colorScheme.gradient} p-4`}>
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Create Birthday Wish ✨
            </h1>
            <p className="text-gray-600">
              Upload photos, customize your message, and create a magical birthday surprise!
            </p>
          </div>

          <div className="space-y-8">
            {/* Person Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="personName" className="text-lg font-semibold">
                  Birthday Person's Name *
                </Label>
                <Input
                  id="personName"
                  placeholder="Enter their name"
                  value={formData.personName}
                  onChange={(e) => handleInputChange('personName', e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="relationship" className="text-lg font-semibold">
                  Your Relationship *
                </Label>
                <Select value={formData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                  <SelectTrigger className="mt-2 text-lg">
                    <SelectValue placeholder="Select your relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRelationships.map(rel => (
                      <SelectItem key={rel.value} value={rel.value}>
                        {rel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">
                Upload Photos & Videos (Max 15, Videos max 2 min)
              </Label>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="fileInput"
                  disabled={isUploading}
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="text-6xl mb-4">
                    {isUploading ? '⏳' : '📸'}
                  </div>
                  <p className="text-xl text-gray-600 mb-2">
                    {isUploading ? 'Uploading files...' : 'Drop files here or click to upload'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports images and videos (max 50MB each)
                  </p>
                </label>
              </div>

              {/* Photo Preview */}
              {formData.photos.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map(photo => (
                    <div key={photo.id} className="relative group">
                      {photo.type === 'image' ? (
                        <img
                          src={`data:image/jpeg;base64,${photo.data}`}
                          alt={photo.name}
                          className="w-full h-32 object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <video
                          src={`data:video/mp4;base64,${photo.data}`}
                          className="w-full h-32 object-cover rounded-lg shadow-md"
                          controls
                        />
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(photo.id)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Generation */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold">
                  Birthday Message *
                </Label>
                <Button
                  onClick={generateMessage}
                  disabled={isGenerating || !formData.personName || !formData.relationship}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      🤖 Generate AI Message
                    </>
                  )}
                </Button>
              </div>
              
              <Textarea
                placeholder="Write your birthday message here or use the AI generator..."
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="min-h-32 text-lg"
              />
            </div>

            {/* Custom No Button Texts */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">
                Customize "No" Button Texts (Optional)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.customNoTexts.map((text, index) => (
                  <Input
                    key={index}
                    placeholder={`No button text ${index + 1}`}
                    value={text}
                    onChange={(e) => handleCustomNoTextChange(index, e.target.value)}
                  />
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="text-center">
              <Button
                onClick={createWish}
                disabled={isCreating}
                className="px-12 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                style={{ backgroundColor: colorScheme.primary }}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  '🎁 Create Birthday Wish'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateWish;