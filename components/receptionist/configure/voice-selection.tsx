"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, Check, Loader2, Sparkles, Waves, CheckCircle2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const REALTIME_VOICES_ORDER = [
  "alloy",
  "echo",
  "sage", 
  "shimmer",
  "ash",
  "ballad",
  "coral",
  "verse",
];

interface VoiceSample {
  id: string;
  voice: string;
  sample_name: string;
  gender: string;
  audio_base64?: string;
  audio_url?: string;
  sample_text: string;
  description: string;
  icon_color: string;
  best_for: string;
}

interface VoiceSelectionProps {
  businessId: string;
  currentVoice?: string;
  onVoiceSaved?: () => void;
}

export default function VoiceSelection({
  businessId,
  currentVoice = "alloy",
  onVoiceSaved,
}: VoiceSelectionProps) {
  const [voices, setVoices] = useState<VoiceSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(currentVoice);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [hasChanged, setHasChanged] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    fetchVoiceSamples();
  }, []);

  useEffect(() => {
    setSelectedVoice(currentVoice);
    setHasChanged(false);
  }, [currentVoice]);

  const fetchVoiceSamples = async () => {
    try {
      const { data: samples, error } = await supabase
        .from("voice_samples")
        .select("*")
        .eq("is_active", true)
        .order("voice");

      if (error) throw error;

      // Sort according to preferred order
      const sortedVoices = REALTIME_VOICES_ORDER.map((voiceName) =>
        samples.find((s) => s.voice === voiceName)
      ).filter(Boolean) as VoiceSample[];

      setVoices(sortedVoices);
    } catch (error: any) {
      console.error("Error fetching voice samples:", error);
      toast.error("Failed to load voice samples");
    } finally {
      setLoading(false);
    }
  };

  const initializeAudio = (voice: VoiceSample): HTMLAudioElement | null => {
    try {
      let url: string;
      
      if (voice.audio_base64) {
        const byteCharacters = atob(voice.audio_base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        url = URL.createObjectURL(blob);
      } else if (voice.audio_url) {
        url = voice.audio_url;
      } else {
        return null;
      }

      const audio = new Audio(url);
      audio.onended = () => {
        if (playingVoice === voice.voice) {
          setPlayingVoice(null);
        }
      };
      
      return audio;
    } catch (error) {
      console.error(`Error initializing audio for ${voice.voice}:`, error);
      return null;
    }
  };

  const playVoiceSample = async (voiceName: string) => {
    const voice = voices.find(v => v.voice === voiceName);
    if (!voice) return;

    // Stop any currently playing audio
    if (playingVoice && audioRefs.current[playingVoice]) {
      audioRefs.current[playingVoice].pause();
      if (playingVoice === voiceName) {
        setPlayingVoice(null);
        return;
      }
    }

    // Initialize audio if not already done
    if (!audioRefs.current[voiceName]) {
      const audio = initializeAudio(voice);
      if (!audio) {
        toast.error("Could not load audio sample");
        return;
      }
      audioRefs.current[voiceName] = audio;
    }

    try {
      const audio = audioRefs.current[voiceName];
      audio.currentTime = 0;
      await audio.play();
      setPlayingVoice(voiceName);
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to play voice sample");
    }
  };

  const handleVoiceSelect = (value: string) => {
    setSelectedVoice(value);
    setHasChanged(value !== currentVoice);
  };

  const saveVoiceSelection = async () => {
    if (!businessId) {
      toast.error("No business ID found");
      return;
    }

    if (selectedVoice === currentVoice) {
      toast.info("Voice is already selected");
      return;
    }

    setSaving(true);
    try {
      // Get existing config
      const { data: existingConfig, error: fetchError } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", businessId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const configData = {
        business_id: businessId,
        config: {
          ...(existingConfig?.config || {}),
          voiceProfile: {
            ...(existingConfig?.config?.voiceProfile || {}),
            voice: selectedVoice,
          },
        },
        updated_at: new Date().toISOString(),
      };

      // Update config
      const { error: upsertError } = await supabase
        .from("business_configs")
        .upsert(configData, {
          onConflict: "business_id",
        });

      if (upsertError) throw upsertError;

      // Trigger prompt update
      const { error: promptError } = await supabase.rpc(
        "update_business_prompt_trigger",
        { p_business_id: businessId }
      );

      if (promptError) {
        console.warn("Prompt update failed:", promptError);
      }

      setHasChanged(false);
      toast.success(`Voice changed to ${voices.find(v => v.voice === selectedVoice)?.sample_name || selectedVoice}`);
      
      // Notify parent that voice was saved
      if (onVoiceSaved) {
        onVoiceSaved();
      }
    } catch (error: any) {
      console.error("Error saving voice selection:", error);
      toast.error("Failed to save voice selection", {
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // Cleanup audio objects on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        if (audio.src.startsWith('blob:')) {
          URL.revokeObjectURL(audio.src);
        }
      });
    };
  }, []);

  if (loading) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading voice options...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentVoiceData = voices.find(v => v.voice === currentVoice);
  const selectedVoiceData = voices.find(v => v.voice === selectedVoice);

  return (
    <Card className="border-2 shadow-lg overflow-hidden">
      <CardHeader className=" bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Volume2 className="h-5 w-5 text-primary" />
              </div>
              AI Voice Selection
            </CardTitle>
            <CardDescription className="text-base pt-1">
              Choose the perfect voice for your AI receptionist. Listen to samples and select the one that best represents your brand.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Current Voice Display */}
        {/* <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  Current Voice
                </Badge>
                {currentVoice === selectedVoice && (
                  <Badge className="text-xs bg-green-500 hover:bg-green-600">
                    Active
                  </Badge>
                )}
              </div>
              <h3 className="text-3xl font-bold text-primary">
                {currentVoiceData?.sample_name || currentVoice}
              </h3>
              {currentVoiceData && (
                <p className="text-sm text-muted-foreground">
                  {currentVoiceData.gender} • {currentVoiceData.best_for}
                </p>
              )}
            </div>
            <div 
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                currentVoiceData?.icon_color || "bg-primary/20"
              }`}
            >
              <Volume2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          {currentVoice === selectedVoice && (
            <div className="absolute top-4 right-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative bg-green-500 rounded-full p-1.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          )}
        </div> */}

        {/* <Separator /> */}

        {/* Voice Selection Dropdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-select" className="text-base font-semibold">
              Select New Voice
            </Label>
            <Badge variant="outline" className="text-xs">
              {voices.length} voices available
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground -mt-1">
            Choose a voice from the dropdown or browse the samples below
          </p>
          <Select value={selectedVoice} onValueChange={handleVoiceSelect}>
            <SelectTrigger id="voice-select" className="h-12 text-base">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.voice} value={voice.voice}>
                  <div className="flex items-center justify-between w-full py-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{voice.sample_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {voice.gender}
                      </Badge>
                    </div>
                    {selectedVoice === voice.voice && (
                      <Check className="h-4 w-4 text-primary ml-4" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Voice Samples Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <Label className="text-base font-semibold">Listen to Voice Samples</Label>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
            Click on any voice card to select it, then use the play button to preview
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {voices.map((voice) => {
              const isSelected = selectedVoice === voice.voice;
              const isCurrent = currentVoice === voice.voice;
              const isPlaying = playingVoice === voice.voice;

              return (
                <div
                  key={voice.voice}
                  className={`
                    group relative flex flex-col p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-md"
                    }
                    ${isCurrent && !isSelected ? "ring-2 ring-primary/30" : ""}
                  `}
                  onClick={() => handleVoiceSelect(voice.voice)}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-primary rounded-full p-1.5 shadow-md">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  {/* Current Voice Badge */}
                  {isCurrent && (
                    <div className="absolute top-3 left-3">
                      <Badge className="text-xs bg-green-500 hover:bg-green-600">
                        Active
                      </Badge>
                    </div>
                  )}

                  {/* Voice Icon */}
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                        voice.icon_color || "bg-primary/20"
                      }`}
                    >
                      <Volume2 className="w-6 h-6 text-primary" />
                    </div>
                    
                    {isPlaying && (
                      <div className="flex gap-1">
                        <Waves className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {/* Voice Info */}
                  <div className="mb-2 space-y-1">
                    <div className="font-semibold text-base">{voice.sample_name}</div>
                    <Badge variant="outline" className="text-xs">
                      {voice.gender}
                    </Badge>
                  </div>
                  
                  {/* Best For */}
                  <div className="mb-2 flex-1">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {voice.best_for}
                    </p>
                  </div>
                  
                  {/* Play Button */}
                  <Button
                    size="sm"
                    variant={isPlaying ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoiceSample(voice.voice);
                    }}
                    className="w-full mt-auto shadow-sm hover:shadow-md transition-shadow"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-3.5 w-3.5 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 mr-2" />
                        Listen
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Save Button */}
        <div className="space-y-3">
          <Button
            onClick={saveVoiceSelection}
            disabled={saving || !hasChanged}
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Voice Selection...
              </>
            ) : hasChanged ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Save Voice Selection
              </>
            ) : (
              "No Changes to Save"
            )}
          </Button>
          
          {!hasChanged && selectedVoice !== currentVoice && (
            <p className="text-sm text-muted-foreground text-center">
              Select a different voice above to enable saving
            </p>
          )}
          
          {selectedVoice === currentVoice && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>This voice is already active</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
