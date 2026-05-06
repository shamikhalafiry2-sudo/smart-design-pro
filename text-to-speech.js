/* ==========================================
   text-to-speech.js - تحويل النص إلى كلام
   ========================================== */
const _ttsWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(_ttsWait);
        window.openTTSModal = () => {
            const obj = canvas.getActiveObject();
            if (obj && obj.type === 'i-text') document.getElementById('ttsText').value = obj.text;
            const m = document.getElementById('ttsModal'); if (m) m.style.display = 'flex';
            loadVoicesList();
        };
        window.loadVoicesList = () => {
            if (typeof speechSynthesis === 'undefined') return;
            const voices = speechSynthesis.getVoices();
            const sel = document.getElementById('voiceSelect');
            if (sel) sel.innerHTML = voices.filter(v => v.lang.includes('ar') || v.lang.includes('en')).map(v => `<option value="${v.name}">${v.name} (${v.lang})</option>`).join('');
        };
        window.speakText = () => {
            if (typeof speechSynthesis === 'undefined') { alert('غير مدعوم'); return; }
            const text = document.getElementById('ttsText').value;
            if (!text) return;
            const u = new SpeechSynthesisUtterance(text);
            const name = document.getElementById('voiceSelect').value;
            const voice = speechSynthesis.getVoices().find(v => v.name === name);
            if (voice) u.voice = voice;
            u.lang = voice ? voice.lang : 'ar-SA';
            speechSynthesis.speak(u);
        };
        if (typeof speechSynthesis !== 'undefined') speechSynthesis.onvoiceschanged = loadVoicesList;
        console.log('✅ text-to-speech.js جاهز');
    }
}, 100);