window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('circuitCanvas');
    const ctx = canvas.getContext('2d');

    // 캔버스 크기를 화면 영역 전체로 동적 설정
    function resizeCanvas() {
        const mainSection = canvas.parentElement;
        canvas.width = mainSection.clientWidth;
        canvas.height = mainSection.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 빛나는 전류 입자 클래스
    class Signal {
        constructor(x, y, vx, vy, maxLength) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.history = [];
            this.maxLength = maxLength || 40 + Math.random() * 40;
            this.speed = 3 + Math.random() * 4;
            this.color = Math.random() > 0.3 ? '#FBBF24' : '#F59E0B'; // Butter-400 / Amber-500
            this.width = 2.5 + Math.random() * 1.5;
            this.life = 1;
            this.decay = 0.003 + Math.random() * 0.005;
        }

        update() {
            // 이전 위치 기록 (꼬리 효과용)
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > 15) {
                this.history.shift();
            }

            // 전진
            this.x += this.vx * this.speed;
            this.y += this.vy * this.speed;

            // 서서히 소멸
            this.life -= this.decay;

            // 가끔 직각으로 꺾임 (회로 특성)
            if (Math.random() < 0.02 && this.history.length > 5) {
                const rand = Math.random();
                if (this.vx !== 0) {
                    this.vy = rand > 0.5 ? 1 : -1;
                    this.vx = 0;
                } else {
                    this.vx = rand > 0.5 ? 1 : -1;
                    this.vy = 0;
                }
            }
        }

        draw() {
            if (this.history.length < 2) return;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
            
            // 화려한 네온 발광(Glow) 효과 적용
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.globalAlpha = this.life;
            ctx.stroke();
            ctx.restore();
        }
    }

    // 고정 노드 (교차점 및 반도체 칩) 클래스
    class Node {
        constructor(x, y, isChip = false) {
            this.x = x;
            this.y = y;
            this.isChip = isChip;
            this.size = isChip ? 16 : 4;
            this.pulse = 0;
            this.pulseSpeed = 0.05 + Math.random() * 0.05;
            this.brightness = 0.3 + Math.random() * 0.7;
        }

        update() {
            this.pulse += this.pulseSpeed;
        }

        draw() {
            ctx.save();
            if (this.isChip) {
                // 사각형 반도체 칩 디자인
                ctx.shadowBlur = 10 + Math.sin(this.pulse) * 8;
                ctx.shadowColor = '#FBBF24';
                ctx.fillStyle = '#1e293b';
                ctx.strokeStyle = '#FBBF24';
                ctx.lineWidth = 2;
                
                // 메인 바디
                ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
                ctx.strokeRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);

                // 칩 핀(Pin) 디테일 표현
                ctx.fillStyle = '#94a3b8';
                for (let offset = -8; offset <= 8; offset += 8) {
                    ctx.fillRect(this.x + offset - 2, this.y - this.size - 4, 4, 4); // 상단 핀
                    ctx.fillRect(this.x + offset - 2, this.y + this.size, 4, 4);     // 하단 핀
                    ctx.fillRect(this.x - this.size - 4, this.y + offset - 2, 4, 4); // 좌측 핀
                    ctx.fillRect(this.x + this.size, this.y + offset - 2, 4, 4);     // 우측 핀
                }
            } else {
                // 일반 원형 노드 연결점
                const currentRadius = this.size + Math.sin(this.pulse) * 2;
                ctx.shadowBlur = 8 + Math.sin(this.pulse) * 4;
                ctx.shadowColor = '#FBBF24';
                ctx.fillStyle = `rgba(251, 191, 36, ${this.brightness})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    const signals = [];
    const nodes = [];

    // 그리드 기반 노드 및 반도체 칩 자동 생성
    function initGrid() {
        nodes.length = 0;
        const gridSpacing = 160;
        const cols = Math.floor(canvas.width / gridSpacing) + 1;
        const rows = Math.floor(canvas.height / gridSpacing) + 1;

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const x = c * gridSpacing + (Math.random() - 0.5) * 50;
                const y = r * gridSpacing + (Math.random() - 0.5) * 50;
                const isChip = Math.random() > 0.85; // 약 15% 확률로 칩 노드 생성
                nodes.push(new Node(x, y, isChip));
            }
        }
    }
    initGrid();

    // 신호가 흐르는 무작위 줄기 발산
    function spawnSignal() {
        if (nodes.length === 0) return;
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        
        // 직각 4방향 중 무작위 방향 결정
        const dir = Math.floor(Math.random() * 4);
        let vx = 0, vy = 0;
        if (dir === 0) vx = 1;
        else if (dir === 1) vx = -1;
        else if (dir === 2) vy = 1;
        else vy = -1;

        signals.push(new Signal(startNode.x, startNode.y, vx, vy));
    }

    // 고정 회로선 밑그림 그리기 (흐릿하고 차분한 고정 라인)
    function drawUnderlayGrid() {
        ctx.save();
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.25)'; // 회로 베이스 라인 투명도 지정
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
            const n1 = nodes[i];
            // 가까운 노드들을 연결하는 기본 회로 기판 패턴 생성
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
                if (dist < 180) {
                    ctx.moveTo(n1.x, n1.y);
                    // 직각으로 연결되는 도선 느낌 추가
                    if (Math.random() > 0.5) {
                        ctx.lineTo(n2.x, n1.y);
                    } else {
                        ctx.lineTo(n1.x, n2.y);
                    }
                    ctx.lineTo(n2.x, n2.y);
                }
            }
        }
        ctx.stroke();
        ctx.restore();
    }

    // 애니메이션 루프 실행
    function animate() {
        // 부드러운 잔상 효과용 투명 배경 덧칠
        ctx.fillStyle = 'rgba(15, 23, 42, 0.08)'; // slate-900 색상 계열 조합
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 고정 라인 밑그림
        drawUnderlayGrid();

        // 노드 업데이트 및 그리기
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // 전류 신호선 업데이트 및 그리기
        for (let i = signals.length - 1; i >= 0; i--) {
            const sig = signals[i];
            sig.update();
            sig.draw();

            // 수명이 다했거나 캔버스를 벗어나면 목록에서 제거
            if (sig.life <= 0 || sig.x < 0 || sig.x > canvas.width || sig.y < 0 || sig.y > canvas.height) {
                signals.splice(i, 1);
            }
        }

        // 일정 주기로 새로운 번쩍이는 신호 활성화
        if (signals.length < 24 && Math.random() < 0.15) {
            spawnSignal();
        }

        requestAnimationFrame(animate);
    }

    animate();

    // 리사이즈 대응 재배치
    window.addEventListener('resize', () => {
        initGrid();
    });
});