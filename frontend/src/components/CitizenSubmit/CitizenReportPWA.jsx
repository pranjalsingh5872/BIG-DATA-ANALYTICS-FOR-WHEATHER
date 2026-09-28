import React, { useState, useRef } from 'react';
import { Send, MapPin, Camera, AlertCircle, CheckCircle, ShieldCheck, Sparkles, Upload, Image as ImageIcon, X } from 'lucide-react';
import { api } from '../../services/api';

export default function CitizenReportPWA({ onReportSubmitted }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    setErrorMsg(null);
    try {
      setSubmitting(true);
      const res = await api.submitCitizenReport(formData);
      setResult(res);
      if (onReportSubmitted) onReportSubmitted();
    } catch (err) {
      console.error('Failed to submit citizen report', err);
      setErrorMsg('Failed to submit report. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
          Crowdsourced Disaster Sensing · Mobile PWA
        </span>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Citizen Weather & Hazard Ground Report
        </h2>
        <p className="text-xs text-slate-500">
          Empowering citizens to report real-time ground truth directly to the National IMD Operations Room
        </p>
      </div>

      {result ? (
        <div className="bg-command-card border border-emerald-300 rounded-2xl p-6 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Report Successfully Ingested!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your submission has been evaluated by the High-Precision Satellite & Computer Vision AI Verification Engine.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Assigned Incident ID:</span>
              <span className="font-mono text-blue-700 font-bold">{result.id}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Uber H3 Precision Cell:</span>
              <span className="font-mono text-slate-900 font-bold">{result.h3_index}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Real-Time Precision Satellite Lock:</span>
              <span className="font-mono text-cyan-800 font-bold text-right text-[11px] truncate max-w-[240px]">
                {result.radar_station_name || 'INSAT-3DR Geostationary Grid'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Vision AI Multimodal Corroboration:</span>
              <span className={`font-mono font-bold text-[11px] ${result.is_media_authentic ? 'text-emerald-700' : 'text-amber-700'}`}>
                {result.is_media_authentic ? 'Authentic Visuals Corroborated' : 'Satellite Optical Fallback'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">Tri-Check AI TrustScore™:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-emerald-700 font-black text-base">{result.trust_score}%</span>
                <span className="text-[10px] text-emerald-600 font-bold">(High Precision)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Verification Outcome:</span>
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
            Submit Another Ground Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-command-card border border-command-border rounded-2xl p-6 shadow-sm space-y-4">
          {/* Observation Title */}
          <div>
            <label htmlFor="title" className="block text-xs uppercase font-bold text-slate-700 mb-1">
              Hazard / Event Headline *
            </label>
            <input
              id="title"
              type="text"
              required
              placeholder="e.g. Heavy waterlogging near Dadar station / भीषण जलभराव"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label htmlFor="description" className="block text-xs uppercase font-bold text-slate-700 mb-1">
              Ground Observation Details (Hindi or English) *
            </label>
            <textarea
              id="description"
              required
              rows={3}
              placeholder="Describe what you see: water height, wind speed, damages, localized disruption..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="category" className="block text-xs uppercase font-bold text-slate-700 mb-1">Hazard Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="severity" className="block text-xs uppercase font-bold text-slate-700 mb-1">Observed Severity</label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none"
              >
                {severities.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* GPS Coordinates with Auto-Detect */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Geographical GPS Anchor</span>
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
                    <span>Resolving GPS & City...</span>
                  </>
                ) : (
                  <span>Auto-Detect My GPS</span>
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
                <label htmlFor="latitude" className="block text-[10px] text-slate-500 mb-0.5">Latitude</label>
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
                <label htmlFor="longitude" className="block text-[10px] text-slate-500 mb-0.5">Longitude</label>
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
              <label htmlFor="city" className="block text-xs uppercase font-bold text-slate-700 mb-1">City / District *</label>
              <input
                id="city"
                type="text"
                required
                placeholder="e.g. Mumbai, Indore, Patna"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-xs uppercase font-bold text-slate-700 mb-1">State *</label>
              <input
                id="state"
                type="text"
                required
                placeholder="e.g. Maharashtra, Madhya Pradesh"
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
                <span>Visual Ground Evidence (Photo Verification)</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Vision AI Active
                </span>
                <button
                  type="button"
                  onClick={() => setMediaInputMode(mediaInputMode === 'upload' ? 'url' : 'upload')}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  {mediaInputMode === 'upload' ? 'Enter Web URL' : 'Upload Device File'}
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
                        <span>Ready for Computer Vision Tri-Check (+25 pts)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearPhoto}
                      className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove image"
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
                      Tap to Upload Photo or Capture from Camera
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      JPG, PNG, WebP supported · High-precision visual corroboration boosts TrustScore to 90%+
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
                  placeholder="https://... (direct image URL)"
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
              Your Name / Reporter Alias (Optional)
            </label>
            <input
              id="source_author"
              type="text"
              placeholder="e.g. Amit Sharma (Field Volunteer)"
              value={formData.source_author}
              onChange={(e) => setFormData({ ...formData, source_author: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Submit Action */}
          {errorMsg && <div className="p-2 rounded bg-red-50 border border-red-200 text-red-800 text-xs">{errorMsg}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Running Tri-Check AI Verification...' : 'Transmit Report to National Command Room'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
