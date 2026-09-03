// AI Generation Engine
// Uses structured prompt engineering templates to produce professional AI-like outputs.
// Each function simulates an AI model by applying tone, audience, and context parameters
// to generate structured, professional content.

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/[.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

function extractActionVerbs(text: string): string[] {
  const verbs = [
    'review', 'approve', 'send', 'schedule', 'prepare', 'follow up',
    'complete', 'discuss', 'finalize', 'submit', 'draft', 'update',
    'create', 'share', 'investigate', 'plan', 'implement', 'test',
    'design', 'deploy', 'research', 'analyze', 'assign', 'confirm',
  ];
  const lower = text.toLowerCase();
  return verbs.filter((v) => lower.includes(v));
}

function findDeadlines(text: string): string[] {
  const patterns = [
    /\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
    /\bby\s+(end of (?:this )?(?:week|month|quarter|year))\b/gi,
    /\bby\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/gi,
    /\bby\s+\w+\s+\d{1,2}(?:st|nd|rd|th)?/gi,
    /\bby\s+tomorrow\b/gi,
    /\bby\s+end of day\b/gi,
    /\bby\s+EOD\b/gi,
    /\bby\s+COB\b/gi,
    /\bnext week\b/gi,
    /\bASAP\b/gi,
    /\bdue\s+(?:on\s+)?(monday|tuesday|wednesday|thursday|friday)/gi,
  ];
  const results: string[] = [];
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) results.push(...matches);
  }
  return [...new Set(results.map((m) => capitalize(m)))];
}

// ─── Smart Email Generator ───

export interface EmailParams {
  topic: string;
  recipient: string;
  tone: string;
  audience: string;
  keyPoints: string;
}

export function generateEmail(params: EmailParams): { subject: string; body: string } {
  const { topic, recipient, tone, audience, keyPoints } = params;

  const toneMap: Record<string, { greeting: string; closing: string; style: string }> = {
    professional: { greeting: 'Dear', closing: 'Sincerely', style: 'formal and structured' },
    friendly: { greeting: 'Hi', closing: 'Best regards', style: 'warm and approachable' },
    urgent: { greeting: 'Dear', closing: 'Regards', style: 'direct and action-oriented' },
    apologetic: { greeting: 'Dear', closing: 'Sincerely', style: 'empathetic and accountable' },
    persuasive: { greeting: 'Dear', closing: 'Best regards', style: 'compelling and confident' },
    appreciative: { greeting: 'Hi', closing: 'With gratitude', style: 'genuine and positive' },
  };

  const t = toneMap[tone] || toneMap.professional;
  const recipientName = recipient || 'Team';
  const pointsArray = keyPoints
    .split(/[,\n]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const subjectLine = generateEmailSubject(topic, tone, audience);
  const bullets = pointsArray.length
    ? pointsArray.map((p) => `  • ${p}`).join('\n')
    : `  • ${topic}`;

  const audienceContext: Record<string, string> = {
    client: 'We value our partnership and want to ensure alignment on this matter.',
    team: 'I wanted to keep everyone in the loop on this.',
    executive: 'Please find below a concise overview for your review.',
    'external stakeholder': 'Thank you for your continued engagement with us.',
    general: '',
  };

  const ac = audienceContext[audience] || '';

  const body = `${t.greeting} ${recipientName},

${ac ? ac + '\n\n' : ''}I am writing regarding ${topic}. ${ac ? '' : ''}The purpose of this communication is to provide you with relevant details and next steps.

Key points to note:
${bullets}

${tone === 'urgent' ? 'Given the time-sensitive nature of this matter, I would appreciate your prompt attention. ' : ''}${tone === 'apologetic' ? 'I sincerely apologize for any inconvenience this may cause and appreciate your understanding. ' : ''}${tone === 'appreciative' ? 'I want to express my sincere appreciation for your support and collaboration on this. ' : ''}Please let me know if you have any questions or require further clarification. I am happy to discuss this at your convenience.

${t.closing},
[Your Name]
[Your Title]
[Your Company]`;

  return { subject: subjectLine, body };
}

function generateEmailSubject(topic: string, tone: string, audience: string): string {
  const topicClean = topic.trim();
  const prefixes: Record<string, string> = {
    professional: '',
    friendly: '',
    urgent: 'URGENT: ',
    apologetic: '',
    persuasive: 'Action Required: ',
    appreciative: 'Thank You — ',
  };
  const prefix = prefixes[tone] || '';
  const audienceSuffix = audience === 'executive' ? ' — For Review' : '';
  return `${prefix}${capitalize(topicClean)}${audienceSuffix}`;
}

// ─── Meeting Notes Summarizer ───

export function generateMeetingSummary(notes: string, title: string): {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  deadlines: string[];
} {
  const sentences = splitIntoSentences(notes);
  const allText = notes;

  // Key points: extract meaningful sentences
  const keyPoints: string[] = [];
  for (const sentence of sentences) {
    if (
      sentence.match(/\b(discussed|agreed|decided|noted|highlighted|raised|mentioned|presented|reviewed|identified|emphasized)\b/i)
    ) {
      keyPoints.push(capitalize(sentence));
    }
  }
  if (keyPoints.length === 0 && sentences.length > 0) {
    keyPoints.push(...sentences.slice(0, Math.min(5, sentences.length)).map(capitalize));
  }
  if (keyPoints.length === 0) {
    keyPoints.push('Meeting notes were provided but no distinct key points could be extracted.');
  }

  // Action items: find action verbs and build items
  const verbs = extractActionVerbs(allText);
  const actionItems: string[] = [];
  for (const verb of verbs) {
    const regex = new RegExp(`[^.\\n]*\\b${verb}\\b[^.\\n]*`, 'gi');
    const matches = allText.match(regex);
    if (matches) {
      for (const m of matches.slice(0, 1)) {
        const clean = m.trim().replace(/^(and|so|then|also|we|i|they|he|she)\s+/i, '');
        if (clean.length > 10) {
          actionItems.push(`${capitalize(verb)}: ${capitalize(clean)}`);
        }
      }
    }
  }
  if (actionItems.length === 0) {
    actionItems.push('Review meeting notes for any unrecorded action items.');
  }

  // Deadlines
  const deadlines = findDeadlines(allText);
  if (deadlines.length === 0) {
    deadlines.push('No specific deadlines were mentioned in the notes.');
  }

  const summary = `This meeting focused on ${title || 'the topics outlined below'}. ` +
    `${keyPoints.length} key discussion point${keyPoints.length !== 1 ? 's' : ''} ` +
    `were identified, ${actionItems.length} action item${actionItems.length !== 1 ? 's' : ''} ` +
    `were assigned, and ${deadlines.length} deadline${deadlines.length !== 1 ? 's' : ''} ` +
    `were noted. Participants should review the action items and ensure timely completion ` +
    `of assigned tasks. A follow-up meeting is recommended to track progress on outstanding items.`;

  return { summary, keyPoints: keyPoints.slice(0, 8), actionItems: actionItems.slice(0, 8), deadlines };
}

// ─── AI Task Planner ───

export interface TaskPlanParams {
  goal: string;
  timeframe: string;
  constraints: string;
}

export function generateTaskPlan(params: TaskPlanParams): Array<{
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  scheduledFor: string;
}> {
  const { goal, timeframe, constraints } = params;
  const goalLower = goal.toLowerCase();

  const tasks: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: string;
    scheduledFor: string;
  }> = [];

  // Always start with planning/research
  tasks.push({
    title: `Define scope and objectives for: ${goal}`,
    description: `Clearly define what success looks like for "${goal}". Identify key deliverables, stakeholders, and any constraints${constraints ? ` including: ${constraints}` : ''}. Document the scope to prevent scope creep.`,
    priority: 'high',
    estimatedTime: '1-2 hours',
    scheduledFor: 'Day 1 — Morning',
  });

  tasks.push({
    title: `Research and gather resources`,
    description: `Collect relevant information, tools, and references needed to accomplish "${goal}". Review similar past projects and identify best practices.`,
    priority: 'high',
    estimatedTime: '2-3 hours',
    scheduledFor: 'Day 1 — Afternoon',
  });

  // Break the goal into sub-tasks
  if (goalLower.includes('report') || goalLower.includes('document') || goalLower.includes('presentation')) {
    tasks.push({
      title: `Draft initial outline`,
      description: `Create a structured outline covering all sections of the ${goalLower.includes('report') ? 'report' : goalLower.includes('presentation') ? 'presentation' : 'document'}. Share with stakeholders for feedback before drafting.`,
      priority: 'high',
      estimatedTime: '1 hour',
      scheduledFor: 'Day 2 — Morning',
    });
    tasks.push({
      title: `Write first draft`,
      description: `Develop the full first draft based on the approved outline. Focus on content completeness over polish at this stage.`,
      priority: 'medium',
      estimatedTime: '3-4 hours',
      scheduledFor: 'Day 2 — Afternoon',
    });
    tasks.push({
      title: `Review, edit, and finalize`,
      description: `Review the draft for clarity, accuracy, and tone. Incorporate feedback from stakeholders. Proofread and format for delivery.`,
      priority: 'medium',
      estimatedTime: '2 hours',
      scheduledFor: 'Day 3 — Morning',
    });
  } else if (goalLower.includes('launch') || goalLower.includes('deploy') || goalLower.includes('release')) {
    tasks.push({
      title: `Prepare deployment checklist`,
      description: `Create a comprehensive checklist of all pre-launch, launch, and post-launch tasks. Include rollback plan and monitoring setup.`,
      priority: 'high',
      estimatedTime: '1-2 hours',
      scheduledFor: 'Day 2 — Morning',
    });
    tasks.push({
      title: `Execute pre-launch tasks`,
      description: `Complete all items on the pre-launch checklist. Verify environment configurations, run final tests, and confirm all dependencies are ready.`,
      priority: 'high',
      estimatedTime: '3-4 hours',
      scheduledFor: 'Day 2 — Afternoon',
    });
    tasks.push({
      title: `Launch and monitor`,
      description: `Execute the launch within the ${timeframe || 'agreed'} timeframe. Monitor for issues and be prepared to execute the rollback plan if needed.`,
      priority: 'high',
      estimatedTime: '2-3 hours',
      scheduledFor: 'Day 3',
    });
  } else {
    tasks.push({
      title: `Break down "${goal}" into sub-tasks`,
      description: `Decompose the goal into 3-5 manageable sub-tasks. Assign ownership and set dependencies. Consider the ${timeframe || 'available'} timeframe when sequencing.`,
      priority: 'high',
      estimatedTime: '1 hour',
      scheduledFor: 'Day 2 — Morning',
    });
    tasks.push({
      title: `Execute primary work`,
      description: `Begin executing the sub-tasks in priority order. Focus on high-impact items first. Track progress and note any blockers.`,
      priority: 'medium',
      estimatedTime: '4-6 hours',
      scheduledFor: 'Day 2 — Afternoon',
    });
    tasks.push({
      title: `Review and wrap up`,
      description: `Review completed work against the defined objectives. Document outcomes, lessons learned, and any remaining items for future consideration.`,
      priority: 'low',
      estimatedTime: '1 hour',
      scheduledFor: 'Day 3',
    });
  }

  tasks.push({
    title: `Follow-up and stakeholder update`,
    description: `Schedule a follow-up to review progress. Prepare a brief status update for stakeholders covering what was accomplished and any next steps.`,
    priority: 'low',
    estimatedTime: '30 minutes',
    scheduledFor: 'Day 3 — Afternoon',
  });

  return tasks;
}

// ─── AI Research Assistant ───

export function generateResearchSummary(topic: string, context: string): {
  summary: string;
  insights: string[];
} {
  const topicClean = topic.trim();
  const contextClean = context.trim();
  const hasContext = contextClean.length > 0;

  const insights: string[] = [];

  insights.push(`${capitalize(topicClean)} is a significant area of interest that requires a multifaceted approach. Understanding its core components is essential for informed decision-making.`);

  if (hasContext) {
    const contextSentences = splitIntoSentences(contextClean);
    for (const s of contextSentences.slice(0, 2)) {
      insights.push(`Based on the provided context: ${capitalize(s)}. This factor plays a crucial role in how ${topicClean} should be approached.`);
    }
  }

  insights.push(`Key trends in this area suggest that early adoption and continuous evaluation yield the best outcomes. Organizations that invest in understanding ${topicClean} thoroughly tend to gain a competitive advantage.`);

  insights.push(`Potential challenges include resistance to change, resource constraints, and the need for ongoing training. Mitigation strategies should be developed proactively.`);

  insights.push(`Recommended next steps: (1) Conduct a deeper analysis of the specific aspects most relevant to your situation, (2) Identify benchmarks and best practices from comparable contexts, and (3) Develop an actionable plan with clear milestones.`);

  const summary = `This research summary provides an overview of ${topicClean}. ` +
    `${hasContext ? `Based on the context provided, ` : ''}the analysis covers key trends, ` +
    `potential challenges, and recommended next steps. The insights below are designed to ` +
    `give you a foundation for further investigation and decision-making. ` +
    `Note that this is an AI-generated summary and should be supplemented with ` +
    `domain-specific research and expert consultation.`;

  return { summary, insights: insights.slice(0, 5) };
}

// ─── AI Chatbot ───

export function generateChatResponse(userMessage: string, conversationHistory: string[]): string {
  const msg = userMessage.toLowerCase().trim();

  // Greeting patterns
  if (msg.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
    return "Hello! I'm your AI Workplace Productivity Assistant. I can help you with email drafting, meeting summaries, task planning, research, and general productivity questions. How can I assist you today?";
  }

  // Email-related
  if (msg.includes('email') || msg.includes('draft') || msg.includes('message')) {
    return "I can help you draft a professional email. To generate the best email for you, I'd need to know: (1) What is the topic or purpose of the email? (2) Who is the recipient? (3) What tone would you like — professional, friendly, urgent, or another? You can use the Smart Email Generator feature on the sidebar for a full structured email draft.";
  }

  // Meeting-related
  if (msg.includes('meeting') || msg.includes('notes') || msg.includes('summary')) {
    return "For meeting notes summarization, I can extract key points, action items, and deadlines from your raw notes. Head over to the Meeting Notes Summarizer in the sidebar and paste your notes — I'll structure them into a clear, actionable summary for you.";
  }

  // Task-related
  if (msg.includes('task') || msg.includes('plan') || msg.includes('schedule') || msg.includes('prioritize')) {
    return "I can help you plan and prioritize your tasks! The AI Task Planner in the sidebar can break down your goals into actionable steps with priorities, estimated times, and scheduling suggestions. Just tell me your goal and timeframe, and I'll create a structured plan.";
  }

  // Research-related
  if (msg.includes('research') || msg.includes('investigate') || msg.includes('analyze') || msg.includes('study')) {
    return "The AI Research Assistant can help you explore a topic and generate insights and summaries. Navigate to the Research Assistant in the sidebar, enter your topic and any context, and I'll provide a structured overview with key insights and recommended next steps.";
  }

  // Productivity tips
  if (msg.includes('productive') || msg.includes('productivity') || msg.includes('time management') || msg.includes('focus')) {
    return "Here are some proven productivity strategies:\n\n1. **Time Blocking**: Allocate specific time blocks for focused work. Schedule deep work in the morning when energy is highest.\n2. **The 2-Minute Rule**: If a task takes less than 2 minutes, do it immediately rather than adding it to your to-do list.\n3. **Prioritize with Eisenhower Matrix**: Categorize tasks by urgency and importance. Focus on important-but-not-urgent tasks to reduce future crises.\n4. **Batch Similar Tasks**: Group related tasks (e.g., all emails, all calls) to reduce context switching.\n5. **Take Breaks**: Use techniques like Pomodoro (25 min work, 5 min break) to maintain focus throughout the day.\n\nWould you like me to help you create a specific plan using the Task Planner?";
  }

  // Help
  if (msg.includes('help') || msg.includes('what can you do') || msg.includes('features')) {
    return "I'm your AI Workplace Productivity Assistant. Here's what I can help with:\n\n• **Smart Email Generator** — Create professional emails with customizable tone and audience\n• **Meeting Notes Summarizer** — Extract key points, action items, and deadlines from raw notes\n• **AI Task Planner** — Break down goals into prioritized, scheduled tasks\n• **AI Research Assistant** — Get insights and summaries on any topic\n• **AI Chatbot** — Ask me anything about productivity and workplace tasks\n\nYou can access each feature from the sidebar on the left. What would you like to do?";
  }

  // Thanks
  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
    return "You're very welcome! I'm here whenever you need help with your workplace tasks. Is there anything else I can assist you with?";
  }

  // Default: try to give a helpful structured response
  const responses = [
    `That's a great question about "${userMessage}". Here's how I'd approach it:\n\n1. Start by clarifying the specific outcome you're looking for.\n2. Break the problem into smaller, manageable parts.\n3. Use the Task Planner feature to create a structured action plan.\n4. If research is needed, try the Research Assistant for insights.\n\nWould you like me to help you take a specific next step?`,
    `I understand you're asking about "${userMessage}". While I can provide general guidance here, you might get more detailed results by using one of the specialized tools in the sidebar — the Email Generator, Meeting Summarizer, Task Planner, or Research Assistant, depending on your need. What specific outcome are you trying to achieve?`,
    `Thanks for sharing that. Regarding "${userMessage}": I'd recommend breaking this down into actionable steps. You can use the AI Task Planner to create a prioritized plan, or if this involves communication, the Email Generator can help you craft the right message. What would be most useful for you right now?`,
  ];

  const index = conversationHistory.length % responses.length;
  return responses[index];
}
