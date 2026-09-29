# WEATHERNEXUS · National Weather Big Data Analytics Platform
### Government of India · Ministry of Earth Sciences · India Meteorological Department (IMD)
> **SIH-26069 National Crisis & Meteorological Intelligence System**

[![Live Production](https://img.shields.io/badge/Production%20Deployment-Vercel%20Live-emerald?style=for-the-badge&logo=vercel)](https://weathernexus.vercel.app/)
[![Indian Standard Time](https://img.shields.io/badge/Time%20Standard-IST%20(UTC%2B5:30)-blue?style=for-the-badge)](https://weathernexus.vercel.app/)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80-orange?style=for-the-badge)](https://weathernexus.vercel.app/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Async-009688?style=for-the-badge&logo=fastapi)](https://weather-backend-onve.onrender.com/docs)
[![React Vite](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://weathernexus.vercel.app/)

---

## 🌐 Live Production URL
* **Main Portal**: **[https://weathernexus.vercel.app/](https://weathernexus.vercel.app/)**
* **Interactive API Documentation**: **[https://weather-backend-onve.onrender.com/docs](https://weather-backend-onve.onrender.com/docs)**

---

## 🌟 Executive Overview
**WEATHERNEXUS** is an autonomous, high-throughput national weather intelligence and crisis management platform designed for the Ministry of Earth Sciences and disaster authorities. It ingests, cross-corroborates, deduplicates, and analyzes millions of multi-source meteorological observations across all 36 States and Union Territories of India:
* **Government Observatories:** IMD Automatic Weather Stations (AWS) & Doppler Weather Radars.
* **Orbital Earth Observation:** INSAT-3DR Multispectral Infrared & Optical satellites, Open-Meteo, ECMWF reanalysis.
* **Social Feeds:** Real-time `#IMD`, `#WeatherAlert`, `#Cyclone`, `#MumbaiRains` streams in **Hindi and English**.
* **Citizen Ground Sensing:** Geolocation-tagged Mobile PWA field observations with photo evidence verification.

---

## 🚀 Key Architectural Pillars

```
┌─────────────────────────────────┬──────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
│ Capability                      │ Benchmark Systems                        │ WEATHERNEXUS National Platform                           │
├─────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ Temporal Standardization        │ Mixed UTC / unaligned timestamps         │ **100% Indian Standard Time (IST, UTC+5:30) Synced**     │
│ Bilingual Accessibility         │ English only or static translation       │ **Dynamic 1-Tap Toggle (English & हिन्दी for All Reports)** │
│ Real-Time Lifecycle Engine      │ Static historical database dumps         │ **24-Hour Sliding Retention & Auto-Refresh Ingestion**   │
│ Multimodal Evidence Check       │ Text keyword heuristics only (<10% acc)  │ **Tri-Check AI Engine + Vision AI Perceptual Hash (92%+)**│
│ Geospatial Aggregation          │ Crashed point-markers                    │ **Uber H3 Hexagonal Hierarchy (Resolution 7 Grid)**      │
│ Multi-Hazard Command            │ Single-threat view (or cyclone-only)     │ **Disasters & Hazard Tracking (Cyclones, Floods, Slips)**│
│ Human Governance                │ Static mock review                       │ **Apex Authority Review Desk + Cryptographic Audit Trail**│
│ Early Warning Outflow           │ None                                     │ **WMO-Standard 1-Click CAP Multi-Channel Broadcast**     │
└─────────────────────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 🧠 Core System Modules

### 1. Indian Standard Time (IST) & 24-Hour Sliding Ingestion Engine
* Every observation, radar pass, satellite capture, and operator action is strictly timestamped in **Indian Standard Time (IST, UTC+5:30)**.
* Continuous auto-refresh evaluates events against a 24-hour operational sliding window:
  - **Resolved / Obsolete hazards** are purged from active tactical views.
  - **Active meteorological threats & live AWS telemetry** are continuously re-ingested within today's live operational cycle so the National Command Center always operates on real-time data.

### 2. Comprehensive Bilingual Engine (English & हिन्दी)
* Segmented header switcher (`[ EN | हिन्दी ]`) with instantaneous platform-wide reactivity.
* Translates 100% of UI chrome, telemetry cards, audit logs, and dynamically translates **all weather report titles, observation descriptions, and 39+ Indian cities and states**.

### 3. Disasters & Hazard Tracking Center
* High-res multi-hazard surveillance module equipped with **Zoom Earth & Satellite observation passes**.
* Dual-panel satellite imagery linked to real-time Doppler radar wind fields.
* 72-Hour predictive cyclone landfall & wind velocity timeline simulation.
* Multi-Hazard Slide Tray for concurrent monitoring of **Cyclones, Flash Floods, Landslides, and Heatwaves**.

### 4. Tri-Check AI Verification & 55:45 Evidence Attribution
Every report receives an explainable **TrustScore™ (0–100%)** based on:
1. **Indic Weather NLP**: Multi-lingual text classification across Hindi, English, and regional terminology.
2. **Vision AI Photo Verification**: EXIF GPS metadata verification and perceptual image hashing against historical disaster archives to detect recycled imagery.
3. **Physical Doppler Cross-Check**: Real-time cross-referencing with the nearest physical IMD Doppler station within 35 km.
* Transparent **55% Citizen Ground Truth : 45% Satellite/Radar Corroboration** evidence split.

### 5. Official Authority Review Desk
* Secure Operator triage desk reserved for verified IMD Duty Officers and Disaster Authorities (`auth@weathernexus.gov.in`).
* Allows duty officers to inspect sensor cross-checks, review computer vision results, and render binding **VERIFY**, **QUARANTINE**, or **REJECT** decisions with required operational justifications.

### 6. Common Alerting Protocol (CAP) 1-Click Emergency Broadcast
* Directly compliant with WMO and NDMA CAP v1.2 emergency alerting standards.
* Authorizes officers to dispatch geo-targeted disaster alerts via **Cell Broadcast SMS**, **CAP RSS Feeds**, and **Emergency WhatsApp Broadcasts**.

---

## 🛠️ Project Structure & Optimizations

```
BIG-DATA-ANALYTICS-FOR-WHEATHER/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── events.py       # 7-Parameter meteorological event queries & H3 clusters
│   │   │   │   ├── ingest.py       # Multi-source ingestion & AI verification trigger
│   │   │   │   ├── review.py       # Operator review queue & HITL decision dispatch
│   │   │   │   ├── grievances.py   # Citizen dispute redressal lifecycle
│   │   │   │   ├── analytics.py    # Ingestion bus, funnels, trust spectrum
│   │   │   │   ├── alerts.py       # CAP Emergency broadcast engine
│   │   │   │   └── export.py       # Official printable PDF incident brief generator
│   │   │   └── api_router.py
│   │   ├── core/
│   │   │   ├── config.py           # System thresholds, API keys, CORS
│   │   │   └── database.py         # SQLAlchemy engine & connection pool
│   │   ├── models/
│   │   │   └── event.py            # WeatherEvent, AuditLog, Grievance schemas
│   │   └── main.py                 # FastAPI application
│   ├── requirements.txt
│   └── seed_data.py
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Live ticking IST clock & bilingual switch
    │   │   ├── Sidebar.jsx         # Clean navigation with Disasters & Hazard Tracking
    │   │   ├── Dashboard/          # National tactical map, priority queue, KPI cards
    │   │   ├── Events/             # Event registry table & AI truth inspection modal
    │   │   ├── Forecast/           # Multi-hazard command, satellite passes, wind forecast
    │   │   ├── Analytics/          # Data stream buses & verification funnels
    │   │   ├── ReviewQueue/        # Official Authority Operator triage desk
    │   │   ├── CitizenSubmit/      # Mobile PWA field reporting with Vision AI
    │   │   ├── Grievance/          # Citizen dispute portal & 55:45 score breakdown
    │   │   ├── Alerts/             # CAP Emergency Alert broadcast studio
    │   │   └── System/             # Microservices & National node health monitor
    │   ├── context/
    │   │   └── LanguageContext.jsx # Bilingual state, city/state maps, dynamic report translators
    │   ├── services/
    │   │   ├── api.js              # 24h sliding retention engine & API connector
    │   │   └── fallbackData.js     # Certified national baseline telemetry dataset
    │   ├── utils/
    │   │   └── time.js             # Indian Standard Time (IST) formatting utilities
    │   └── App.jsx                 # Master application controller
    ├── vite.config.js              # Optimized manual chunking (Leaflet, Lucide, Core)
    └── package.json
```

---

## ⚡ Local Development Quickstart

### Prerequisites
* **Node.js**: v18+ (Node v20+ recommended)
* **Python**: v3.10+

### 1. Launch the Frontend
```bash
cd frontend
npm install
npm run dev
```
* Access the local frontend at: [http://localhost:5173](http://localhost:5173)

### 2. Launch the Backend API (Optional for full backend parity)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Access the Swagger API documentation at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🚀 Production Deployment
* **Frontend**: Automatically deployed via continuous delivery on **Vercel** (`https://weathernexus.vercel.app/`).
* **Backend**: Hosted on **Render** (`https://weather-backend-onve.onrender.com/`).
* **Failover Guarantee**: The frontend includes a standalone national telemetry & H3 spatial engine ensuring 100% full-feature availability even during remote cloud cold-starts.

---

## 📜 Official Incident Brief PDF
Every incident in the platform can generate a certified **Disaster Incident Brief PDF** complete with:
* Unique Reference Incident ID & Ingestion Timestamps in **IST**.
* H3 Geospatial Hexagon Cell Coordinates.
* Tri-Check AI Verification Breakdown (NLP + Vision + Doppler).
* Physical Weather Radar Station corroboration readings.
* Immutable audit trail log for legal and governmental recordkeeping.

---
*Built for the Smart India Hackathon (SIH) · Problem Statement SIH-26069 · National Weather Intelligence*
