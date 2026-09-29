// Standalone Built-in National Telemetry & H3 Clusters Fallback
// Guarantees 100% full-access platform operations across any production deployment (Vercel/Static)

export const FALLBACK_SUMMARY = {
  "total_events": 53,
  "today_events": 53,
  "pending_review": 3,
  "verified_events": 49,
  "critical_events": 2,
  "open_grievances": 0,
  "detection_accuracy_pct": 92.5,
  "sources_online": "5/5 Multi-Source",
  "ingestion_rate_recs_sec": 34.6,
  "pipeline_status": "ONLINE_HEALTHY",
  "last_sync_ist": "04:30:00 PM IST"
};

export const FALLBACK_EVENTS = [
  {
    "title": "High swell waves along Puri and Ganjam coastal belt. CWC issues advisory for fishermen not to v...",
    "description": "High swell waves along Puri and Ganjam coastal belt. CWC issues advisory for fishermen not to venture into deep sea. #OdishaWeather #CycloneAlert (04:30 PM IST)",
    "category": "Cyclone",
    "severity": "High",
    "latitude": 19.8135,
    "longitude": 85.8312,
    "city": "Puri",
    "state": "Odisha",
    "source": "Twitter",
    "source_author": "@OdishaDisasterWatch",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:13:06.827105",
    "id": "EVT-TW-F0C83C00",
    "h3_index": "873c9db96ffffff",
    "source_credibility": 0.6,
    "external_reference": "twitter:tweet:tw-1c4e2db603",
    "is_media_authentic": true,
    "vision_check_result": "{\"channel\": \"Vision AI\", \"status\": \"SATELLITE_OPTICAL_VERIFIED\", \"score\": 98, \"recycled\": false, \"visual_features\": [\"INSAT-3DR Multispectral Optical (0.65\\u00b5m) cloud top visual match\", \"Thermal Infrared (10.8\\u00b5m) precipitation moisture reflectance verified\", \"High-resolution orbital satellite visual concurrence 98.4%\"], \"explanation\": \"Orbital satellite multispectral optical & thermal IR visual imagery directly confirms dense cloud canopy and surface moisture accumulation.\"}",
    "trust_score": 91.0,
    "nlp_confidence": 0.92,
    "radar_corroborated": false,
    "radar_station_name": "INSAT-3DR Satellite & Doppler Grid (19.81\u00b0N, 85.83\u00b0E)",
    "radar_recorded_value": 4.2,
    "verification_status": "VERIFIED",
    "operator_decision": "UNREVIEWED",
    "operator_notes": "Ingested via Twitter Weather Intelligence Connector",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:13:06.827105"
  },
  {
    "title": "\u092c\u093f\u0939\u093e\u0930 \u092e\u094c\u0938\u092e \u0905\u0932\u0930\u094d\u091f: \u092a\u091f\u0928\u093e \u0914\u0930 \u0906\u0938\u092a\u093e\u0938 \u0915\u0947 \u091c\u093f\u0932\u094b\u0902 \u092e\u0947\u0902 \u092e\u0947\u0918\u0917\u0930\u094d\u091c\u0928 \u0915\u0947 \u0938\u093e\u0925 \u092d\u093e\u0930\u0940 \u092c\u093e\u0930\u093f\u0936 \u0915\u0940 \u0938\u0902\u092d\u093e\u0935\u0928\u093e\u0964 \u092a\u094d\u0930\u0936\u093e\u0938\u0928 \u0928\u0947 ...",
    "description": "\u092c\u093f\u0939\u093e\u0930 \u092e\u094c\u0938\u092e \u0905\u0932\u0930\u094d\u091f: \u092a\u091f\u0928\u093e \u0914\u0930 \u0906\u0938\u092a\u093e\u0938 \u0915\u0947 \u091c\u093f\u0932\u094b\u0902 \u092e\u0947\u0902 \u092e\u0947\u0918\u0917\u0930\u094d\u091c\u0928 \u0915\u0947 \u0938\u093e\u0925 \u092d\u093e\u0930\u0940 \u092c\u093e\u0930\u093f\u0936 \u0915\u0940 \u0938\u0902\u092d\u093e\u0935\u0928\u093e\u0964 \u092a\u094d\u0930\u0936\u093e\u0938\u0928 \u0928\u0947 \u0938\u0924\u0930\u094d\u0915 \u0930\u0939\u0928\u0947 \u0915\u094b \u0915\u0939\u093e\u0964 #BiharWeather #IMD (04:30 PM IST)",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 28.6139,
    "longitude": 77.209,
    "city": "New Delhi",
    "state": "Delhi",
    "source": "Twitter",
    "source_author": "@BiharMausamWatch",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:13:06.827105",
    "id": "EVT-TW-DC37D005",
    "h3_index": "873da1146ffffff",
    "source_credibility": 0.75,
    "external_reference": "twitter:tweet:tw-aae4471446",
    "is_media_authentic": true,
    "vision_check_result": "{\"channel\": \"Vision AI\", \"status\": \"SATELLITE_OPTICAL_VERIFIED\", \"score\": 98, \"recycled\": false, \"visual_features\": [\"INSAT-3DR Multispectral Optical (0.65\\u00b5m) cloud top visual match\", \"Thermal Infrared (10.8\\u00b5m) precipitation moisture reflectance verified\", \"High-resolution orbital satellite visual concurrence 98.4%\"], \"explanation\": \"Orbital satellite multispectral optical & thermal IR visual imagery directly confirms dense cloud canopy and surface moisture accumulation.\"}",
    "trust_score": 96.0,
    "nlp_confidence": 0.92,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Satellite & Doppler Grid (28.61\u00b0N, 77.21\u00b0E)",
    "radar_recorded_value": 4.2,
    "verification_status": "VERIFIED",
    "operator_decision": "UNREVIEWED",
    "operator_notes": "Ingested via Twitter Weather Intelligence Connector",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:13:06.827105"
  },
  {
    "title": "IMD Nowcast: Kolkata and South 24 Parganas to experience moderate spells of rainfall accompanie...",
    "description": "IMD Nowcast: Kolkata and South 24 Parganas to experience moderate spells of rainfall accompanied with lightning strikes in next 2 hours. #KolkataRains (04:30 PM IST)",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 22.5726,
    "longitude": 88.3639,
    "city": "Kolkata",
    "state": "West Bengal",
    "source": "Twitter",
    "source_author": "@KolkataWeatherDesk",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:13:06.827105",
    "id": "EVT-TW-C5822502",
    "h3_index": "873cf2c60ffffff",
    "source_credibility": 0.6,
    "external_reference": "twitter:tweet:tw-70e98e83fe",
    "is_media_authentic": true,
    "vision_check_result": "{\"channel\": \"Vision AI\", \"status\": \"SATELLITE_OPTICAL_VERIFIED\", \"score\": 98, \"recycled\": false, \"visual_features\": [\"INSAT-3DR Multispectral Optical (0.65\\u00b5m) cloud top visual match\", \"Thermal Infrared (10.8\\u00b5m) precipitation moisture reflectance verified\", \"High-resolution orbital satellite visual concurrence 98.4%\"], \"explanation\": \"Orbital satellite multispectral optical & thermal IR visual imagery directly confirms dense cloud canopy and surface moisture accumulation.\"}",
    "trust_score": 96.0,
    "nlp_confidence": 0.92,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Satellite & Doppler Grid (22.57\u00b0N, 88.36\u00b0E)",
    "radar_recorded_value": 4.2,
    "verification_status": "VERIFIED",
    "operator_decision": "UNREVIEWED",
    "operator_notes": "Ingested via Twitter Weather Intelligence Connector",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:13:06.827105"
  },
  {
    "title": "Severe localized thunderstorm and high wind squall reported across coastal Mumbai and Thane sub...",
    "description": "Severe localized thunderstorm and high wind squall reported across coastal Mumbai and Thane subways. Water accumulation at low spots. #MumbaiRains #WeatherAlert (04:30 PM IST)",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 19.076,
    "longitude": 72.8777,
    "city": "Mumbai",
    "state": "Maharashtra",
    "source": "Twitter",
    "source_author": "@MumbaiWeatherLive",
    "media_url": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80",
    "media_type": "image",
    "observed_at": "2026-09-29T19:13:06.827105",
    "id": "EVT-TW-5539CBE9",
    "h3_index": "87608b0b6ffffff",
    "source_credibility": 0.6,
    "external_reference": "twitter:tweet:tw-1e6a3db130",
    "is_media_authentic": true,
    "vision_check_result": "{\"channel\": \"Vision AI\", \"status\": \"AUTHENTIC_VISUAL_EVIDENCE\", \"score\": 96, \"recycled\": false, \"exif_gps_match\": true, \"concordance_score_pct\": 96.4, \"scene_summary\": \"Water accumulation & precipitation cues identified\", \"visual_features\": [\"Inundated roadway surface reflectivity\", \"High atmospheric moisture saturation\", \"Dense overcast nimbostratus cloud canopy\"], \"payload_type\": \"Web Evidence Link\", \"explanation\": \"Computer Vision verified field photo: Water accumulation & precipitation cues identified. Visual concordance 96.4%.\"}",
    "trust_score": 95.5,
    "nlp_confidence": 0.92,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Satellite & Doppler Grid (19.08\u00b0N, 72.88\u00b0E)",
    "radar_recorded_value": 4.2,
    "verification_status": "VERIFIED",
    "operator_decision": "UNREVIEWED",
    "operator_notes": "Ingested via Twitter Weather Intelligence Connector",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:13:06.827105"
  },
  {
    "title": "\u092e\u094c\u0938\u092e \u0935\u093f\u092d\u093e\u0917 (IMD) \u0915\u093e \u0905\u0932\u0930\u094d\u091f: \u0926\u093f\u0932\u094d\u0932\u0940-\u090f\u0928\u0938\u0940\u0906\u0930 \u092e\u0947\u0902 \u0936\u093e\u092e \u0915\u094b \u0924\u0947\u091c \u0939\u0935\u093e\u0913\u0902 \u0915\u0947 \u0938\u093e\u0925 \u092c\u093e\u0930\u093f\u0936 \u0914\u0930 \u092c\u0942\u0902\u0926\u093e\u092c\u093e\u0902\u0926\u0940 \u0915\u0947 \u0906\u0938\u093e...",
    "description": "\u092e\u094c\u0938\u092e \u0935\u093f\u092d\u093e\u0917 (IMD) \u0915\u093e \u0905\u0932\u0930\u094d\u091f: \u0926\u093f\u0932\u094d\u0932\u0940-\u090f\u0928\u0938\u0940\u0906\u0930 \u092e\u0947\u0902 \u0936\u093e\u092e \u0915\u094b \u0924\u0947\u091c \u0939\u0935\u093e\u0913\u0902 \u0915\u0947 \u0938\u093e\u0925 \u092c\u093e\u0930\u093f\u0936 \u0914\u0930 \u092c\u0942\u0902\u0926\u093e\u092c\u093e\u0902\u0926\u0940 \u0915\u0947 \u0906\u0938\u093e\u0930\u0964 #IMD #DelhiWeather (04:30 PM IST)",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 28.6139,
    "longitude": 77.209,
    "city": "New Delhi",
    "state": "Delhi",
    "source": "Twitter",
    "source_author": "@Indiametsky",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:13:06.827105",
    "id": "EVT-TW-F0596F35",
    "h3_index": "873da1146ffffff",
    "source_credibility": 0.6,
    "external_reference": "twitter:tweet:tw-a04157f930",
    "is_media_authentic": true,
    "vision_check_result": "{\"channel\": \"Vision AI\", \"status\": \"SATELLITE_OPTICAL_VERIFIED\", \"score\": 98, \"recycled\": false, \"visual_features\": [\"INSAT-3DR Multispectral Optical (0.65\\u00b5m) cloud top visual match\", \"Thermal Infrared (10.8\\u00b5m) precipitation moisture reflectance verified\", \"High-resolution orbital satellite visual concurrence 98.4%\"], \"explanation\": \"Orbital satellite multispectral optical & thermal IR visual imagery directly confirms dense cloud canopy and surface moisture accumulation.\"}",
    "trust_score": 96.0,
    "nlp_confidence": 0.92,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Satellite & Doppler Grid (28.61\u00b0N, 77.21\u00b0E)",
    "radar_recorded_value": 4.2,
    "verification_status": "VERIFIED",
    "operator_decision": "UNREVIEWED",
    "operator_notes": "Ingested via Twitter Weather Intelligence Connector",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:13:06.827105"
  },
  {
    "title": "Live Surface Observation: Agra, Uttar Pradesh (23.9\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 23.9\u00b0C, humidity 86%, wind speed 9.3 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 27.1767,
    "longitude": 78.0081,
    "city": "Agra",
    "state": "Uttar Pradesh",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Agra Kheria AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0038",
    "h3_index": "873d8584affffff",
    "source_credibility": 0.92,
    "external_reference": "station:agra:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Agra Kheria AWS",
    "radar_recorded_value": 9.3,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 23.9\u00b0C, 9.3 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Amritsar, Punjab (23.1\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 23.1\u00b0C, humidity 93%, wind speed 4.5 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 31.634,
    "longitude": 74.8723,
    "city": "Amritsar",
    "state": "Punjab",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Amritsar Rajasansi AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0037",
    "h3_index": "87424d26dffffff",
    "source_credibility": 0.92,
    "external_reference": "station:amritsar:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Amritsar Rajasansi AWS",
    "radar_recorded_value": 4.5,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 23.1\u00b0C, 4.5 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Varanasi, Uttar Pradesh (25.2\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 25.2\u00b0C, humidity 94%, wind speed 7.1 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 25.3176,
    "longitude": 82.9739,
    "city": "Varanasi",
    "state": "Uttar Pradesh",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Varanasi Babatpur AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0036",
    "h3_index": "873c16456ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:varanasi:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Varanasi Babatpur AWS",
    "radar_recorded_value": 7.1,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 25.2\u00b0C, 7.1 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Jodhpur, Rajasthan (28.1\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 28.1\u00b0C, humidity 55%, wind speed 1.8 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 26.2389,
    "longitude": 73.0243,
    "city": "Jodhpur",
    "state": "Rajasthan",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Jodhpur Marwar AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0035",
    "h3_index": "87425a6c6ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:jodhpur:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Jodhpur Marwar AWS",
    "radar_recorded_value": 1.8,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 28.1\u00b0C, 1.8 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Madurai",
    "description": "Coastal atmospheric reading: Temperature 26.6\u00b0C, humidity 76%, ocean breeze 5.4 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 9.9252,
    "longitude": 78.1198,
    "city": "Madurai",
    "state": "Tamil Nadu",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Madurai Airport AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0034",
    "h3_index": "87603422cffffff",
    "source_credibility": 0.92,
    "external_reference": "station:madurai:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Madurai Airport AWS",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 26.6\u00b0C, 5.4 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Raipur, Chhattisgarh (24.4\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 24.4\u00b0C, humidity 87%, wind speed 6.2 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 21.2514,
    "longitude": 81.6296,
    "city": "Raipur",
    "state": "Chhattisgarh",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Raipur Mana AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0033",
    "h3_index": "873cb1cabffffff",
    "source_credibility": 0.92,
    "external_reference": "station:raipur:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Raipur Mana AWS",
    "radar_recorded_value": 6.2,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 24.4\u00b0C, 6.2 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Low Visibility Fog Corridor in Ranchi, Jharkhand",
    "description": "Ground humidity at 94% creating dense moisture inversion. Visibility restricted. Road transport caution advised.",
    "category": "Fog",
    "severity": "Moderate",
    "latitude": 23.3441,
    "longitude": 85.3096,
    "city": "Ranchi",
    "state": "Jharkhand",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Ranchi Hinoo AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0032",
    "h3_index": "873ca8534ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:ranchi:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Ranchi Hinoo AWS",
    "radar_recorded_value": 8.9,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 21.3\u00b0C, 8.9 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Bhubaneswar",
    "description": "Coastal atmospheric reading: Temperature 25.5\u00b0C, humidity 89%, ocean breeze 6.9 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 20.2961,
    "longitude": 85.8245,
    "city": "Bhubaneswar",
    "state": "Odisha",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Bhubaneswar Airport AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0031",
    "h3_index": "873c8e400ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:bhubaneswar:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Bhubaneswar Airport AWS",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 25.5\u00b0C, 6.9 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Low Visibility Fog Corridor in Chandigarh, Punjab",
    "description": "Ground humidity at 88% creating dense moisture inversion. Visibility restricted. Road transport caution advised.",
    "category": "Fog",
    "severity": "Moderate",
    "latitude": 30.7333,
    "longitude": 76.7794,
    "city": "Chandigarh",
    "state": "Punjab",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Chandigarh Airbase AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0030",
    "h3_index": "873d14699ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:chandigarh:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Chandigarh Airbase AWS",
    "radar_recorded_value": 1.3,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 21.9\u00b0C, 1.3 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Surat",
    "description": "Coastal atmospheric reading: Temperature 25.6\u00b0C, humidity 88%, ocean breeze 5.2 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 21.1702,
    "longitude": 72.8311,
    "city": "Surat",
    "state": "Gujarat",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Surat Dumas Coast AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0029",
    "h3_index": "8742d9d6bffffff",
    "source_credibility": 0.92,
    "external_reference": "station:surat:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Surat Dumas Coast AWS",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 25.6\u00b0C, 5.2 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Nagpur",
    "description": "Coastal atmospheric reading: Temperature 25.2\u00b0C, humidity 76%, ocean breeze 9.1 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 21.1458,
    "longitude": 79.0882,
    "city": "Nagpur",
    "state": "Maharashtra",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Nagpur Sonegaon AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0028",
    "h3_index": "87609612dffffff",
    "source_credibility": 0.92,
    "external_reference": "station:nagpur:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Nagpur Sonegaon AWS",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 25.2\u00b0C, 9.1 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Indore, Madhya Pradesh (23.6\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 23.6\u00b0C, humidity 77%, wind speed 7.7 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 22.7196,
    "longitude": 75.8577,
    "city": "Indore",
    "state": "Madhya Pradesh",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Indore Devi Ahilya AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0027",
    "h3_index": "873d9629bffffff",
    "source_credibility": 0.92,
    "external_reference": "station:indore:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Indore Devi Ahilya AWS",
    "radar_recorded_value": 7.7,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 23.6\u00b0C, 7.7 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Bhopal, Madhya Pradesh (23.9\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 23.9\u00b0C, humidity 86%, wind speed 8.2 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 23.2599,
    "longitude": 77.4126,
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Bhopal Bairagarh AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0026",
    "h3_index": "873d914f1ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:bhopal:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Bhopal Bairagarh AWS",
    "radar_recorded_value": 8.2,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 23.9\u00b0C, 8.2 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Patna, Bihar (25.2\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 25.2\u00b0C, humidity 92%, wind speed 7.6 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 25.5941,
    "longitude": 85.1376,
    "city": "Patna",
    "state": "Bihar",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Patna Jaiprakash AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0025",
    "h3_index": "873c138caffffff",
    "source_credibility": 0.92,
    "external_reference": "station:patna:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Patna Jaiprakash AWS",
    "radar_recorded_value": 7.6,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 25.2\u00b0C, 7.6 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Lucknow, Uttar Pradesh (24.6\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 24.6\u00b0C, humidity 93%, wind speed 4.7 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 26.8467,
    "longitude": 80.9462,
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Lucknow Amausi AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0024",
    "h3_index": "873d8dcd5ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:lucknow:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Lucknow Amausi AWS",
    "radar_recorded_value": 4.7,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 24.6\u00b0C, 4.7 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Jaipur, Rajasthan (23.9\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 23.9\u00b0C, humidity 78%, wind speed 6.0 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 26.9124,
    "longitude": 75.7873,
    "city": "Jaipur",
    "state": "Rajasthan",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Jaipur Sanganer AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0023",
    "h3_index": "873da218effffff",
    "source_credibility": 0.92,
    "external_reference": "station:jaipur:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Jaipur Sanganer AWS",
    "radar_recorded_value": 6.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 23.9\u00b0C, 6.0 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Pune",
    "description": "Coastal atmospheric reading: Temperature 22.9\u00b0C, humidity 93%, ocean breeze 5.2 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 18.5204,
    "longitude": 73.8567,
    "city": "Pune",
    "state": "Maharashtra",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Pune Shivajinagar AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0022",
    "h3_index": "876088501ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:pune:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Pune Shivajinagar AWS",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 22.9\u00b0C, 5.2 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Ahmedabad",
    "description": "Coastal atmospheric reading: Temperature 27.6\u00b0C, humidity 70%, ocean breeze 4.4 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 23.0225,
    "longitude": 72.5714,
    "city": "Ahmedabad",
    "state": "Gujarat",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Ahmedabad Sabarmati AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0021",
    "h3_index": "8742cea64ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:ahmedabad:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Ahmedabad Sabarmati AWS",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 27.6\u00b0C, 4.4 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Hyderabad, Telangana (26.6\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 26.6\u00b0C, humidity 65%, wind speed 2.4 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 17.385,
    "longitude": 78.4867,
    "city": "Hyderabad",
    "state": "Telangana",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Begumpet Airport AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0020",
    "h3_index": "8760a25b0ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:hyderabad:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Begumpet Airport AWS",
    "radar_recorded_value": 2.4,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 26.6\u00b0C, 2.4 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Low Visibility Fog Corridor in Bengaluru, Karnataka",
    "description": "Ground humidity at 97% creating dense moisture inversion. Visibility restricted. Road transport caution advised.",
    "category": "Fog",
    "severity": "Moderate",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "city": "Bengaluru",
    "state": "Karnataka",
    "source": "Open-Meteo AWS",
    "source_author": "National Surface AWS Network (Bengaluru HAL Surface AWS)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-AWS-0019",
    "h3_index": "8760145b4ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:bengaluru:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Bengaluru HAL Surface AWS",
    "radar_recorded_value": 1.8,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via Open-Meteo AWS pipeline. Verified telemetry: 20.8\u00b0C, 1.8 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Vijayawada",
    "description": "Coastal atmospheric reading: Temperature 26.9\u00b0C, humidity 82%, ocean breeze 0.7 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 16.5062,
    "longitude": 80.648,
    "city": "Vijayawada",
    "state": "Andhra Pradesh",
    "source": "INSAT-3DR Satellite",
    "source_author": "ISRO Earth Observation System (INSAT-3DR Krishna Basin)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-INSAT-0018",
    "h3_index": "87619aa6cffffff",
    "source_credibility": 0.92,
    "external_reference": "station:vijayawada:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Krishna Basin",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via INSAT-3DR Satellite pipeline. Verified telemetry: 26.9\u00b0C, 0.7 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Shimla, Himachal Pradesh (10.7\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 10.7\u00b0C, humidity 84%, wind speed 2.7 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 31.1048,
    "longitude": 77.1734,
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "source": "INSAT-3DR Satellite",
    "source_author": "ISRO Earth Observation System (INSAT-3DR Western Himalayan)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-INSAT-0017",
    "h3_index": "873d10976ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:shimla:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Western Himalayan",
    "radar_recorded_value": 2.7,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via INSAT-3DR Satellite pipeline. Verified telemetry: 10.7\u00b0C, 2.7 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Dehradun, Uttarakhand (20.2\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 20.2\u00b0C, humidity 87%, wind speed 3.9 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 30.3165,
    "longitude": 78.0322,
    "city": "Dehradun",
    "state": "Uttarakhand",
    "source": "INSAT-3DR Satellite",
    "source_author": "ISRO Earth Observation System (INSAT-3DR Garhwal Infrared)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-INSAT-0016",
    "h3_index": "873d10659ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:dehradun:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Garhwal Infrared",
    "radar_recorded_value": 3.9,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via INSAT-3DR Satellite pipeline. Verified telemetry: 20.2\u00b0C, 3.9 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Localized Thunderstorm & Cloud Cover in Imphal",
    "description": "Convective orographic cloud cluster: 23.7\u00b0C, relative humidity 87%, winds 1.8 km/h.",
    "category": "Thunderstorm",
    "severity": "Moderate",
    "latitude": 24.817,
    "longitude": 93.9368,
    "city": "Imphal",
    "state": "Manipur",
    "source": "INSAT-3DR Satellite",
    "source_author": "ISRO Earth Observation System (INSAT-3DR Northeast Sounder)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-INSAT-0015",
    "h3_index": "873cea050ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:imphal:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 89.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Northeast Sounder",
    "radar_recorded_value": 1.8,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via INSAT-3DR Satellite pipeline. Verified telemetry: 23.7\u00b0C, 1.8 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Localized Thunderstorm & Cloud Cover in Gangtok",
    "description": "Convective orographic cloud cluster: 15.8\u00b0C, relative humidity 80%, winds 2.0 km/h.",
    "category": "Thunderstorm",
    "severity": "Moderate",
    "latitude": 27.3389,
    "longitude": 88.6065,
    "city": "Gangtok",
    "state": "Sikkim",
    "source": "INSAT-3DR Satellite",
    "source_author": "ISRO Earth Observation System (INSAT-3DR Himalayan Sounder)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-INSAT-0014",
    "h3_index": "873c0acd4ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:gangtok:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 89.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Himalayan Sounder",
    "radar_recorded_value": 2.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via INSAT-3DR Satellite pipeline. Verified telemetry: 15.8\u00b0C, 2.0 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Low Visibility Fog Corridor in Shillong, Meghalaya",
    "description": "Ground humidity at 100% creating dense moisture inversion. Visibility restricted. Road transport caution advised.",
    "category": "Fog",
    "severity": "Moderate",
    "latitude": 25.5788,
    "longitude": 91.8933,
    "city": "Shillong",
    "state": "Meghalaya",
    "source": "INSAT-3DR Satellite",
    "source_author": "ISRO Earth Observation System (INSAT-3DR Cloud Top TIR)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-INSAT-0013",
    "h3_index": "873ce3a16ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:shillong:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Cloud Top TIR",
    "radar_recorded_value": 4.6,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via INSAT-3DR Satellite pipeline. Verified telemetry: 18.9\u00b0C, 4.6 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Coimbatore",
    "description": "Coastal atmospheric reading: Temperature 25.1\u00b0C, humidity 80%, ocean breeze 3.3 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 11.0168,
    "longitude": 76.9558,
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "source": "INSAT-3DR Satellite",
    "source_author": "ISRO Earth Observation System (INSAT-3DR Ghats Imager)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-INSAT-0012",
    "h3_index": "876033868ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:coimbatore:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Ghats Imager",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via INSAT-3DR Satellite pipeline. Verified telemetry: 25.1\u00b0C, 3.3 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Thiruvananthapuram",
    "description": "Coastal atmospheric reading: Temperature 25.4\u00b0C, humidity 93%, ocean breeze 7.5 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 8.5241,
    "longitude": 76.9366,
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "source": "INSAT-3DR Satellite",
    "source_author": "ISRO Earth Observation System (INSAT-3DR Coastal Sounder)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-INSAT-0011",
    "h3_index": "876026235ffffff",
    "source_credibility": 0.92,
    "external_reference": "station:thiruvananthapuram:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "INSAT-3DR Coastal Sounder",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via INSAT-3DR Satellite pipeline. Verified telemetry: 25.4\u00b0C, 7.5 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: Srinagar, Jammu & Kashmir (14.0\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 14.0\u00b0C, humidity 81%, wind speed 1.9 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 34.0837,
    "longitude": 74.7973,
    "city": "Srinagar",
    "state": "Jammu & Kashmir",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Srinagar Pir Panjal X-Band)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0010",
    "h3_index": "873d34a5cffffff",
    "source_credibility": 0.96,
    "external_reference": "station:srinagar:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Srinagar Pir Panjal X-Band",
    "radar_recorded_value": 1.9,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 14.0\u00b0C, 1.9 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Puri",
    "description": "Coastal atmospheric reading: Temperature 26.5\u00b0C, humidity 92%, ocean breeze 4.2 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 19.8135,
    "longitude": 85.8312,
    "city": "Puri",
    "state": "Odisha",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Puri Paradip Coastal Doppler)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0009",
    "h3_index": "873c9db96ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:puri:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Puri Paradip Coastal Doppler",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 26.5\u00b0C, 4.2 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Visakhapatnam",
    "description": "Coastal atmospheric reading: Temperature 26.2\u00b0C, humidity 94%, ocean breeze 2.8 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 17.6868,
    "longitude": 83.2185,
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Vizag Dolphin Nose S-Band)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0008",
    "h3_index": "873c93014ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:visakhapatnam:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Vizag Dolphin Nose S-Band",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 26.2\u00b0C, 2.8 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Kochi",
    "description": "Coastal atmospheric reading: Temperature 27.2\u00b0C, humidity 90%, ocean breeze 1.8 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 9.9312,
    "longitude": 76.2673,
    "city": "Kochi",
    "state": "Kerala",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Kochi Naval Base Doppler C-Band)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0007",
    "h3_index": "876004d33ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:kochi:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Kochi Naval Base Doppler C-Band",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 27.2\u00b0C, 1.8 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Localized Thunderstorm & Cloud Cover in Agartala",
    "description": "Convective orographic cloud cluster: 26.9\u00b0C, relative humidity 91%, winds 4.3 km/h.",
    "category": "Thunderstorm",
    "severity": "Moderate",
    "latitude": 23.8315,
    "longitude": 91.2868,
    "city": "Agartala",
    "state": "Tripura",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Agartala Airport Doppler Radar)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0006",
    "h3_index": "873cc4453ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:agartala:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 89.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Agartala Airport Doppler Radar",
    "radar_recorded_value": 4.3,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 26.9\u00b0C, 4.3 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Localized Thunderstorm & Cloud Cover in Guwahati",
    "description": "Convective orographic cloud cluster: 26.2\u00b0C, relative humidity 88%, winds 3.3 km/h.",
    "category": "Thunderstorm",
    "severity": "Moderate",
    "latitude": 26.1445,
    "longitude": 91.7362,
    "city": "Guwahati",
    "state": "Assam",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Guwahati Borjhar C-Band)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0005",
    "h3_index": "873ce1571ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:guwahati:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 89.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Guwahati Borjhar C-Band",
    "radar_recorded_value": 3.3,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 26.2\u00b0C, 3.3 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Live Surface Observation: New Delhi, Delhi (22.1\u00b0C)",
    "description": "Normal atmospheric baseline: Temperature 22.1\u00b0C, humidity 94%, wind speed 6.9 km/h.",
    "category": "Other",
    "severity": "Low",
    "latitude": 28.6139,
    "longitude": 77.209,
    "city": "New Delhi",
    "state": "Delhi",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Delhi Mausam Bhavan S-Band)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0004",
    "h3_index": "873da1146ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:new delhi:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 85.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Delhi Mausam Bhavan S-Band",
    "radar_recorded_value": 6.9,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 22.1\u00b0C, 6.9 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Chennai",
    "description": "Coastal atmospheric reading: Temperature 28.2\u00b0C, humidity 78%, ocean breeze 11.4 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Chennai Port Doppler C-Band)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0003",
    "h3_index": "87618c488ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:chennai:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Chennai Port Doppler C-Band",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 28.2\u00b0C, 11.4 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Kolkata",
    "description": "Coastal atmospheric reading: Temperature 26.9\u00b0C, humidity 89%, ocean breeze 3.1 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 22.5726,
    "longitude": 88.3639,
    "city": "Kolkata",
    "state": "West Bengal",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Kolkata Alipore Doppler S-Band)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0002",
    "h3_index": "873cf2c60ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:kolkata:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Kolkata Alipore Doppler S-Band",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 26.9\u00b0C, 3.1 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Convective Showers & Marine Breeze in Mumbai",
    "description": "Coastal atmospheric reading: Temperature 25.6\u00b0C, humidity 90%, ocean breeze 3.2 km/h.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 19.076,
    "longitude": 72.8777,
    "city": "Mumbai",
    "state": "Maharashtra",
    "source": "IMD Doppler Radar",
    "source_author": "IMD Doppler Weather Radar Network (Mumbai Colaba Doppler S-Band)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:12:56.265729",
    "id": "EVT-IN-DWR-0001",
    "h3_index": "87608b0b6ffffff",
    "source_credibility": 0.96,
    "external_reference": "station:mumbai:2026-09-29T00:30",
    "is_media_authentic": true,
    "vision_check_result": "CERTIFIED_SENSOR_STREAM",
    "trust_score": 86.0,
    "nlp_confidence": 0.96,
    "radar_corroborated": true,
    "radar_station_name": "Mumbai Colaba Doppler S-Band",
    "radar_recorded_value": 0.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Authenticated via IMD Doppler Radar pipeline. Verified telemetry: 25.6\u00b0C, 3.2 km/h.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Severe Waterlogging at Kurla and Gandhi Market: Twitter Storm Report",
    "description": "Crowdsourced alert via #MumbaiRains: Rapid inundation reported on LBS Marg and railway underpass. Vehicles stalled, civic pumps active.",
    "category": "Flooding",
    "severity": "High",
    "latitude": 19.085,
    "longitude": 72.88,
    "city": "Mumbai",
    "state": "Maharashtra",
    "source": "Twitter / X Stream",
    "source_author": "@MumbaiWeatherLive",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:09:56.265729",
    "id": "EVT-TW-0001",
    "h3_index": "87608b54dffffff",
    "source_credibility": 0.82,
    "external_reference": "https://twitter.com/MumbaiWeatherLive/status/1790581901",
    "is_media_authentic": true,
    "vision_check_result": "NLP_GEOTAGGED_TEXT",
    "trust_score": 78.5,
    "nlp_confidence": 0.88,
    "radar_corroborated": false,
    "radar_station_name": "IMD Doppler Corridor Corroboration",
    "radar_recorded_value": 24.5,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Crowdsourced Twitter alert with NLP entity extraction and geo-spatial corroboration.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Citizen Field Verification: High Tide Tidal Surge at Fort Kochi Coast",
    "description": "Citizen PWA submission: Seawater breach on beach walkway. Inundation depth 0.45 meters. High tidal swell corroborated with INCOIS buoy data.",
    "category": "Flooding",
    "severity": "Critical",
    "latitude": 9.94,
    "longitude": 76.275,
    "city": "Kochi",
    "state": "Kerala",
    "source": "Citizen PWA Reports",
    "source_author": "Citizen Volunteer (ID: PWA-KER-4091)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:07:56.265729",
    "id": "EVT-CITIZEN-0001",
    "h3_index": "876004d32ffffff",
    "source_credibility": 0.75,
    "external_reference": "pwa-submission:kochi:100",
    "is_media_authentic": true,
    "vision_check_result": "PASS_INTEGRITY",
    "trust_score": 89.0,
    "nlp_confidence": 0.85,
    "radar_corroborated": true,
    "radar_station_name": "Regional Doppler Micro-Zone",
    "radar_recorded_value": 18.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Citizen mobile field submission via PWA ground-truth module.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Brahmaputra Water Level Warning: Inundation in Rukminigaon",
    "description": "Verified citizen stream #AssamFloods: Flash runoff from Meghalaya hills inundating GS Road and low-lying residential sectors.",
    "category": "Flooding",
    "severity": "Critical",
    "latitude": 26.155,
    "longitude": 91.75,
    "city": "Guwahati",
    "state": "Assam",
    "source": "Twitter / X Stream",
    "source_author": "@AssamDisasterAlert",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T19:02:56.265729",
    "id": "EVT-TW-0002",
    "h3_index": "873ce1571ffffff",
    "source_credibility": 0.82,
    "external_reference": "https://twitter.com/AssamDisasterAlert/status/1790581902",
    "is_media_authentic": true,
    "vision_check_result": "NLP_GEOTAGGED_TEXT",
    "trust_score": 86.0,
    "nlp_confidence": 0.88,
    "radar_corroborated": true,
    "radar_station_name": "IMD Doppler Corridor Corroboration",
    "radar_recorded_value": 24.5,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Crowdsourced Twitter alert with NLP entity extraction and geo-spatial corroboration.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Dense Valley Fog & Reduced Visibility on Kalka-Shimla Highway",
    "description": "Citizen PWA telemetry: Ground visibility dropping under 40 meters between Solan and Taradevi. Heavy rime fog deposition.",
    "category": "Fog",
    "severity": "Moderate",
    "latitude": 31.11,
    "longitude": 77.18,
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "source": "Citizen PWA Reports",
    "source_author": "Highway Patrol Volunteer (ID: PWA-HP-1102)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T18:55:56.265729",
    "id": "EVT-CITIZEN-0002",
    "h3_index": "873d10976ffffff",
    "source_credibility": 0.75,
    "external_reference": "pwa-submission:shimla:101",
    "is_media_authentic": true,
    "vision_check_result": "PASS_INTEGRITY",
    "trust_score": 73.0,
    "nlp_confidence": 0.85,
    "radar_corroborated": false,
    "radar_station_name": "Regional Doppler Micro-Zone",
    "radar_recorded_value": 0.0,
    "verification_status": "PENDING_REVIEW",
    "operator_decision": "PENDING_REVIEW",
    "operator_notes": "Citizen mobile field submission via PWA ground-truth module.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Sudden Squall and Dust Surge in Delhi NCR: Crowdsourced Report",
    "description": "Citizen reports on #DelhiWeather: High velocity dust winds followed by localized drizzle in Central and South Delhi. Trees uprooted near ITO.",
    "category": "Thunderstorm",
    "severity": "Moderate",
    "latitude": 28.625,
    "longitude": 77.22,
    "city": "New Delhi",
    "state": "Delhi",
    "source": "Twitter / X Stream",
    "source_author": "@DelhiRainWatch",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T18:55:56.265729",
    "id": "EVT-TW-0003",
    "h3_index": "873da1140ffffff",
    "source_credibility": 0.82,
    "external_reference": "https://twitter.com/DelhiRainWatch/status/1790581903",
    "is_media_authentic": true,
    "vision_check_result": "NLP_GEOTAGGED_TEXT",
    "trust_score": 74.0,
    "nlp_confidence": 0.88,
    "radar_corroborated": false,
    "radar_station_name": "IMD Doppler Corridor Corroboration",
    "radar_recorded_value": 38.0,
    "verification_status": "PENDING_REVIEW",
    "operator_decision": "PENDING_REVIEW",
    "operator_notes": "Crowdsourced Twitter alert with NLP entity extraction and geo-spatial corroboration.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Kalbaishakhi Nor'wester Activity Detected in North 24 Parganas",
    "description": "Real-time Twitter stream #KolkataRains: Intense thunderstorm band moving inland from Sundarbans. Gusty winds reaching 65 km/h.",
    "category": "Thunderstorm",
    "severity": "High",
    "latitude": 22.585,
    "longitude": 88.375,
    "city": "Kolkata",
    "state": "West Bengal",
    "source": "Twitter / X Stream",
    "source_author": "@KolkataWeatherHQ",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T18:48:56.265729",
    "id": "EVT-TW-0004",
    "h3_index": "873cf2c65ffffff",
    "source_credibility": 0.82,
    "external_reference": "https://twitter.com/KolkataWeatherHQ/status/1790581904",
    "is_media_authentic": true,
    "vision_check_result": "NLP_GEOTAGGED_TEXT",
    "trust_score": 82.0,
    "nlp_confidence": 0.88,
    "radar_corroborated": true,
    "radar_station_name": "IMD Doppler Corridor Corroboration",
    "radar_recorded_value": 38.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Crowdsourced Twitter alert with NLP entity extraction and geo-spatial corroboration.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Bellandur Outer Ring Road Flash Drainage Overflow",
    "description": "PWA Ground Truth: Heavy storm runoff overflowing stormwater drains on Ecospace junction. Two lanes waterlogged.",
    "category": "Flooding",
    "severity": "High",
    "latitude": 12.98,
    "longitude": 77.6,
    "city": "Bengaluru",
    "state": "Karnataka",
    "source": "Citizen PWA Reports",
    "source_author": "Civic Warden (ID: PWA-BLR-8823)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T18:43:56.265729",
    "id": "EVT-CITIZEN-0003",
    "h3_index": "8760145b4ffffff",
    "source_credibility": 0.75,
    "external_reference": "pwa-submission:bengaluru:102",
    "is_media_authentic": true,
    "vision_check_result": "PASS_INTEGRITY",
    "trust_score": 85.0,
    "nlp_confidence": 0.85,
    "radar_corroborated": true,
    "radar_station_name": "Regional Doppler Micro-Zone",
    "radar_recorded_value": 18.0,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Citizen mobile field submission via PWA ground-truth module.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Coastal Moisture Surge & Steady Downpour in Velachery",
    "description": "Verified tweet #ChennaiRains: Continuous sea-breeze convection causing steady moderate rainfall across South Chennai corridors.",
    "category": "Rainfall",
    "severity": "Moderate",
    "latitude": 13.09,
    "longitude": 80.28,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "source": "Twitter / X Stream",
    "source_author": "@TamilNaduWeatherman",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T18:41:56.265729",
    "id": "EVT-TW-0005",
    "h3_index": "87618c48effffff",
    "source_credibility": 0.82,
    "external_reference": "https://twitter.com/TamilNaduWeatherman/status/1790581905",
    "is_media_authentic": true,
    "vision_check_result": "NLP_GEOTAGGED_TEXT",
    "trust_score": 91.0,
    "nlp_confidence": 0.88,
    "radar_corroborated": true,
    "radar_station_name": "IMD Doppler Corridor Corroboration",
    "radar_recorded_value": 24.5,
    "verification_status": "VERIFIED",
    "operator_decision": "VERIFIED",
    "operator_notes": "Crowdsourced Twitter alert with NLP entity extraction and geo-spatial corroboration.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Severe Heat Index & Loo Winds Reported Across Walled City",
    "description": "Citizen telemetry #JaipurHeat: Ambient mercury surpassing 43\u00b0C with dry westerly convection. Public advised to avoid midday sun.",
    "category": "Heatwave",
    "severity": "High",
    "latitude": 26.92,
    "longitude": 75.8,
    "city": "Jaipur",
    "state": "Rajasthan",
    "source": "Twitter / X Stream",
    "source_author": "@RajasthanMausam",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T18:34:56.265729",
    "id": "EVT-TW-0006",
    "h3_index": "873da2188ffffff",
    "source_credibility": 0.82,
    "external_reference": "https://twitter.com/RajasthanMausam/status/1790581906",
    "is_media_authentic": true,
    "vision_check_result": "NLP_GEOTAGGED_TEXT",
    "trust_score": 79.0,
    "nlp_confidence": 0.88,
    "radar_corroborated": false,
    "radar_station_name": "IMD Doppler Corridor Corroboration",
    "radar_recorded_value": 38.0,
    "verification_status": "PENDING_REVIEW",
    "operator_decision": "PENDING_REVIEW",
    "operator_notes": "Crowdsourced Twitter alert with NLP entity extraction and geo-spatial corroboration.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  },
  {
    "title": "Spam/Unverified Claim: False Cloudburst Alert Flagged by AI Tri-Check",
    "description": "Flagged Citizen report claiming severe cloudburst in Kankarbagh. Doppler radar shows zero convective echoes (0.0 mm/hr). AI marked disproven.",
    "category": "Other",
    "severity": "Low",
    "latitude": 25.6,
    "longitude": 85.145,
    "city": "Patna",
    "state": "Bihar",
    "source": "Citizen PWA Reports",
    "source_author": "Anonymous User (ID: PWA-UNK-009)",
    "media_url": null,
    "media_type": "none",
    "observed_at": "2026-09-29T18:31:56.265729",
    "id": "EVT-CITIZEN-0004",
    "h3_index": "873c138cbffffff",
    "source_credibility": 0.2,
    "external_reference": "pwa-submission:patna:103",
    "is_media_authentic": false,
    "vision_check_result": "ANOMALY_DETECTED",
    "trust_score": 22.0,
    "nlp_confidence": 0.85,
    "radar_corroborated": false,
    "radar_station_name": "Regional Doppler Micro-Zone",
    "radar_recorded_value": 0.0,
    "verification_status": "REJECTED",
    "operator_decision": "REJECTED",
    "operator_notes": "Citizen mobile field submission via PWA ground-truth module.",
    "duplicate_of_id": null,
    "ingested_at": "2026-09-29T19:12:56.265729"
  }
];

export const FALLBACK_H3_CLUSTERS = [
  {
    "h3_index": "87608b0b6ffffff",
    "count": 2,
    "critical_count": 0,
    "categories": {
      "Rainfall": 2
    },
    "avg_trust": 90.8,
    "centroid": [
      19.076,
      72.8777
    ],
    "boundary": [
      [
        19.072787410932698,
        72.88761838919083
      ],
      [
        19.08442417856951,
        72.88358230557536
      ],
      [
        19.086107854047526,
        72.87143860186279
      ],
      [
        19.0761564794332,
        72.863332567612
      ],
      [
        19.064521086254157,
        72.86736820415899
      ],
      [
        19.062835693212065,
        72.87951032225085
      ]
    ],
    "state": "Maharashtra",
    "city": "Mumbai"
  },
  {
    "h3_index": "873cf2c60ffffff",
    "count": 2,
    "critical_count": 0,
    "categories": {
      "Rainfall": 2
    },
    "avg_trust": 91.0,
    "centroid": [
      22.5726,
      88.3639
    ],
    "boundary": [
      [
        22.564646210617145,
        88.38870819265692
      ],
      [
        22.577162772198644,
        88.38468528682421
      ],
      [
        22.579927005387578,
        88.37064973551986
      ],
      [
        22.57017529383071,
        88.36063845783528
      ],
      [
        22.557659255371735,
        88.36466185041839
      ],
      [
        22.554894405192176,
        88.378696034336
      ]
    ],
    "state": "West Bengal",
    "city": "Kolkata"
  },
  {
    "h3_index": "87618c488ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      13.0827,
      80.2707
    ],
    "boundary": [
      [
        13.074514375826535,
        80.28101063524947
      ],
      [
        13.087210461755735,
        80.27700390113397
      ],
      [
        13.089906540832763,
        80.2640718333366
      ],
      [
        13.079907728838796,
        80.25514800328841
      ],
      [
        13.06721300455911,
        80.25915469762762
      ],
      [
        13.064515730594671,
        80.27208526210332
      ]
    ],
    "state": "Tamil Nadu",
    "city": "Chennai"
  },
  {
    "h3_index": "873da1146ffffff",
    "count": 3,
    "critical_count": 0,
    "categories": {
      "Other": 1,
      "Rainfall": 2
    },
    "avg_trust": 92.3,
    "centroid": [
      28.6139,
      77.209
    ],
    "boundary": [
      [
        28.616379376896624,
        77.18297617504363
      ],
      [
        28.604867616486654,
        77.18886297534881
      ],
      [
        28.60360567713515,
        77.20379885006987
      ],
      [
        28.613854492841043,
        77.21285265042461
      ],
      [
        28.625368186066403,
        77.2069695223619
      ],
      [
        28.62663113106457,
        77.19202892049782
      ]
    ],
    "state": "Delhi",
    "city": "New Delhi"
  },
  {
    "h3_index": "873ce1571ffffff",
    "count": 2,
    "critical_count": 1,
    "categories": {
      "Thunderstorm": 1,
      "Flooding": 1
    },
    "avg_trust": 87.5,
    "centroid": [
      26.1445,
      91.7362
    ],
    "boundary": [
      [
        26.146241692508443,
        91.76071058048524
      ],
      [
        26.158496012984266,
        91.75673509394835
      ],
      [
        26.16141165749125,
        91.74239328653756
      ],
      [
        26.1520733483869,
        91.7320282088426
      ],
      [
        26.139819249985575,
        91.73600441986993
      ],
      [
        26.13690323843525,
        91.75034498451436
      ]
    ],
    "state": "Assam",
    "city": "Guwahati"
  },
  {
    "h3_index": "873cc4453ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Thunderstorm": 1
    },
    "avg_trust": 89.0,
    "centroid": [
      23.8315,
      91.2868
    ],
    "boundary": [
      [
        23.82524532529065,
        91.29054166372761
      ],
      [
        23.83776165875066,
        91.28658268486836
      ],
      [
        23.840738245650506,
        91.27236765527978
      ],
      [
        23.831198895906727,
        91.26211285157873
      ],
      [
        23.818682865256594,
        91.26607251297862
      ],
      [
        23.8157058813687,
        91.28028629594313
      ]
    ],
    "state": "Tripura",
    "city": "Agartala"
  },
  {
    "h3_index": "876004d33ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      9.9312,
      76.2673
    ],
    "boundary": [
      [
        9.936356813990873,
        76.27319390008451
      ],
      [
        9.948819535609339,
        76.2692385712098
      ],
      [
        9.951505065397617,
        76.25694811425845
      ],
      [
        9.941729292486466,
        76.24861449020865
      ],
      [
        9.929268244086245,
        76.25256956158393
      ],
      [
        9.926581295422569,
        76.26485851476232
      ]
    ],
    "state": "Kerala",
    "city": "Kochi"
  },
  {
    "h3_index": "873c93014ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      17.6868,
      83.2185
    ],
    "boundary": [
      [
        17.68558442858039,
        83.2239802755035
      ],
      [
        17.6982286520996,
        83.21993273088002
      ],
      [
        17.700833088197392,
        83.20649814594758
      ],
      [
        17.690794314482105,
        83.19711259715989
      ],
      [
        17.67815110389733,
        83.20116028259827
      ],
      [
        17.675545654000597,
        83.21459337636483
      ]
    ],
    "state": "Andhra Pradesh",
    "city": "Visakhapatnam"
  },
  {
    "h3_index": "873c9db96ffffff",
    "count": 2,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1,
      "Cyclone": 1
    },
    "avg_trust": 88.5,
    "centroid": [
      19.8135,
      85.8312
    ],
    "boundary": [
      [
        19.8106863895607,
        85.83342862996237
      ],
      [
        19.823326548853334,
        85.82938940809065
      ],
      [
        19.826015127893854,
        85.81564255929781
      ],
      [
        19.816064361574245,
        85.80593636940976
      ],
      [
        19.80342497743371,
        85.80997590272413
      ],
      [
        19.800735584334216,
        85.82372131486466
      ]
    ],
    "state": "Odisha",
    "city": "Puri"
  },
  {
    "h3_index": "873d34a5cffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      34.0837,
      74.7973
    ],
    "boundary": [
      [
        34.08140454270133,
        74.7896495024774
      ],
      [
        34.06936474198459,
        74.7965234097335
      ],
      [
        34.068258139418475,
        74.81286828646004
      ],
      [
        34.07919058533922,
        74.82234498886896
      ],
      [
        34.09123255918567,
        74.81547506781033
      ],
      [
        34.092339914211806,
        74.79912445650871
      ]
    ],
    "state": "Jammu & Kashmir",
    "city": "Srinagar"
  },
  {
    "h3_index": "876026235ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      8.5241,
      76.9366
    ],
    "boundary": [
      [
        8.528053367601695,
        76.95821148955098
      ],
      [
        8.540595071467337,
        76.9542691217411
      ],
      [
        8.543416597471508,
        76.9419391237239
      ],
      [
        8.53369775445402,
        76.93355298241318
      ],
      [
        8.521157737854546,
        76.93749513030441
      ],
      [
        8.518334877052526,
        76.94982363968448
      ]
    ],
    "state": "Kerala",
    "city": "Thiruvananthapuram"
  },
  {
    "h3_index": "876033868ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      11.0168,
      76.9558
    ],
    "boundary": [
      [
        11.00694280019731,
        76.96941830742075
      ],
      [
        11.019440833456834,
        76.9654442921805
      ],
      [
        11.022085106469673,
        76.95301400321567
      ],
      [
        11.012232743229918,
        76.94455924229794
      ],
      [
        10.999736314579433,
        76.94853303467015
      ],
      [
        10.99709064458588,
        76.96096181109404
      ]
    ],
    "state": "Tamil Nadu",
    "city": "Coimbatore"
  },
  {
    "h3_index": "873ce3a16ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Fog": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      25.5788,
      91.8933
    ],
    "boundary": [
      [
        25.564874129046935,
        91.9082306852791
      ],
      [
        25.577208706080235,
        91.90426810412949
      ],
      [
        25.580166527483403,
        91.88995161719275
      ],
      [
        25.57079012775398,
        91.87959894197589
      ],
      [
        25.558455775412913,
        91.88356225433046
      ],
      [
        25.555497597931026,
        91.89787751110654
      ]
    ],
    "state": "Meghalaya",
    "city": "Shillong"
  },
  {
    "h3_index": "873c0acd4ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Thunderstorm": 1
    },
    "avg_trust": 89.0,
    "centroid": [
      27.3389,
      88.6065
    ],
    "boundary": [
      [
        27.33374317024911,
        88.61581656435324
      ],
      [
        27.345685457544157,
        88.61173244015662
      ],
      [
        27.348208411101297,
        88.59745155666076
      ],
      [
        27.338789657803098,
        88.5872562012517
      ],
      [
        27.326847743977915,
        88.59134084402629
      ],
      [
        27.32432420981045,
        88.60562032405294
      ]
    ],
    "state": "Sikkim",
    "city": "Gangtok"
  },
  {
    "h3_index": "873cea050ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Thunderstorm": 1
    },
    "avg_trust": 89.0,
    "centroid": [
      24.817,
      93.9368
    ],
    "boundary": [
      [
        24.814059798026193,
        93.94682112425834
      ],
      [
        24.826562732615116,
        93.94294129821989
      ],
      [
        24.82975432721721,
        93.92863019681168
      ],
      [
        24.820443193222697,
        93.9182000360866
      ],
      [
        24.807940364346003,
        93.92208071956239
      ],
      [
        24.804748563570552,
        93.93639070672204
      ]
    ],
    "state": "Manipur",
    "city": "Imphal"
  },
  {
    "h3_index": "873d10659ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      30.3165,
      78.0322
    ],
    "boundary": [
      [
        30.310471012427975,
        78.01497261026654
      ],
      [
        30.298715358548307,
        78.02085229612376
      ],
      [
        30.297307113431035,
        78.03612855938135
      ],
      [
        30.3076533920562,
        78.04553005385938
      ],
      [
        30.319410901619886,
        78.03965433335414
      ],
      [
        30.320820277202905,
        78.02437315175072
      ]
    ],
    "state": "Uttarakhand",
    "city": "Dehradun"
  },
  {
    "h3_index": "873d10976ffffff",
    "count": 2,
    "critical_count": 0,
    "categories": {
      "Other": 1,
      "Fog": 1
    },
    "avg_trust": 79.0,
    "centroid": [
      31.1048,
      77.1734
    ],
    "boundary": [
      [
        31.10758606013742,
        77.15367849571902
      ],
      [
        31.095761930016906,
        77.15979708761955
      ],
      [
        31.094429214868097,
        77.175308240408
      ],
      [
        31.104919595666413,
        77.18470589921934
      ],
      [
        31.116745667875787,
        77.17859126352512
      ],
      [
        31.118079417501768,
        77.16307501146377
      ]
    ],
    "state": "Himachal Pradesh",
    "city": "Shimla"
  },
  {
    "h3_index": "87619aa6cffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      16.5062,
      80.648
    ],
    "boundary": [
      [
        16.49799611477222,
        80.66480168570986
      ],
      [
        16.510537806952954,
        80.6607516006384
      ],
      [
        16.51302706595353,
        80.64763194734863
      ],
      [
        16.502975838433763,
        80.63856391054479
      ],
      [
        16.490435349112346,
        80.64261397797
      ],
      [
        16.487944884390902,
        80.65573210017212
      ]
    ],
    "state": "Andhra Pradesh",
    "city": "Vijayawada"
  },
  {
    "h3_index": "8760145b4ffffff",
    "count": 2,
    "critical_count": 0,
    "categories": {
      "Fog": 1,
      "Flooding": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      12.9716,
      77.5946
    ],
    "boundary": [
      [
        12.97596169707093,
        77.60299309022386
      ],
      [
        12.988445816571017,
        77.59899026961779
      ],
      [
        12.990981375325301,
        77.58639450493625
      ],
      [
        12.981034204983276,
        77.57780309015591
      ],
      [
        12.968551585752207,
        77.58180571932974
      ],
      [
        12.966014636595762,
        77.59439995499558
      ]
    ],
    "state": "Karnataka",
    "city": "Bengaluru"
  },
  {
    "h3_index": "8760a25b0ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      17.385,
      78.4867
    ],
    "boundary": [
      [
        17.383671145092734,
        78.50353332585806
      ],
      [
        17.395975747803313,
        78.49946937446029
      ],
      [
        17.398237634070462,
        78.48657172013331
      ],
      [
        17.388196286253816,
        78.47773958465227
      ],
      [
        17.375892951235866,
        78.48180339032886
      ],
      [
        17.373629696294074,
        78.49469947751145
      ]
    ],
    "state": "Telangana",
    "city": "Hyderabad"
  },
  {
    "h3_index": "8742cea64ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      23.0225,
      72.5714
    ],
    "boundary": [
      [
        23.028985874672557,
        72.56365680613638
      ],
      [
        23.018447235076486,
        72.56983771935465
      ],
      [
        23.017760453323916,
        72.58372952329522
      ],
      [
        23.02761190690312,
        72.59144459075877
      ],
      [
        23.03815278022434,
        72.5852662749221
      ],
      [
        23.03883996636208,
        72.57137029321234
      ]
    ],
    "state": "Gujarat",
    "city": "Ahmedabad"
  },
  {
    "h3_index": "876088501ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      18.5204,
      73.8567
    ],
    "boundary": [
      [
        18.508744616313606,
        73.87161706820883
      ],
      [
        18.520530287940016,
        73.86757404804175
      ],
      [
        18.52234208892038,
        73.85529466072167
      ],
      [
        18.512369883884922,
        73.84705988038175
      ],
      [
        18.50058559143337,
        73.85110250298338
      ],
      [
        18.49877212482202,
        73.86338030373031
      ]
    ],
    "state": "Maharashtra",
    "city": "Pune"
  },
  {
    "h3_index": "873da218effffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      26.9124,
      75.7873
    ],
    "boundary": [
      [
        26.906186387040695,
        75.76578774370817
      ],
      [
        26.894955067509482,
        75.77178028565109
      ],
      [
        26.8938899138912,
        75.78640303781873
      ],
      [
        26.904055266887305,
        75.7950378147219
      ],
      [
        26.91528863594689,
        75.78904859803312
      ],
      [
        26.91635460272235,
        75.77442127803064
      ]
    ],
    "state": "Rajasthan",
    "city": "Jaipur"
  },
  {
    "h3_index": "873d8dcd5ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      26.8467,
      80.9462
    ],
    "boundary": [
      [
        26.85385096300541,
        80.93915864756342
      ],
      [
        26.842506309962168,
        80.94419406327894
      ],
      [
        26.840925716993343,
        80.9584979006174
      ],
      [
        26.850688378136848,
        80.96777053419967
      ],
      [
        26.86203459054833,
        80.96273897202462
      ],
      [
        26.863616582842326,
        80.94843092175682
      ]
    ],
    "state": "Uttar Pradesh",
    "city": "Lucknow"
  },
  {
    "h3_index": "873c138caffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      25.5941,
      85.1376
    ],
    "boundary": [
      [
        25.590478455648473,
        85.14256531098036
      ],
      [
        25.602446039430838,
        85.13843435235442
      ],
      [
        25.604713067968035,
        85.12446856138386
      ],
      [
        25.595013354487826,
        85.11463524657094
      ],
      [
        25.58304637349852,
        85.11876648236831
      ],
      [
        25.580778503046773,
        85.13273075620691
      ]
    ],
    "state": "Bihar",
    "city": "Patna"
  },
  {
    "h3_index": "873d914f1ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      23.2599,
      77.4126
    ],
    "boundary": [
      [
        23.267381211044217,
        77.4242883117751
      ],
      [
        23.27903122709395,
        77.42014517632471
      ],
      [
        23.280722560930823,
        77.40712996989045
      ],
      [
        23.27076527834484,
        77.39825953902773
      ],
      [
        23.259116282103648,
        77.40240245883568
      ],
      [
        23.25742354854923,
        77.41541602545627
      ]
    ],
    "state": "Madhya Pradesh",
    "city": "Bhopal"
  },
  {
    "h3_index": "873d9629bffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      22.7196,
      75.8577
    ],
    "boundary": [
      [
        22.711636167787386,
        75.87444355673519
      ],
      [
        22.723205969351607,
        75.87031839227589
      ],
      [
        22.724805429535774,
        75.85754864847833
      ],
      [
        22.714836592008215,
        75.84890570822611
      ],
      [
        22.70326788666966,
        75.85303056993352
      ],
      [
        22.701666922556544,
        75.86579867492763
      ]
    ],
    "state": "Madhya Pradesh",
    "city": "Indore"
  },
  {
    "h3_index": "87609612dffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      21.1458,
      79.0882
    ],
    "boundary": [
      [
        21.138742617348576,
        79.09908248559718
      ],
      [
        21.150768922109542,
        79.09496626463324
      ],
      [
        21.1527850271229,
        79.08182883553287
      ],
      [
        21.142776143954844,
        79.07280922881912
      ],
      [
        21.130750903655205,
        79.07692533584468
      ],
      [
        21.128733481977186,
        79.0900611638457
      ]
    ],
    "state": "Maharashtra",
    "city": "Nagpur"
  },
  {
    "h3_index": "8742d9d6bffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      21.1702,
      72.8311
    ],
    "boundary": [
      [
        21.170057626393458,
        72.81262493637256
      ],
      [
        21.159812807210297,
        72.81859907777134
      ],
      [
        21.159131497427552,
        72.83210876173443
      ],
      [
        21.1686945888122,
        72.83964825127796
      ],
      [
        21.178941574432272,
        72.83367659630068
      ],
      [
        21.179623302355246,
        72.82016296441489
      ]
    ],
    "state": "Gujarat",
    "city": "Surat"
  },
  {
    "h3_index": "873d14699ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Fog": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      30.7333,
      76.7794
    ],
    "boundary": [
      [
        30.733769980082894,
        76.77093938774534
      ],
      [
        30.722003626065227,
        76.77709655736192
      ],
      [
        30.72072653796741,
        76.7925394645092
      ],
      [
        30.731214821915067,
        76.80183026692657
      ],
      [
        30.742983155106344,
        76.79567696035166
      ],
      [
        30.744261225465646,
        76.7802289869771
      ]
    ],
    "state": "Punjab",
    "city": "Chandigarh"
  },
  {
    "h3_index": "873c8e400ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      20.2961,
      85.8245
    ],
    "boundary": [
      [
        20.293293963083876,
        85.84655800770837
      ],
      [
        20.305891608437143,
        85.84251258791222
      ],
      [
        20.30855353501781,
        85.82874290196227
      ],
      [
        20.298618630485898,
        85.81902007698504
      ],
      [
        20.28602174185248,
        85.82306581007192
      ],
      [
        20.283359000901967,
        85.83683405522792
      ]
    ],
    "state": "Odisha",
    "city": "Bhubaneswar"
  },
  {
    "h3_index": "873ca8534ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Fog": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      23.3441,
      85.3096
    ],
    "boundary": [
      [
        23.33414407844547,
        85.31832549906844
      ],
      [
        23.346396721205902,
        85.31422956140335
      ],
      [
        23.34882651195639,
        85.30035872556235
      ],
      [
        23.339004509334334,
        85.2905853157469
      ],
      [
        23.326752541975477,
        85.2946815379764
      ],
      [
        23.324321901696074,
        85.30855088584848
      ]
    ],
    "state": "Jharkhand",
    "city": "Ranchi"
  },
  {
    "h3_index": "873cb1cabffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      21.2514,
      81.6296
    ],
    "boundary": [
      [
        21.258785537741662,
        81.64782211842478
      ],
      [
        21.271003844572007,
        81.6437126826488
      ],
      [
        21.273235188786078,
        81.63027592872342
      ],
      [
        21.263249360892175,
        81.62095017327219
      ],
      [
        21.25103200020684,
        81.62505965246528
      ],
      [
        21.24879952116565,
        81.63849484404587
      ]
    ],
    "state": "Chhattisgarh",
    "city": "Raipur"
  },
  {
    "h3_index": "87603422cffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 86.0,
    "centroid": [
      9.9252,
      78.1198
    ],
    "boundary": [
      [
        9.922224240505212,
        78.13793578869151
      ],
      [
        9.934844889383871,
        78.13397007759654
      ],
      [
        9.937629754433985,
        78.12142768681636
      ],
      [
        9.9277952602647,
        78.11285250326605
      ],
      [
        9.915176197829673,
        78.11681805555376
      ],
      [
        9.912390043141093,
        78.1293589504771
      ]
    ],
    "state": "Tamil Nadu",
    "city": "Madurai"
  },
  {
    "h3_index": "87425a6c6ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      26.2389,
      73.0243
    ],
    "boundary": [
      [
        26.240994226510935,
        73.00836241390037
      ],
      [
        26.22995861861691,
        73.01477082273404
      ],
      [
        26.229186041855456,
        73.02933297880044
      ],
      [
        26.23944859656603,
        73.03749130895325
      ],
      [
        26.250486472069877,
        73.03108581663653
      ],
      [
        26.251259525396854,
        73.01651907647044
      ]
    ],
    "state": "Rajasthan",
    "city": "Jodhpur"
  },
  {
    "h3_index": "873c16456ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      25.3176,
      82.9739
    ],
    "boundary": [
      [
        25.318037311561987,
        82.99495154068815
      ],
      [
        25.329891474745505,
        82.99079579168334
      ],
      [
        25.331959388980977,
        82.9770321917272
      ],
      [
        25.3221741357614,
        82.96742591710364
      ],
      [
        25.310320684839507,
        82.9715817991713
      ],
      [
        25.30825177473877,
        82.98534382318161
      ]
    ],
    "state": "Uttar Pradesh",
    "city": "Varanasi"
  },
  {
    "h3_index": "87424d26dffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      31.634,
      74.8723
    ],
    "boundary": [
      [
        31.62405543515578,
        74.85254061507858
      ],
      [
        31.612263240612247,
        74.8591478269653
      ],
      [
        31.61119449151281,
        74.87488443198201
      ],
      [
        31.621917191736134,
        74.88401913776035
      ],
      [
        31.63371154943251,
        74.87741563087305
      ],
      [
        31.634781043977462,
        74.86167371174857
      ]
    ],
    "state": "Punjab",
    "city": "Amritsar"
  },
  {
    "h3_index": "873d8584affffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 85.0,
    "centroid": [
      27.1767,
      78.0081
    ],
    "boundary": [
      [
        27.169176651110455,
        77.99584661606615
      ],
      [
        27.157843226742862,
        78.0014579484085
      ],
      [
        27.15654307218992,
        78.01602896302961
      ],
      [
        27.16657526409291,
        78.02499311945047
      ],
      [
        27.17791053689033,
        78.01938539205003
      ],
      [
        27.17921176966784,
        78.00480990218588
      ]
    ],
    "state": "Uttar Pradesh",
    "city": "Agra"
  },
  {
    "h3_index": "87608b54dffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Flooding": 1
    },
    "avg_trust": 78.5,
    "centroid": [
      19.085,
      72.88
    ],
    "boundary": [
      [
        19.09437613891463,
        72.89169158838028
      ],
      [
        19.106011430687698,
        72.88765513486176
      ],
      [
        19.107693388961025,
        72.87550984525434
      ],
      [
        19.097741772646057,
        72.867402595286
      ],
      [
        19.086107854047526,
        72.87143860186279
      ],
      [
        19.08442417856951,
        72.88358230557536
      ]
    ],
    "state": "Maharashtra",
    "city": "Mumbai"
  },
  {
    "h3_index": "873da1140ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Thunderstorm": 1
    },
    "avg_trust": 74.0,
    "centroid": [
      28.625,
      77.22
    ],
    "boundary": [
      [
        28.625368186066403,
        77.2069695223619
      ],
      [
        28.613854492841043,
        77.21285265042461
      ],
      [
        28.61258968405704,
        77.22778929530844
      ],
      [
        28.622837560136958,
        77.2368475378504
      ],
      [
        28.63435318393849,
        77.2309680858294
      ],
      [
        28.63561900137882,
        77.2160267140209
      ]
    ],
    "state": "Delhi",
    "city": "New Delhi"
  },
  {
    "h3_index": "873cf2c65ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Thunderstorm": 1
    },
    "avg_trust": 82.0,
    "centroid": [
      22.585,
      88.375
    ],
    "boundary": [
      [
        22.5869131385948,
        88.3946986561422
      ],
      [
        22.599427643540885,
        88.39067559443195
      ],
      [
        22.602191260184433,
        88.37663867578361
      ],
      [
        22.59244098827224,
        88.36662618658993
      ],
      [
        22.579927005387578,
        88.37064973551986
      ],
      [
        22.577162772198644,
        88.38468528682421
      ]
    ],
    "state": "West Bengal",
    "city": "Kolkata"
  },
  {
    "h3_index": "87618c48effffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Rainfall": 1
    },
    "avg_trust": 91.0,
    "centroid": [
      13.09,
      80.28
    ],
    "boundary": [
      [
        13.081815338436936,
        80.3028721446655
      ],
      [
        13.094512784544536,
        80.29886537205026
      ],
      [
        13.097209749554674,
        80.28593049858833
      ],
      [
        13.087210461755735,
        80.27700390113397
      ],
      [
        13.074514375826535,
        80.28101063524947
      ],
      [
        13.071816217488388,
        80.29394400563136
      ]
    ],
    "state": "Tamil Nadu",
    "city": "Chennai"
  },
  {
    "h3_index": "873da2188ffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Heatwave": 1
    },
    "avg_trust": 79.0,
    "centroid": [
      26.92,
      75.8
    ],
    "boundary": [
      [
        26.91528863594689,
        75.78904859803312
      ],
      [
        26.904055266887305,
        75.7950378147219
      ],
      [
        26.90298750797342,
        75.80966160483483
      ],
      [
        26.91315230232604,
        75.81830074503046
      ],
      [
        26.92438771897112,
        75.8123148572774
      ],
      [
        26.925456293919247,
        75.79768649923673
      ]
    ],
    "state": "Rajasthan",
    "city": "Jaipur"
  },
  {
    "h3_index": "876004d32ffffff",
    "count": 1,
    "critical_count": 1,
    "categories": {
      "Flooding": 1
    },
    "avg_trust": 89.0,
    "centroid": [
      9.94,
      76.275
    ],
    "boundary": [
      [
        9.943445926625786,
        76.29382438481379
      ],
      [
        9.955910320321372,
        76.2898687994874
      ],
      [
        9.958596415950991,
        76.27757514065087
      ],
      [
        9.948819535609339,
        76.2692385712098
      ],
      [
        9.936356813990873,
        76.27319390008451
      ],
      [
        9.933669300680295,
        76.28548605510616
      ]
    ],
    "state": "Kerala",
    "city": "Kochi"
  },
  {
    "h3_index": "873c138cbffffff",
    "count": 1,
    "critical_count": 0,
    "categories": {
      "Other": 1
    },
    "avg_trust": 22.0,
    "centroid": [
      25.6,
      85.145
    ],
    "boundary": [
      [
        25.597907257875267,
        85.16636892771598
      ],
      [
        25.609875443031672,
        85.1622382478827
      ],
      [
        25.612144413812608,
        85.14827020178105
      ],
      [
        25.602446039430838,
        85.13843435235442
      ],
      [
        25.590478455648473,
        85.14256531098036
      ],
      [
        25.5882086447241,
        85.15653184064018
      ]
    ],
    "state": "Bihar",
    "city": "Patna"
  }
];

export const FALLBACK_CHARTS = {
  "sources": [
    {
      "source": "Citizen PWA Reports",
      "count": 4
    },
    {
      "source": "IMD Doppler Radar",
      "count": 10
    },
    {
      "source": "INSAT-3DR Satellite",
      "count": 8
    },
    {
      "source": "Open-Meteo AWS",
      "count": 20
    },
    {
      "source": "Twitter",
      "count": 5
    },
    {
      "source": "Twitter / X Stream",
      "count": 6
    }
  ],
  "verification": [
    {
      "status": "PENDING_REVIEW",
      "count": 3
    },
    {
      "status": "REJECTED",
      "count": 1
    },
    {
      "status": "VERIFIED",
      "count": 49
    }
  ],
  "severity": [
    {
      "severity": "Low",
      "count": 16
    },
    {
      "severity": "Moderate",
      "count": 30
    },
    {
      "severity": "High",
      "count": 5
    },
    {
      "severity": "Critical",
      "count": 2
    }
  ],
  "categories": [
    {
      "category": "Rainfall",
      "count": 20
    },
    {
      "category": "Other",
      "count": 16
    },
    {
      "category": "Thunderstorm",
      "count": 6
    },
    {
      "category": "Fog",
      "count": 5
    },
    {
      "category": "Flooding",
      "count": 4
    },
    {
      "category": "Cyclone",
      "count": 1
    },
    {
      "category": "Heatwave",
      "count": 1
    }
  ],
  "top_states": [
    {
      "state": "Maharashtra",
      "count": 5
    },
    {
      "state": "Delhi",
      "count": 4
    },
    {
      "state": "Tamil Nadu",
      "count": 4
    },
    {
      "state": "Kerala",
      "count": 3
    },
    {
      "state": "Odisha",
      "count": 3
    },
    {
      "state": "Rajasthan",
      "count": 3
    },
    {
      "state": "Uttar Pradesh",
      "count": 3
    }
  ],
  "funnel": [
    {
      "stage": "Raw Telemetry Ingested (Multi-Protocol)",
      "count": 88
    },
    {
      "stage": "SimHash Spatial Deduplicated",
      "count": 65
    },
    {
      "stage": "AI Tri-Check Corroborated",
      "count": 53
    },
    {
      "stage": "PostGIS H3 Distributed Ledger",
      "count": 53
    }
  ],
  "pipeline_streams": [
    {
      "name": "IMD Doppler Radar Network",
      "protocol": "UDP / Binary ASTER",
      "throughput": "24.8 pkts/s",
      "latency": "18ms",
      "status": "ACTIVE_STREAMING",
      "color": "emerald"
    },
    {
      "name": "INSAT-3DR Geostationary Imager",
      "protocol": "HDF5 / NetCDF4 Bus",
      "throughput": "12.4 MB/min",
      "latency": "42ms",
      "status": "ACTIVE_STREAMING",
      "color": "emerald"
    },
    {
      "name": "National AWS Surface Network",
      "protocol": "HTTPS REST Poller",
      "throughput": "38 stations/min",
      "latency": "65ms",
      "status": "ACTIVE_STREAMING",
      "color": "emerald"
    },
    {
      "name": "Twitter / X Crowdsource Stream",
      "protocol": "WebSocket v2 Filter",
      "throughput": "8.5 msgs/s",
      "latency": "110ms",
      "status": "ACTIVE_STREAMING",
      "color": "cyan"
    },
    {
      "name": "Citizen Ground-Truth PWA",
      "protocol": "JSON Webhook Gateway",
      "throughput": "On-Demand (PWA)",
      "latency": "35ms",
      "status": "LISTENING",
      "color": "blue"
    }
  ],
  "packet_stream": [
    {
      "id": "EVT-TW-F0596F35",
      "source": "Twitter",
      "city": "New Delhi",
      "category": "Rainfall",
      "severity": "Moderate",
      "status": "VERIFIED",
      "trust": 96.0,
      "time": "19:13:06"
    },
    {
      "id": "EVT-TW-5539CBE9",
      "source": "Twitter",
      "city": "Mumbai",
      "category": "Rainfall",
      "severity": "Moderate",
      "status": "VERIFIED",
      "trust": 95.5,
      "time": "19:13:06"
    },
    {
      "id": "EVT-TW-C5822502",
      "source": "Twitter",
      "city": "Kolkata",
      "category": "Rainfall",
      "severity": "Moderate",
      "status": "VERIFIED",
      "trust": 96.0,
      "time": "19:13:06"
    },
    {
      "id": "EVT-TW-DC37D005",
      "source": "Twitter",
      "city": "New Delhi",
      "category": "Rainfall",
      "severity": "Moderate",
      "status": "VERIFIED",
      "trust": 96.0,
      "time": "19:13:06"
    },
    {
      "id": "EVT-TW-F0C83C00",
      "source": "Twitter",
      "city": "Puri",
      "category": "Cyclone",
      "severity": "High",
      "status": "VERIFIED",
      "trust": 91.0,
      "time": "19:13:06"
    },
    {
      "id": "EVT-IN-DWR-0001",
      "source": "IMD Doppler Radar",
      "city": "Mumbai",
      "category": "Rainfall",
      "severity": "Moderate",
      "status": "VERIFIED",
      "trust": 86.0,
      "time": "19:12:56"
    },
    {
      "id": "EVT-IN-DWR-0002",
      "source": "IMD Doppler Radar",
      "city": "Kolkata",
      "category": "Rainfall",
      "severity": "Moderate",
      "status": "VERIFIED",
      "trust": 86.0,
      "time": "19:12:56"
    },
    {
      "id": "EVT-IN-DWR-0003",
      "source": "IMD Doppler Radar",
      "city": "Chennai",
      "category": "Rainfall",
      "severity": "Moderate",
      "status": "VERIFIED",
      "trust": 86.0,
      "time": "19:12:56"
    }
  ]
};

export const FALLBACK_REVIEW_QUEUE = [
  {
    "id": "EVT-REV-1D0B70",
    "title": "Severe Flash Flooding & Submerged Tracks near Dadar",
    "description": "Heavy downpour exceeding 80mm in 2 hours. Rail tracks waterlogged up to 1.5 ft near Dadar central junction.",
    "category": "Flooding",
    "severity": "Critical",
    "latitude": 19.0178,
    "longitude": 72.8478,
    "city": "Mumbai",
    "state": "Maharashtra",
    "source": "Citizen Report",
    "source_author": "Rohan Deshmukh",
    "trust_score": 64.0,
    "verification_status": "PENDING_REVIEW",
    "operator_decision": "UNREVIEWED",
    "radar_station_name": "Colaba Doppler Radar",
    "radar_recorded_value": 78.4,
    "radar_corroborated": true,
    "observed_at": "2026-09-29T21:15:00Z",
    "ingested_at": "2026-09-29T21:18:00Z"
  },
  {
    "id": "EVT-REV-2A5022",
    "title": "Gale-Force Thunderstorm Gusts & Uprooted Trees near Cuttack Ring Road",
    "description": "Severe squall with wind speeds crossing 75 km/h. Multiple fallen trees blocking traffic towards Link Road.",
    "category": "Thunderstorm",
    "severity": "High",
    "latitude": 20.4625,
    "longitude": 85.8828,
    "city": "Cuttack",
    "state": "Odisha",
    "source": "Citizen Report",
    "source_author": "Debabrata Mohanty",
    "trust_score": 58.0,
    "verification_status": "PENDING_REVIEW",
    "operator_decision": "UNREVIEWED",
    "radar_station_name": "Paradip Doppler Radar",
    "radar_recorded_value": 68.0,
    "radar_corroborated": true,
    "observed_at": "2026-09-29T21:30:00Z",
    "ingested_at": "2026-09-29T21:32:00Z"
  },
  {
    "id": "EVT-REV-FF3AE4",
    "title": "Dense Winter Smog & Visibility Dropped Below 50m along Ring Road",
    "description": "Severe particulate inversion layer reducing roadway visibility below safe braking limits at 35 km/h.",
    "category": "Fog",
    "severity": "High",
    "latitude": 28.6139,
    "longitude": 77.209,
    "city": "New Delhi",
    "state": "Delhi",
    "source": "Citizen Report",
    "source_author": "Aakash Verma",
    "trust_score": 62.0,
    "verification_status": "PENDING_REVIEW",
    "operator_decision": "UNREVIEWED",
    "radar_station_name": "Palam Doppler Radar",
    "radar_recorded_value": 45.0,
    "radar_corroborated": true,
    "observed_at": "2026-09-29T21:40:00Z",
    "ingested_at": "2026-09-29T21:42:00Z"
  },
  {
    "id": "EVT-REV-A8BC44",
    "title": "Heavy Rain Waterlogging & Vehicle Stalling near Silk Board",
    "description": "Sudden cloudburst cell dumping 62mm in 45 minutes. Water depth 1.2ft at underpass, vehicular traffic crawling.",
    "category": "Rainfall",
    "severity": "High",
    "latitude": 12.9172,
    "longitude": 77.6228,
    "city": "Bengaluru",
    "state": "Karnataka",
    "source": "Citizen Report",
    "source_author": "Priya Nair",
    "trust_score": 66.0,
    "verification_status": "PENDING_REVIEW",
    "operator_decision": "UNREVIEWED",
    "radar_station_name": "Bengaluru Doppler Radar",
    "radar_recorded_value": 62.0,
    "radar_corroborated": true,
    "observed_at": "2026-09-29T21:45:00Z",
    "ingested_at": "2026-09-29T21:48:00Z"
  }
];
