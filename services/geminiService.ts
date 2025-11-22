import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// The API key is obtained exclusively from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketingCopy = async (productName: string, productDescription: string, tone: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return "Error: API Key is missing. Please check your configuration.";
  }

  try {
    const prompt = `
      Act as a world-class copywriter.
      Write a compelling, high-conversion marketing ad copy for the following product.
      
      Product Name: ${productName}
      Description: ${productDescription}
      Tone: ${tone}
      
      Format the output using Markdown key-value pairs for better readability:
      
      **Headline:** [Catchy Headline]
      
      **Ad Copy:** [Compelling Body Text]
      
      **Call to Action:** [Strong CTA]
      
      Keep it punchy and under 150 words total.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Error generating marketing copy:", error);
    return "Sorry, we encountered an error generating your copy. Please try again later.";
  }
};

export const generateSocialMediaIdeas = async (topic: string, audience: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return "Error: API Key is missing. Please check your configuration.";
  }

  try {
    const prompt = `
      Act as a creative social media manager.
      Generate 3 creative and engaging social media post ideas based on the following inputs.

      Topic: ${topic}
      Target Audience: ${audience}

      Format the output using Markdown. 
      For each idea, use the following structure:

      ### Idea [Number]
      **Headline:** [Catchy Hook]
      **Visual:** [Brief description of visual]
      **Caption:** [Engaging text with hashtags]
      
      Separate each idea clearly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No ideas generated.";
  } catch (error) {
    console.error("Error generating social media ideas:", error);
    return "Sorry, we encountered an error generating your ideas. Please try again later.";
  }
};

export const generateSeoContentIdeas = async (keywords: string, audience: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return "Error: API Key is missing. Please check your configuration.";
  }

  try {
    const prompt = `
      Act as an SEO specialist.
      Generate 3 SEO-optimized content ideas based on the following keywords and target audience.

      Keywords: ${keywords}
      Target Audience: ${audience}

      Format the output using Markdown.
      For each idea, use the following structure:

      ### Idea [Number]
      **Title:** [SEO Friendly Title]
      **Content Outline:** [Brief outline of the content including key sections]
      **Meta Description:** [Optimized meta description under 160 characters]
      **Target Keywords:** [List of primary and secondary keywords used]

      Separate each idea clearly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No ideas generated.";
  } catch (error) {
    console.error("Error generating SEO ideas:", error);
    return "Sorry, we encountered an error generating your SEO ideas. Please try again later.";
  }
};