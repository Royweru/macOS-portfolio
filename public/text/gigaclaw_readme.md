GIGACLAW
An autonomous job-application agent
================================================================

Scrape, match, tailor, apply, report. A human stays in the loop
by default.

GigaClaw is a five-node LangGraph pipeline that hunts remote
roles for you. It pulls listings from RemoteOK, scores each one
against your profile with an LLM, rewrites your CV and cover
letter for the ones that clear the bar, submits applications
through Playwright, and writes everything it did into a
timestamped Markdown report.

It started life as an educational project on building a
real-world agent from scratch. The interesting part isn't that
it can apply to jobs. It's how much of the design is about
stopping it from doing the wrong thing:

* Approval first. AUTO_APPLY is off by default. Nothing is
  submitted until you say so.
* Human-in-the-loop queue. Pending decisions can be approved,
  skipped or retried from the CLI. They expire after 30 minutes
  (default action: skip) so a stale decision never fires.
* Hard submission caps. At most 3 live submissions per run and
  10 per UTC day, both configurable.
* A quality gate on tailoring. Every tailored CV and cover
  letter is scored. Anything under the threshold (default 0.72)
  is regenerated before it can go anywhere.
* A rollout gate. rollout-gate evaluates the latest run against
  safety thresholds, and rollout-artifacts validates the
  evidence captured for each application.


QUICK START
-----------
1. Clone and install

   git clone https://github.com/Royweru/gigclaw.git
   cd gigclaw
   python -m venv venv
   venv\Scripts\activate       (Windows)
   source venv/bin/activate    (Mac/Linux)
   pip install -r requirements.txt
   playwright install chromium

2. Configure

   cp .env.example .env

   Then edit .env with your real API key:
     OPENAI_API_KEY=sk-proj-your-real-key-here
     MODEL=gpt-5-nano

3. Set up (creates runtime folders, verifies config)

   python run.py setup

   Your profile and CV live under data/user/.

4. Run

   python run.py run


CLI
---
python run.py setup
    Initialize directories and verify config
python run.py run
    Run the full 5-node agent pipeline
python run.py scrape
    Refresh job data from RemoteOK
python run.py status
    View job stats and configuration
python run.py report
    Display the latest session report
python run.py hitl-pending
    List pending human review decisions
python run.py hitl-resolve <id> <approve|skip|retry>
    Resolve one HITL decision
python run.py hitl-run
    Execute approved/retry HITL decisions in live mode
python run.py rollout-gate
    Evaluate the latest run against rollout safety thresholds
python run.py rollout-artifacts
    Validate the latest apply evidence artifacts
python run.py --help
    Show all available commands


ARCHITECTURE
------------
Scrape --> Match --> Tailor --> Apply --> Report --> END
  |          |         |         |          |
  v          v         v         v          v
RemoteOK   GPT-5    GPT-5   Playwright   Markdown
  API      nano     nano    (Browser)     Report

Scrape  Fetches remote listings from RemoteOK and normalizes
        them into Job models.
Match   Scores each job against your profile (0 to 100). Only
        jobs at or above MIN_MATCH_SCORE continue.
Tailor  Generates a tailored CV and cover letter, then runs the
        quality gate and regeneration loop.
Apply   Submits through a Greenhouse adapter, a Lever adapter,
        or a generic heuristic form filler as fallback.
Report  Writes a timestamped Markdown session report.

Project structure

gigclaw/
  run.py              entry point
  requirements.txt    Python dependencies
  .env.example        config template
  app/
    ai/               LangChain multi-provider engine, prompts
    automation/       Playwright browser manager, form filler
    cli/              Typer + Rich commands
    core/             config, models, storage, setup
    graph/            LangGraph nodes and StateGraph workflow
    scrapers/         base class, RemoteOK, scraper runner
  data/               runtime data (git-ignored)
    jobs.json         scraped listings
    reports/          session reports
    screenshots/      Playwright screenshots
    user/             profile + CV


CONFIGURATION
-------------
NAME                          DEFAULT     WHAT IT DOES
OPENAI_API_KEY                required    API key
MODEL                         gpt-5-nano  model used
MAX_JOBS_PER_RUN              50          jobs per run
MIN_MATCH_SCORE               75.0        min match (0-100)
AUTO_APPLY                    false       skip human approval
TAILORING_QUALITY_THRESHOLD   0.72        min tailoring score
TAILORING_MAX_REGENERATIONS   1           retries if gate fails
ENABLE_GREENHOUSE_APPLIER     true        Greenhouse adapter
ENABLE_LEVER_APPLIER          true        Lever adapter
ENABLE_GENERIC_FALLBACK       true        generic form filler
MAX_LIVE_SUBMISSIONS_PER_RUN  3           live cap per run
MAX_LIVE_SUBMISSIONS_PER_DAY  10          live cap per UTC day
HITL_SLA_MINUTES              30          minutes until expiry
HITL_AUTO_EXPIRE_ACTION       skip        action on timeout


ADDING A SCRAPER
----------------
Scrapers share an abstract base class, so a new job board is
one small file:

  # app/scrapers/my_new_scraper.py
  from app.scrapers.base import BaseScraper

  class MyNewScraper(BaseScraper):
      def get_source_name(self) -> str:
          return "mysite"

      def scrape(self) -> list:
          # Your scraping logic here
          pass

      def _normalize(self, raw_data) -> list:
          # Convert to Job models
          pass


TECH STACK
----------
Python 3.10+, LangGraph (orchestration), LangChain (multi-
provider AI), OpenAI (matching and content), Playwright
(browser automation), Typer + Rich (CLI), Pydantic (validation
and settings), httpx (API scraping)


RESPONSIBLE USE
---------------
Review what it plans to send before you approve it, keep the
submission caps low, and respect each job board's terms of
service. Design notes for the tailoring engine are in
docs/phase3-tailoring-engine.md in the repo:
https://github.com/Royweru/gigclaw


LICENSE
-------
MIT