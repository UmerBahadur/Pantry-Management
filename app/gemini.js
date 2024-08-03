import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const MODEL_NAME = "gemini-1.0-pro";
  
  const API_KEY = "AIzaSyCipMvq2wDw7-bcYAz7B3_b1oHJa0SdiRc";
  
  async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };
  
    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];
  
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });
  
    const regionSpecificPrompt = `${prompt} give a link of recipes for these ingredients present.`;
  
    try {
        const result = await chat.sendMessage(regionSpecificPrompt);
        const response = result.response.text();
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error during chat:", error);
        return "Sorry, there was an error processing your request.";
    }
  }
  
  export default runChat;
  
  
  