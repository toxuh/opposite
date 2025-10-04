import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

interface FactsRequest {
  userLat: number;
  userLon: number;
  antipodeLat: number;
  antipodeLon: number;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: FactsRequest = await req.json();
    const { userLat, userLon, antipodeLat, antipodeLon } = body;

    // Fallback facts if OpenAI fails
    const fallbackFacts = [
      "Most antipodes are in the ocean! About 71% of Earth's surface is water.",
      "Spain and New Zealand are nearly perfect antipodes of each other.",
      "If you could dig straight through Earth, it would take about 42 minutes to fall to the other side!",
      "The word 'antipode' comes from Greek, meaning 'with feet opposite'.",
      "China's antipode is mostly in Argentina and Chile.",
      "Very few major cities have their antipodes on land.",
      "The antipode of the North Pole is the South Pole!",
      "Hawaii's antipode is in Botswana, Africa.",
    ];

    // Check if API key is configured
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your_openai_api_key_here"
    ) {
      return NextResponse.json({ facts: fallbackFacts });
    }

    const prompt = `Generate 8 interesting facts about antipodes (opposite points on Earth). 

User's location: ${userLat.toFixed(2)}°, ${userLon.toFixed(2)}°
Antipode location: ${antipodeLat.toFixed(2)}°, ${antipodeLon.toFixed(2)}°

Requirements:
- 4 facts should be specific to these coordinates or the countries/regions they're in
- 4 facts should be general about antipodes, Earth's geography, or related science
- Each fact should be 1-2 sentences, engaging and educational
- Mix fun trivia with scientific information
- Keep facts concise (under 150 characters each)

Return ONLY a JSON array of 8 strings, nothing else. Example format:
["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5", "Fact 6", "Fact 7", "Fact 8"]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a geography expert who creates engaging, educational facts about antipodes and Earth's geography. Always respond with valid JSON arrays only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ facts: fallbackFacts });
    }

    // Parse the response
    try {
      const facts = JSON.parse(content);
      if (Array.isArray(facts) && facts.length === 8) {
        return NextResponse.json({ facts });
      }
      return NextResponse.json({ facts: fallbackFacts });
    } catch {
      return NextResponse.json({ facts: fallbackFacts });
    }
  } catch (error) {
    console.error("Error generating facts:", error);
    // Return fallback facts on error
    return NextResponse.json({
      facts: [
        "Most antipodes are in the ocean! About 71% of Earth's surface is water.",
        "Spain and New Zealand are nearly perfect antipodes of each other.",
        "If you could dig straight through Earth, it would take about 42 minutes to fall to the other side!",
        "The word 'antipode' comes from Greek, meaning 'with feet opposite'.",
        "China's antipode is mostly in Argentina and Chile.",
        "Very few major cities have their antipodes on land.",
        "The antipode of the North Pole is the South Pole!",
        "Hawaii's antipode is in Botswana, Africa.",
      ],
    });
  }
};
