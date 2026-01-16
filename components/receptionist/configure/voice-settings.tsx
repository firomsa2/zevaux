// "use client";

// import { useState, useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Loader2,
//   Save,
//   AlertCircle,
//   Mic,
//   Volume2,
//   Languages,
//   Play,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";

// const VOICE_PROFILES = [
//   {
//     id: "alloy",
//     name: "Alloy",
//     description: "Clear and professional voice",
//     gender: "neutral",
//   },
//   {
//     id: "echo",
//     name: "Echo",
//     description: "Warm and friendly voice",
//     gender: "neutral",
//   },
//   {
//     id: "fable",
//     name: "Fable",
//     description: "Storyteller tone",
//     gender: "neutral",
//   },
//   {
//     id: "onyx",
//     name: "Onyx",
//     description: "Deep and authoritative voice",
//     gender: "male",
//   },
//   {
//     id: "nova",
//     name: "Nova",
//     description: "Bright and energetic voice",
//     gender: "female",
//   },
//   {
//     id: "shimmer",
//     name: "Shimmer",
//     description: "Soft and calming voice",
//     gender: "female",
//   },
// ];

// const LANGUAGES = [
//   { code: "en-US", name: "English (US)", native: "English" },
//   { code: "en-GB", name: "English (UK)", native: "English" },
//   { code: "es-ES", name: "Spanish (Spain)", native: "Español" },
//   { code: "es-MX", name: "Spanish (Mexico)", native: "Español" },
//   { code: "fr-FR", name: "French (France)", native: "Français" },
//   { code: "de-DE", name: "German", native: "Deutsch" },
//   { code: "it-IT", name: "Italian", native: "Italiano" },
//   { code: "pt-BR", name: "Portuguese (Brazil)", native: "Português" },
//   { code: "ja-JP", name: "Japanese", native: "日本語" },
//   { code: "ko-KR", name: "Korean", native: "한국어" },
//   { code: "zh-CN", name: "Chinese (Mandarin)", native: "中文" },
// ];
// const LANGUAGES1 = [
//   { code: "en", name: "English" },
//   { code: "es", name: "Spanish" },
//   // { code: "fr", name: "French" },
//   // { code: "de", name: "German" },
//   // { code: "it", name: "Italian" },
//   // { code: "pt", name: "Portuguese" },
//   // { code: "zh", name: "Chinese" },
//   // { code: "ja", name: "Japanese" },
//   // { code: "ko", name: "Korean" },
//   // { code: "ru", name: "Russian" },
// ];

// const SPEECH_STYLES = [
//   { id: "neutral", name: "Neutral", description: "Balanced and professional" },
//   { id: "friendly", name: "Friendly", description: "Warm and approachable" },
//   { id: "formal", name: "Formal", description: "Professional and precise" },
//   {
//     id: "energetic",
//     name: "Energetic",
//     description: "Upbeat and enthusiastic",
//   },
//   { id: "calm", name: "Calm", description: "Relaxed and reassuring" },
// ];

// const TIMEZONES = [
//   "America/New_York",
//   "America/Chicago",
//   "America/Denver",
//   "America/Los_Angeles",
//   "America/Phoenix",
//   "America/Anchorage",
//   "America/Honolulu",
//   "Europe/London",
//   "Europe/Paris",
//   "Europe/Berlin",
//   "Asia/Tokyo",
//   "Asia/Hong_Kong",
//   "Australia/Sydney",
// ];

// export default function VoiceSettingsForm() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [businessId, setBusinessId] = useState<string | null>(null);
//   const [playing, setPlaying] = useState(false);
//   const supabase = createClient();
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     voiceProfile: {
//       provider: "openai",
//       voice: "alloy",
//       language: "en-US",
//       speechStyle: "neutral",
//       speed: 1.0,
//       pitch: 1.0,
//       volume: 0.8,
//     },
//     languageSettings: {
//       autoDetect: true,
//       fallbackLanguage: "en-US",
//       multilingual: true,
//       codeSwitching: false,
//       accentStrength: 0.5,
//     },
//     pronunciation: {
//       phoneticNames: true,
//       companyName: "",
//       phoneticCompanyName: "",
//       customPronunciations: [] as Array<{
//         word: string;
//         pronunciation: string;
//       }>,
//     },
//     default_language: "en",
//     supported_languages: ["en"],
//     timezone: "America/New_York",
//   });

//   useEffect(() => {
//     fetchBusinessData();
//   }, []);

//   const fetchBusinessData = async () => {
//     try {
//       setLoading(true);

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) throw new Error("No user found");

//       // Get business data
//       const { data: userData } = await supabase
//         .from("users")
//         .select("business_id")
//         .eq("id", user.id)
//         .maybeSingle();

//       if (!userData?.business_id) throw new Error("No business found");
//       setBusinessId(userData.business_id);

//       const { data: configRes } = await supabase
//         .from("business_configs")
//         .select("*")
//         .eq("business_id", userData.business_id)
//         .maybeSingle();

//       if (configRes?.config?.voiceProfile) {
//         setFormData((prev) => ({
//           ...prev,
//           voiceProfile: {
//             ...prev.voiceProfile,
//             ...configRes.config.voiceProfile,
//           },
//         }));
//       }

//       if (configRes?.config?.languageSettings) {
//         setFormData((prev) => ({
//           ...prev,
//           languageSettings: {
//             ...prev.languageSettings,
//             ...configRes.config.languageSettings,
//           },
//         }));
//       }

//       if (configRes?.config?.pronunciation) {
//         setFormData((prev) => ({
//           ...prev,
//           pronunciation: {
//             ...prev.pronunciation,
//             ...configRes.config.pronunciation,
//           },
//         }));
//       }

//       // Get business name for pronunciation
//       const { data: businessData } = await supabase
//         .from("businesses")
//         .select("*")
//         .eq("id", userData.business_id)
//         .single();
//       console.log("🚀 ~ fetchBusinessData ~ businessData:", businessData);

//       if (businessData?.name && !formData.pronunciation.companyName) {
//         setFormData((prev) => ({
//           ...prev,
//           pronunciation: {
//             ...prev.pronunciation,
//             companyName: businessData.name,
//           },
//         }));
//       }

//       if (businessData?.timezone) {
//         setFormData((prev) => {
//           console.log("🚀 ~ fetchBusinessData ~ prev:", prev);
//           return {
//             ...prev,
//             timezone: businessData.timezone,
//           };
//         });
//       }
//       // Always set default_language from business
//       if (businessData?.default_language) {
//         setFormData((prev) => ({
//           ...prev,
//           default_language: businessData.default_language,
//         }));
//       }
//       if (businessData?.supported_languages) {
//         setFormData((prev) => ({
//           ...prev,
//           supported_languages: businessData.supported_languages,
//         }));
//       }
//     } catch (err: any) {
//       setError(err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVoiceChange = (field: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       voiceProfile: {
//         ...prev.voiceProfile,
//         [field]: value,
//       },
//     }));
//   };

//   const handleLanguageChange = (field: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       languageSettings: {
//         ...prev.languageSettings,
//         [field]: value,
//       },
//     }));
//   };

//   const handlePronunciationChange = (field: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       pronunciation: {
//         ...prev.pronunciation,
//         [field]: value,
//       },
//     }));
//   };

//   const addCustomPronunciation = () => {
//     const word = prompt("Enter the word to pronounce:");
//     const pronunciation = prompt("Enter the phonetic pronunciation:");

//     if (word && pronunciation) {
//       setFormData((prev) => ({
//         ...prev,
//         pronunciation: {
//           ...prev.pronunciation,
//           customPronunciations: [
//             ...prev.pronunciation.customPronunciations,
//             { word, pronunciation },
//           ],
//         },
//       }));
//     }
//   };

//   const removeCustomPronunciation = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       pronunciation: {
//         ...prev.pronunciation,
//         customPronunciations: prev.pronunciation.customPronunciations.filter(
//           (_, i) => i !== index
//         ),
//       },
//     }));
//   };

//   const handleChange = (field: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleLanguageToggle = (language: string) => {
//     setFormData((prev) => {
//       const langs = [...prev.supported_languages];
//       const index = langs.indexOf(language);

//       if (index > -1) {
//         // Remove if it's not the default language
//         if (language !== prev.default_language) {
//           langs.splice(index, 1);
//         }
//       } else {
//         langs.push(language);
//       }

//       // Ensure default language is always included
//       if (!langs.includes(prev.default_language)) {
//         langs.push(prev.default_language);
//       }

//       return { ...prev, supported_languages: langs };
//     });
//   };

//   const playVoicePreview = async () => {
//     if (playing) return;

//     setPlaying(true);

//     // In a real implementation, this would call an API to generate audio
//     // For now, we'll just simulate it with a timeout
//     setTimeout(() => {
//       setPlaying(false);
//       toast({
//         title: "Voice Preview",
//         description: "Playing voice preview... (simulated)",
//         variant: "default",
//       });
//     }, 2000);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError(null);

//     try {
//       if (!businessId) throw new Error("No business ID found");

//       // Persist language/timezone settings to businesses table
//       const businessUpdate = {
//         default_language: formData.default_language,
//         supported_languages: formData.supported_languages,
//         timezone: formData.timezone,
//         updated_at: new Date().toISOString(),
//       };

//       const { error: businessError } = await supabase
//         .from("businesses")
//         .update(businessUpdate)
//         .eq("id", businessId);

//       if (businessError) throw businessError;

//       // Get existing config
//       const { data: existingConfig } = await supabase
//         .from("business_configs")
//         .select("*")
//         .eq("business_id", businessId)
//         .single();

//       const configData = {
//         business_id: businessId,
//         config: {
//           ...(existingConfig?.config || {}),
//           voiceProfile: formData.voiceProfile,
//           languageSettings: formData.languageSettings,
//           pronunciation: formData.pronunciation,
//         },
//         updated_at: new Date().toISOString(),
//       };

//       // Update config
//       const { error: configError } = await supabase
//         .from("business_configs")
//         .upsert(configData, {
//           onConflict: "business_id",
//         });

//       if (configError) throw configError;

//       // Update prompt
//       const { error: promptError } = await supabase.rpc(
//         "update_business_prompt_trigger",
//         { p_business_id: businessId }
//       );

//       if (promptError) {
//         console.warn("Prompt update failed:", promptError);
//       }

//       toast({
//         title: "Success",
//         description: "Voice settings saved successfully",
//         variant: "default",
//       });
//     } catch (err: any) {
//       setError(err.message);
//       toast({
//         title: "Error",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Voice & Language</h1>
//         <p className="text-muted-foreground">
//           Configure voice profiles, language settings, and pronunciation
//         </p>
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Language Settings</CardTitle>
//             <CardDescription>
//               Configure language preferences for your receptionist
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="default_language">Default Language *</Label>
//                 <Select
//                   value={formData.default_language}
//                   onValueChange={(value) =>
//                     handleChange("default_language", value)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {LANGUAGES1.map((lang) => (
//                       <SelectItem key={lang.code} value={lang.code}>
//                         {lang.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Supported Languages</Label>
//                 <div className="flex flex-wrap gap-2">
//                   {LANGUAGES1.map((lang) => {
//                     const isSupported = formData.supported_languages.includes(
//                       lang.code
//                     );
//                     const isDefault = formData.default_language === lang.code;

//                     return (
//                       <button
//                         key={lang.code}
//                         type="button"
//                         onClick={() => handleLanguageToggle(lang.code)}
//                         className={`
//                                 px-3 py-1.5 rounded-full text-sm border transition-colors
//                                 ${
//                                   isDefault
//                                     ? "bg-primary text-primary-foreground border-primary"
//                                     : isSupported
//                                     ? "bg-secondary text-secondary-foreground border-secondary"
//                                     : "bg-background text-muted-foreground border-border hover:bg-accent"
//                                 }
//                               `}
//                       >
//                         {lang.name}
//                         {isDefault && " (Default)"}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Click languages to enable/disable. Default language cannot be
//                   disabled.
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Voice Profile */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Mic className="h-5 w-5" />
//               Voice Profile
//             </CardTitle>
//             <CardDescription>
//               Choose and customize your receptionist's voice
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="voice">Voice Selection</Label>
//                   <Select
//                     value={formData.voiceProfile.voice}
//                     onValueChange={(value) => handleVoiceChange("voice", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {VOICE_PROFILES.map((voice) => (
//                         <SelectItem key={voice.id} value={voice.id}>
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={`w-3 h-3 rounded-full ${
//                                 voice.gender === "male"
//                                   ? "bg-blue-500"
//                                   : voice.gender === "female"
//                                   ? "bg-pink-500"
//                                   : "bg-gray-500"
//                               }`}
//                             />
//                             <div>
//                               <p className="font-medium">{voice.name}</p>
//                               <p className="text-xs text-muted-foreground">
//                                 {voice.description}
//                               </p>
//                             </div>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="speechStyle">Speech Style</Label>
//                   <Select
//                     value={formData.voiceProfile.speechStyle}
//                     onValueChange={(value) =>
//                       handleVoiceChange("speechStyle", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {SPEECH_STYLES.map((style) => (
//                         <SelectItem key={style.id} value={style.id}>
//                           <div>
//                             <p className="font-medium">{style.name}</p>
//                             <p className="text-xs text-muted-foreground">
//                               {style.description}
//                             </p>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="language">Language</Label>
//                   <Select
//                     value={formData.voiceProfile.language}
//                     onValueChange={(value) =>
//                       handleVoiceChange("language", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {LANGUAGES.map((lang) => (
//                         <SelectItem key={lang.code} value={lang.code}>
//                           <div>
//                             <p className="font-medium">{lang.name}</p>
//                             <p className="text-xs text-muted-foreground">
//                               {lang.native}
//                             </p>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Label>Speech Speed</Label>
//                       <span className="text-sm text-muted-foreground">
//                         {formData.voiceProfile.speed.toFixed(1)}x
//                       </span>
//                     </div>
//                     <Slider
//                       value={[formData.voiceProfile.speed]}
//                       onValueChange={([value]) =>
//                         handleVoiceChange("speed", value)
//                       }
//                       min={0.5}
//                       max={2}
//                       step={0.1}
//                     />
//                     <div className="flex justify-between text-xs text-muted-foreground">
//                       <span>Slower</span>
//                       <span>Normal</span>
//                       <span>Faster</span>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Label>Voice Pitch</Label>
//                       <span className="text-sm text-muted-foreground">
//                         {formData.voiceProfile.pitch.toFixed(1)}
//                       </span>
//                     </div>
//                     <Slider
//                       value={[formData.voiceProfile.pitch]}
//                       onValueChange={([value]) =>
//                         handleVoiceChange("pitch", value)
//                       }
//                       min={0.5}
//                       max={1.5}
//                       step={0.1}
//                     />
//                     <div className="flex justify-between text-xs text-muted-foreground">
//                       <span>Lower</span>
//                       <span>Normal</span>
//                       <span>Higher</span>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Label>Volume</Label>
//                       <span className="text-sm text-muted-foreground">
//                         {Math.round(formData.voiceProfile.volume * 100)}%
//                       </span>
//                     </div>
//                     <Slider
//                       value={[formData.voiceProfile.volume]}
//                       onValueChange={([value]) =>
//                         handleVoiceChange("volume", value)
//                       }
//                       min={0.1}
//                       max={1}
//                       step={0.1}
//                     />
//                     <div className="flex justify-between text-xs text-muted-foreground">
//                       <span>Softer</span>
//                       <span>Normal</span>
//                       <span>Louder</span>
//                     </div>
//                   </div>
//                 </div>

//                 <Button
//                   type="button"
//                   onClick={playVoicePreview}
//                   disabled={playing}
//                   className="w-full"
//                 >
//                   {playing ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Playing Preview...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="mr-2 h-4 w-4" />
//                       Play Voice Preview
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Language Settings */}
//         {/* <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Languages className="h-5 w-5" />
//               Language Settings
//             </CardTitle>
//             <CardDescription>
//               Configure language detection and handling
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="fallbackLanguage">Fallback Language</Label>
//                   <Select
//                     value={formData.languageSettings.fallbackLanguage}
//                     onValueChange={(value) =>
//                       handleLanguageChange("fallbackLanguage", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {LANGUAGES.map((lang) => (
//                         <SelectItem key={lang.code} value={lang.code}>
//                           {lang.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <p className="text-xs text-muted-foreground">
//                     Language to use when detection is uncertain
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label>Accent Strength</Label>
//                     <span className="text-sm text-muted-foreground">
//                       {Math.round(
//                         formData.languageSettings.accentStrength * 100
//                       )}
//                       %
//                     </span>
//                   </div>
//                   <Slider
//                     value={[formData.languageSettings.accentStrength]}
//                     onValueChange={([value]) =>
//                       handleLanguageChange("accentStrength", value)
//                     }
//                     min={0}
//                     max={1}
//                     step={0.1}
//                   />
//                   <div className="flex justify-between text-xs text-muted-foreground">
//                     <span>Neutral</span>
//                     <span>Moderate</span>
//                     <span>Strong</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="p-4 border rounded-lg space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label className="text-base">Auto-detect Language</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Detect caller's language automatically
//                       </p>
//                     </div>
//                     <input
//                       type="checkbox"
//                       checked={formData.languageSettings.autoDetect}
//                       onChange={(e) =>
//                         handleLanguageChange("autoDetect", e.target.checked)
//                       }
//                       className="h-4 w-4 rounded border-gray-300"
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label className="text-base">Multilingual Support</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Handle multiple languages in one conversation
//                       </p>
//                     </div>
//                     <input
//                       type="checkbox"
//                       checked={formData.languageSettings.multilingual}
//                       onChange={(e) =>
//                         handleLanguageChange("multilingual", e.target.checked)
//                       }
//                       className="h-4 w-4 rounded border-gray-300"
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label className="text-base">Code Switching</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Allow mixing languages in responses
//                       </p>
//                     </div>
//                     <input
//                       type="checkbox"
//                       checked={formData.languageSettings.codeSwitching}
//                       onChange={(e) =>
//                         handleLanguageChange("codeSwitching", e.target.checked)
//                       }
//                       className="h-4 w-4 rounded border-gray-300"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card> */}

//         {/* Pronunciation */}
//         {/* <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Volume2 className="h-5 w-5" />
//               Pronunciation Guide
//             </CardTitle>
//             <CardDescription>
//               Customize pronunciation of names and special terms
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="companyName">Company Name</Label>
//                   <input
//                     id="companyName"
//                     value={formData.pronunciation.companyName}
//                     onChange={(e) =>
//                       handlePronunciationChange("companyName", e.target.value)
//                     }
//                     className="w-full px-3 py-2 border rounded-md"
//                     placeholder="Your company name"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phoneticCompanyName">
//                     Phonetic Pronunciation
//                   </Label>
//                   <input
//                     id="phoneticCompanyName"
//                     value={formData.pronunciation.phoneticCompanyName}
//                     onChange={(e) =>
//                       handlePronunciationChange(
//                         "phoneticCompanyName",
//                         e.target.value
//                       )
//                     }
//                     className="w-full px-3 py-2 border rounded-md"
//                     placeholder="Example: GLOW and GRACE"
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     How your company name should be pronounced
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between p-4 border rounded-lg">
//                 <div>
//                   <Label className="text-base">Phonetic Name Recognition</Label>
//                   <p className="text-sm text-muted-foreground">
//                     Use phonetic spelling for better name pronunciation
//                   </p>
//                 </div>
//                 <input
//                   type="checkbox"
//                   checked={formData.pronunciation.phoneticNames}
//                   onChange={(e) =>
//                     handlePronunciationChange("phoneticNames", e.target.checked)
//                   }
//                   className="h-4 w-4 rounded border-gray-300"
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <Label>Custom Pronunciations</Label>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={addCustomPronunciation}
//                 >
//                   Add Custom Pronunciation
//                 </Button>
//               </div>

//               {formData.pronunciation.customPronunciations.length > 0 ? (
//                 <div className="space-y-2">
//                   {formData.pronunciation.customPronunciations.map(
//                     (item, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between p-3 bg-secondary rounded-lg"
//                       >
//                         <div>
//                           <p className="font-medium">{item.word}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {item.pronunciation}
//                           </p>
//                         </div>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeCustomPronunciation(index)}
//                         >
//                           Remove
//                         </Button>
//                       </div>
//                     )
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 border-2 border-dashed rounded-lg">
//                   <p className="text-muted-foreground">
//                     No custom pronunciations added yet
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Add words that are commonly mispronounced
//                   </p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card> */}

//         {/* Actions */}
//         <div className="flex items-center justify-between pt-4 border-t">
//           <div className="text-sm text-muted-foreground">
//             Changes affect voice and language behavior
//           </div>
//           <Button type="submit" disabled={saving} size="lg">
//             {saving ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="mr-2 h-4 w-4" />
//                 Save Voice Settings
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Save,
  AlertCircle,
  Mic,
  Volume2,
  Languages,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VoiceSelection from "./voice-selection";
import { ReceptionistProgressWrapper } from "@/components/onboarding/receptionist-progress-wrapper";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";

const LANGUAGES1 = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "America/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Hong_Kong",
  "Australia/Sydney",
];

export default function VoiceSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [currentVoice, setCurrentVoice] = useState("alloy");
  const [shouldRefreshVoice, setShouldRefreshVoice] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    default_language: "en",
    supported_languages: ["en"],
    timezone: "America/New_York",
  });

  useEffect(() => {
    fetchBusinessData();
  }, [shouldRefreshVoice]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Get business data
      const { data: userData } = await supabase
        .from("users")
        .select("business_id")
        .eq("id", user.id)
        .maybeSingle();

      if (!userData?.business_id) throw new Error("No business found");
      setBusinessId(userData.business_id);

      // Get business config for voice
      const { data: configRes } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", userData.business_id)
        .maybeSingle();

      if (configRes?.config?.voiceProfile?.voice) {
        setCurrentVoice(configRes.config.voiceProfile.voice);
      }

      // Get business data for language/timezone
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", userData.business_id)
        .single();

      if (businessData) {
        setFormData({
          default_language: businessData.default_language || "en",
          supported_languages: businessData.supported_languages || ["en"],
          timezone: businessData.timezone || "America/New_York",
        });
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSaved = () => {
    // Trigger refresh to get updated voice
    setShouldRefreshVoice(!shouldRefreshVoice);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => {
      const langs = [...prev.supported_languages];
      const index = langs.indexOf(language);

      if (index > -1) {
        // Remove if it's not the default language
        if (language !== prev.default_language) {
          langs.splice(index, 1);
        }
      } else {
        langs.push(language);
      }

      // Ensure default language is always included
      if (!langs.includes(prev.default_language)) {
        langs.push(prev.default_language);
      }

      return { ...prev, supported_languages: langs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!businessId) throw new Error("No business ID found");

      // Update business language/timezone settings
      const businessUpdate = {
        default_language: formData.default_language,
        supported_languages: formData.supported_languages,
        timezone: formData.timezone,
        updated_at: new Date().toISOString(),
      };

      const { error: businessError } = await supabase
        .from("businesses")
        .update(businessUpdate)
        .eq("id", businessId);

      if (businessError) throw businessError;

      toast({
        title: "Success",
        description: "Settings saved successfully",
        variant: "default",
      });

      // Trigger onboarding progress refresh
      triggerOnboardingRefresh();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReceptionistProgressWrapper />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voice & Language</h1>
        <p className="text-muted-foreground">
          Configure voice profiles, language settings, and pronunciation
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Language Settings Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Language Settings
            </CardTitle>
            <CardDescription>
              Configure language preferences for your receptionist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="default_language">Default Language *</Label>
                <Select
                  value={formData.default_language}
                  onValueChange={(value) =>
                    handleChange("default_language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES1.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Supported Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES1.map((lang) => {
                    const isSupported = formData.supported_languages.includes(
                      lang.code
                    );
                    const isDefault = formData.default_language === lang.code;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageToggle(lang.code)}
                        className={`
                                px-3 py-1.5 rounded-full text-sm border transition-colors
                                ${
                                  isDefault
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : isSupported
                                    ? "bg-secondary text-secondary-foreground border-secondary"
                                    : "bg-background text-muted-foreground border-border hover:bg-accent"
                                }
                              `}
                      >
                        {lang.name}
                        {isDefault && " (Default)"}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click languages to enable/disable. Default language cannot be
                  disabled.
                </p>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => handleChange("timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Changes affect voice and language behavior
          </div>
          <Button type="submit" disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Voice Selection Card */}
      {businessId && (
        <VoiceSelection
          businessId={businessId}
          currentVoice={currentVoice}
          onVoiceSaved={handleVoiceSaved} // Changed from onVoiceChange
        />
      )}
    </div>
  );
}
