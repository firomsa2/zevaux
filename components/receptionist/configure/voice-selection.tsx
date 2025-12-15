// "use client";

// import { useState, useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Play, Pause, Volume2, Check, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { Label } from "@/components/ui/label";

// const REALTIME_VOICES_ORDER = [
//   "alloy",
//   "echo",
//   "sage", 
//   "shimmer",
//   "ash",
//   "ballad",
//   "coral",
//   "verse",
// ];

// interface VoiceSample {
//   id: string;
//   voice: string;
//   sample_name: string;
//   gender: string;
//   audio_base64?: string;
//   audio_url?: string;
//   sample_text: string;
//   description: string;
//   icon_color: string;
//   best_for: string;
// }

// interface VoiceSelectionProps {
//   businessId: string;
//   currentVoice?: string;
//   onVoiceChange?: (voice: string) => void;
// }

// export default function VoiceSelection({
//   businessId,
//   currentVoice = "alloy",
//   onVoiceChange,
// }: VoiceSelectionProps) {
//   const [voices, setVoices] = useState<VoiceSample[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [selectedVoice, setSelectedVoice] = useState(currentVoice);
//   const [playingVoice, setPlayingVoice] = useState<string | null>(null);
//   const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  
//   const supabase = createClient();
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchVoiceSamples();
//   }, []);

//   useEffect(() => {
//     setSelectedVoice(currentVoice);
//   }, [currentVoice]);

//   const fetchVoiceSamples = async () => {
//     try {
//       const { data: samples, error } = await supabase
//         .from("voice_samples")
//         .select("*")
//         .eq("is_active", true)
//         .order("voice");

//       if (error) throw error;

//       // Sort according to preferred order
//       const sortedVoices = REALTIME_VOICES_ORDER.map((voiceName) =>
//         samples.find((s) => s.voice === voiceName)
//       ).filter(Boolean) as VoiceSample[];

//       setVoices(sortedVoices);
      
//       // Pre-initialize audio elements
//       const audioMap: Record<string, HTMLAudioElement> = {};
//       sortedVoices.forEach((voice) => {
//         if (voice.audio_base64 || voice.audio_url) {
//           try {
//             let url: string;
            
//             if (voice.audio_base64) {
//               const byteCharacters = atob(voice.audio_base64);
//               const byteNumbers = new Array(byteCharacters.length);
//               for (let i = 0; i < byteCharacters.length; i++) {
//                 byteNumbers[i] = byteCharacters.charCodeAt(i);
//               }
//               const byteArray = new Uint8Array(byteNumbers);
//               const blob = new Blob([byteArray], { type: "audio/mpeg" });
//               url = URL.createObjectURL(blob);
//             } else if (voice.audio_url) {
//               url = voice.audio_url;
//             } else {
//               return;
//             }

//             const audio = new Audio(url);
//             audio.onended = () => {
//               if (playingVoice === voice.voice) {
//                 setPlayingVoice(null);
//               }
//             };
//             audioMap[voice.voice] = audio;
//           } catch (error) {
//             console.error(`Error initializing audio for ${voice.voice}:`, error);
//           }
//         }
//       });
      
//       setAudioElements(audioMap);
//     } catch (error: any) {
//       console.error("Error fetching voice samples:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load voice samples",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const playVoiceSample = (voice: string) => {
//     if (playingVoice === voice) {
//       // Stop playing
//       audioElements[voice]?.pause();
//       setPlayingVoice(null);
//     } else {
//       // Stop any currently playing audio
//       if (playingVoice && audioElements[playingVoice]) {
//         audioElements[playingVoice].pause();
//       }
      
//       // Play new voice
//       const audio = audioElements[voice];
//       if (audio) {
//         audio.currentTime = 0;
//         audio.play().then(() => {
//           setPlayingVoice(voice);
//         }).catch((error) => {
//           console.error("Error playing audio:", error);
//           toast({
//             title: "Error",
//             description: "Failed to play voice sample",
//             variant: "destructive",
//           });
//         });
//       }
//     }
//   };

//   const handleVoiceChange = (value: string) => {
//     setSelectedVoice(value);
//     if (onVoiceChange) {
//       onVoiceChange(value);
//     }
//   };

//   const saveVoiceSelection = async () => {
//     if (!businessId) {
//       toast({
//         title: "Error",
//         description: "No business ID found",
//         variant: "destructive",
//       });
//       return;
//     }

//     setSaving(true);
//     try {
//       // Get existing config
//       const { data: existingConfig, error: fetchError } = await supabase
//         .from("business_configs")
//         .select("*")
//         .eq("business_id", businessId)
//         .single();

//       if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
//         throw fetchError;
//       }

//       const configData = {
//         business_id: businessId,
//         config: {
//           ...(existingConfig?.config || {}),
//           voiceProfile: {
//             ...(existingConfig?.config?.voiceProfile || {}),
//             voice: selectedVoice,
//           },
//         },
//         updated_at: new Date().toISOString(),
//       };

//       // Update config
//       const { error: upsertError } = await supabase
//         .from("business_configs")
//         .upsert(configData, {
//           onConflict: "business_id",
//         });

//       if (upsertError) throw upsertError;

//       // Trigger prompt update
//       const { error: promptError } = await supabase.rpc(
//         "update_business_prompt_trigger",
//         { p_business_id: businessId }
//       );

//       if (promptError) {
//         console.warn("Prompt update failed:", promptError);
//       }

//       toast({
//         title: "Success",
//         description: `Voice changed to ${voices.find(v => v.voice === selectedVoice)?.sample_name || selectedVoice}`,
//         variant: "default",
//       });
//     } catch (error: any) {
//       console.error("Error saving voice selection:", error);
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <Loader2 className="h-6 w-6 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <Card className="p-6">
//       <div className="space-y-6">
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Select AI Voice</h3>
//           <p className="text-sm text-muted-foreground">
//             Choose the voice for your AI receptionist
//           </p>
//         </div>

//         {/* Voice Selection Dropdown */}
//         <div className="space-y-2">
//           <Label htmlFor="voice-select">Voice</Label>
//           <Select value={selectedVoice} onValueChange={handleVoiceChange}>
//             <SelectTrigger id="voice-select">
//               <SelectValue placeholder="Select a voice" />
//             </SelectTrigger>
//             <SelectContent>
//               {voices.map((voice) => (
//                 <SelectItem key={voice.voice} value={voice.voice}>
//                   <div className="flex items-center justify-between w-full">
//                     <span>{voice.sample_name}</span>
//                     {selectedVoice === voice.voice && (
//                       <Check className="h-4 w-4 text-primary" />
//                     )}
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Voice Samples List */}
//         <div className="space-y-3">
//           <Label>Listen to Samples</Label>
//           <div className="space-y-2">
//             {voices.map((voice) => (
//               <div
//                 key={voice.voice}
//                 className={`flex items-center justify-between p-3 rounded-lg border ${
//                   selectedVoice === voice.voice
//                     ? "border-primary bg-primary/5"
//                     : "border-border"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       voice.icon_color || "bg-primary/20"
//                     }`}
//                   >
//                     <Volume2 className="w-4 h-4 text-primary" />
//                   </div>
//                   <div>
//                     <div className="font-medium">{voice.sample_name}</div>
//                     <div className="text-xs text-muted-foreground">
//                       {voice.gender} • Best for: {voice.best_for}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => playVoiceSample(voice.voice)}
//                     disabled={!audioElements[voice.voice]}
//                   >
//                     {playingVoice === voice.voice ? (
//                       <Pause className="h-4 w-4" />
//                     ) : (
//                       <Play className="h-4 w-4" />
//                     )}
//                   </Button>
                  
//                   {selectedVoice === voice.voice && (
//                     <div className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
//                       Selected
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="pt-4">
//           <Button
//             onClick={saveVoiceSelection}
//             disabled={saving || selectedVoice === currentVoice}
//             className="w-full"
//           >
//             {saving ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               "Save Voice Selection"
//             )}
//           </Button>
//           {selectedVoice === currentVoice && (
//             <p className="text-sm text-muted-foreground text-center mt-2">
//               Voice is already selected
//             </p>
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// }


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
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

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
  onVoiceSaved?: () => void; // Changed from onVoiceChange
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
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to load voice samples",
        variant: "destructive",
      });
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
        toast({
          title: "Error",
          description: "Could not load audio sample",
          variant: "destructive",
        });
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
      toast({
        title: "Error",
        description: "Failed to play voice sample",
        variant: "destructive",
      });
    }
  };

  const handleVoiceSelect = (value: string) => {
    setSelectedVoice(value);
    setHasChanged(value !== currentVoice);
  };

  const saveVoiceSelection = async () => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "No business ID found",
        variant: "destructive",
      });
      return;
    }

    if (selectedVoice === currentVoice) {
      toast({
        title: "Info",
        description: "Voice is already selected",
        variant: "default",
      });
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
      toast({
        title: "Success",
        description: `Voice changed to ${voices.find(v => v.voice === selectedVoice)?.sample_name || selectedVoice}`,
        variant: "default",
      });
      
      // Notify parent that voice was saved
      if (onVoiceSaved) {
        onVoiceSaved();
      }
    } catch (error: any) {
      console.error("Error saving voice selection:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Select AI Voice</h3>
          <p className="text-sm text-muted-foreground">
            Choose the voice for your AI receptionist
          </p>
        </div>

        {/* Current Voice Display */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Current Voice</p>
              <p className="text-2xl font-bold text-primary">
                {voices.find(v => v.voice === currentVoice)?.sample_name || currentVoice}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              voices.find(v => v.voice === currentVoice)?.icon_color || "bg-primary/20"
            }`}>
              <Volume2 className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Voice Selection Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="voice-select">Select New Voice</Label>
          <Select value={selectedVoice} onValueChange={handleVoiceSelect}>
            <SelectTrigger id="voice-select">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.voice} value={voice.voice}>
                  <div className="flex items-center justify-between w-full">
                    <span>{voice.sample_name}</span>
                    {selectedVoice === voice.voice && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Samples Grid - 4x4 */}
        <div className="space-y-3">
          <Label>Listen to Samples</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {voices.map((voice) => (
              <div
                key={voice.voice}
                className={`flex flex-col p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedVoice === voice.voice
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
                onClick={() => handleVoiceSelect(voice.voice)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      voice.icon_color || "bg-primary/20"
                    }`}
                  >
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  
                  {selectedVoice === voice.voice && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="font-medium text-sm">{voice.sample_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {voice.gender}
                  </div>
                </div>
                
                <div className="mt-auto space-y-2">
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {voice.best_for}
                  </div>
                  
                  <Button
                    size="sm"
                    variant={playingVoice === voice.voice ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoiceSample(voice.voice);
                    }}
                    className="w-full"
                  >
                    {playingVoice === voice.voice ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Listen
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={saveVoiceSelection}
            disabled={saving || !hasChanged}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Voice Selection"
            )}
          </Button>
          
          {!hasChanged && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {selectedVoice === currentVoice 
                ? "Current voice is already selected"
                : "Select a different voice to save changes"
              }
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}