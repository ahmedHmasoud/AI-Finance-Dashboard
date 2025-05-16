const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY } = process.env;

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint for AI spending suggestions
router.post('/spending-suggestions', async (req, res) => {
  try {
    const { spendingData } = req.body;
    
    if (!spendingData || !Array.isArray(spendingData)) {
      return res.status(400).json({ error: 'Invalid spending data format' });
    }

    // Format spending data for the prompt
    const formattedData = spendingData.map(item => `
      Category: ${item.category}
      Amount: $${item.amount}
      Date: ${item.date}
      Description: ${item.description || 'N/A'}
    `).join('\n');

    // Generate AI suggestions
    const prompt = `Analyze the following spending data and provide personalized financial advice and suggestions:
    ${formattedData}
    
    Please provide:
    1. A summary of spending patterns
    2. Areas for potential cost savings
    3. Budgeting recommendations
    4. Any potential red flags in spending behavior
    
    Format your response in a friendly, conversational tone.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.data.choices[0].message.content;
    
    res.json({
      success: true,
      suggestions: response,
      originalData: spendingData
    });

  } catch (error) {
    console.error('Error in AI suggestions:', error);
    res.status(500).json({
      error: 'Failed to generate AI suggestions. Please try again later.',
      details: error.message
    });
  }
});

module.exports = router;
