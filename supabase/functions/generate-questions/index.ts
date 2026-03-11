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
    const { category, count = 10, difficulty = 'medium', customTopic } = await req.json();

    const difficultyPrompts: Record<string, string> = {
      easy: 'Otázky musí být LEHKÉ – základní fakta, která zná většina lidí. Žádné chytáky.',
      medium: 'Otázky by měly být STŘEDNĚ OBTÍŽNÉ – vyžadují solidní znalosti, ale nejsou extrémně těžké.',
      hard: 'Otázky musí být TĚŽKÉ – detailní a specifické znalosti, chytáky, méně známá fakta. Pro skutečné experty.',
    };
    const difficultyInstruction = difficultyPrompts[difficulty] || difficultyPrompts.medium;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let topic: string;

    if (category === 'custom') {
      if (!customTopic || typeof customTopic !== 'string' || customTopic.trim().length < 3) {
        return new Response(JSON.stringify({ error: "Zadej prosím téma s alespoň 3 znaky." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Sanitize: limit length
      topic = customTopic.trim().slice(0, 100);
    } else {
      topic = categoryPrompts[category];
      if (!topic) throw new Error(`Unknown category: ${category}`);
    }

    const subtopics: Record<string, string[]> = {
      law: ["pracovní právo a zákoník práce", "rodinné právo a dědictví", "obchodní právo a korporace", "správní právo a úřady", "trestní právo procesní", "mezinárodní humanitární právo", "právo duševního vlastnictví", "ústavní právo a dělba moci", "evropské právo a instituce EU", "historie práva a právní filosofie"],
      it: ["algoritmy a datové struktury", "webové technologie a frameworky", "databáze a SQL", "umělá inteligence a strojové učení", "mobilní vývoj", "cloudové služby", "kryptografie a šifrování", "historie počítačů", "linuxové systémy", "síťové protokoly a architektura"],
      games: ["retro hry a konzole 80. a 90. let", "indie hry a jejich tvůrci", "esport a kompetitivní scéna", "herní enginy a technologie", "RPG a příběhové hry", "FPS a akční hry", "strategické a simulační hry", "Nintendo a jeho historie", "PlayStation a Xbox exkluzivity", "mobilní a VR hry"],
      movies: ["české filmy a nová vlna", "animované filmy a studia", "sci-fi a fantasy filmy", "filmová hudba a soundtracky", "oscarové filmy a ceremonie", "režiséři 21. století", "kultovní seriály", "dokumentární filmy", "akční a thriller filmy", "komedie a romantické filmy"],
      books: ["česká literatura 20. století", "fantasy a sci-fi literatura", "klasická ruská literatura", "americká literatura", "dětská literatura a pohádky", "básníci a poezie", "detektivní a kriminální romány", "nobelova cena za literaturu", "antická literatura", "současná světová próza"],
    };

    const seed = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();

    let systemPrompt: string;
    let userPrompt: string;

    if (category === 'custom') {
      systemPrompt = `Jsi kreativní tvůrce kvízových otázek v češtině. Uživatel ti zadá téma a ty vytvoříš kvízové otázky.
DŮLEŽITÉ PRAVIDLO: Pokud zadané téma je nesmyslné, nesrozumitelné, příliš vágní, urážlivé, nebo z něj nelze vytvořit faktické kvízové otázky, odpověz POUZE tímto JSON objektem (žádný jiný text):
{"error": "Omlouváme se, ale na toto téma nelze vytvořit kvíz. Zkus zadat jiné, konkrétnější téma."}

Pokud téma JE validní:
- Každá otázka musí mít přesně 4 možnosti odpovědi, z nichž právě jedna je správná.
- ${difficultyInstruction}
- Otázky by měly být zajímavé, fakticky správné a ověřitelné.`;

      userPrompt = `Vygeneruj přesně ${count} UNIKÁTNÍCH kvízových otázek na téma: "${topic}".

Identifikátor generování: ${seed}-${timestamp}. Buď maximálně kreativní.

Pokud téma NENÍ vhodné pro kvíz, odpověz chybovým JSON objektem jak je popsáno v instrukcích.

Jinak odpověz POUZE validním JSON polem v tomto formátu (žádný jiný text):
[
  {
    "question": "Text otázky?",
    "options": ["Odpověď A", "Odpověď B", "Odpověď C", "Odpověď D"],
    "correctIndex": 0
  }
]

correctIndex je index (0-3) správné odpovědi v poli options.`;
    } else {
      const catSubtopics = subtopics[category] || [];
      const shuffled = catSubtopics.sort(() => Math.random() - 0.5);
      const focus = shuffled.slice(0, 3).join(", ");

      systemPrompt = `Jsi kreativní tvůrce kvízových otázek v češtině. NIKDY neopakuj stejné otázky.
Každá otázka musí mít přesně 4 možnosti odpovědi, z nichž právě jedna je správná.
${difficultyInstruction}
Otázky by měly být zajímavé a překvapivé.`;

      userPrompt = `Vygeneruj přesně ${count} UNIKÁTNÍCH kvízových otázek na téma: ${topic}.

POVINNĚ se zaměř především na tato podtémata: ${focus}.
Identifikátor generování: ${seed}-${timestamp}. Buď maximálně kreativní a vyhni se očividným/banálním otázkám.

Odpověz POUZE validním JSON polem v tomto formátu (žádný jiný text):
[
  {
    "question": "Text otázky?",
    "options": ["Odpověď A", "Odpověď B", "Odpověď C", "Odpověď D"],
    "correctIndex": 0
  }
]

correctIndex je index (0-3) správné odpovědi v poli options.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        temperature: 1.2,
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

    const parsed = JSON.parse(content);

    // Check if AI returned an error object (for invalid custom topics)
    if (parsed && !Array.isArray(parsed) && parsed.error) {
      return new Response(JSON.stringify({ error: parsed.error }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ questions: parsed }), {
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
