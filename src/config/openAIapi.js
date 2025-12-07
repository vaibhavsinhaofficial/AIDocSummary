const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey : process.env.apiKey,
});

async function getAISummary(text){

    
const response = await openai.chat.completions.create({

     model: "gpt-5-nano",
    messages: [
      { role: "system", content: "Summarize text in simple English." },
      { role: "user", content: text }
    ],

});

return response.choices[0].message.content;

}

module.exports = getAISummary;
