/**
 * Multi-Hazard Severity Index (MHSI) Standards & Triaging Registry
 * 
 * Standard Operational Classification (NDMA / IMD / GDACS Protocols):
 * - Level 3 (Red Alert - Critical Emergency): MHSI >= 65.0 (Immediate life-safety protocols, NDRF mobilization)
 * - Level 2 (Orange/Amber Alert - Monitored Advisory): MHSI 40.0 - 64.9 (Continuous radar/satellite tracking)
 * - Level 1 (Yellow Alert - Guarded): MHSI 20.0 - 39.9 (Monitored situational awareness)
 * - Negligible / Dissipated / Safe: MHSI < 20.0 (Standard De-listing Cutoff)
 * 
 * STANDARD DE-LISTING PROTOCOL:
 * Any event whose MHSI drops below 20.0 or whose physical circulation has collapsed
 * into an inactive remnant trough is classified as "NEGLIGIBLE / DE-ESCALATED" and is
 * automatically filtered out and de-listed from active national crisis tracking.
 */

export const MHSI_ACTIVE_THRESHOLD = 20.0;

export const DEFAULT_MULTI_HAZARDS = [
  {
    id: 'landslide',
    name: 'Wayanad Slope Instability & Debris Flow',
    name_hi: 'वायनाड मेप्पाडी भूस्खलन एवं मलबा प्रवाह',
    hazard_type: 'Monsoon Landslide & Mudslip',
    icon_type: 'mountain',
    severity_rank: 1,
    mhsi_score: 78.6,
    status_code: 'HIGH_ALERT',
    badge_color: 'bg-red-600',
    region: 'Western Ghats, Kerala (Meppadi - Chooralmala)',
    region_hi: 'पश्चिमी घाट ढलान, केरल (चूरलमाला - मेप्पाडी)',
    center: [11.55, 76.15],
    primary_metric: '91% Soil Saturation',
    primary_metric_hi: '91.4% मृदा जल-संतृप्ति',
    secondary_metric: '312 mm / 48h Rain',
    secondary_metric_hi: '312 मिमी / 48 घंटे वर्षा',
    satellite_label: 'Sentinel-2 & InSAR Topographic Moisture Analysis',
    satellite_label_hi: 'सेंटिनल उपग्रह रडार एवं ग्राउंड सेंसर ग्रिड',
    satellite_src: '/assets/landslide_sar_wayanad.jpg',
    description: 'Extreme antecedent monsoon precipitation has triggered deep hydraulic soil saturation (>90%) across steep slopes (>30°). High probability of slope slippage and debris channelization.',
    hotspots: [
      { name: 'Chooralmala Valley', lat: 11.52, lon: 76.18, risk: 'Debris Flow Red Zone' },
      { name: 'Mundakkai Slope', lat: 11.54, lon: 76.21, risk: 'High Shear Instability' },
      { name: 'Meppadi Ridge', lat: 11.55, lon: 76.13, risk: 'Soil Saturation 93%' },
      { name: 'Vellarimala Peak', lat: 11.47, lon: 76.14, risk: 'Headscarp Tension Cracks' }
    ],
    plain_report: {
      headline_en: 'Severe Ground Saturation & Landslide Risk in Wayanad',
      headline_hi: 'वायनाड में अत्यधिक जल-संतृप्ति एवं गंभीर भूस्खलन का खतरा',
      quick_take_en: 'Continuous heavy rainfall (312 mm) has soaked the mountain soil past 91% of its water-holding limit. Steep hill slopes near tea settlements are at acute risk of mud and rock slippage.',
      quick_take_hi: 'लगातार 48 घंटों में 312 मिमी मूसलाधार वर्षा से पहाड़ी मिट्टी 91.4% तक पानी से संतृप्त हो चुकी है। चाय बागानों के पास खड़ी ढलानों पर मिट्टी और मलबे के खिसकने का गंभीर खतरा बना हुआ है।',
      when_started_en: '36 Hours Ago (Oct 2 Evening): Intense cloudburst-scale monsoon rain started over the Western Ghats ridge, triggering heavy mountain runoff.',
      when_started_hi: '36 घंटे पहले (2 अक्टूबर शाम 18:30 IST): पश्चिमी घाट की मेप्पाडी पहाड़ियों पर बादल फटने जैसी मूसलाधार बारिश (312 मिमी) शुरू हुई, जिससे ढलानों पर भारी जल प्रवाह उत्पन्न हुआ।',
      how_escalating_en: 'Rainwater seeped deep into mountain bedrock, driving pore-water pressure past 91.4%. Surface tension cracks widened on upper tea slopes, raising threat of sudden mudflow down to valleys.',
      how_escalating_hi: 'बारिश का पानी गहराई में रिसने से पोर-वाटर प्रेशर 91.4% पहुंच गया। उपग्रह इनसार (InSAR) ने 14 मिमी/घंटे की गति से ढलान खिसकना और ऊपरी चाय बागानों में दरारें दर्ज की हैं।',
      current_situation_en: 'Red Alert in effect. Precautionary evacuation underway for 4 hillside hamlets (Chooralmala & Mundakkai). InSAR radar and thermal drones actively tracking slope movements.',
      current_situation_hi: 'रेड अलर्ट पूर्णतः प्रभावी है। 4 संवेदनशील बस्तियों (चूरलमाला व मुंडक्कई) से 850+ परिवारों को सुरक्षित शिविरों में शिफ्ट किया जा रहा है। एनडीआरएफ और थर्मल ड्रोन 24x7 निगरानी कर रहे हैं।',
      future_outlook_en: 'Intermittent rainfall expected for next 12 hours before tapering. Ground saturation remains critical; high vigilance required through tomorrow.',
      future_outlook_hi: 'अगले 12 घंटों तक रुक-रुक कर बारिश रहने का अनुमान है। मिट्टी अत्यधिक गीली होने से कल शाम तक पूर्ण सतर्कता अनिवार्य है।',
      why_dangerous_en: 'When hillside soil absorbs this much water, friction holding it together fails. Millions of tons of mud and boulders can slide down into valleys within minutes without warning.',
      why_dangerous_hi: 'जब पहाड़ी मिट्टी 90% से अधिक पानी सोख लेती है तो पत्थरों और मिट्टी को थामने वाला घर्षण समाप्त हो जाता है। बिना चेतावनी के लाखों टन कीचड़ और भारी चट्टानें नीचे बह सकती हैं।',
      who_affected_en: 'Tea estate workers and residents in 4 highland sectors (Chooralmala, Mundakkai, Meppadi, and Vellarimala).',
      who_affected_hi: 'चूरलमाला, मुंडक्कई, मेप्पाडी और वेल्लारीमाला के चाय बागान श्रमिक व ग्रामीण आबादी।',
      current_action_en: 'NDRF teams stationed on ground. Evacuation to designated relief camps advised. Drone thermal cameras scanning tension cracks.',
      current_action_hi: 'एनडीआरएफ की 3 बटालियन और राज्य आपदा दल तैनात हैं। सुरक्षित जिला राहत शिविरों में लोगों को भेजा गया है। ड्रोन द्वारा दरारों की निगरानी जारी है।',
      dos_and_donts_en: [
        'Move immediately to designated highland district relief shelters.',
        'Avoid all night travel on steep hill roads and hairpin bends.',
        'Do not cross overflowing streams, culverts, or natural mountain runoffs.',
        'Follow verified alerts from Kerala Disaster Management & IMD only.'
      ],
      dos_and_donts_hi: [
        'प्रशासन द्वारा बनाए गए नजदीकी सुरक्षित राहत शिविरों में तुरंत जाएं।',
        'रात के समय पहाड़ी और घुमावदार रास्तों पर यात्रा से पूर्णतः बचें।',
        'उफनते नालों, पुलिया और पहाड़ी झरनों को पार करने की कोशिश न करें।',
        'केवल आपदा प्रबंधन और मौसम विभाग के आधिकारिक अलर्ट पर भरोसा करें।'
      ]
    },
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 84,
      intensity_detail: '91.4% pore-water pressure saturation + 312 mm / 48h deluge on slopes >30°',
      exposure_score: 74,
      exposure_detail: '4 Highland settlement tea estate pockets (Chooralmala & Mundakkai)',
      urgency_score: 82,
      urgency_detail: 'Active tension cracks recorded along upper ridge lines with imminent rainfall',
      confidence_score: 95,
      confidence_detail: 'Sentinel-2 SAR Soil Moisture Index + Kerala IMD Automated Weather Stations',
      plain_english: 'The AI ranked Wayanad as #1 High Alert due to dangerous hydraulic saturation exceeding critical slope shear limits across tea estate settlements.',
      plain_hindi: 'एआई ने वायनाड को सर्वोच्च चेतावनी स्तर पर रखा है क्योंकि 91.4% मिट्टी की नमी ढलानों की सुरक्षित सीमा पार कर चुकी है और भूस्खलन का उच्च जोखिम है।'
    }
  },
  {
    id: 'volcano',
    name: 'Barren Island Volcanic & Thermal Emission',
    name_hi: 'बैरन द्वीप ज्वालामुखी सक्रिय थर्मल विस्फोट',
    hazard_type: 'Volcanic / Thermal Anomaly',
    icon_type: 'flame',
    severity_rank: 2,
    mhsi_score: 46.5,
    status_code: 'MONITORED_ADVISORY',
    badge_color: 'bg-orange-600',
    region: 'Andaman Sea (138 km East of Port Blair)',
    region_hi: 'अंडमान सागर (पोर्ट ब्लेयर से 138 किमी पूर्व)',
    center: [12.28, 93.86],
    primary_metric: '142 MW Radiative Power',
    primary_metric_hi: '142 मेगावाट विकिरण ऊर्जा',
    secondary_metric: '3.8 DU SO₂ Plume',
    secondary_metric_hi: '3.8 DU SO₂ गैस फैलाव',
    satellite_label: 'Sentinel-2 SWIR Thermal Infrared & Aerosol Dispersion',
    satellite_label_hi: 'सेंटिनल-2 SWIR इन्फ्रारेड एवं एरोसोल सेंसर',
    satellite_src: '/assets/volcano_thermal_barren.jpg',
    description: 'Continuous strombolian activity with thermal radiative bloom from central caldera. SO2 aerosol plume drifting WSW. Maritime advisory in effect for 45 km radius.',
    satellite_src: '/assets/volcano_thermal_barren.jpg',
    description: 'Continuous strombolian activity with thermal radiative bloom from central caldera. SO2 aerosol plume drifting WSW. Maritime advisory in effect for 45 km radius.',
    hotspots: [
      { name: 'Central Caldera Crater', lat: 12.28, lon: 93.86, risk: 'Active Thermal Vent (1100°C)' },
      { name: 'Western Lava Channel', lat: 12.28, lon: 93.84, risk: 'Sub-surface Basalt Flow' },
      { name: 'Maritime Buffer Zone', lat: 12.25, lon: 93.80, risk: '45 km Exclusion Perimeter' }
    ],
    plain_report: {
      headline_en: 'Active Volcanic Activity at Barren Island (No Threat to Mainland)',
      headline_hi: 'बैरन द्वीप पर सक्रिय ज्वालामुखी हलचल (मुख्य भूमि सुरक्षित)',
      quick_take_en: 'India’s only active volcano is emitting hot basalt lava (1100°C) and sulfur gas plumes. However, the island is completely uninhabited, meaning zero direct danger to civilian life.',
      quick_take_hi: 'भारत का एकमात्र सक्रिय ज्वालामुखी 1100°C गर्म लावा और सल्फर गैस का धुआं छोड़ रहा है। चूंकि यह द्वीप पूरी तरह निर्जन (खाली) है, इसलिए आम जनता को कोई खतरा नहीं है।',
      when_started_en: '24 Hours Ago (Oct 3, 02:30 AM): Renewed Strombolian eruptive pulses detected from central caldera by Sentinel-2 SWIR infrared sensor.',
      when_started_hi: '24 घंटे पहले (3 अक्टूबर तड़के): सेंट्रल काल्डेरा क्रेटर से लावा उत्सर्जन और सल्फर गैस का धुआं उपग्रह इन्फ्रारेड सेंसर द्वारा दर्ज किया गया।',
      how_escalating_en: 'Steady basaltic spattering inside crater releasing 142 MW thermal radiative energy. SO2 gas plume drifting WSW over the Andaman Sea without paroxysmal explosive shift.',
      how_escalating_hi: 'ज्वालामुखी से 142 MW की स्थिर ताप ऊर्जा निकल रही है और धुआं समुद्र के ऊपर 22 किमी पश्चिम-दक्षिण दिशा में फैल रहा है। कोई बड़ा विस्फोटक बदलाव नहीं हुआ है।',
      current_situation_en: 'Island is completely uninhabited; zero danger to civilian populace. Indian Coast Guard enforcing 45 km maritime safety perimeter. Port Blair (138 km away) is 100% normal.',
      current_situation_hi: 'द्वीप पूरी तरह निर्जन है; नागरिकों को कोई खतरा नहीं। तटरक्षक बल ने समुद्र में 45 किमी का सुरक्षा घेरा बनाया हुआ है। पोर्ट ब्लेयर (138 किमी दूर) में जनजीवन पूरी तरह सामान्य है।',
      future_outlook_en: 'Activity expected to remain in steady Strombolian degassing mode. Maritime advisory maintained through the week.',
      future_outlook_hi: 'अगले कुछ दिनों तक सामान्य गैसीय उत्सर्जन जारी रहने का अनुमान है। समुद्र में जहाजों के लिए सतर्कता एडवाइजरी जारी रहेगी।',
      why_dangerous_en: 'Volcanic vents release toxic sulfur dioxide and hot basalt fragments. The hazard is strictly maritime—hazardous to passing fishing boats and low-flying aircraft.',
      why_dangerous_hi: 'ज्वालामुखी से जहरीली गैस और गर्म चट्टानें निकलती हैं। यह खतरा सिर्फ समुद्र में गुजरने वाले जहाजों और हवाई जहाजों के लिए है, जमीन पर किसी बस्ती को नहीं।',
      who_affected_en: 'No human population resides on the island. Maritime shipping vessels and aviation corridors in the Andaman Sea are regulated.',
      who_affected_hi: 'द्वीप पर कोई इंसान नहीं रहता। अंडमान सागर में चलने वाले जहाजों और उड़ानों के मार्ग को नियंत्रित किया गया है।',
      current_action_en: 'Indian Coast Guard maintaining a 45 km exclusion buffer. Sentinel-5P satellite continuously tracking ash plume direction.',
      current_action_hi: 'भारतीय तटरक्षक बल ने 45 किमी का सुरक्षा घेरा बनाया है। उपग्रह से धुएं और राख के फैलाव पर नजर रखी जा रही है।',
      dos_and_donts_en: [
        'Fishermen and boats must maintain at least 45 km distance from the caldera.',
        'Aviation flights rerouted around ash dispersion corridors.',
        'Mainland and Port Blair residents have zero risk; normal daily life continues.',
        'Do not attempt private drone flights or unauthorized sea expeditions.'
      ],
      dos_and_donts_hi: [
        'मछुआरों और नावों को द्वीप से कम से कम 45 किमी दूर रहने की सख्त हिदायत है।',
        'विमानों के रास्तों को ज्वालामुखी के धुएं से दूर मोड़ा गया है।',
        'पोर्ट ब्लेयर और मुख्य भूमि के नागरिकों को कोई खतरा नहीं, स्थिति सामान्य है।',
        'द्वीप के पास अनधिकृत नाव या ड्रोन ले जाने का प्रयास न करें।'
      ]
    },
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 68,
      intensity_detail: '142 MW Volcanic Radiative Power (VRP) & 3.8 DU SO2 gas column',
      exposure_score: 18,
      exposure_detail: 'Uninhabited island; restricted to offshore shipping lanes & aviation airways',
      urgency_score: 42,
      urgency_detail: 'Steady-state Strombolian eruption without paroxysmal explosive shift',
      confidence_score: 99,
      confidence_detail: 'Sentinel-2 MSI Short-Wave Infrared (SWIR) + Sentinel-5P TROPOMI UV Spectrometer',
      plain_english: 'The AI ranked Barren Island at Rank #2 (Advisory) because despite high thermal energy, human exposure is virtually zero as the island is uninhabited.',
      plain_hindi: 'एआई ने बैरन द्वीप को दूसरे स्थान पर रखा क्योंकि उच्च ज्वालामुखी ताप के बावजूद द्वीप निर्जन है और नागरिक जीवन पर कोई सीधा खतरा नहीं है।'
    }
  },
  {
    id: 'flood',
    name: 'Brahmaputra Valley Riverine Surveillance',
    name_hi: 'असम ब्रह्मपुत्र नदी घाटी जल विज्ञान निगरानी',
    hazard_type: 'Hydrological Basin Inundation',
    icon_type: 'waves',
    severity_rank: 3,
    mhsi_score: 32.0,
    status_code: 'NORMAL_GUARDED',
    badge_color: 'bg-emerald-600',
    region: 'Upper Assam (Kaziranga - Majuli Sector)',
    region_hi: 'ऊपरी असम (काजीरंगा - माजुली सेक्टर)',
    center: [26.75, 93.50],
    primary_metric: '0.8m Below Danger Level',
    primary_metric_hi: 'खतरे के निशान से 0.8 मी. नीचे',
    secondary_metric: 'Discharge 18,200 m³/s',
    secondary_metric_hi: '18,200 घन मी/सेकंड निर्वहन',
    satellite_label: 'Sentinel-1 SAR Hydrological Flood Extent Analysis',
    satellite_label_hi: 'सेंटिनल-1 SAR जल स्तर एवं बेसिन टेलीमेट्री',
    satellite_src: '/assets/flood_cwc_brahmaputra.jpg',
    description: 'Monsoon basin runoff within controlled thresholds. CWC hydrological gauges at Dhubri, Guwahati, and Nematighat reporting steady river stages below warning thresholds.',
    hotspots: [
      { name: 'Majuli River Island', lat: 26.95, lon: 94.20, risk: 'Bank Erosion Monitoring' },
      { name: 'Kaziranga North Lowlands', lat: 26.65, lon: 93.35, risk: 'Seasonal Inundation Normal' },
      { name: 'Tezpur CWC Gauge', lat: 26.62, lon: 92.79, risk: 'Stage 64.2m (Safe)' }
    ],
    plain_report: {
      headline_en: 'Controlled River Runoff in Brahmaputra Valley (Below Danger Mark)',
      headline_hi: 'ब्रह्मपुत्र घाटी में नियंत्रित जल प्रवाह (खतरे के निशान से नीचे)',
      quick_take_en: 'The Brahmaputra River is flowing 0.8 meters safely below statutory danger levels. Embankments and dykes are intact, and routine seasonal monitoring is underway.',
      quick_take_hi: 'ब्रह्मपुत्र नदी का जलस्तर खतरे के निशान से 0.8 मीटर सुरक्षित नीचे बह रहा है। सभी सुरक्षा तटबंध मजबूत हैं और सामान्य मानसूनी निगरानी जारी है।',
      when_started_en: '48 Hours Ago: Monsoon runoff from Arunachal highlands swelled basin flow into Assam, raising discharge to 18,200 m³/s.',
      when_started_hi: '48 घंटे पहले: अरुणाचल की पहाड़ियों में तेज मानसूनी बारिश के बाद ब्रह्मपुत्र बेसिन में पानी का बहाव बढ़कर 18,200 m³/s हुआ।',
      how_escalating_en: 'Flow reached initial flood warning stages but remained safely bounded within engineered dykes without breaches or spillover.',
      how_escalating_hi: 'नदी का जलस्तर बढ़ा परंतु सुरक्षा तटबंधों के भीतर रहा। किसी भी तटबंध के टूटने या आबादी में पानी घुसने की कोई घटना नहीं हुई।',
      current_situation_en: 'Water stage stabilized at 0.8 meters below statutory danger mark. CWC automatic gauges confirm receding trend upstream.',
      current_situation_hi: 'जलस्तर खतरे के निशान से 0.8 मीटर नीचे पूरी तरह स्थिर है। केंद्रीय जल आयोग के गेज पुष्टि कर रहे हैं कि पानी धीरे-धीरे घट रहा है।',
      future_outlook_en: 'Catchment rainfall decreasing. River levels projected to drop further by 0.3 meters over next 24-48 hours.',
      future_outlook_hi: 'जलग्रहण क्षेत्र में बारिश कम हो रही है। अगले 24 से 48 घंटे में जलस्तर 0.3 मीटर और नीचे जाने का अनुमान है।',
      why_dangerous_en: 'During peak monsoon, catchment runoff can swell river channels. At present, river discharge is within standard capacity (18,200 m³/s), with no flash flood threat.',
      why_dangerous_hi: 'तेज बारिश में नदी का बहाव तेज हो सकता है, लेकिन वर्तमान में पानी की निकासी सामान्य क्षमता में है और किसी अचानक बाढ़ (फ्लैश फ्लड) का खतरा नहीं है।',
      who_affected_en: 'Low-lying riparian farmland in Majuli and Kaziranga. Normal daily agricultural life continues under guarded awareness.',
      who_affected_hi: 'माजुली और काजीरंगा के निचले तटीय कृषि क्षेत्र। सभी दैनिक गतिविधियां सामान्य रूप से चल रही हैं।',
      current_action_en: 'Central Water Commission (CWC) telemetry gauges updating river height every hour. SDRF boats on standby in Majuli island.',
      current_action_hi: 'केंद्रीय जल आयोग (CWC) हर घंटे नदी के स्तर की जांच कर रहा है। सुरक्षा दल माजुली में सतर्क अवस्था में तैनात हैं।',
      dos_and_donts_en: [
        'Stay informed via local CWC water stage announcements.',
        'Farmers in low-lying char areas should monitor riverbank alerts.',
        'No emergency evacuation or panic required; flood barriers are functioning.',
        'Do not swim or moor unanchored wooden country boats during high current hours.'
      ],
      dos_and_donts_hi: [
        'जल आयोग द्वारा जारी होने वाले दैनिक जलस्तर बुलेटिन पर नजर रखें।',
        'नदी किनारे के किसान आधिकारिक अलर्ट का पालन करें।',
        'किसी प्रकार के डर की जरूरत नहीं है, सभी तटबंध सुरक्षित हैं।',
        'तेज बहाव के समय नदी में तैरने या छोटी नावों को बिना बांधे छोड़ने से बचें।'
      ]
    },
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 34,
      intensity_detail: 'Basin discharge 18,200 m3/s; river stage 0.8m below statutory danger level',
      exposure_score: 40,
      exposure_detail: 'Riparian villages fortified with flood dykes & early warning siren grid',
      urgency_score: 25,
      urgency_detail: 'Catchment precipitation tapering; receding flood crest upstream',
      confidence_score: 96,
      confidence_detail: 'Central Water Commission (CWC) telemetry gauges + Sentinel-1 C-band SAR water mask',
      plain_english: 'The AI ranked Brahmaputra Valley at Rank #3 (Guarded) as river levels remain safely below statutory danger marks with no emergency evacuation required.',
      plain_hindi: 'एआई ने ब्रह्मपुत्र घाटी को सुरक्षित निगरानी में रखा है क्योंकि नदी का जलस्तर खतरे के निशान से 0.8 मीटर नीचे है और स्थिति नियंत्रण में है।'
    }
  },
  {
    id: 'cyclone',
    name: "System 'ARNAB' (Dissipated / Low Threat)",
    name_hi: "प्रणाली 'अर्नब' (शांत / कम खतरा - सामान्य स्थिति)",
    hazard_type: 'Dissipated Cyclonic System',
    icon_type: 'cyclone',
    severity_rank: 4,
    mhsi_score: 18.5,
    status_code: 'INACTIVE_MONITORING',
    badge_color: 'bg-stone-500',
    region: 'Central Bay of Bengal (Open Sea)',
    region_hi: 'मध्य बंगाल की खाड़ी (खुला समुद्री क्षेत्र)',
    center: [16.8, 88.5],
    primary_metric: '28 km/h Breeze (Normal)',
    primary_metric_hi: '28 किमी/घंटा सामान्य हवा',
    secondary_metric: '1008 hPa (Standard Pressure)',
    secondary_metric_hi: '1008 hPa सामान्य वायुदाब',
    satellite_label: 'Zoom Earth & INSAT-3DR Real-Time Synoptic Observation',
    satellite_label_hi: 'इनसैट-3डीआर एवं उपग्रह रडार लाइव अवलोकन',
    satellite_src: '/assets/normal_synoptic_india.jpg',
    description: 'System ARNAB has weakened and dissipated over the open sea into a remnant low-pressure trough. No severe cyclonic or coastal landfall threat exists along Indian coastlines. Routine coastal monitoring active.',
    hotspots: [
      { name: 'Balasore Coast', lat: 21.49, lon: 86.93, risk: 'All Clear · Normal Sea Conditions' },
      { name: 'Bhadrak / Dhamra', lat: 20.79, lon: 86.84, risk: 'All Clear · Standard Tide' },
      { name: 'Kendrapara', lat: 20.50, lon: 86.42, risk: 'All Clear · Safe Maritime Belt' },
      { name: 'Purba Medinipur', lat: 21.93, lon: 87.77, risk: 'All Clear · Nominal Weather' }
    ],
    plain_report: {
      headline_en: 'System Dissipated: Cyclone Threat Over (Normal Sea Breeze)',
      headline_hi: 'प्रणाली शांत: चक्रवात का खतरा समाप्त (सामान्य तटीय मौसम)',
      quick_take_en: 'System ARNAB / DANA has completely weakened and lost its circulation over the open Bay of Bengal. There is NO coastal landfall threat and weather is normal.',
      quick_take_hi: 'चक्रवाती प्रणाली गहरे समुद्र में पूरी तरह कमजोर होकर बिखर चुकी है। भारतीय समुद्र तटों पर किसी भी तूफान के टकराने (लैंडफॉल) का कोई खतरा नहीं है।',
      when_started_en: '72 Hours Ago: A tropical convective disturbance formed over south-central Bay of Bengal.',
      when_started_hi: '72 घंटे पहले: दक्षिण-मध्य बंगाल की खाड़ी के ऊपर एक चक्रवाती हवा का दबाव बनना शुरू हुआ था।',
      how_escalating_en: 'Adverse high vertical wind shear (30+ knots) rapidly disrupted the system’s core circulation over open waters, halting cyclonic development.',
      how_escalating_hi: 'खुले समुद्र में तेज विपरीत हवाओं (विंड शीयर) ने इसके चक्रवाती भंवर को तोड़ दिया। तूफान संगठित होने के बजाय बिखर गया।',
      current_situation_en: 'System completely dissipated into a harmless remnant trough. Coastal winds calm at 28 km/h. Zero threat of storm surge or coastal landfall.',
      current_situation_hi: 'प्रणाली पूरी तरह समाप्त होकर सामान्य बादलों में बदल चुकी है। तटीय हवाएं शांत (28 किमी/घंटा) हैं। चक्रवात का कोई खतरा नहीं है।',
      future_outlook_en: 'Remnant moisture will dissipate over sea in next 24 hours. Clear, normal coastal weather expected across Odisha and West Bengal.',
      future_outlook_hi: 'अगले 24 घंटे में बचे-खुचे बादल भी समुद्र में समाप्त हो जाएंगे। ओडिशा और बंगाल के तटों पर मौसम पूरी तरह साफ रहेगा।',
      why_dangerous_en: 'Tropical cyclones generate destructive winds and storm surges when intact. However, 4 independent satellites confirm this system has decayed into harmless scattered clouds.',
      why_dangerous_hi: 'चक्रवात जब सक्रिय होता है तो तेज हवा और तूफानी लहरें लाता है, लेकिन 4 उपग्रहों ने पुष्टि की है कि यह सिस्टम अब केवल बादलों के सामान्य बिखराव में बदल चुका है।',
      who_affected_en: 'Coastal Odisha and West Bengal (Balasore, Bhadrak, Purba Medinipur) are fully in the safe green zone. Ports and fishing are operating normally.',
      who_affected_hi: 'ओडिशा और पश्चिम बंगाल के तटीय जिले (बालेश्वर, भद्रक, मेदिनीपुर) पूरी तरह सुरक्षित ग्रीन जोन में हैं। बंदरगाह और मछुआरे सामान्य काम कर रहे हैं।',
      current_action_en: 'Automated satellite tracking confirms open-water dissipation. De-escalated from emergency priority; all coastal alerts lifted.',
      current_action_hi: 'उपग्रह डेटा ने चक्रवात के शांत होने की पुष्टि की है। सभी तटीय आपात चेतावनियां वापस ले ली गई हैं।',
      dos_and_donts_en: [
        'Ignore old or recycled cyclone videos spreading on social media.',
        'Normal maritime fishing and port operations can proceed as scheduled.',
        'Tourists and coastal residents can go about their daily routines safely.',
        'Rely on IMD / WeatherNexus for true real-time atmospheric verification.'
      ],
      dos_and_donts_hi: [
        'सोशल मीडिया पर पुराने या फर्जी चक्रवाती वीडियो पर ध्यान न दें।',
        'तटीय क्षेत्रों में बाजार, स्कूल और मछली पकड़ने की गतिविधियां सामान्य हैं।',
        'नागरिक और पर्यटक बिना किसी भय के अपनी सामान्य दिनचर्या जारी रख सकते हैं।',
        'वास्तविक स्थिति के लिए केवल आधिकारिक मौसम बुलेटिन देखें।'
      ]
    },
    interpretability_breakdown: {
      formula: 'MHSI = (0.35 × Intensity + 0.35 × Exposure + 0.20 × Urgency) × Telemetry Confidence',
      intensity_score: 18,
      intensity_detail: '28 km/h gentle breeze + 1008 hPa normal atmospheric pressure',
      exposure_score: 15,
      exposure_detail: 'Coastal activities normal; zero evacuation or storm surge advisories',
      urgency_score: 10,
      urgency_detail: 'No landfall trajectory; system fully dissipated over open water',
      confidence_score: 99,
      confidence_detail: '4 Independent Satellites (Zoom Earth, Meteosat-IODC, Himawari, INSAT-3DR) confirm vortex collapse and absence of convective organization',
      plain_english: 'The AI classified Cyclonic System ARNAB as Inactive / De-escalated (Low Threat) because the vortex circulation has collapsed into a weak low-pressure trough with no coastal threat to India.',
      plain_hindi: 'एआई ने चक्रवाती प्रणाली अर्नब को निष्क्रिय / शांत (कम खतरा) के रूप में वर्गीकृत किया है क्योंकि चक्रवात का भंवर पूरी तरह समाप्त हो चुका है और भारतीय तटों पर कोई खतरा नहीं है।'
    }
  }
];

/**
 * Filters out threats whose MHSI falls below the statutory threshold (< 20.0)
 * or marked as INACTIVE_MONITORING, sorting active threats descending by MHSI score.
 */
export function getActiveMultiHazards(rawList = DEFAULT_MULTI_HAZARDS) {
  const list = Array.isArray(rawList) ? rawList : DEFAULT_MULTI_HAZARDS;
  const filtered = list.filter(
    (h) => (h.mhsi_score || 0) >= MHSI_ACTIVE_THRESHOLD && h.status_code !== 'INACTIVE_MONITORING'
  );
  const activeList = filtered.length > 0 ? filtered : list;
  return [...activeList]
    .sort((a, b) => (b.mhsi_score || 0) - (a.mhsi_score || 0))
    .map((h, idx) => ({ ...h, severity_rank: idx + 1 }));
}

/**
 * Returns the highest severity active threat across the country.
 */
export function getTopHazard(rawList = DEFAULT_MULTI_HAZARDS) {
  const active = getActiveMultiHazards(rawList);
  return active.length > 0 ? active[0] : null;
}

/**
 * Returns any de-escalated / negligible hazards that have fallen below the threshold.
 */
export function getArchivedDeescalatedHazards(rawList = DEFAULT_MULTI_HAZARDS) {
  const list = Array.isArray(rawList) ? rawList : DEFAULT_MULTI_HAZARDS;
  return list.filter(
    (h) => (h.mhsi_score || 0) < MHSI_ACTIVE_THRESHOLD || h.status_code === 'INACTIVE_MONITORING'
  );
}
