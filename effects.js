/* ==========================================
   effects.js - تأثيرات العنصر المحدد
   ========================================== */
const _effectsWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(_effectsWait);
        
        function updateEffectsPanel() {
            const obj = canvas.getActiveObject();
            const panel = document.getElementById('selectedSettings');
            if (!panel) return;
            
            if (!obj || obj.type !== 'i-text') {
                panel.style.display = 'none';
                return;
            }
            
            panel.style.display = 'block';
            document.getElementById('textColorPicker').value = obj.fill || '#ffffff';
            document.getElementById('fontFamilySelect').value = obj.fontFamily || 'Cairo';
            document.getElementById('opacitySlider').value = obj.opacity || 1;
            document.getElementById('strokeWidth').value = obj.strokeWidth || 0;
            document.getElementById('strokeColor').value = obj.stroke || '#000000';
            document.getElementById('rotationSlider').value = obj.angle || 0;
        }
        
        // تطبيق التأثيرات
        function applyEffect(effect, value) {
            const obj = canvas.getActiveObject();
            if (!obj || obj.type !== 'i-text') return;
            
            switch (effect) {
                case 'fill':
                    obj.set('fill', value);
                    break;
                case 'fontFamily':
                    obj.set('fontFamily', value);
                    break;
                case 'opacity':
                    obj.set('opacity', parseFloat(value));
                    break;
                case 'shadow':
                    if (value) {
                        obj.set('shadow', 'rgba(0,0,0,0.6) 3px 3px 5px');
                    } else {
                        obj.set('shadow', null);
                    }
                    break;
                case 'stroke':
                    const strokeColor = document.getElementById('strokeColor').value;
                    obj.set({ stroke: strokeColor, strokeWidth: parseInt(value) });
                    break;
                case 'rotation':
                    obj.set('angle', parseInt(value));
                    break;
            }
            canvas.forceRender();
            if (typeof saveState === 'function') saveState();
        }
        
        // ربط الأحداث
        canvas.on('selection:created', updateEffectsPanel);
        canvas.on('selection:updated', updateEffectsPanel);
        canvas.on('selection:cleared', () => {
            const panel = document.getElementById('selectedSettings');
            if (panel) panel.style.display = 'none';
        });
        
        // أزرار التأثيرات
        document.getElementById('textColorPicker')?.addEventListener('input', function(e) {
            applyEffect('fill', e.target.value);
        });
        
        document.getElementById('fontFamilySelect')?.addEventListener('change', function(e) {
            applyEffect('fontFamily', e.target.value);
        });
        
        document.getElementById('opacitySlider')?.addEventListener('input', function(e) {
            applyEffect('opacity', e.target.value);
        });
        
        document.getElementById('toggleShadow')?.addEventListener('click', function() {
            const obj = canvas.getActiveObject();
            if (obj && obj.type === 'i-text') {
                const hasShadow = !!obj.shadow;
                applyEffect('shadow', !hasShadow);
                this.textContent = hasShadow ? 'تفعيل' : 'إلغاء';
            }
        });
        
        document.getElementById('strokeWidth')?.addEventListener('input', function(e) {
            applyEffect('stroke', e.target.value);
        });
        
        document.getElementById('strokeColor')?.addEventListener('input', function(e) {
            const obj = canvas.getActiveObject();
            if (obj && obj.type === 'i-text') {
                obj.set('stroke', e.target.value);
                canvas.forceRender();
                if (typeof saveState === 'function') saveState();
            }
        });
        
        document.getElementById('rotationSlider')?.addEventListener('input', function(e) {
            applyEffect('rotation', e.target.value);
        });
        
        // تعبئة قائمة الخطوط
        const fonts = ['Cairo', 'Tajawal', 'Almarai', 'Changa', 'Reem Kufi', 'El Messiri', 'Lemonada', 'Marhey'];
        const select = document.getElementById('fontFamilySelect');
        if (select) {
            select.innerHTML = fonts.map(f => `<option value="${f}">${f}</option>`).join('');
        }
        
        console.log('✅ effects.js جاهز');
    }
}, 100);