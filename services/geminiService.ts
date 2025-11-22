import { GoogleGenAI, Content } from "@google/genai";

// Initialize the Gemini API client
// The API key is obtained exclusively from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AdvancedOptions {
  length?: string;
  creativity?: string;
  negativeKeywords?: string;
}

export const generateMarketingCopy = async (
  productName: string, 
  productDescription: string, 
  platform: string,
  tone: string, 
  options?: AdvancedOptions
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return "Error: API Key is missing. Please check your configuration.";
  }

  const { length = 'Medium', creativity = 'High', negativeKeywords = '' } = options || {};

  try {
    const prompt = `
      Act as a world-class copywriter.
      Write a compelling, high-conversion marketing ad copy for the following product.
      
      Product Name: ${productName}
      Description: ${productDescription}
      Target Platform: ${platform}
      Tone: ${tone}
      
      Constraints & Preferences:
      - Desired Length: ${length}
      - Creativity Level: ${creativity}
      - Format specifically for ${platform} (e.g. use hashtags for Instagram/Twitter, professional tone for LinkedIn, concise for Google Ads).
      ${negativeKeywords ? `- Strictly avoid these words/phrases: ${negativeKeywords}` : ''}
      
      Format the output using Markdown key-value pairs for better readability:
      
      **Headline:** [Catchy Headline]
      
      **Ad Copy:** [Compelling Body Text]
      
      **Call to Action:** [Strong CTA]
      
      Ensure the content is punchy and persuasive.
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

export const generateAdImage = async (
  productName: string,
  description: string,
  tone: string
): Promise<string | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  try {
    let visualStyle = "";
    
    switch (tone) {
      case 'Luxury':
        visualStyle = "high-end, elegant, sophisticated, cinematic lighting, premium textures (silk, marble, gold), dark or neutral color palette, sleek composition";
        break;
      case 'Exciting':
        visualStyle = "dynamic, high energy, vibrant colors, action-oriented, dramatic lighting, motion blur, bold composition";
        break;
      case 'Humorous':
        visualStyle = "playful, quirky, bright and colorful, exaggerated elements, fun atmosphere, whimsical style";
        break;
      case 'Urgent':
        visualStyle = "bold, high contrast, striking, intense, warm colors (reds, oranges), attention-grabbing, impact-focused";
        break;
      case 'Professional':
      default:
        visualStyle = "clean, minimalist, corporate, trustworthy, balanced composition, soft studio lighting, professional product photography style";
        break;
    }

    const prompt = `
      Generate a high-quality, photorealistic advertising image for a product named "${productName}".
      
      Product Description: ${description}.
      
      Target Visual Style: ${visualStyle}.
      
      Composition Instructions:
      - Create a compelling visual suitable for a digital marketing campaign.
      - Focus on lighting, composition, and product appeal.
      - Ensure the product is the focal point.
      - Background should complement the product without clutter.
      - STRICTLY NO TEXT, NO WORDS, NO TYPOGRAPHY in the image.
      - Aspect ratio 1:1.
      - 4K resolution, highly detailed.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    return null;
  } catch (error: any) {
    console.error("Error generating ad image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};

export const generateSocialMediaIdeas = async (
  topic: string, 
  audience: string,
  options?: AdvancedOptions
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return "Error: API Key is missing. Please check your configuration.";
  }

  const { length = 'Medium', creativity = 'High', negativeKeywords = '' } = options || {};

  try {
    const prompt = `
      Act as a creative social media manager.
      Generate 3 creative and engaging social media post ideas based on the following inputs.

      Topic: ${topic}
      Target Audience: ${audience}

      Constraints & Preferences:
      - Post Length Style: ${length}
      - Creativity Level: ${creativity}
      ${negativeKeywords ? `- Strictly avoid these words/phrases: ${negativeKeywords}` : ''}

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

export const generateSeoContentIdeas = async (
  keywords: string, 
  audience: string,
  options?: AdvancedOptions
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const { length = 'Medium', creativity = 'High', negativeKeywords = '' } = options || {};

  try {
    const prompt = `
      Act as an SEO specialist.
      Generate 3 SEO-optimized content ideas based on the following keywords and target audience.

      Keywords: ${keywords}
      Target Audience: ${audience}
      
      Constraints & Preferences:
      - Content Depth: ${length}
      - Creativity Level: ${creativity}
      ${negativeKeywords ? `- Strictly avoid these words/phrases: ${negativeKeywords}` : ''}

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

    if (!response.text) {
      throw new Error("The model returned an empty response.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Error generating SEO ideas:", error);
    
    // Return specific error messages for better UI handling
    if (error.message?.includes('API key')) {
       throw new Error("Invalid API Key. Please check your settings.");
    } else if (error.message?.includes('quota') || error.status === 429) {
       throw new Error("Usage limit exceeded. Please try again later.");
    } else {
       throw new Error("Failed to generate SEO content. Please try again.");
    }
  }
};

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

export const generateChatResponse = async (history: ChatMessage[], message: string, language: string = 'en'): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: API Key is missing.";
  }

  try {
    // Convert local message format to Gemini Content format
    const chatHistory: Content[] = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = `You are a helpful, professional, and witty AI assistant for 'ezAI Digital Marketing'. 
    Your goal is to help users with marketing questions, explain ezAI's services (SEO, PPC, Social Media, Content, Analytics), and encourage them to schedule a free audit. 
    Keep responses concise (under 50 words) unless asked for details.
    IMPORTANT: You must respond in the '${language}' language.`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: chatHistory,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const result = await chat.sendMessage({ message: message });
    return result.text || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};