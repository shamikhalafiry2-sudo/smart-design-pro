// generate.js - وسيط OpenAI API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, type } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `أنت مساعد تصميم. أعد JSON لتصميم ${type === 'logo' ? 'شعار' : 'بوستر'}. الهيكل: { "title": "عنوان", "subtitle": "نص فرعي", "bgColor": "#hex", "titleColor": "#hex", "subtitleColor": "#hex", "fontTitle": "Cairo", "fontSubtitle": "Tajawal", "elements": [ { "type": "text", "content": "نص", "x": 0.5, "y": 0.3, "fontSize": 48 } ] }`
          },
          { role: 'user', content: `صمم: ${prompt}` }
        ],
        temperature: 0.8, max_tokens: 500
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'OpenAI error');
    
    const jsonText = data.choices[0].message.content;
    const jsonMatch = jsonText.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error('JSON غير صالح');
    
    res.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
