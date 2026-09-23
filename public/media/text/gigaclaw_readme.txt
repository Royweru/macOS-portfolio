# GigaClaw

**An autonomous job-application agent: scrape, match, tailor, apply, report. A human stays in the loop by default.**

GigaClaw is a five-node LangGraph pipeline that hunts remote roles for you. It pulls listings from RemoteOK, scores each one against your profile with an LLM, rewrites your CV and cover letter for the ones that clear the bar, submits applications through Playwright, and writes everything it did into a timestamped Markdown report.

It started life as an educational project on building a real-world agent from scratch. The interesting part isn't that it can apply to jobs. It's how much of the design is about stopping it from doing the wrong thing:

- **Approval first.** `AUTO_APPLY` is off by default. Nothing is submitted until you say so.
- **Human-in-the-loop queue.** Pending decisions can be approved, skipped or retried from the CLI, and they expire after 30 minutes (default action: skip) so a stale decision never fires.
- **Hard submission caps.** At most 3 live submissions per run and 10 per UTC day, configurable.
- **A quality gate on tailoring.** Every tailored CV and cover letter is scored. Anything under the threshold (default 0.72) is regenerated before it can go anywhere.
- **A rollout gate.** `rollout-gate` evaluates the latest run against safety thresholds, and `rollout-artifacts` validates the evidence captured for each application.

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/Royweru/gigclaw-agent
cd gigclaw
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
playwright install chromium
```

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env` with your real API key:

```
OPENAI_API_KEY=sk-proj-your-real-key-here
MODEL=gpt-5-nano
```

### 3. Set up

```bash
python run.py setup
```

This creates the runtime directories and verifies your config. Your profile and CV live under `data/user/`.

### 4. Run

```bash
python run.py run
```

---

## CLI

| Command | Description |
|---------|-------------|
| `python run.py setup` | Initialize directories and verify config |
| `python run.py run` | Run the full 5-node agent pipeline |
| `python run.py scrape` | Refresh job data from RemoteOK |
| `python run.py status` | View job stats and configuration |
| `python run.py report` | Display the latest session report |
| `python run.py hitl-pending` | List pending human review decisions |
| `python run.py hitl-resolve <id> <approve\|skip\|retry>` | Resolve one HITL decision |
| `python run.py hitl-run` | Execute approved/retry HITL decisions in live mode |
| `python run.py rollout-gate` | Evaluate the latest run against rollout safety thresholds |
| `python run.py rollout-artifacts` | Validate the latest apply evidence artifacts |
| `python run.py --help` | Show all available commands |

---

## Architecture

```
Scrape --> Match --> Tailor --> Apply --> Report --> END
  |          |         |         |          |
  v          v         v         v          v
RemoteOK   GPT-5    GPT-5   Playwright   Markdown
  API      nano     nano    (Browser)     Report
```

| Node | What it does |
|------|--------------|
| **Scrape** | Fetches remote listings from RemoteOK and normalizes them into `Job` models |
| **Match** | Scores each job against your profile (0 to 100). Only jobs at or above `MIN_MATCH_SCORE` continue |
| **Tailor** | Generates a tailored CV and cover letter, then runs the quality gate and regeneration loop |
| **Apply** | Submits through a Greenhouse adapter, a Lever adapter, or a generic heuristic form filler as fallback |
| **Report** | Writes a timestamped Markdown session report |

### Project structure

```
gigclaw/
├── run.py                    # Entry point
├── run.bat                   # Windows shortcut
├── .env                      # Your config (git-ignored)
├── .env.example              # Config template
├── requirements.txt          # Python dependencies
├── app/
│   ├── ai/                   # AI engine (LangChain multi-provider)
│   │   ├── engine.py         # Direct OpenAI integration
│   │   ├── providers.py      # LangChain multi-provider factory
│   │   └── prompts.py        # System prompts for matching/tailoring
│   ├── automation/           # Browser automation
│   │   ├── browser.py        # BrowserManager (Playwright singleton)
│   │   └── applicator.py     # GenericFormFiller (heuristic form filling)
│   ├── cli/                  # Command-line interface
│   │   └── commands.py       # All CLI commands (Typer + Rich)
│   ├── core/                 # Core business logic
│   │   ├── config.py         # Settings (Pydantic + .env)
│   │   ├── models.py         # Data models (Job, UserProfile, AgentState)
│   │   ├── setup.py          # Directory initialization
│   │   └── storage.py        # JSON persistence layer
│   ├── graph/                # LangGraph orchestration
│   │   ├── nodes.py          # 5 pipeline nodes
│   │   └── workflow.py       # StateGraph definition
│   └── scrapers/             # Job board scrapers
│       ├── base.py           # Abstract base class
│       ├── remoteok.py       # RemoteOK implementation
│       └── runner.py         # Scraper orchestrator
├── data/                     # Runtime data (git-ignored)
│   ├── jobs.json             # Scraped job listings
│   ├── reports/              # Session reports
│   ├── screenshots/          # Playwright screenshots
│   └── user/                 # User profile + CV
```

---

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | n/a | Your OpenAI API key |
| `MODEL` | No | `gpt-5-nano` | OpenAI model to use |
| `MAX_JOBS_PER_RUN` | No | `50` | Max jobs to process per run |
| `MIN_MATCH_SCORE` | No | `75.0` | Minimum AI match score (0-100) |
| `AUTO_APPLY` | No | `false` | Skip human approval |
| `TAILORING_QUALITY_THRESHOLD` | No | `0.72` | Minimum quality score for tailored artifacts |
| `TAILORING_MAX_REGENERATIONS` | No | `1` | Regeneration attempts when the quality gate fails |
| `ENABLE_GREENHOUSE_APPLIER` | No | `true` | Enable Greenhouse ATS adapter |
| `ENABLE_LEVER_APPLIER` | No | `true` | Enable Lever ATS adapter |
| `ENABLE_GENERIC_FALLBACK` | No | `true` | Enable generic form filler fallback |
| `MAX_LIVE_SUBMISSIONS_PER_RUN` | No | `3` | Safety cap on live submissions per pipeline run |
| `MAX_LIVE_SUBMISSIONS_PER_DAY` | No | `10` | Safety cap on live submissions per UTC day |
| `HITL_SLA_MINUTES` | No | `30` | Minutes before pending HITL decisions auto-expire |
| `HITL_AUTO_EXPIRE_ACTION` | No | `skip` | Default action when a HITL decision times out |

---

## Adding a scraper

Scrapers share an abstract base class, so a new job board is one small file:

```python
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
```

## Tech stack

- **Python 3.10+**
- **LangGraph**: workflow orchestration
- **LangChain**: multi-provider AI abstraction
- **OpenAI**: job matching and content generation
- **Playwright**: browser automation
- **Typer + Rich**: CLI and terminal UI
- **Pydantic**: data validation and settings
- **httpx**: HTTP client for API scraping

## Responsible use

Review what it plans to send before you approve it, keep the submission caps low, and respect each job board's terms of service. The tailoring engine design notes are in `docs/phase3-tailoring-engine.md` in the [repository](https://github.com/Royweru/gigclaw).

## License

MIT