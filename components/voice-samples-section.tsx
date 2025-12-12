import { createClient } from "@/utils/supabase/server";
import VoicePlayer from "./voice-player";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Volume2, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

// Realtime-supported voices in desired order
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

export default async function VoiceSamplesSection() {
  const supabase = await createClient();

  // Fetch voice samples from Supabase
  const { data: samples, error } = await supabase
    .from("voice_samples")
    .select("*")
    .eq("is_active", true)
    .order("voice");

  if (error) {
    console.error("Error fetching voice samples:", error);
    return null;
  }

  if (!samples || samples.length === 0) {
    return null;
  }

  // Sort voices according to our preferred order
  const sortedVoices = REALTIME_VOICES_ORDER.map((voiceName) =>
    samples.find((s) => s.voice === voiceName)
  ).filter(Boolean);

  // Split into main (first 6) and additional (last 2)
  const mainVoices = sortedVoices.slice(0, 6);
  const additionalVoices = sortedVoices.slice(6);

  return (
    <section
      id="voice-samples"
      className="py-20 bg-gradient-to-b from-background via-primary/5 to-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience OpenAI's Premium Voice Samples
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from 8 distinct, realtime-supported voices for your AI
            receptionist. All samples are pre-generated and stored for instant
            playback.
          </p>
        </div>

        {/* Main Voices - First 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mainVoices.map((voice) => (
            <Card
              key={voice.id}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group bg-white/95 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${voice.icon_color} flex items-center justify-center shadow-md`}
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {voice.sample_name}
                      </h3>
                      <BadgeCheck className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {voice.gender}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${voice.icon_color} text-white`}
                  >
                    Realtime
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {voice.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-medium mb-2 text-primary">
                  Best for:
                </p>
                <p className="text-xs text-muted-foreground">
                  {voice.best_for}
                </p>
              </div>

              {/* Voice Player Component */}
              <div className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-transparent">
                <VoicePlayer
                  voice={voice.voice}
                  audioBase64={voice.audio_base64}
                  audioUrl={voice.audio_url}
                  text={voice.sample_text}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Voices - Last 2 */}
        {additionalVoices.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-center mb-6">
              Additional Professional Voices
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-3xl mx-auto">
              {additionalVoices.map((voice) => (
                <Card
                  key={voice.id}
                  className="p-4 hover:shadow-lg transition-all hover:border-primary/30 bg-white/95 backdrop-blur-sm"
                >
                  <div
                    className={`w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br ${voice.icon_color} flex items-center justify-center`}
                  >
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-medium text-sm mb-2 text-center">
                    {voice.sample_name}
                  </div>
                  <div className="border rounded-lg p-2 bg-gradient-to-br from-primary/5 to-transparent">
                    <VoicePlayer
                      voice={voice.voice}
                      audioBase64={voice.audio_base64}
                      audioUrl={voice.audio_url}
                      text={voice.sample_text}
                      compact={true}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Feature Highlight */}
        <Card className="max-w-4xl mx-auto p-8 mb-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-semibold text-2xl mb-4">
                All 8 Realtime Voices Included
              </h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Optimized for realtime conversations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Switch between voices anytime</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Perfect for AI receptionist applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Instant playback from pre-generated samples</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
              <h5 className="font-semibold mb-4 text-center">
                Voice Statistics
              </h5>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    8
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Realtime Voices
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 rounded-lg bg-primary/5">
                    <div className="text-lg font-semibold">100%</div>
                    <div className="text-xs text-muted-foreground">
                      Pre-generated
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/5">
                    <div className="text-lg font-semibold">Optimized</div>
                    <div className="text-xs text-muted-foreground">
                      For Realtime
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              Try All Voices in Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            All 8 OpenAI Realtime voices included • Instant playback • Optimized
            for live conversations
          </p>
        </div>
      </div>
    </section>
  );
}
