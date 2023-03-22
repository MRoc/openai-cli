import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
dotenv.config();

var stdin = process.stdin;
stdin.resume();
stdin.setEncoding("utf8");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!configuration.apiKey) {
  throw new Error("OpenAI API key not configured!");
}

const openai = new OpenAIApi(configuration);

const messages = [];

stdin.on("data", async (data) => {
  if (!data || data.length === 0) {
    return;
  }

  messages.push({ role: "user", content: data });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.6,
      max_tokens: 2048,
      n: 1,
      presence_penalty: -0.5,
      frequency_penalty: 1.0,
    });

    const message = completion.data.choices[0].message;

    messages.push(message);

    process.stdout.write(`${message.content}\n`);
    // process.stdout.write(`${JSON.stringify(completion.data.choices)}\n`);
  } catch (error) {
    throw new Error(error.message);
  }
});
