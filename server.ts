import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Agent Copilot Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, context, mode } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      // Fallback deterministic smart response when API key is not configured
      const lower = message.toLowerCase();
      let fallbackText = "I've analyzed your workspace data. Here's a structured execution plan:\n\n1. Review your current CRM conversion rate (currently 8.7%).\n2. Prioritize following up with the 326 qualified leads using tailored email sequences.\n3. Keep website copy aligned with your value proposition to maximize organic acquisition.\n\nAll tasks have been staged in your workflow review queue.";
      
      if (lower.includes('launch') || lower.includes('product')) {
        fallbackText = "🚀 Product Launch Action Plan:\n\n1. Website Builder: Update hero copy and publish the launch announcement banner.\n2. CRM: Filter and tag high-value customer accounts (e.g., Priya Sharma, Vikram Singh).\n3. Marketing: Schedule a 3-part automated email sequence for launch day.\n4. Webinars: Schedule a live walkthrough session for community signups.\n5. Analytics: Set up tracking for conversion rates and recurring subscription starts.";
      } else if (lower.includes('lead') || lower.includes('follow up') || lower.includes('contact')) {
        fallbackText = "📋 Lead Follow-up Protocol:\n\n1. Segment leads received within the last 24 hours (e.g. Rahul Mehta, Neha Gupta).\n2. Dispatch personalized discovery meeting links with automated reminders.\n3. Sync contact notes directly to your CRM table.\n4. Flag leads inactive after 72 hours for automated re-engagement.";
      } else if (lower.includes('performance') || lower.includes('revenue') || lower.includes('summary')) {
        fallbackText = "📊 Business Health Summary:\n\n• Total Revenue: ₹4,82,650 (+12.8% MoM)\n• Active Subscriptions: 846 accounts (72% of monthly target)\n• Qualified Leads: 326 leads ready for conversion\n• Marketing Open Rate: 24.6% (exceeding industry benchmark by +6.4%)\n\nRecommendation: Focus on converting the 326 qualified prospects to boost MRR past ₹9,00,000.";
      }

      res.json({
        reply: fallbackText,
        source: 'nexus-copilot-local',
      });
      return;
    }

    const systemPrompt = `You are Nexus Business Copilot, an elite executive AI operating inside a unified modern business platform. 
The platform manages:
- Website builder (landing pages, themes, headlines)
- CRM & Contacts (leads, prospects, customers, MRR values)
- Subscriptions & Billing (Starter ₹499/mo, Pro ₹1,499/mo, Business ₹3,999/mo)
- Marketing Campaigns (email, newsletters, open rate: 24.6%)
- Webinars & Community Events
- Analytics & Revenue Forecasting

Provide crisp, structured, executive-grade advice and concrete numbered steps. Be actionable, concise, and helpful. Current workspace context: ${context || 'Acme Studio demo workspace'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'Unable to generate response.',
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      error: 'Failed to process AI request',
      details: error.message || 'Unknown error',
    });
  }
});

// Download ZIP Archive Endpoint
app.get('/api/download-zip', (_req, res) => {
  const zipPath = path.resolve(__dirname, 'nexus-workspace.zip');
  res.download(zipPath, 'nexus-workspace.zip', (err) => {
    if (err) {
      console.error('Error downloading zip:', err);
      res.status(500).send('Could not download zip file');
    }
  });
});

// Setup Vite in development or static serve in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Nexus workspace server running on port ${port}`);
  });
}

startServer();
