# M-Afya

**A WhatsApp-native health-monitoring agent for people managing blood pressure and blood sugar.**

A patient goes home with a glucometer or a blood pressure cuff and a number they don't know how to read. M-Afya is where they send that number. There is no app to install and no account to create: the patient messages a WhatsApp number, and the agent interprets the reading against reference material and replies in plain language, in the channel they already check fifty times a day.

It was built for a pharmacy that wanted to keep closer track of its diabetic patients between visits, and it is deployed on a server I manage myself.

---

## How it works

1. **The patient sends a message on WhatsApp.** Africa's Talking delivers it to a FastAPI webhook.
2. **A LangGraph agent works out what the message is**: a new reading, a question, or a request for a report, and routes it to the right step.
3. **Readings are interpreted against retrieved reference material.** The agent pulls the relevant passages from a ChromaDB knowledge base (retrieval-augmented generation) and interprets the value against them instead of answering from the model's memory.
4. **The reply goes back over WhatsApp** in plain language a patient can act on.
5. **On request, M-Afya generates a PDF summary** of the patient's readings with ReportLab.

## Design decisions

- **WhatsApp, not an app.** The hardest part of remote monitoring is getting patients to keep doing it. Meeting them in a chat they already use removes the install, the login and the learning curve.
- **Grounded, not improvised.** In anything health-adjacent, a fluent wrong answer is worse than no answer. Retrieval ties the agent's interpretation to reference material that can be inspected and corrected.
- **A graph, not one giant prompt.** LangGraph makes each step a node with defined inputs and outputs, so each part of the conversation can be tested on its own and changed without breaking the rest.
- **Self-hosted.** The service runs on a Hetzner VPS that I set up and maintain myself.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Agent orchestration | Python, LangGraph |
| Knowledge retrieval (RAG) | ChromaDB |
| API and webhooks | FastAPI |
| WhatsApp / messaging gateway | Africa's Talking |
| Reports | ReportLab (PDF) |
| Hosting | Self-managed Hetzner VPS |

## Intended use

M-Afya supports self-monitoring. It does not diagnose, prescribe, or replace a clinician, and it is not a medical device.

## Status and access

Built in early 2026 and deployed. There is no public live link and the source code is private, so the demo video on the project is the best way to see it working.

Want a walkthrough of the architecture or the code? Get in touch: weruroy347@gmail.com