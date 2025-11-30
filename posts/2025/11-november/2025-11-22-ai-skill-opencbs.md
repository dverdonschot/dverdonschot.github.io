---
title: Building an AI Skill to Analyze Datasets on CBS Open Data
date: 2025-11-22
description: Get answers to your questions based on open Dutch Government data.
tags: [AI Skill, Open Data, CBS]
image: /images/blog/2025/cbsoanalyze-hero-min.jpg
imageAlt: Dashboard visualization showing CBS Open Data analysis with charts and statistics about Dutch demographic and economic trends
---

# AI Skills Project: OpenCBS

After watching [IndyDevDan](https://www.youtube.com/channel/UC_x36zCEGilGpB1m-V4gmjg) create an AI Skill to analyze Polymarket in his video [Why are top engineers DITCHING MCP Servers?](https://youtu.be/OIKTsVjTVJE), I was inspired to build something similar for Dutch government data.

My goal was to create an AI Skill that analyzes datasets from [CBS Open Data](https://opendata.cbs.nl/portal.html?_la=nl&_catalog=CBS) (Centraal Bureau voor de Statistiek - the Dutch national statistics office).

## What are Skills?

Skills are specialized instruction sets that AI assistants like Claude can use to perform specific tasks with domain expertise. Think of them as reusable templates that help automate repetitive work and enforce best practices. They're especially useful in Claude Code, an AI coding assistant that can execute tasks in your development environment.

### CBS Dataset Analyzer (`cbs-analyzer`)

**Location**: `.claude/skills/cbs-analyzer/SKILL.md`
**Repository**: [CBS Analyzer Skill](https://github.com/dverdonschot/claude-code-ai-skills/tree/main/.claude/skills/cbs-analyzer)

This skill enables Claude to download and analyze CBS Open Data datasets. Key capabilities:

- Browse available CBS Open Datasets based on your queries
- Download datasets using the opencbs CLI tool
- Check for cached data to avoid redundant downloads
- Explore dataset dimensions and structure
- Generate analysis scripts based on your questions
- Answer questions about Dutch demographic, economic, and social statistics

**When to use**: Analyzing CBS datasets, exploring trends in Dutch statistics, or querying CBS Open Data by dataset ID.

## Best Practices

Learn more at [Claude Skills](https://www.claude.com/blog/skills)

- Keep skills focused on a single responsibility
- Make skills reusable across different projects
- Include clear examples in skill documentation
- Test skills thoroughly before relying on them
- Update central repository; changes propagate via symlinks
