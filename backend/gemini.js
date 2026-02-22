import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
    You are not Google. You will now behave like a voice-enabled assistant.
    
    Your task is to understand the user's natural language input and respond with a JSON object like this:
    
    {
      "type": "general" | "google-search" | "youtube-search" | "youtube-play" |
      "get-time" | "get-date" | "github-open" | "get-day" | "get-month" |
      "calculator-open" | "leetcode-open" | "linkedin-open" | "hotstar-open" |
      "netflix-open" | "twitter-open" | "flipkart-open" | "amazon-open" |
      "mail-open" | "drive-open" | "photos-open" | "calendar-open" | "ecoshudhra-open" |
      "instagram-open" | "facebook-open" | "weather-show",


      "userInput": "<original user input>" {only remove your name from userinput if exists} and ager kisi ne google ye youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,


      "response":"<a short spoken response to read out loud to the user>"
    }
      
    Instructions:
    -"type":determine the intentof the user.
    -"userinput": orginal sentence the user spoke.
    -"response":A short voice-friendly reply,e.g.,"sure,playing it now","Here's what I found","Today is Tuesday",etc.

    Type meanings:
    -"general": if it's a factural or informational question. aur ager koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki catagory me rakho bas mid-short answer dena.
    -"google-search": if user wants to search somethings on Google .
    -"youtube-search": if user wants to search somethings on Youtube.
    -"youtube-play": if user wants to directly play a video or song.
    -"calculator-open": if user wants to open a calculator.
    -"github-open": if user wants to open github.
    -"hotstar-open":if user wants to open hotstar. 
    -"netflix-open": if user wants to open netflix.
    -"twitter-open":if user wants to open twitter.
    -"flipkart-open":if user wants to open flipkart.
    -"amazon-open":if user wants to open amazon.
    -"mail-open":if user wants to open mail.
    -"drive-open":if user wants to open drive.
    -"photos-open":if user wants to open photos.
    -"ecoshudhra-open":if user wants to open ecoshudhra.
    -"calender-open":if user wants to open calender.
    -"leetcode-open": if user wants to open leetcode.
    -"linkedin-open": if user wants to open linkedin.
    -"instagram-open": if user wants to open instagram.
    -"facebook-open": if user wants to open facebok.
    -"weather-show": if user wants to know weather.
    -"get-time": if user asks for current time.
    -"get-date": if user asks for today's date .
    -"get-day": if user asks for what day it is .
    -"get-month": if user asks for the current month .


    Important:
    - Use ${userName} ager koi puche tume kisne banaya
    - only response with the JSON object, nothing else.
    
    now your userInput- ${command}

    `;

    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [
            {
              text: prompt, // ✅ This injects your actual input
            },
          ],
        },
      ],
    });

    return result.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return "Something went wrong with Gemini.";
  }
};

export default geminiResponse;