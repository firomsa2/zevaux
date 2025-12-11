// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Play, Download, Pause } from "lucide-react";
// import { useState, useRef } from "react";

// interface AudioPlayerModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   call: any;
// }

// export function AudioPlayerModal({ isOpen, onClose, call }: AudioPlayerModalProps) {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   const handlePlayPause = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const handleDownload = () => {
//     // This will be implemented when we have audio files
//     console.log('Download audio for call:', call.id);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Call Recording</DialogTitle>
//           <DialogDescription>
//             Recording from call with {call.caller_phone}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Audio Player */}
//           <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
//             <div className="text-center space-y-4">
//               <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="w-12 h-12 text-primary-foreground"
//                   onClick={handlePlayPause}
//                 >
//                   {isPlaying ? (
//                     <Pause className="w-6 h-6" />
//                   ) : (
//                     <Play className="w-6 h-6" />
//                   )}
//                 </Button>
//               </div>
//               <audio
//                 ref={audioRef}
//                 onEnded={() => setIsPlaying(false)}
//                 // src will be added when we have audio files
//                 // src={call.recording_url}
//               />
//               <p className="text-sm text-muted-foreground">
//                 {isPlaying ? 'Playing...' : 'Click to play recording'}
//               </p>
//             </div>
//           </div>

//           {/* Download Button */}
//           <Button onClick={handleDownload} className="w-full" variant="outline">
//             <Download className="w-4 h-4 mr-2" />
//             Download Recording
//           </Button>

//           {/* Coming Soon Notice */}
//           <div className="text-xs text-center text-muted-foreground p-2 bg-yellow-50 rounded">
//             Audio recording feature coming soon
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CallWithTranscript } from "@/types/call";
import { Play, Pause, Volume2, Download } from "lucide-react";

interface AudioPlayerModalProps {
  call: CallWithTranscript;
  isOpen: boolean;
  onClose: () => void;
}

export function AudioPlayerModal({
  call,
  isOpen,
  onClose,
}: AudioPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const recordingUrl = call.transcript?.recording_URL;

  useEffect(() => {
    if (!recordingUrl) return;

    const audio = new Audio(recordingUrl);
    audioRef.current = audio;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [recordingUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    if (!recordingUrl) return;

    const link = document.createElement("a");
    link.href = recordingUrl;
    link.download = `call-recording-${call.id}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!recordingUrl) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recording Unavailable</DialogTitle>
            <DialogDescription>
              No recording available for this call.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Call Recording</DialogTitle>
          <DialogDescription>
            Recording from {call.caller_phone} • {formatTime(duration)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
                className="h-12 w-12"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>

          {/* Call Info */}
          <div className="pt-4 border-t">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Caller:</span>
                <span>{call.caller_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(call.started_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{call.minutes ? `${call.minutes} min` : "Unknown"}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
