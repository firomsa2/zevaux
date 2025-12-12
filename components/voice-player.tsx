"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Loader2, Download } from "lucide-react";

interface VoicePlayerProps {
  voice: string;
  text?: string;
  audioBase64?: string;
  audioUrl?: string;
  autoPlay?: boolean;
  className?: string;
  compact?: boolean;
  showDownload?: boolean;
  onPlay?: () => void;
}

export default function VoicePlayer({
  voice,
  text = "",
  audioBase64,
  audioUrl,
  autoPlay = false,
  className = "",
  compact = false,
  showDownload = false,
  onPlay,
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrl = useRef<string | null>(null);

  // Initialize audio from base64 or URL
  const initializeAudio = () => {
    if (!audioBase64 && !audioUrl) {
      setHasAudio(false);
      return;
    }

    try {
      let url: string;

      if (audioBase64) {
        // Convert base64 to blob URL
        const byteCharacters = atob(audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        url = URL.createObjectURL(blob);
        audioBlobUrl.current = url;
      } else if (audioUrl) {
        // Use direct URL from Supabase storage
        url = audioUrl;
      } else {
        return;
      }

      // Create audio element
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.onplay = () => {
        setIsPlaying(true);
        if (onPlay) onPlay();
        // Track play in database
        fetch("/api/voice-samples", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voice, incrementPlay: true }),
        }).catch(console.error);
      };
      audio.onpause = () => setIsPlaying(false);

      setHasAudio(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
      setHasAudio(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || isLoading) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    }
  };

  const downloadAudio = () => {
    if (!audioBase64) return;

    const byteCharacters = atob(audioBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${voice}_sample.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    initializeAudio();

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioBlobUrl.current) {
        URL.revokeObjectURL(audioBlobUrl.current);
      }
    };
  }, [audioBase64, audioUrl]);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={togglePlay}
          disabled={!hasAudio || isLoading}
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 rounded-full"
        >
          {isPlaying ? (
            <Pause className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-medium truncate capitalize">
              {voice}
            </span>
          </div>

          {isPlaying && (
            <div className="flex items-center gap-0.5 h-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-0.5 bg-gradient-to-t from-primary to-primary/80 animate-pulse rounded-full"
                  style={{
                    height: `${Math.sin(i) * 4 + 6}px`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        <Button
          onClick={togglePlay}
          disabled={!hasAudio || isLoading}
          size="sm"
          variant="outline"
          className="relative w-10 h-10 p-0 rounded-full"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm font-medium capitalize">{voice}</span>
            {hasAudio && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600">
                Ready
              </span>
            )}
          </div>

          {/* Audio wave visualization */}
          <div className="flex items-center gap-1 h-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? `bg-gradient-to-t from-primary to-primary/80 animate-pulse`
                    : "bg-muted"
                }`}
                style={{
                  height: isPlaying ? `${Math.sin(i * 0.5) * 8 + 12}px` : "8px",
                  animationDelay: isPlaying ? `${i * 100}ms` : "0ms",
                }}
              />
            ))}
          </div>
        </div>

        {showDownload && audioBase64 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadAudio}
            className="w-8 h-8 p-0"
          >
            <Download className="w-3 h-3" />
          </Button>
        )}
      </div>

      {text && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {text}
        </p>
      )}
    </div>
  );
}
