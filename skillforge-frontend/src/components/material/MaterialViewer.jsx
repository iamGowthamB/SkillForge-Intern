//AWS S3
import React, { useState } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize, Download, ExternalLink, FileText, AlertCircle } from 'lucide-react'
import Button from '../common/Button'
import { materialProgressService } from "../../services/materialProgressService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";


const MaterialViewer = ({ material, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [pdfViewMode, setPdfViewMode] = useState('google')
  const videoRef = React.useRef(null)

  if (!material) return null

  // Always return S3 URL directly
  const getFileUrl = () => material.filePath

  // PDF viewer S3 compatible
  const getPdfViewUrl = () => {
    const originalUrl = getFileUrl()

    if (pdfViewMode === 'google') {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(originalUrl)}&embedded=true`
    }

    if (pdfViewMode === 'mozilla') {
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(originalUrl)}`
    }

    return originalUrl
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return
    if (isPlaying) videoRef.current.pause()
    else videoRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const handleMuteToggle = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = getFileUrl()
    link.download = material.fileName || material.title
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openInNewTab = (url) => window.open(url, '_blank', 'noopener,noreferrer')

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex-1 mr-4">
            <h2 className="text-xl font-bold text-gray-900">{material.title}</h2>
            {material.description && (
              <p className="text-sm text-gray-600 mt-1">{material.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white">

          {/* VIDEO */}
          {material.materialType === 'VIDEO' && (
            <div className="relative bg-black">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[70vh]"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                src={getFileUrl()}
              />

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">

                {/* Progress Bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayPause}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full"
                  >
                    {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white" />}
                  </button>

                  <button
                    onClick={handleMuteToggle}
                    className="p-2 hover:bg-gray-800 rounded-full"
                  >
                    {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
                  </button>

                  <div className="flex-1"></div>

                  <button
                    onClick={handleFullscreen}
                    className="p-2 hover:bg-gray-800 rounded-full"
                  >
                    <Maximize size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PDF */}
          {material.materialType === 'PDF' && (
            <div className="bg-gray-50">

              {/* Mode Switch */}
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} className="text-blue-600" />
                    <span className="text-sm text-blue-800">PDF Viewer Mode:</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPdfViewMode('google')}
                      className={`px-3 py-1 text-xs rounded-md ${pdfViewMode === 'google'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-300'}`}
                    >
                      Google Viewer
                    </button>

                    <button
                      onClick={() => setPdfViewMode('mozilla')}
                      className={`px-3 py-1 text-xs rounded-md ${pdfViewMode === 'mozilla'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-300'}`}
                    >
                      Mozilla Viewer
                    </button>
                  </div>
                </div>

                <p className="text-xs text-blue-600 mt-1">Switch if PDF fails to load</p>
              </div>

              {/* Iframe */}
              <div className="h-[70vh] bg-gray-100">
                <iframe
                  src={getPdfViewUrl()}
                  className="w-full h-full"
                  title={material.title}
                />
              </div>

              {/* Tips */}
              <div className="px-6 py-4 bg-yellow-50 border-t">
                <div className="flex items-start space-x-3">
                  <FileText size={20} className="text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">PDF Issues?</p>
                    <p className="text-xs text-yellow-700">
                      • Try changing viewer<br />
                      • Open in new tab<br />
                      • Download PDF
                    </p>

                    <div className="flex space-x-3 mt-3">
                      <Button
                        onClick={() => openInNewTab(getFileUrl())}
                        variant="secondary"
                        size="sm"
                        icon={ExternalLink}
                      >
                        Open in New Tab
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="primary"
                        size="sm"
                        icon={Download}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* LINK */}
          {material.materialType === 'LINK' && (
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-900">External Link</h3>
                <p className="text-sm text-blue-800">Click below to open.</p>

                <a
                  href={material.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                  <span>Open Link</span>
                  <ExternalLink size={16} />
                </a>
              </div>

              <iframe
                src={material.externalUrl}
                className="w-full h-[500px] border"
                title={material.title}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t rounded-b-xl flex justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {material.materialType}
              {material.fileName && (
                <>
                  <span className="mx-2">•</span>
                  <span className="font-medium">File:</span> {material.fileName}
                </>
              )}
            </div>

            <div className="flex space-x-3">
              {/* ✔ Mark Material Completed Button */}
              {/* In Backend We set as Completed Topic If Quiz is Attemt or not */}
              {/* <Button
                onClick={async () => {
                  try {
                    await materialProgressService.markMaterialCompleted(
                      user.userId,
                      material.id
                    );
                    toast.success("Material marked as completed!");
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to mark completed");
                  }
                }}
                variant="success"
                size="sm"
              >
                Mark Completed
              </Button> */}
              
              {(material.materialType === 'VIDEO' || material.materialType === 'PDF') && (
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="sm"
                  icon={Download}
                >
                  Download
                </Button>
              )}

              <Button onClick={onClose} variant="primary" size="sm">
                Close
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MaterialViewer
