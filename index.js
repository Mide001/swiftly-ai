// Import required modules and initialize Express
const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables from a .env file if present
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON request bodies
app.use(express.json());

app.post(
  "/api/generate-summary/:name/:amount/:walletAddress",
  async (req, res) => {
    const name = req.params.name;
    const amount = req.params.amount;
    const walletAddress = req.params.walletAddress;

    try {
      const messages = [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `Generate a short but professional payment summary for ${name}. Amount: ${amount}, Wallet Address: ${walletAddress}. Dont add any information for me to fill`,
        },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      const theResponse = completion.choices[0].message;

      return res.json({ result: theResponse });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
