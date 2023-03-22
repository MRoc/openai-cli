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

stdin.on("data", async (data) => {
  if (!data || data.length === 0) {
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: data,
      temperature: 0.6,
      max_tokens: 2048,
    });

    process.stdout.write(`${completion.data.choices[0].text}\n`);
    // process.stdout.write(`${JSON.stringify(completion.data.choices)}\n`);
  } catch (error) {
    throw new Error(error.message);
  }
});
