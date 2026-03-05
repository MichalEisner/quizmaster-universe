import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const categoryPrompts: Record<string, string> = {
  law: "české a mezinárodní právo, ústavní právo, trestní právo, občanské právo",
  it: "informační technologie, programování, počítačové sítě, operační systémy, kybernetická bezpečnost",
  games: "videoherní svět, herní historie, herní mechaniky, slavné herní série",
  movies: "filmy a seriály, režiséři, herci, filmové ceny, slavné scény",
  books: "světová i česká literatura, autoři, literární žánry, slavná díla",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, count = 10 } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const topic = categoryPrompts[category];
    if (!topic) throw new Error(`Unknown category: ${category}`);

    const systemPrompt = `Jsi tvůrce kvízových otázek v češtině. Generuj unikátní, zajímavé a různorodé otázky.
Každá otázka musí mít přesně 4 možnosti odpovědi, z nichž právě jedna je správná.
Otázky by měly být středně obtížné - ne příliš lehké, ale ani příliš těžké.
Snaž se, aby otázky byly co nejvíce různorodé a pokrývaly různá podtémata.`;

    const userPrompt = `Vygeneruj přesně ${count} kvízových otázek na téma: ${topic}.

Odpověz POUZE validním JSON polem v tomto formátu (žádný jiný text):
[
  {
    "question": "Text otázky?",
    "options": ["Odpověď A", "Odpověď B", "Odpověď C", "Odpověď D"],
    "correctIndex": 0
  }
]

correctIndex je index (0-3) správné odpovědi v poli options.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Příliš mnoho požadavků, zkuste to později." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Nedostatek kreditů." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    // Strip markdown code fences if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    const questions = JSON.parse(content);

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-questions error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
