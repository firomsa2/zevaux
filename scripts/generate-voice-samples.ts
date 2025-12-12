import "dotenv/config";

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Only 8 voices supported by Realtime API
const REALTIME_VOICES = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "sage",
  "shimmer",
  "verse",
];

async function generateAndStoreSamples() {
  console.log("Fetching voice samples from database...");

  const { data: samples, error } = await supabase
    .from("voice_samples")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching samples:", error);
    return;
  }

  if (!samples || samples.length === 0) {
    console.log("No samples found in database.");
    return;
  }

  console.log(`Found ${samples.length} voice samples to process.\n`);

  for (const sample of samples) {
    // Skip if voice already has audio
    if (sample.audio_url) {
      console.log(`✓ ${sample.voice} already has audio — skipping`);
      continue;
    }

    // Only process realtime-supported voices
    if (!REALTIME_VOICES.includes(sample.voice)) {
      console.log(`⚠ Skipping unsupported voice: ${sample.voice}`);
      continue;
    }

    console.log(`🎤 Generating audio for: ${sample.voice}...`);

    try {
      // Generate audio using tts-1 model (still works for these voices)
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: sample.voice as any,
        input: sample.sample_text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      const base64Audio = buffer.toString("base64");

      const fileName = `voice_${sample.voice}_${Date.now()}.mp3`;

      // Upload audio file
      const { error: uploadError } = await supabase.storage
        .from("voice-samples")
        .upload(fileName, buffer, {
          contentType: "audio/mpeg",
          cacheControl: "31536000",
        });

      if (uploadError) {
        console.error(`❌ Upload error for ${sample.voice}:`, uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("voice-samples")
        .getPublicUrl(fileName);

      // Update database row
      const { error: updateError } = await supabase
        .from("voice_samples")
        .update({
          audio_url: urlData.publicUrl,
          audio_base64: base64Audio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sample.id);

      if (updateError) {
        console.error(`❌ Update error for ${sample.voice}:`, updateError);
      } else {
        console.log(`✅ Stored audio for ${sample.voice}\n`);
      }

      // Delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`❌ Error generating ${sample.voice}:`, err);
    }
  }

  console.log("🎉 Voice sample generation complete!");
}

generateAndStoreSamples().catch(console.error);
