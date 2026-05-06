/* ==========================================
   ai.js - الذكاء الاصطناعي (API حقيقي + محاكاة احتياطية)
   ========================================== */
let generateDesignFromPrompt, applyDesignToCanvas;

const _aiWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(_aiWait);

        generateDesignFromPrompt = async function(prompt, type = 'poster') {
            try {
                // ⭐ الاتصال بـ API عبر الرابط الصحيح
                const res = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, type })
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log('✅ تم التوليد بالذكاء الاصطناعي');
                    return data;
                }
                throw new Error('استخدام المحاكاة');
            } catch (e) {
                // ⭐ محاكاة احتياطية (عند عدم وجود API)
                console.log('⚠️ استخدام المحاكاة الاحتياطية');
                const colors = ['#2d1e1e', '#0a1a2a', '#1e2a1e', '#2d2d44', '#121212'];
                const bg = colors[Math.floor(Math.random() * colors.length)];
                const titles = ['تصميم رائع', 'إبداع', 'فن', 'تصميمك', 'تحفة'];
                const title = titles[Math.floor(Math.random() * titles.length)];
                
                return {
                    title: title,
                    subtitle: prompt,
                    bgColor: bg,
                    titleColor: '#6c63ff',
                    subtitleColor: '#e0e0e0',
                    fontTitle: 'Cairo',
                    fontSubtitle: 'Tajawal',
                    elements: [
                        { type: 'text', content: title, x: 0.5, y: 0.3, fontSize: 48, fontWeight: 'bold' },
                        { type: 'text', content: prompt, x: 0.5, y: 0.55, fontSize: 28 }
                    ]
                };
            }
        };

        applyDesignToCanvas = function(design) {
            if (!design) return;
            
            if (typeof clearCanvas === 'function') clearCanvas();
            if (typeof setBackgroundColor === 'function') setBackgroundColor(design.bgColor || '#1e1e2f');
            
            // إضافة العناصر
            if (design.elements && design.elements.length > 0) {
                design.elements.forEach((el, i) => {
                    if (el.type === 'text') {
                        const txt = new fabric.IText(el.content || ' ', {
                            left: (el.x || 0.5) * canvas.width,
                            top: (el.y || 0.5) * canvas.height,
                            fontFamily: el.fontFamily || design.fontTitle || 'Cairo',
                            fill: el.color || design.titleColor || '#ffffff',
                            fontSize: el.fontSize || 36,
                            fontWeight: el.fontWeight || 'normal',
                            originX: 'center',
                            originY: 'center',
                            editable: true,
                        });
                        canvas.add(txt);
                        txt.set({ opacity: 0 });
                        txt.animate('opacity', 1, {
                            duration: 300,
                            delay: i * 80,
                            onChange: () => canvas.forceRender()
                        });
                    }
                });
            }
            
            // إضافة عنوان رئيسي
            if (design.title) {
                const titleText = new fabric.IText(design.title, {
                    left: canvas.width / 2,
                    top: canvas.height * 0.15,
                    fontFamily: design.fontTitle || 'Cairo',
                    fill: design.titleColor || '#6c63ff',
                    fontSize: 50,
                    fontWeight: 'bold',
                    originX: 'center',
                    originY: 'center',
                    editable: true,
                });
                canvas.add(titleText);
                titleText.set({ opacity: 0 });
                titleText.animate('opacity', 1, {
                    duration: 400,
                    onChange: () => canvas.forceRender()
                });
            }
            
            // إضافة نص فرعي
            if (design.subtitle) {
                const subText = new fabric.IText(design.subtitle, {
                    left: canvas.width / 2,
                    top: canvas.height * 0.35,
                    fontFamily: design.fontSubtitle || 'Tajawal',
                    fill: design.subtitleColor || '#e0e0e0',
                    fontSize: 30,
                    originX: 'center',
                    originY: 'center',
                    editable: true,
                });
                canvas.add(subText);
                subText.set({ opacity: 0 });
                subText.animate('opacity', 1, {
                    duration: 400,
                    delay: 100,
                    onChange: () => canvas.forceRender()
                });
            }
            
            canvas.forceRender();
            if (typeof saveState === 'function') saveState();
            if (typeof updateLayersList === 'function') updateLayersList();
        };

        console.log('✅ ai.js جاهز');
    }
}, 100);
