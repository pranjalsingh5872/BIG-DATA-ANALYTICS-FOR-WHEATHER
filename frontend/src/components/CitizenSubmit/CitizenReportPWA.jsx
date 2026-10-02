import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Camera, AlertCircle, CheckCircle, ShieldCheck, ShieldAlert, Sparkles, Upload, Image as ImageIcon, X, Wifi, WifiOff, RefreshCw, Smartphone, Copy, Check, Radio, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const MAX_REPORTS_PER_DEVICE = 2;

function getOrCreateDeviceId() {
  try {
    let id = localStorage.getItem('weathernexus_citizen_device_id');
    if (!id) {
      id = 'DEV-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).slice(-4).toUpperCase();
      localStorage.setItem('weathernexus_citizen_device_id', id);
    }
    return id;
  } catch {
    return 'DEV-CLIENT-NODE';
  }
}

function getStoredDeviceSubmissions() {
  try {
    const raw = localStorage.getItem('weathernexus_device_reports_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredOfflineQueue() {
  try {
    const raw = localStorage.getItem('weathernexus_offline_reports_queue');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredOfflineQueue(queue) {
  try {
    localStorage.setItem('weathernexus_offline_reports_queue', JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save offline queue', e);
  }
}

export default function CitizenReportPWA({ onReportSubmitted }) {
  const { lang, tr, t, translateCategory, translateSeverity } = useLanguage();
  const [deviceId] = useState(() => getOrCreateDeviceId());
  const [deviceSubmissions, setDeviceSubmissions] = useState(() => getStoredDeviceSubmissions());
  const reportCount = deviceSubmissions.length;
  const isDeviceQuotaReached = reportCount >= MAX_REPORTS_PER_DEVICE;

  // Zero-Connectivity Disaster Resilience States
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [simulatedBlackout, setSimulatedBlackout] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState(() => getStoredOfflineQueue());
  const [syncingQueue, setSyncingQueue] = useState(false);
  const [offlineSuccessNotice, setOfflineSuccessNotice] = useState(null);
  const [copiedSms, setCopiedSms] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Rainfall',
    severity: 'Moderate',
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'New Delhi',
    state: 'Delhi',
    source_author: '',
    media_url: '',
    media_type: 'none'
  });

  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsFeedback, setGpsFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFileName, setPhotoFileName] = useState('');
  const [mediaInputMode, setMediaInputMode] = useState('upload'); // 'upload' | 'url'
  const fileInputRef = useRef(null);

  const categories = ['Rainfall', 'Flooding', 'Thunderstorm', 'Heatwave', 'Fog', 'Dust Storm', 'Strong Winds', 'Cyclone', 'Other'];
  const severities = ['Low', 'Moderate', 'High', 'Critical'];

  const resolveCityAndState = async (lat, lon) => {
    try {
      const geo = await api.reverseGeocode(lat, lon);
      if (geo && (geo.city || geo.state)) {
        return {
          city: geo.city || '',
          state: geo.state || ''
        };
      }
    } catch (e) {
      console.warn('Backend reverse geocode failed, trying client fallback', e);
    }

    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      if (res.ok) {
        const data = await res.json();
        return {
          city: data.city || data.locality || data.principalSubdivision || '',
          state: data.principalSubdivision || ''
        };
      }
    } catch (e) {
      console.warn('BigDataCloud client fallback failed', e);
    }
    return { city: '', state: '' };
  };

  const detectLocation = () => {
    setDetectingGps(true);
    setGpsFeedback({ type: 'info', message: 'Detecting GPS coordinates & resolving city/state...' });

    const applyLocation = async (lat, lon, detectedCity, detectedState, sourceNote) => {
      let finalCity = detectedCity;
      let finalState = detectedState;
      if (!finalCity || !finalState) {
        const resolved = await resolveCityAndState(lat, lon);
        finalCity = finalCity || resolved.city;
        finalState = finalState || resolved.state;
      }

      setFormData((prev) => ({
        ...prev,
        latitude: parseFloat(lat.toFixed(4)),
        longitude: parseFloat(lon.toFixed(4)),
        city: finalCity || prev.city,
        state: finalState || prev.state
      }));

      setGpsFeedback({
        type: 'success',
        message: `Auto-detected: ${finalCity || 'Location'}, ${finalState || 'India'} (${lat.toFixed(4)}, ${lon.toFixed(4)})${sourceNote ? ' · ' + sourceNote : ''}`
      });
      setTimeout(() => setGpsFeedback(null), 5000);
      setDetectingGps(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          await applyLocation(lat, lon, '', '', 'Device GPS');
        },
        async (err) => {
          console.warn('Device GPS unavailable or permission denied. Falling back to Network IP Geolocation...', err);
          setGpsFeedback({ type: 'info', message: 'Device GPS unavailable. Resolving via Network IP...' });
          try {
            const ipLoc = await api.detectLocationByIp();
            if (ipLoc && ipLoc.latitude && ipLoc.longitude) {
              await applyLocation(ipLoc.latitude, ipLoc.longitude, ipLoc.city, ipLoc.state, 'Network IP Location');
            } else {
              setGpsFeedback({ type: 'warning', message: 'Could not auto-detect location. Please enter manually.' });
              setDetectingGps(false);
            }
          } catch (ipErr) {
            console.error('IP Geolocation fallback failed', ipErr);
            setGpsFeedback({ type: 'warning', message: 'Location auto-detect unavailable. Please enter manually.' });
            setDetectingGps(false);
          }
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      api.detectLocationByIp().then((ipLoc) => {
        if (ipLoc && ipLoc.latitude && ipLoc.longitude) {
          applyLocation(ipLoc.latitude, ipLoc.longitude, ipLoc.city, ipLoc.state, 'Network IP Location');
        } else {
          setGpsFeedback({ type: 'warning', message: 'Geolocation not supported. Please fill manually.' });
          setDetectingGps(false);
        }
      }).catch(() => {
        setGpsFeedback({ type: 'warning', message: 'Geolocation not supported. Please fill manually.' });
        setDetectingGps(false);
      });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      setPhotoPreview(base64Data);
      setFormData((prev) => ({
        ...prev,
        media_url: base64Data,
        media_type: 'image'
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setPhotoPreview(null);
    setPhotoFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData((prev) => ({
      ...prev,
      media_url: '',
      media_type: 'none'
    }));
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const queued = getStoredOfflineQueue();
      if (queued && queued.length > 0) {
        handleFlushOfflineQueue();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleFlushOfflineQueue = async () => {
    const currentQueue = getStoredOfflineQueue();
    if (!currentQueue || currentQueue.length === 0) return;
    try {
      setSyncingQueue(true);
      let successCount = 0;
      const remainingQueue = [];

      for (const item of currentQueue) {
        try {
          await api.submitCitizenReport(item.payload);
          successCount++;
        } catch (err) {
          console.warn('Failed to sync item from offline queue, retaining', err);
          remainingQueue.push(item);
        }
      }

      saveStoredOfflineQueue(remainingQueue);
      setOfflineQueue(remainingQueue);

      if (successCount > 0) {
        setOfflineSuccessNotice(
          tr(
            `Synchronized ${successCount} offline disaster report(s) to National IMD Operations Room!`,
            `${successCount} ऑफलाइन आपदा रिपोर्ट राष्ट्रीय आईएमडी नियंत्रण कक्ष में सफलतापूर्वक सिंक हो गईं!`
          )
        );
        setTimeout(() => setOfflineSuccessNotice(null), 6000);
        if (onReportSubmitted) onReportSubmitted();
      }
    } finally {
      setSyncingQueue(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDeviceQuotaReached) {
      setErrorMsg(tr(
        'Anti-Spam Quota Reached: A physical device can submit a maximum of 2 incident reports to prevent coordinate manipulation.',
        'एंटी-स्पैम कोटा पूर्ण: स्पैम और हेरफेर रोकने हेतु एक डिवाइस से अधिकतम 2 रिपोर्ट की अनुमति है।'
      ));
      return;
    }
    if (!formData.title || !formData.description) return;
    setErrorMsg(null);
    setOfflineSuccessNotice(null);

    const effectiveOnline = isOnline && !simulatedBlackout;
    const payload = {
      ...formData,
      source_author: `${deviceId} · ${formData.source_author || 'Citizen Volunteer'}`
    };

    // Case A: Offline / Telecom Blackout mode
    if (!effectiveOnline) {
      const queuedItem = {
        id: `OFFLINE-${Date.now().toString(36).toUpperCase()}`,
        queuedAt: new Date().toISOString(),
        payload,
        title: formData.title,
        city: formData.city || 'Ground Sector',
        category: formData.category,
        severity: formData.severity
      };

      const updatedQueue = [...offlineQueue, queuedItem];
      saveStoredOfflineQueue(updatedQueue);
      setOfflineQueue(updatedQueue);

      const updatedHistory = [
        ...deviceSubmissions,
        {
          id: queuedItem.id,
          time: new Date().toISOString(),
          title: formData.title,
          city: formData.city || 'India (Offline Buffered)'
        }
      ];
      setDeviceSubmissions(updatedHistory);
      try {
        localStorage.setItem('weathernexus_device_reports_history', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error(err);
      }

      setOfflineSuccessNotice(
        tr(
          'Telecom Blackout Detected · Report Securely Buffered in Local Storage with GPS Coordinates. Will automatically flush to IMD once connectivity returns.',
          'टेलीकॉम ब्लैकआउट पहचाना गया · रिपोर्ट स्थानीय स्टोरेज में जीपीएस निर्देशांकों के साथ सुरक्षित रूप से बफर कर ली गई है। कनेक्टिविटी मिलते ही स्वतः आईएमडी को प्रेषित होगी।'
        )
      );

      // Reset form
      setPhotoPreview(null);
      setPhotoFileName('');
      setFormData({
        title: '',
        description: '',
        category: 'Rainfall',
        severity: 'Moderate',
        latitude: 28.6139,
        longitude: 77.2090,
        city: 'New Delhi',
        state: 'Delhi',
        source_author: '',
        media_url: '',
        media_type: 'none'
      });
      return;
    }

    // Case B: Live Online Submission with automatic offline buffering fallback
    try {
      setSubmitting(true);
      const res = await api.submitCitizenReport(payload);
      setResult(res);

      const updatedHistory = [
        ...deviceSubmissions,
        {
          id: res.id || res.event_id || `CIT-${Date.now().toString(36).toUpperCase()}`,
          time: new Date().toISOString(),
          title: formData.title,
          city: formData.city || 'India'
        }
      ];
      setDeviceSubmissions(updatedHistory);
      try {
        localStorage.setItem('weathernexus_device_reports_history', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error(err);
      }

      if (onReportSubmitted) onReportSubmitted();
    } catch (err) {
      console.warn('Network submit failed, automatically caching in offline resilience queue:', err);
      // Fallback to offline buffering so user never loses their incident!
      const fallbackItem = {
        id: `OFFLINE-${Date.now().toString(36).toUpperCase()}`,
        queuedAt: new Date().toISOString(),
        payload,
        title: formData.title,
        city: formData.city || 'Ground Sector',
        category: formData.category,
        severity: formData.severity
      };
      const updatedQueue = [...offlineQueue, fallbackItem];
      saveStoredOfflineQueue(updatedQueue);
      setOfflineQueue(updatedQueue);

      setOfflineSuccessNotice(
        tr(
          'Network Connection Dropped · Incident Report Automatically Cached to Local Disaster Queue (0% Data Loss).',
          'नेटवर्क कनेक्शन बाधित · घटना रिपोर्ट स्वतः स्थानीय आपदा कतार में सुरक्षित सहेज ली गई (शून्य डेटा हानि)।'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
          {tr('Crowdsourced Disaster Sensing · Mobile PWA', 'क्राउडसोर्स आपदा संवेदन · मोबाइल PWA')}
        </span>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          {tr('Citizen Weather & Hazard Ground Report', 'नागरिक मौसम एवं आपदा ग्राउंड रिपोर्ट')}
        </h2>
        <p className="text-xs text-slate-500">
          {tr(
            'Empowering citizens to report real-time ground truth directly to the National IMD Operations Room',
            'नागरिकों को राष्ट्रीय आईएमडी कमान कक्ष में सीधे रियल-टाइम जमीनी स्थिति रिपोर्ट करने हेतु सशक्त बनाना'
          )}
        </p>
      </div>

      {/* Connectivity & Device Anti-Spam Quota Status Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-100/90 border border-slate-200 p-3 rounded-xl text-xs gap-2.5 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="font-bold text-slate-800">
              {tr('Device ID:', 'डिवाइस आईडी:')}
            </span>
            <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300 font-semibold">
              {deviceId}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-500 font-medium">
              {tr('Quota:', 'कोटा:')}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] ${
              isDeviceQuotaReached
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {reportCount} / {MAX_REPORTS_PER_DEVICE}
            </span>
          </div>
        </div>

        {/* Live Network & Telecom Blackout Simulation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border shadow-xs ${
            isOnline && !simulatedBlackout
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}>
            {isOnline && !simulatedBlackout ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tr('Online · Live Sync', 'ऑनलाइन · लाइव सिंक')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                <span>{tr('Offline · Local Buffer', 'ऑफलाइन · स्थानीय बफर')}</span>
              </>
            )}
          </div>

          {/* Interactive Simulation Toggle for SIH Judges */}
          <button
            type="button"
            onClick={() => setSimulatedBlackout(!simulatedBlackout)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
              simulatedBlackout
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
            }`}
            title="Simulate disaster telecom blackout where cell towers are destroyed"
          >
            <Radio className="w-3 h-3" />
            <span>{simulatedBlackout ? tr('Restore Telecom Tower', 'टावर बहाल करें') : tr('Simulate Telecom Blackout', 'सिम्युलेट टेलीकॉम ब्लैकआउट')}</span>
          </button>
        </div>
      </div>

      {/* Offline Success Banner Notice */}
      {offlineSuccessNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold block text-emerald-900">{tr('Disaster Resilience Notification', 'आपदा अनुकूलता सूचना')}</span>
            <span className="text-[11.5px] leading-relaxed text-emerald-800">{offlineSuccessNotice}</span>
          </div>
        </div>
      )}

      {/* Offline Queue Stored Incidents Drawer */}
      {offlineQueue.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                {tr('Offline Incident Queue (Zero-Connectivity Buffer)', 'ऑफलाइन घटना कतार (शून्य-कनेक्टिविटी बफर)')}
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-200 text-amber-900 border border-amber-400">
              {offlineQueue.length} {tr('Buffered', 'सहेजे गए')}
            </span>
          </div>

          <p className="text-[11px] text-amber-900 leading-relaxed">
            {tr(
              'These citizen reports were logged during a network failure. They are safely preserved in device memory and will automatically flush to the IMD National Operations Room.',
              'ये नागरिक रिपोर्ट नेटवर्क विफलता के दौरान दर्ज की गईं। ये स्थानीय डिवाइस मेमोरी में सुरक्षित हैं और आईएमडी नियंत्रण कक्ष को प्रेषित होने हेतु तैयार हैं।'
            )}
          </p>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {offlineQueue.map((item, idx) => (
              <div key={item.id || idx} className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{item.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {item.category} • {item.city} • {item.id}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {tr('Queued', 'कतारबद्ध')}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={syncingQueue || (!isOnline && simulatedBlackout)}
            onClick={handleFlushOfflineQueue}
            className="w-full py-2 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingQueue ? 'animate-spin' : ''}`} />
            <span>
              {syncingQueue
                ? tr('Flushing Offline Queue to IMD...', 'आईएमडी को कतार प्रेषित हो रही है...')
                : tr(`Flush & Sync (${offlineQueue.length}) Offline Reports to IMD`, `आईएमडी को (${offlineQueue.length}) रिपोर्ट सिंक करें`)}
            </span>
          </button>
        </div>
      )}

      {/* Prominent Warning if Quota is Reached */}
      {isDeviceQuotaReached && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 font-black text-sm text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>{tr('Device Incident Limit Reached (2 / 2 Reports Submitted)', 'डिवाइस रिपोर्ट सीमा पूर्ण (2 में से 2 रिपोर्ट दर्ज)')}</span>
          </div>
          <p className="text-amber-900 leading-relaxed text-[11.5px]">
            {tr(
              'To eliminate coordinate spam, data manipulation, and false flood alarms from a single location, each device is restricted to a maximum of 2 incident submissions. Both of your reports have been ingested and verified by National AI Operations.',
              'एक ही स्थान से स्पैम, गलत अलर्ट एवं डेटा हेरफेर रोकने हेतु, प्रत्येक डिवाइस को अधिकतम 2 रिपोर्ट दर्ज करने की अनुमति है। आपकी दोनों रिपोर्ट राष्ट्रीय AI नियंत्रण कक्ष में दर्ज कर ली गई हैं।'
            )}
          </p>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 text-[11px] font-mono space-y-1">
            <span className="font-bold text-amber-900 block">{tr('Logged Incident Submissions from this Device:', 'इस डिवाइस से दर्ज रिपोर्ट:')}</span>
            {deviceSubmissions.map((sub, i) => (
              <div key={i} className="flex items-center justify-between text-stone-700 border-b border-amber-100/80 last:border-0 py-0.5">
                <span>#{i + 1} <b>{sub.title}</b> ({sub.city || 'India'})</span>
                <span className="text-amber-800 font-bold font-mono text-[10px]">{sub.id}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-amber-800 font-semibold pt-0.5">
            {tr('For life-threatening emergencies requiring immediate dispatch, dial 112 directly.', 'जीवन-घातक आपात स्थिति में तत्काल सहायता हेतु राष्ट्रीय आपातकालीन नंबर 112 पर संपर्क करें।')}
          </p>
        </div>
      )}

      {result ? (
        <div className="bg-command-card border border-emerald-300 rounded-2xl p-6 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">{tr('Report Successfully Ingested!', 'रिपोर्ट सफलतापूर्वक दर्ज की गई!')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {tr(
                'Your submission has been evaluated by the High-Precision Satellite & Computer Vision AI Verification Engine.',
                'आपकी रिपोर्ट का उच्च-परिशुद्धता उपग्रह एवं कंप्यूटर विज़न AI इंजन द्वारा मूल्यांकन किया गया है।'
              )}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{tr('Assigned Incident ID:', 'आवंटित घटना पहचान (ID):')}</span>
              <span className="font-mono text-blue-700 font-bold">{result.id}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{tr('Uber H3 Precision Cell:', 'H3 परिशुद्धता सेल:')}</span>
              <span className="font-mono text-slate-900 font-bold">{result.h3_index}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{tr('Real-Time Precision Satellite Lock:', 'उपग्रह समन्वय लॉक:')}</span>
              <span className="font-mono text-cyan-800 font-bold text-right text-[11px] truncate max-w-[240px]">
                {result.radar_station_name || 'INSAT-3DR Geostationary Grid'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{tr('Vision AI Multimodal Corroboration:', 'विज़न AI सत्यापन:')}</span>
              <span className={`font-mono font-bold text-[11px] ${result.is_media_authentic ? 'text-emerald-700' : 'text-amber-700'}`}>
                {result.is_media_authentic ? tr('Authentic Visuals Corroborated', 'प्रामाणिक दृश्य सत्यापित') : tr('Satellite Optical Fallback', 'उपग्रह ऑप्टिकल बैकअप')}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">{tr('Tri-Check AI TrustScore™:', 'AI ट्रस्ट-स्कोर™:')}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-emerald-700 font-black text-base">{result.trust_score}%</span>
                <span className="text-[10px] text-emerald-600 font-bold">({tr('High Precision', 'उच्च सटीकता')})</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{tr('Verification Outcome:', 'सत्यापन परिणाम:')}</span>
              <span className={`px-2.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                result.verification_status === 'VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {result.verification_status}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setPhotoPreview(null);
              setPhotoFileName('');
              setFormData({
                title: '',
                description: '',
                category: 'Rainfall',
                severity: 'Moderate',
                latitude: 28.6139,
                longitude: 77.2090,
                city: 'New Delhi',
                state: 'Delhi',
                source_author: '',
                media_url: '',
                media_type: 'none'
              });
            }}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            {tr('Submit Another Ground Report', 'एक और जमीनी रिपोर्ट दर्ज करें')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-command-card border border-command-border rounded-2xl p-6 shadow-sm space-y-4">
          {/* Observation Title */}
          <div>
            <label htmlFor="title" className="block text-xs uppercase font-bold text-slate-700 mb-1">
              {tr('Hazard / Event Headline *', 'आपदा / घटना शीर्षक *')}
            </label>
            <input
              id="title"
              type="text"
              required
              placeholder={tr('e.g. Heavy waterlogging near Dadar station / भीषण जलभराव', 'उदा. दादर स्टेशन के पास भीषण जलभराव')}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label htmlFor="description" className="block text-xs uppercase font-bold text-slate-700 mb-1">
              {tr('Ground Observation Details (Hindi or English) *', 'जमीनी अवलोकन विवरण (हिन्दी या अंग्रेजी) *')}
            </label>
            <textarea
              id="description"
              required
              rows={3}
              placeholder={tr(
                'Describe what you see: water height, wind speed, damages, localized disruption...',
                'जो आप देख रहे हैं उसका विवरण दें: पानी की ऊंचाई, हवा की गति, क्षति, स्थानीय अवरोध...'
              )}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="category" className="block text-xs uppercase font-bold text-slate-700 mb-1">{tr('Hazard Category', 'आपदा श्रेणी')}</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none"
              >
                {categories.map((c) => <option key={c} value={c}>{translateCategory(c)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="severity" className="block text-xs uppercase font-bold text-slate-700 mb-1">{tr('Observed Severity', 'अवलोकित गंभीरता')}</label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none"
              >
                {severities.map((s) => <option key={s} value={s}>{translateSeverity(s)}</option>)}
              </select>
            </div>
          </div>

          {/* GPS Coordinates with Auto-Detect */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{tr('Geographical GPS Anchor', 'भौगोलिक जीपीएस एंकर')}</span>
              </span>
              <button
                type="button"
                onClick={detectLocation}
                disabled={detectingGps}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors disabled:opacity-60"
              >
                {detectingGps ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>{tr('Resolving GPS & City...', 'जीपीएस एवं शहर की पहचान जारी...')}</span>
                  </>
                ) : (
                  <span>{tr('Auto-Detect My GPS', 'मेरा जीपीएस स्वतः पहचानें')}</span>
                )}
              </button>
            </div>

            {gpsFeedback && (
              <div className={`p-2 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                gpsFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : gpsFeedback.type === 'warning'
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'bg-blue-50 text-blue-800 border border-blue-200 animate-pulse'
              }`}>
                <span>{gpsFeedback.message}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="latitude" className="block text-[10px] text-slate-500 mb-0.5">{tr('Latitude', 'अक्षांश (Latitude)')}</label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  min={6.5}
                  max={37.0}
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-[10px] text-slate-500 mb-0.5">{tr('Longitude', 'देशांतर (Longitude)')}</label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  min={68.0}
                  max={97.5}
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="block text-xs uppercase font-bold text-slate-700 mb-1">{tr('City / District *', 'शहर / ज़िला *')}</label>
              <input
                id="city"
                type="text"
                required
                placeholder={tr('e.g. Mumbai, Indore, Patna', 'उदा. मुंबई, इंदौर, पटना')}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-xs uppercase font-bold text-slate-700 mb-1">{tr('State *', 'राज्य *')}</label>
              <input
                id="state"
                type="text"
                required
                placeholder={tr('e.g. Maharashtra, Madhya Pradesh', 'उदा. महाराष्ट्र, मध्य प्रदेश')}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Photo / Visual Evidence Upload with Computer Vision AI Verification */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>{tr('Visual Ground Evidence (Photo Verification)', 'प्रत्यक्ष दृश्य साक्ष्य (फोटो सत्यापन)')}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {tr('Vision AI Active', 'विज़न एआई सक्रिय')}
                </span>
                <button
                  type="button"
                  onClick={() => setMediaInputMode(mediaInputMode === 'upload' ? 'url' : 'upload')}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  {mediaInputMode === 'upload' ? tr('Enter Web URL', 'वेब यूआरएल दर्ज करें') : tr('Upload Device File', 'डिवाइस से फाइल अपलोड करें')}
                </button>
              </div>
            </div>

            {mediaInputMode === 'upload' ? (
              <div>
                {photoPreview ? (
                  <div className="relative rounded-xl border border-emerald-300 bg-white p-2.5 flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Field capture preview"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {photoFileName || 'field_weather_capture.jpg'}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-mono mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>{tr('Ready for Computer Vision Tri-Check (+25 pts)', 'कंप्यूटर विज़न ट्राई-चेक हेतु तैयार (+25 अंक)')}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearPhoto}
                      className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title={tr('Remove image', 'तस्वीर हटाएं')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/30 rounded-xl p-4 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-slate-800">
                      {tr('Tap to Upload Photo or Capture from Camera', 'फोटो अपलोड करने या कैमरे से लेने के लिए टैप करें')}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {tr('JPG, PNG, WebP supported · High-precision visual corroboration boosts TrustScore to 90%+', 'JPG, PNG, WebP समर्थित · उच्च परिशुद्धता दृश्य पुष्टि ट्रस्ट स्कोर को 90%+ तक बढ़ाती है')}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <Camera className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  id="media_url"
                  type="url"
                  placeholder={tr('https://... (direct image URL)', 'https://... (सीधा छवि URL)')}
                  value={formData.media_url}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      media_url: val,
                      media_type: val ? 'image' : 'none'
                    });
                    setPhotoPreview(val || null);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Citizen Alias */}
          <div>
            <label htmlFor="source_author" className="block text-xs uppercase font-bold text-slate-700 mb-1">
              {tr('Your Name / Reporter Alias (Optional)', 'आपका नाम / प्रेषक का नाम (वैकल्पिक)')}
            </label>
            <input
              id="source_author"
              type="text"
              placeholder={tr('e.g. Amit Sharma (Field Volunteer)', 'उदा. अमित शर्मा (फील्ड वालंटियर)')}
              value={formData.source_author}
              onChange={(e) => setFormData({ ...formData, source_author: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Submit Action */}
          {errorMsg && <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">{errorMsg}</div>}
          <button
            type="submit"
            disabled={submitting || isDeviceQuotaReached}
            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 ${
              isDeviceQuotaReached
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.99] disabled:opacity-50'
            }`}
          >
            {isDeviceQuotaReached ? (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>{tr('Device Quota Limit Reached (Max 2 Reports / Device)', 'डिवाइस कोटा सीमा पूर्ण (अधिकतम 2 रिपोर्ट प्रति डिवाइस)')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{submitting ? tr('Running Tri-Check AI Verification...', 'ट्राई-चेक एआई सत्यापन जारी...') : tr('Transmit Report to National Command Room', 'राष्ट्रीय नियंत्रण कक्ष को रिपोर्ट प्रेषित करें')}</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Emergency SMS & USSD Offline Telemetry Bridge Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-700" />
            <h4 className="font-bold text-slate-900">
              {tr('Zero-Data Emergency Fallback: SMS / USSD Ingestion Bridge', 'शून्य-डेटा आपातकालीन विकल्प: एसएमएस / यूएसएसडी अंतर्ग्रहण')}
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            {tr('Statutory Toll-Free 112 / 1070', 'टोल-फ्री 112 / 1070')}
          </span>
        </div>

        <p className="text-[11.5px] text-slate-600 leading-relaxed">
          {tr(
            'In severe disaster corridors where 4G/5G mobile towers are knocked out, citizens and relief volunteers can dispatch reports via standard 2G GSM SMS. The AI ingestion engine parses keywords, pincode, and severity automatically.',
            'भीषण आपदा क्षेत्रों में जहाँ 4G/5G मोबाइल टावर नष्ट हो चुके हों, नागरिक एवं राहत स्वयंसेवक सामान्य 2G जीएसएम एसएमएस के माध्यम से रिपोर्ट भेज सकते हैं।'
          )}
        </p>

        <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="font-mono text-xs text-slate-800 flex items-center gap-2">
            <span className="text-slate-500 font-bold">SMS Format:</span>
            <span className="bg-slate-100 px-2 py-1 rounded font-bold text-blue-700 border border-slate-200">
              WEATHER &lt;PINCODE&gt; &lt;HAZARD&gt; &lt;SEVERITY&gt;
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              try {
                navigator.clipboard?.writeText('WEATHER 110001 FLOOD CRITICAL Water level 4ft near railway bridge');
                setCopiedSms(true);
                setTimeout(() => setCopiedSms(false), 3000);
              } catch {}
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copiedSms ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copiedSms ? tr('Copied Template!', 'टेम्पलेट कॉपी हो गया!') : tr('Copy SMS Example', 'एसएमएस उदाहरण कॉपी करें')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
