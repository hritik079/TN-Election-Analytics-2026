# 📊 AtliQ Media: 2026 Tamil Nadu Election Analytics

![Project Banner](https://img.shields.io/badge/Project-Data%20Analytics-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Python-Pandas-yellow?style=flat-square) ![Tech Stack](https://img.shields.io/badge/SQL-SQLite-lightgrey?style=flat-square) ![Tech Stack](https://img.shields.io/badge/UI-React%20%7C%20Tailwind-cyan?style=flat-square)

## 📌 Project Overview
An end-to-end automated data analytics pipeline and interactive broadcast dashboard developed for **AtliQ Media**. This project replaces manual election reporting with a scalable, real-time SQL-backed intelligence platform to analyze the 2026 Tamil Nadu Assembly Elections.

* **Developer:** Hritik Raj
* **Institute:** DS Vidhya
* **Project Guide:** Vijay Sir

## 🚀 Key Objectives Achieved
- **Zero Delay Reporting:** Engineered an automated ETL pipeline (Python to SQLite) to process ECI Form 20 data instantly.
- **Star Schema Data Warehousing:** Designed a centralized database optimized for sub-100ms analytical queries during live news broadcasts.
- **Unbiased Real-time Analytics:** Delivered 100% fact-based swing seat detection and margin calculations.

## 📈 Major Electoral Insights (2026 vs 2021)
1. **TVK Emerges as Single Largest Party:** Secured 108 seats, falling just short of the 118 majority mark.
2. **Massive Disruption:** 163 seats flipped compared to the 2021 elections.
3. **The Urban Sweep:** TVK captured 29 out of 32 constituencies in the Chennai Metro region.
4. **Battleground Extremes:** Recorded massive mandates (Madavaram at 70K+ margin) alongside extreme micro-margins (Tiruppattur decided by just 1 vote).

## 🛠️ Tech Stack & Tools
* **Data Extraction & Transformation:** Python (Pandas)
* **Data Warehousing & Queries:** SQL (SQLite, DB Browser)
* **Visualization & Dashboarding:** Power BI, React.js (Recharts, Tailwind CSS)
* **Presentation & Reporting:** Gamma AI

## 📂 Repository Structure
* `/Data` - Contains cleaned dimensional and fact tables (CSV format).
* `/Database` - The core SQLite database (`atliq_election.db`).
* `/Dashboard` - React JSX code & Power BI file for the UI/UX frontend of the newsroom terminal.
* `/Scripts` - Core analytical queries and pipeline setup.

## 💡 How to Run Locally
1. Download the `atliq_election.db` file and open it using any SQLite viewer (e.g., DB Browser for SQLite).
2. The JSX dashboard can be deployed into any standard React environment or rendered via CodeSandbox/Claude Artifacts.
3. The `.pbix` file can be opened directly via Microsoft Power BI Desktop.
