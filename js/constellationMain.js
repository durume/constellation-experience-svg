class ConstellationMain {
    createQuadrantGuide() {
            // 화면 4분할 가이드 오버레이
            const guide = document.createElement('div');
            guide.id = 'quadrant-guide';
            guide.style.position = 'fixed';
            guide.style.top = '0';
            guide.style.left = '0';
            guide.style.width = '100%';
            guide.style.height = '100%';
            guide.style.pointerEvents = 'none';
            guide.style.zIndex = '10';
            
            // 북쪽 라벨
            const northLabel = document.createElement('div');
            northLabel.textContent = 'NORTH (북)';
            northLabel.style.position = 'absolute';
            northLabel.style.top = '10%';
            northLabel.style.left = '25%';
            northLabel.style.transform = 'translate(-50%, -50%)';
            northLabel.style.color = '#4ae24a';
            northLabel.style.fontSize = '14px';
            northLabel.style.fontWeight = 'bold';
            northLabel.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            northLabel.style.opacity = '0.6';
            guide.appendChild(northLabel);
            
            // 동쪽 라벨
            const eastLabel = document.createElement('div');
            eastLabel.textContent = 'EAST (동)';
            eastLabel.style.position = 'absolute';
            eastLabel.style.top = '10%';
            eastLabel.style.right = '25%';
            eastLabel.style.transform = 'translate(50%, -50%)';
            eastLabel.style.color = '#e24a4a';
            eastLabel.style.fontSize = '14px';
            eastLabel.style.fontWeight = 'bold';
            eastLabel.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            eastLabel.style.opacity = '0.6';
            guide.appendChild(eastLabel);
            
            // 서쪽 라벨
            const westLabel = document.createElement('div');
            westLabel.textContent = 'WEST (서)';
            westLabel.style.position = 'absolute';
            westLabel.style.bottom = '10%';
            westLabel.style.left = '25%';
            westLabel.style.transform = 'translate(-50%, 50%)';
            westLabel.style.color = '#e2a54a';
            westLabel.style.fontSize = '14px';
            westLabel.style.fontWeight = 'bold';
            westLabel.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            westLabel.style.opacity = '0.6';
            guide.appendChild(westLabel);
            
            // 남쪽 라벨
            const southLabel = document.createElement('div');
            southLabel.textContent = 'SOUTH (남)';
            southLabel.style.position = 'absolute';
            southLabel.style.bottom = '10%';
            southLabel.style.right = '25%';
            southLabel.style.transform = 'translate(50%, 50%)';
            southLabel.style.color = '#4a90e2';
            southLabel.style.fontSize = '14px';
            southLabel.style.fontWeight = 'bold';
            southLabel.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            southLabel.style.opacity = '0.6';
            guide.appendChild(southLabel);
            
            // 수직 십자선
            const crosshairV = document.createElement('div');
            crosshairV.style.position = 'absolute';
            crosshairV.style.top = '0';
            crosshairV.style.left = '50%';
            crosshairV.style.width = '1px';
            crosshairV.style.height = '100%';
            crosshairV.style.background = 'rgba(255,255,255,0.1)';
            guide.appendChild(crosshairV);
            
            // 수평 십자선
            const crosshairH = document.createElement('div');
            crosshairH.style.position = 'absolute';
            crosshairH.style.top = '50%';
            crosshairH.style.left = '0';
            crosshairH.style.width = '100%';
            crosshairH.style.height = '1px';
            crosshairH.style.background = 'rgba(255,255,255,0.1)';
            guide.appendChild(crosshairH);
            
            document.body.appendChild(guide);
    }// constellationMain.js - 메인 애플리케이션 (핸드 트래킹 개선 버전)
}
class ConstellationExperience {
    constructor() {
        // 핵심 Three.js 객체들
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f0f23);
        this.createStarField(this.scene);

        
        // MediaPipe 관련
        this.hands = null;
        this.camera_stream = null;
        
        // 3D 객체들
        this.currentModel = null;
        this.models = {
            center: null,
            east: null,
            west: null,
            north: null,
            south: null,
            // _28 모델 추가
            east_28: null,
            west_28: null,
            north_28: null,
            south_28: null
        };
        this.modelPaths = {
            center: 'models/ChonSangYolChaBunYaJiDo_Plat_Center.svg',
            east: 'models/ChonSangYolChaBunYaJiDo_Plat_East.svg',
            west: 'models/ChonSangYolChaBunYaJiDo_Plat_West.svg',
            north: 'models/ChonSangYolChaBunYaJiDo_Plat_North.svg',
            south: 'models/ChonSangYolChaBunYaJiDo_Plat_South.svg',
            east_28: 'models/ChonSangYolChaBunYaJiDo_Plat_East_28.svg',
            west_28: 'models/ChonSangYolChaBunYaJiDo_Plat_West_28.svg',
            north_28: 'models/ChonSangYolChaBunYaJiDo_Plat_North_28.svg',
            south_28: 'models/ChonSangYolChaBunYaJiDo_Plat_South_28.svg'
        };
        this.currentDirection = 'center';
        
        // 손 위치 표시기
        this.handCursors = [null, null];
        
        // 상호작용 상태
        this.handStates = [
            { // 왼손
                isVisible: false,
                landmarks: null,
                isPinching: false,
                pinchStrength: 0,
                smoothedLandmarks: null,
                lastPinchTime: 0,
                position: null
            },
            { // 오른손
                isVisible: false,
                landmarks: null,
                isPinching: false,
                pinchStrength: 0,
                smoothedLandmarks: null,
                lastPinchTime: 0,
                position: null
            }
        ];
        
        // 선택 상태
        this.selectedSeason = null;
        this.selectedConstellation = null;
        this.isExpanded = false;
        
        // 확대 상태 변수 추가
        this.isZoomed = false;
        this.zoomedDirection = null;
        
        // 애니메이션 상태
        this.initialCameraPosition = null;
        this.initialStarMapOpacity = 0.8;
        
        // 핀치 이펙트 관리
        this.pinchEffects = [];
        this.pinchCooldown = 500; // 밀리초

        // 줌 제스처 관련 변수
        this.isTwoHandsFisting = false;  // 양손 주먹 상태
        this.initialFistDistance = null;
        this.currentZoom = 1.0;
        this.minZoom = 0.3;      // 더 많이 축소 가능
        this.maxZoom = 3.0;      // 더 많이 확대 가능
        this.zoomSensitivity = 0.005;  // 감도 조정
        this.zoomVelocity = 0;   // 줌 속도 (부드러운 줌을 위해)
        
        // V 제스처 감지 변수
        this.vGestureDetected = false;
        this.vGestureCooldown = 1000; // 1초 쿨다운
        this.lastVGestureTime = 0;

        // _28 모델들의 개별 위치 설정
        this.zoomedModelPositions = {
            east_28: { x: 0, y: 0, z: 0 },
            west_28: { x: 0, y: 0, z: 0 },    
            north_28: { x: 0, y: 0, z: 0 },   
            south_28: { x: 0, y: 0, z: 0 }    
        };
        
        // _28 모델 선택 시 카메라가 이동할 위치 (Z값은 고정, XY만 이동)
        this.zoomedCameraPositions = {
            east_28: { 
                position: { x: 0.0, y: 0.0, z: 0.0 },    // 동쪽: 오른쪽으로 이동
                lookAt: { x: 0.0, y: 0, z: 0 }         // 같은 X좌표를 바라봄
            },
            west_28: { 
                position: { x: 0.0, y: 0.0, z: 0.0 },   // 서쪽: 왼쪽으로 이동
                lookAt: { x: 0.0, y: 0, z: 0 }
            },
            north_28: { 
                position: { x: 0.0, y: 0.0, z: 0.0 },    // 북쪽: 위쪽으로 이동
                lookAt: { x: 0, y: 0.0, z: 0 }
            },
            south_28: { 
                position: { x: 0.0, y: 0.0, z: 0.0 },   // 남쪽: 아래쪽으로 이동
                lookAt: { x: 0, y: 0.0, z: 0 }
            }
        };

        // 패닝 관련 변수들
        this.isPanning = false;
        this.panningHandIndex = -1;
        this.panStartPosition = null;
        this.cameraStartPosition = null;
        this.maxPanRange = 3.0;
        this.panSensitivity = 2.0;
        
        // 현재 세션의 _28 모델별 카메라 위치 (세션 동안만 유지)
        this.sessionCameraPositions = {
            east_28: { x: 0, y: 0, z: 1.5 },
            west_28: { x: 0, y: 0, z: 1.5 },
            north_28: { x: 0, y: 0, z: 1.5 },
            south_28: { x: 0, y: 0, z: 1.5 }
        };
        
        // 현재 세션의 줌 레벨 (세션 동안만 유지)
        this.sessionZoomLevels = {
            east_28: 1.0,
            west_28: 1.0,
            north_28: 1.0,
            south_28: 1.0
        };
    }

    async init() {
        try {
            const intro = document.getElementById('intro-screen');
            gsap.to(intro, {
            opacity: 0,
            duration: 1,
            delay: 1,
            onComplete: () => intro.remove()
            });

            document.getElementById('status').textContent = 'Three.js 초기화 중...';
            this.setupThreeJS();
            
            document.getElementById('status').textContent = '3D 객체 생성 중...';
            await this.loadAllModels();
            this.createHandCursors();
            this.createQuadrantGuide();
            
            document.getElementById('status').textContent = '카메라 설정 중...';
            await this.setupCamera();
            
            document.getElementById('status').textContent = 'MediaPipe 초기화 중...';
            await this.setupMediaPipe();
            
            this.setupEventListeners();
            this.animate();
            
            document.getElementById('loading').style.display = 'none';
            document.getElementById('status').textContent = '준비 완료! 손을 카메라 앞에 위치시키세요.';
            
        } catch (error) {
            console.error('초기화 실패:', error);
            document.getElementById('status').textContent = '초기화 실패: ' + error.message;
        }
    }

    // 클래스 내부 어디든 (init() 밖에서) 선언
    createStarField(scene) {
        const starCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < starCount; i++) {
            const x = THREE.MathUtils.randFloatSpread(400);
            const y = THREE.MathUtils.randFloatSpread(400);
            const z = THREE.MathUtils.randFloatSpread(400);
            positions.push(x, y, z);

            const color = new THREE.Color();
            color.setHSL(0.6 + Math.random() * 0.1, 0.6, 0.8 + Math.random() * 0.2);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        gsap.to(material, {
            opacity: 0.4,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    setupThreeJS() {
        this.scene = new THREE.Scene();
    
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 1.5);
        this.camera.lookAt(0, 0, 0);  // 항상 Z=0 평면을 바라봄
        this.initialCameraPosition = this.camera.position.clone();
        // this.initialCameraRotation = this.camera.rotation.clone();  // 초기 회전값 저장
            
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000011);
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        // 조명 설정
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(1, 1, 0.5);
        this.scene.add(directionalLight);
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    async loadAllModels() {
        console.log('=== SVG 모델 로딩 시작 ===');
        
        // 모든 모델을 텍스처로 로드
        for (const [direction, path] of Object.entries(this.modelPaths)) {
            try {
                console.log(`${direction} 로딩: ${path}`);
                
                // 이미지로 SVG 로드
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        console.log(`${direction} 이미지 로드 성공`);
                        
                        // 캔버스에 그리기
                        const canvas = document.createElement('canvas');
                        canvas.width = 1024;
                        canvas.height = 1024;
                        const ctx = canvas.getContext('2d');
                        
                        // 투명 배경
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        
                        // SVG 이미지 그리기 (중앙 정렬)
                        const scale = Math.min(
                            canvas.width / img.width,
                            canvas.height / img.height
                        ) * 0.9;
                        
                        const x = (canvas.width - img.width * scale) / 2;
                        const y = (canvas.height - img.height * scale) / 2;
                        
                        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                        
                        // 텍스처 생성
                        const texture = new THREE.CanvasTexture(canvas);
                        texture.needsUpdate = true;
                        
                        // 원형 지오메트리 사용 (천문도에 더 적합)
                        const geometry = new THREE.CircleGeometry(1, 64);
                        const material = new THREE.MeshPhysicalMaterial({
                            map: texture,
                            transparent: true,
                            side: THREE.DoubleSide,
                            alphaTest: 0.1,
                            metalness: 0.3,
                            roughness: 0.4,
                            clearcoat: 0.2,
                            clearcoatRoughness: 0.2
                        });
                        
                        const mesh = new THREE.Mesh(geometry, material);
                        mesh.name = direction;
                        
                        // 약간의 두께감을 위한 테두리 추가
                        const ringGeometry = new THREE.RingGeometry(1.95, 2.05, 64);
                        const ringMaterial = new THREE.MeshPhysicalMaterial({
                            color: 0x8B7355,
                            metalness: 0.8,
                            roughness: 0.2,
                            side: THREE.DoubleSide
                        });
                        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                        ring.position.z = 0.01;
                        
                        // 그룹으로 감싸기
                        const group = new THREE.Group();
                        group.add(mesh);
                        group.add(ring);
                        
                        // 그림자 설정
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        ring.castShadow = true;
                        ring.receiveShadow = true;
                        
                        this.models[direction] = group;
                        
                        // _28 모델은 더 크게
                        if (direction.includes('_28')) {
                            this.models[direction].scale.set(1, 1, 1);
                        } else {
                            this.models[direction].scale.set(1, 1, 1);
                        }
                        
                        // Z축 180도 회전
                        // this.models[direction].rotation.z = Math.PI;
                        
                        // center 모델은 즉시 표시
                        if (direction === 'center') {
                            this.scene.add(this.models[direction]);
                            this.currentModel = this.models[direction];
                            
                            // // 초기 회전 애니메이션
                            // gsap.from(this.currentModel.rotation, {
                            //     z: Math.PI * 2,
                            //     duration: 2,
                            //     ease: "power2.out"
                            // });
                            
                            // 초기 스케일 애니메이션
                            gsap.from(this.currentModel.scale, {
                                x: 0,
                                y: 0,
                                z: 0,
                                duration: 1,
                                ease: "back.out(1.7)"
                            });
                        }
                        
                        console.log(`✓ ${direction} 모델 로드 완료`);
                        resolve();
                    };
                    
                    img.onerror = (error) => {
                        console.error(`${direction} 이미지 로드 실패:`, error);
                        reject(error);
                    };
                    
                    // 이미지 소스 설정
                    img.src = path;
                });
                
            } catch (error) {
                console.error(`${direction} 로드 실패:`, error);
                this.createFallbackModel(direction);
            }
        }
        
        // 로드 완료 확인
        if (!this.currentModel) {
            console.log('center 모델이 없음, 폴백 생성');
            this.createFallbackModel('center');
        }
        
        console.log('=== 모든 모델 로딩 완료 ===');
    }

    createSVGPlane(direction, svgPath) {
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(
            svgPath,
            (texture) => {
                const geometry = new THREE.PlaneGeometry(4, 4);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide
                });
                
                const plane = new THREE.Mesh(geometry, material);
                plane.name = `${direction}_texture`;
                
                this.models[direction] = plane;
                
                if (direction.includes('_28')) {
                    this.models[direction].scale.multiplyScalar(1.5);
                }
                
                // this.models[direction].rotation.z = Math.PI;
                
                if (direction === 'center') {
                    this.scene.add(this.models[direction]);
                    this.currentModel = this.models[direction];
                }
                
                console.log(`${direction} SVG 텍스처 평면 생성 완료`);
            },
            undefined,
            (error) => {
                console.error(`${direction} SVG 텍스처 로드 실패:`, error);
                this.createFallbackModel(direction);
            }
        );
    }

    createFallbackModel(direction) {
        const colors = {
            center: 0x808080,
            east: 0x4ae24a,
            west: 0xe2a54a,
            north: 0x4a90e2,
            south: 0xe24a4a,
            east_28: 0x66ff66,
            west_28: 0xffaa66,
            north_28: 0x6666ff,
            south_28: 0xff6666
        };
        
        // 원형 지오메트리 사용
        const geometry = new THREE.CircleGeometry(2, 32);
        const material = new THREE.MeshPhysicalMaterial({ 
            color: colors[direction] || 0x808080,
            metalness: 0.3,
            roughness: 0.7,
            side: THREE.DoubleSide
        });
        
        const circle = new THREE.Mesh(geometry, material);
        
        // 방향 텍스트 추가
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // 배경
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(128, 128, 120, 0, Math.PI * 2);
        ctx.fill();
        
        // 텍스트
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(direction.toUpperCase(), 128, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const textPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.5), 
            textMaterial
        );
        textPlane.position.z = 0.01;
        
        const group = new THREE.Group();
        group.add(circle);
        group.add(textPlane);
        group.name = `${direction}_fallback`;
        
        if (direction.includes('_28')) {
            group.scale.set(3, 3, 3);
        }
        
        group.rotation.z = Math.PI;
        
        this.models[direction] = group;
        
        if (direction === 'center') {
            this.scene.add(this.models[direction]);
            this.currentModel = this.models[direction];
        }
        
        console.log(`${direction} 폴백 모델 생성 완료`);
    }

    switchModel(newDirection) {
    // center에서 center를 선택하면 무시
        if (newDirection === 'center' && this.currentDirection === 'center') return;
        
        // 같은 방향이고 확대되지 않은 상태면 무시
        if (this.currentDirection === newDirection && !this.isZoomed) return;
        
        // 현재 모델 제거
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
        }
        
        // 확대 상태 초기화
        if (this.isZoomed) {
            this.isZoomed = false;
            this.zoomedDirection = null;
            this.currentZoom = 1.0;
            this.showZoomIndicator(false);
            
            // 🔴 카메라 애니메이션 제거 - 즉시 이동
            this.camera.position.copy(this.initialCameraPosition);
            this.camera.fov = 75;
            this.camera.updateProjectionMatrix();
        }
        
        // 새 모델 추가
        if (this.models[newDirection]) {
            this.scene.add(this.models[newDirection]);
            this.currentModel = this.models[newDirection];
            this.currentDirection = newDirection;
            
            // 🔴 페이드 인 애니메이션 제거 - 즉시 표시
            const targetScale = newDirection.includes('_28') ? 1.5 : 1;
            this.currentModel.scale.set(targetScale, targetScale, targetScale);
            
            console.log(`모델 전환: ${newDirection}`);
            
            if (newDirection === 'center') {
                document.getElementById('status').textContent = '준비 완료! 손을 카메라 앞에 위치시키세요.';
            } else {
                document.getElementById('status').textContent = `${newDirection.toUpperCase()} 모델 (다시 핀치: 확대 모드)`;
            }
        }
    }

    switchToZoomedModel(direction) {
        if (direction === 'center') return;
        
        const zoomedModelKey = `${direction}_28`;
        
        // 현재 모델 즉시 제거
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
        }
        
        if (this.models[zoomedModelKey]) {
            this.scene.add(this.models[zoomedModelKey]);
            this.currentModel = this.models[zoomedModelKey];
            this.currentDirection = direction;
            this.isZoomed = true;
            this.zoomedDirection = direction;
            
            // 세션에 저장된 줌 레벨 복원
            this.currentZoom = this.sessionZoomLevels[zoomedModelKey];
            
            // 세션에 저장된 카메라 위치 복원
            const savedPos = this.sessionCameraPositions[zoomedModelKey];
            this.camera.position.set(savedPos.x, savedPos.y, savedPos.z);
            
            // 줌 레벨에 따른 FOV 설정
            const baseFOV = 75;
            this.camera.fov = baseFOV / Math.sqrt(this.currentZoom);
            this.camera.updateProjectionMatrix();
            
            console.log(`${direction} 구역 확대 모델로 전환 (위치: ${savedPos.x.toFixed(2)}, ${savedPos.y.toFixed(2)}, 줌: ${this.currentZoom.toFixed(2)})`);
            document.getElementById('status').textContent = `${direction.toUpperCase()} 구역 확대 보기 (양손 주먹: 줌, V: 돌아가기)`;
        }
    }

    getDirectionName(direction) {
        const directionNames = {
            east: '동쪽',
            west: '서쪽',
            north: '북쪽',
            south: '남쪽'
        };
        return directionNames[direction] || direction;
    }
    createHandCursors() {
        // 왼손 커서 (파란색)
        const leftCursorGeometry = new THREE.RingGeometry(0.05, 0.08, 32);
        const leftCursorMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        this.handCursors[0] = new THREE.Mesh(leftCursorGeometry, leftCursorMaterial);
        this.handCursors[0].visible = false;
        this.scene.add(this.handCursors[0]);
        
        // 오른손 커서 (빨간색)
        const rightCursorGeometry = new THREE.RingGeometry(0.05, 0.08, 32);
        const rightCursorMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        this.handCursors[1] = new THREE.Mesh(rightCursorGeometry, rightCursorMaterial);
        this.handCursors[1].visible = false;
        this.scene.add(this.handCursors[1]);
    }

    updateHandCursor(handIndex, position, isPinching) {
        const cursor = this.handCursors[handIndex];
        if (!cursor) return;
        
        if (isPinching) {
            // 핀치 중에는 커서 숨기기
            cursor.visible = false;
        } else if (position) {
            // 손이 펼쳐진 상태에서는 커서 표시
            cursor.visible = true;
            cursor.position.copy(position);
            
            // 카메라를 향하도록 회전
            cursor.lookAt(this.camera.position);
            
            // 부드러운 펄스 효과
            const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
            cursor.scale.set(scale, scale, 1);
        } else {
            cursor.visible = false;
        }
    }

    determineQuadrant(normalizedX, normalizedY) {
        // MediaPipe는 좌우가 반전되어 있으므로 보정
        // selfieMode가 true일 때는 이미 반전되어 있음
        const x = normalizedX;
        const y = normalizedY;
        
        // 화면 중심을 (0.5, 0.5)로 설정
        const dx = x - 0.5;
        const dy = y - 0.5;
        
        // 대각선을 기준으로 영역 판단
        // X자 대각선: y = x와 y = -x
        if (dy < -Math.abs(dx)) {
            // 위쪽 삼각형 영역
            return 'north';
        } else if (dy > Math.abs(dx)) {
            // 아래쪽 삼각형 영역
            return 'south';
        } else if (dx < 0) {
            // 왼쪽 삼각형 영역
            return 'east';
        } else {
            // 오른쪽 삼각형 영역
            return 'west';
        }
    }

    determineQuadrantSimple(normalizedX, normalizedY) {
        // 화면 중심을 (0.5, 0.5)로 설정
        const dx = normalizedX - 0.5;
        const dy = normalizedY - 0.5;
        
        // 대각선 y = x와 y = -x를 기준으로 판단
        if (dy < dx && dy < -dx) {
            return 'north';  // 위쪽 (북)
        } else if (dy >= dx && dy < -dx) {
            return 'east';   // 왼쪽 (동)
        } else if (dy >= dx && dy >= -dx) {
            return 'south';  // 아래쪽 (남)
        } else {
            return 'west';   // 오른쪽 (서)
        }
    }

    visualizeQuadrantSelection(x, y, quadrant) {
        // 기존 마커 제거
        const existingMarker = document.getElementById('debug-marker');
        if (existingMarker) existingMarker.remove();
        
        // 디버그 마커 생성
        const marker = document.createElement('div');
        marker.id = 'debug-marker';
        marker.style.cssText = `
            position: fixed;
            left: ${x * 100}%;
            top: ${y * 100}%;
            width: 20px;
            height: 20px;
            background: red;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10000;
        `;
        
        // 선택된 영역 표시
        const label = document.createElement('div');
        label.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: black;
            color: white;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 12px;
        `;
        label.textContent = quadrant;
        marker.appendChild(label);
        
        document.body.appendChild(marker);
        
        // 3초 후 제거
        setTimeout(() => marker.remove(), 3000);
    }

    async setupCamera() {
        const video = document.getElementById('video');
        
        try {
            this.camera_stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                }
            });
            video.srcObject = this.camera_stream;
        } catch (error) {
            console.error('카메라 접근 실패:', error);
            throw error;
        }
    }

    async setupMediaPipe() {
        if (typeof Hands === 'undefined') {
            throw new Error('MediaPipe Hands 라이브러리가 로드되지 않았습니다.');
        }

        this.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        this.hands.setOptions({
            selfieMode: true,
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,  // 더 낮은 값으로 조정
            minTrackingConfidence: 0.5    // 더 낮은 값으로 조정
        });

        this.hands.onResults((results) => this.onHandResults(results));

        if (typeof Camera === 'undefined') {
            throw new Error('MediaPipe Camera 유틸리티가 로드되지 않았습니다.');
        }

        const camera = new Camera(document.getElementById('video'), {
            onFrame: async () => {
                await this.hands.send({ image: document.getElementById('video') });
            },
            width: 640,
            height: 480
        });

        camera.start();
    }

    onHandResults(results) {
        // 손 추적 상태 초기화
        this.handStates[0].isVisible = false;
        this.handStates[1].isVisible = false;

        if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            document.getElementById('status').textContent = '손을 카메라 앞에 위치시키세요';
            this.isTwoHandsPinching = false;
            return;
        }

        let statusText = '';
        
        // 양손이 모두 감지되었는지 확인
        const bothHandsDetected = results.multiHandLandmarks.length === 2;
        
        // 감지된 각 손 처리
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const landmarks = results.multiHandLandmarks[i];
            const handedness = results.multiHandedness[i];
            const label = handedness.label;
            const score = handedness.score;
            
            // 손 인덱스 결정 (Left = 0, Right = 1)
            const handIndex = label === "Left" ? 0 : 1;
            
            if (score > 0.8) {
                this.updateHandTracking(handIndex, landmarks, label);
                
                const pinchStatus = this.handStates[handIndex].isPinching ? '✊' : '✋';
                statusText += `${label} 손 ${pinchStatus} `;
            }
        }
        
        // 양손 줌 제스처 처리 (_28 모델이 활성화된 경우에만)
        if (bothHandsDetected && this.isZoomed) {
            this.handleTwoHandsZoom();
        } else {
            this.isTwoHandsPinching = false;
            this.initialPinchDistance = null;
        }
        
        // V 제스처 감지 (_28 모델이 활성화된 경우에만)
        if (this.isZoomed) {
            this.detectVGesture();
        }
        
        document.getElementById('status').textContent = statusText || '손을 카메라 앞에 위치시키세요';
    }

    handleTwoHandsZoom() {
        const leftHand = this.handStates[0];
        const rightHand = this.handStates[1];
        
        if (leftHand.isVisible && rightHand.isVisible) {
            const leftFist = this.isFistGesture(leftHand.smoothedLandmarks);
            const rightFist = this.isFistGesture(rightHand.smoothedLandmarks);
            
            if (leftFist && rightFist) {
                const distance = this.calculateHandsDistance(
                    leftHand.position,
                    rightHand.position
                );
                
                if (!this.isTwoHandsFisting) {
                    this.isTwoHandsFisting = true;
                    this.initialFistDistance = distance;
                    console.log('양손 주먹 줌 제스처 시작');
                    this.showZoomIndicator(true);
                } else {
                    // 거리 변화를 기반으로 줌 레벨 업데이트
                    const distanceRatio = distance / this.initialFistDistance;
                    const targetZoom = this.currentZoom * distanceRatio;
                    this.currentZoom = Math.max(this.minZoom, Math.min(this.maxZoom, targetZoom));
                    this.initialFistDistance = distance;
                    
                    // 카메라 줌 적용
                    this.applyZoom();
                    
                    // 줌 레벨 표시 업데이트
                    this.updateZoomIndicator();
                }
            } else {
                // 줌 제스처 종료 시 현재 줌 레벨 저장
                if (this.isTwoHandsFisting) {
                    if (this.isZoomed && this.currentDirection) {
                        const modelKey = `${this.currentDirection}_28`;
                        this.sessionZoomLevels[modelKey] = this.currentZoom;
                        console.log(`${modelKey} 줌 레벨 저장: ${this.currentZoom.toFixed(2)}`);
                    }
                    console.log('양손 주먹 줌 제스처 종료');
                    this.showZoomIndicator(false);
                }
                this.isTwoHandsFisting = false;
                this.initialFistDistance = null;
            }
        } else {
            this.isTwoHandsFisting = false;
            this.initialFistDistance = null;
            this.showZoomIndicator(false);
        }
    }

    showZoomIndicator(show) {
        const indicator = document.getElementById('zoom-indicator');
        
        if (show && !indicator) {
            const div = document.createElement('div');
            div.id = 'zoom-indicator';
            div.style.cssText = `
                position: fixed;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 18px;
                font-weight: bold;
                z-index: 1000;
                pointer-events: none;
                border: 2px solid rgba(255, 255, 255, 0.3);
            `;
            document.body.appendChild(div);
            
            // 양손 주먹 아이콘도 표시
            const fistIcon = document.createElement('div');
            fistIcon.id = 'fist-icon';
            fistIcon.innerHTML = '👊 ↔️ 👊';
            fistIcon.style.cssText = `
                position: fixed;
                top: 25%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 30px;
                z-index: 1000;
                pointer-events: none;
            `;
            document.body.appendChild(fistIcon);
            
        } else if (!show) {
            if (indicator) indicator.remove();
            const fistIcon = document.getElementById('fist-icon');
            if (fistIcon) fistIcon.remove();
        }
    }

    updateZoomIndicator() {
        const indicator = document.getElementById('zoom-indicator');
        if (indicator) {
            const zoomPercent = Math.round(this.currentZoom * 100);
            indicator.textContent = `줌: ${zoomPercent}%`;
            
            // 줌 레벨에 따라 색상 변경
            if (this.currentZoom > 1.5) {
                indicator.style.borderColor = '#4ae24a'; // 초록색 (확대)
            } else if (this.currentZoom < 0.7) {
                indicator.style.borderColor = '#e24a4a'; // 빨간색 (축소)
            } else {
                indicator.style.borderColor = 'rgba(255, 255, 255, 0.3)'; // 기본
            }
        }
    }

    isFistGesture(landmarks) {
        if (!landmarks) return false;
        
        // 손가락 끝과 손바닥 기준점 사이의 거리 계산
        const palmBase = landmarks[0];  // 손목
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        
        // 각 손가락이 손바닥에 가까이 있는지 확인
        const threshold = 0.15;  // 거리 임계값
        
        const thumbFolded = this.calculateLandmarkDistance(thumbTip, palmBase) < threshold;
        const indexFolded = this.calculateLandmarkDistance(indexTip, palmBase) < threshold;
        const middleFolded = this.calculateLandmarkDistance(middleTip, palmBase) < threshold;
        const ringFolded = this.calculateLandmarkDistance(ringTip, palmBase) < threshold;
        const pinkyFolded = this.calculateLandmarkDistance(pinkyTip, palmBase) < threshold;
        
        // 모든 손가락이 접혀있으면 주먹
        return indexFolded && middleFolded && ringFolded && pinkyFolded;
    }

    calculateLandmarkDistance(landmark1, landmark2) {
        const dx = landmark1.x - landmark2.x;
        const dy = landmark1.y - landmark2.y;
        const dz = landmark1.z - landmark2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    detectVGesture() {
        let vGestureCount = 0;
        
        // 각 손에서 V 제스처 확인
        for (let handIndex = 0; handIndex < 2; handIndex++) {
            const handState = this.handStates[handIndex];
            
            if (handState.isVisible && handState.smoothedLandmarks) {
                if (this.isVGesture(handState.smoothedLandmarks)) {
                    vGestureCount++;
                }
            }
        }
        
        // 적어도 한 손이 V 제스처를 하고 있는지 확인
        if (vGestureCount > 0 && !this.vGestureDetected) {
            const currentTime = Date.now();
            
            // 쿨다운 체크
            if (currentTime - this.lastVGestureTime > this.vGestureCooldown) {
                this.vGestureDetected = true;
                this.lastVGestureTime = currentTime;
                console.log('V 제스처 감지!');
                
                if (this.isZoomed) {
                    // _28 모델에서 원래 모델로 복귀
                    this.returnToOriginalModel(this.currentDirection);
                } else if (this.currentDirection !== 'center') {
                    // 일반 모델에서 center로 복귀 (선택사항)
                    // this.switchModel('center');
                    // this.showMessage('중앙 모델로 복귀');
                }
                
                // 시각적 피드백
                this.createVGestureEffect();
            }
        } else if (vGestureCount === 0) {
            this.vGestureDetected = false;
        }
    }

    updateHandTracking(handIndex, landmarks, handLabel) {
        const handState = this.handStates[handIndex];
        
        // 손 상태 업데이트
        handState.isVisible = true;
        handState.landmarks = landmarks;
        
        // 손떨림 보정을 위한 스무딩 적용
        const smoothedLandmarks = this.smoothLandmarks(handIndex, landmarks);
        
        // 핀치하는 손가락 위치로 변경
        const thumbTip = smoothedLandmarks[4];
        const indexTip = smoothedLandmarks[8];
        const pinchCenter = {
            x: (thumbTip.x + indexTip.x) / 2,
            y: (thumbTip.y + indexTip.y) / 2,
            z: (thumbTip.z + indexTip.z) / 2
        };
        handState.position = this.convertToWorldPosition(pinchCenter, handIndex);
        
        // 제스처 분석
        const gestureInfo = this.analyzeGestures(handIndex, smoothedLandmarks);
        
        // 패닝 중이면 업데이트 (_28 모델에서만)
        if (this.isPanning && this.isZoomed && gestureInfo.isPinching) {
            this.updatePanning(handIndex, gestureInfo);
        }
        
        // 핀치 상태 변화 감지
        if (gestureInfo.isPinching && !handState.isPinching) {
            // 쿨다운 체크
            const currentTime = Date.now();
            if (currentTime - handState.lastPinchTime > this.pinchCooldown) {
                this.onPinchStart(handIndex, gestureInfo, smoothedLandmarks);
                handState.lastPinchTime = currentTime;
            }
        } else if (!gestureInfo.isPinching && handState.isPinching) {
            this.onPinchEnd(handIndex);
        }
        
        // 연속적인 핀치 이펙트 (_28 모델이 아닐 때만)
        if (gestureInfo.isPinching && !this.isZoomed) {
            this.updateContinuousPinchEffect(handIndex, gestureInfo, smoothedLandmarks);
        }
        
        // 손 커서 업데이트
        this.updateHandCursor(handIndex, handState.position, gestureInfo.isPinching);
        
        handState.isPinching = gestureInfo.isPinching;
        handState.pinchStrength = gestureInfo.pinchStrength;
    }

    updatePanning(handIndex, gestureInfo) {
        if (!this.isPanning || 
            this.panningHandIndex !== handIndex || 
            !this.panStartPosition || 
            !this.cameraStartPosition) {
            return;
        }
        
        const currentPosition = {
            x: gestureInfo.pinchPosition.x,
            y: gestureInfo.pinchPosition.y
        };
        
        const normalizedDeltaX = currentPosition.x - this.panStartPosition.x;
        const normalizedDeltaY = currentPosition.y - this.panStartPosition.y;
        
        const zoomAdjustedSensitivity = this.panSensitivity / this.currentZoom;
        
        const cameraDeltaX = -normalizedDeltaX * zoomAdjustedSensitivity * 5.0;
        const cameraDeltaY = normalizedDeltaY * zoomAdjustedSensitivity * 5.0;
        
        let newCameraX = this.cameraStartPosition.x + cameraDeltaX;
        let newCameraY = this.cameraStartPosition.y + cameraDeltaY;
        
        // 패닝 범위 제한
        newCameraX = Math.max(-this.maxPanRange, Math.min(this.maxPanRange, newCameraX));
        newCameraY = Math.max(-this.maxPanRange, Math.min(this.maxPanRange, newCameraY));
        
        this.camera.position.x = newCameraX;
        this.camera.position.y = newCameraY;
    }
    
    stopPanning() {
        if (!this.isPanning) return;
        
        console.log(`패닝 종료 - 최종 오프셋: X=${this.panOffset.x.toFixed(2)}, Y=${this.panOffset.y.toFixed(2)}`);
        
        this.isPanning = false;
        this.panningHandIndex = -1;
        this.panStartPosition = null;
        this.cameraStartPosition = null;
        
        this.showPanningIndicator(false);
    }

    resetPanning() {
        // 패닝 상태 초기화
        this.panOffset = { x: 0, y: 0 };
        this.stopPanning();
        
        console.log('패닝 오프셋 리셋');
    }

    smoothLandmarks(handIndex, landmarks) {
        const handState = this.handStates[handIndex];
        const smoothingFactor = 0.2; // 더 강한 스무딩
        
        if (!handState.smoothedLandmarks) {
            handState.smoothedLandmarks = landmarks.map(lm => ({...lm}));
            return handState.smoothedLandmarks;
        }
        
        const smoothed = landmarks.map((landmark, i) => {
            const prev = handState.smoothedLandmarks[i];
            return {
                x: prev.x + (landmark.x - prev.x) * smoothingFactor,
                y: prev.y + (landmark.y - prev.y) * smoothingFactor,
                z: prev.z + (landmark.z - prev.z) * smoothingFactor,
                visibility: landmark.visibility
            };
        });
        
        handState.smoothedLandmarks = smoothed;
        return smoothed;
    }

    analyzeGestures(handIndex, landmarks) {
        const gestureInfo = {
            isPinching: false,
            pinchStrength: 0,
            pinchPosition: null
        };
        
        // 엄지와 검지 끝 위치
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        
        // 핀치 거리 계산 (화면 좌표 기준)
        const screenDistance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) +
            Math.pow(thumbTip.y - indexTip.y, 2)
        );
        
        // Z축 거리도 고려
        const depthDistance = Math.abs(thumbTip.z - indexTip.z);
        
        // 전체 거리 (화면 거리를 더 중요하게)
        const totalDistance = screenDistance + depthDistance * 0.5;
        
        // 핀치 강도 계산 (임계값 조정)
        const maxDistance = 0.08; // 더 큰 임계값
        gestureInfo.pinchStrength = Math.max(0, 1 - (totalDistance / maxDistance));
        gestureInfo.isPinching = gestureInfo.pinchStrength > 0.5; // 낮은 임계값
        
        // 디버그 정보
        if (handIndex === 0 || handIndex === 1) {
            const debugInfo = `Hand ${handIndex}: distance=${totalDistance.toFixed(3)}, strength=${gestureInfo.pinchStrength.toFixed(2)}, pinching=${gestureInfo.isPinching}`;
            if (gestureInfo.pinchStrength > 0.3) {
                console.log(debugInfo);
            }
        }
        
        // 핀치 위치 계산 (엄지와 검지 중간점)
        gestureInfo.pinchPosition = {
            x: (thumbTip.x + indexTip.x) / 2,
            y: (thumbTip.y + indexTip.y) / 2,
            z: (thumbTip.z + indexTip.z) / 2
        };
        
        return gestureInfo;
    }

    isVGesture(landmarks) {
        // 손가락 끝 위치
        const thumbTip = landmarks[4];      // 엄지
        const indexTip = landmarks[8];      // 검지
        const middleTip = landmarks[12];    // 중지
        const ringTip = landmarks[16];      // 약지
        const pinkyTip = landmarks[20];     // 소지
        
        // 손가락 MCP 관절 위치 (손바닥 기준)
        const indexMCP = landmarks[5];
        const middleMCP = landmarks[9];
        const ringMCP = landmarks[13];
        const pinkyMCP = landmarks[17];
        
        // 검지와 중지가 펴져 있는지 확인 (y값이 MCP보다 작으면 위로 펴진 것)
        const indexExtended = indexTip.y < indexMCP.y - 0.1;
        const middleExtended = middleTip.y < middleMCP.y - 0.1;
        
        // 약지와 소지가 접혀 있는지 확인
        const ringFolded = ringTip.y > ringMCP.y - 0.05;
        const pinkyFolded = pinkyTip.y > pinkyMCP.y - 0.05;
        
        // V 제스처: 검지와 중지만 펴고 나머지는 접힌 상태
        return indexExtended && middleExtended && ringFolded && pinkyFolded;
    }

    // 두 손 사이의 거리 계산
    calculateHandsDistance(pos1, pos2) {
        if (!pos1 || !pos2) return 0;
        
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    // 줌 적용
    applyZoom() {
        if (!this.isZoomed) return;
        
        const baseZ = 1.5;
        const newZ = baseZ / this.currentZoom;
        
        gsap.to(this.camera.position, {
            z: newZ,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {
                // Z축 위치도 세션에 저장
                if (this.currentDirection) {
                    const modelKey = `${this.currentDirection}_28`;
                    this.sessionCameraPositions[modelKey].z = this.camera.position.z;
                }
            }
        });
        
        // FOV 조정
        const baseFOV = 75;
        const newFOV = baseFOV / Math.sqrt(this.currentZoom);
        
        gsap.to(this.camera, {
            fov: Math.max(20, Math.min(120, newFOV)),
            duration: 0.1,
            ease: "power2.out",
            onUpdate: () => {
                this.camera.updateProjectionMatrix();
            }
        });
    }

    // V 제스처 이펙트
    createVGestureEffect() {
        // 화면 중앙에 V 아이콘과 메시지 표시
        const vEffect = document.createElement('div');
        vEffect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 10000;
            pointer-events: none;
        `;
        
        vEffect.innerHTML = `
            <div style="font-size: 100px; transform: scale(0);" id="v-icon">✌️</div>
            <div style="color: white; font-size: 24px; margin-top: 20px; opacity: 0;" id="v-text">
                기본 보기로 돌아갑니다
            </div>
        `;
        
        document.body.appendChild(vEffect);
        
        // 애니메이션
        gsap.timeline()
            .to('#v-icon', {
                scale: 1.5,
                duration: 0.3,
                ease: "back.out(1.7)"
            })
            .to('#v-text', {
                opacity: 1,
                duration: 0.2
            }, "-=0.1")
            .to(vEffect, {
                opacity: 0,
                duration: 0.5,
                delay: 0.8,
                onComplete: () => {
                    document.body.removeChild(vEffect);
                }
            });
        
        // 사운드 효과
        this.playGestureSound(800, 0.1);
    }

    // 제스처 사운드
    playGestureSound(frequency, duration) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.log('오디오 재생 실패:', error);
        }
    }

    // MediaPipe 좌표를 3D 월드 좌표로 변환
    convertToWorldPosition(normalizedCoord, handIndex) {
        // 화면 비율을 고려한 변환
        const aspect = window.innerWidth / window.innerHeight;
        
        // 카메라 시야각에 맞춘 좌표 계산
        const fovRad = (this.camera.fov * Math.PI) / 180;
        const distance = 2; // 카메라로부터의 거리
        
        // 화면 좌표를 3D 공간으로 매핑
        const worldX = (normalizedCoord.x - 0.5) * Math.tan(fovRad / 2) * aspect * distance * 2;
        const worldY = -(normalizedCoord.y - 0.5) * Math.tan(fovRad / 2) * distance * 2;
        const worldZ = -distance; // 카메라 앞
        
        // 카메라 위치 기준으로 변환
        const worldPos = new THREE.Vector3(worldX, worldY, worldZ);
        worldPos.add(this.camera.position);
        
        console.log(`World position: x=${worldPos.x.toFixed(2)}, y=${worldPos.y.toFixed(2)}, z=${worldPos.z.toFixed(2)}`);
        
        return worldPos;
    }

    onPinchStart(handIndex, gestureInfo, landmarks) {
        const handLabel = handIndex === 0 ? "왼손" : "오른손";
        console.log(`${handLabel} 핀치 시작!`);
        console.log(`핀치 위치: x=${gestureInfo.pinchPosition.x.toFixed(2)}, y=${gestureInfo.pinchPosition.y.toFixed(2)}`);
        
        // 핀치 시작 이펙트
        this.createPinchStartEffect(handIndex, gestureInfo);
        
        // _28 모델 상태 확인
        if (this.isZoomed) {
            // _28 모델에서는 패닝 시작
            this.startPanning(handIndex, gestureInfo);
            return;
        }
        
        // 일반 모드에서의 핀치 동작
        const quadrant = this.determineQuadrant(
            gestureInfo.pinchPosition.x,
            gestureInfo.pinchPosition.y
        );
        
        console.log(`선택된 영역: ${quadrant}`);
        
        // 디버깅용 시각화
        this.visualizeQuadrantSelection(
            gestureInfo.pinchPosition.x,
            gestureInfo.pinchPosition.y,
            quadrant
        );
        
        // 선택 영역 하이라이트 표시
        // this.createSelectionHighlight(quadrant);
        
        if (this.currentDirection === 'center') {
            // 중앙에서 방향 선택
            this.switchModel(quadrant);
        } else if (this.currentDirection === quadrant && !this.isZoomed) {
            // 같은 방향 다시 선택 시 _28 모델로 전환
            this.switchToZoomedModel(quadrant);
        } else {
            // 다른 방향 선택
            this.switchModel(quadrant);
        }
    }

    // createSelectionHighlight(quadrant) {
    //     // 기존 하이라이트 제거
    //     const existingHighlight = document.getElementById('quadrant-highlight');
    //     if (existingHighlight) {
    //         existingHighlight.remove();
    //     }
        
    //     const highlight = document.createElement('div');
    //     highlight.id = 'quadrant-highlight';
        
    //     // 각 영역의 클립 패스 정의
    //     const clipPaths = {
    //         north: 'polygon(50% 0%, 100% 0%, 50% 50%)',
    //         east: 'polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%)',
    //         south: 'polygon(0% 100%, 50% 50%, 100% 100%)',
    //         west: 'polygon(50% 50%, 100% 0%, 100% 100%)'
    //     };
        
    //     const colors = {
    //         north: 'rgba(226, 74, 74, 0.2)',   // 빨간색
    //         east: 'rgba(74, 226, 74, 0.2)',    // 초록색
    //         south: 'rgba(226, 165, 74, 0.2)',  // 주황색
    //         west: 'rgba(74, 144, 226, 0.2)'    // 파란색
    //     };
        
    //     highlight.style.cssText = `
    //         position: fixed;
    //         top: 0;
    //         left: 0;
    //         width: 100%;
    //         height: 100%;
    //         background: ${colors[quadrant]};
    //         clip-path: ${clipPaths[quadrant]};
    //         pointer-events: none;
    //         z-index: 5;
    //         transition: opacity 0.3s;
    //     `;
        
    //     document.body.appendChild(highlight);
        
    //     // 일정 시간 후 페이드 아웃
    //     setTimeout(() => {
    //         highlight.style.opacity = '0';
    //         setTimeout(() => highlight.remove(), 300);
    //     }, 500);
    // }


    startPanning(handIndex, gestureInfo) {
        if (!this.isZoomed) {
            console.log('패닝은 _28 모델에서만 가능합니다.');
            return;
        }
        
        if (this.isPanning) {
            return;
        }
        
        this.isPanning = true;
        this.panningHandIndex = handIndex;
        
        // 시작 위치 저장 (핀치 위치)
        this.panStartPosition = {
            x: gestureInfo.pinchPosition.x,
            y: gestureInfo.pinchPosition.y
        };
        
        // 현재 카메라 위치 저장 (이미 패닝된 위치일 수 있음)
        this.cameraStartPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y
        };
        
        console.log(`패닝 시작 - 카메라 위치: (${this.camera.position.x.toFixed(2)}, ${this.camera.position.y.toFixed(2)})`);
        this.showPanningIndicator(true);
        this.showMessage('핀치를 유지하고 드래그하여 이동', 1500);
    }

    // 패닝 종료
    onPinchEnd(handIndex) {
        const handLabel = handIndex === 0 ? "왼손" : "오른손";
        console.log(`${handLabel} 핀치 종료`);
        
        if (this.isPanning && this.panningHandIndex === handIndex) {
            // 현재 카메라 위치를 세션에 저장
            if (this.isZoomed && this.currentDirection) {
                const modelKey = `${this.currentDirection}_28`;
                this.sessionCameraPositions[modelKey] = {
                    x: this.camera.position.x,
                    y: this.camera.position.y,
                    z: this.camera.position.z
                };
                console.log(`${modelKey} 위치 저장: (${this.camera.position.x.toFixed(2)}, ${this.camera.position.y.toFixed(2)})`);
            }
            
            this.isPanning = false;
            this.panStartPosition = null;
            this.cameraStartPosition = null;
            console.log('패닝 종료');
            
            this.showPanningIndicator(false);
        }
    }

    showPanningIndicator(show) {
        const indicatorId = 'panning-indicator';
        let indicator = document.getElementById(indicatorId);
        
        if (show) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = indicatorId;
                indicator.style.cssText = `
                    position: fixed;
                    top: 35%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 150, 255, 0.9);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 20px;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `;
                indicator.innerHTML = `
                    <span style="font-size: 24px;">🖐️</span>
                    <span>패닝 모드 - 드래그하여 이동</span>
                `;
                document.body.appendChild(indicator);
                
                // 페이드 인 효과
                gsap.from(indicator, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        } else {
            if (indicator) {
                gsap.to(indicator, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        indicator.remove();
                    }
                });
            }
        }
    }

    createPanningIndicator(show) {
        const indicator = document.getElementById('panning-indicator');
        
        if (show && !indicator) {
            const div = document.createElement('div');
            div.id = 'panning-indicator';
            div.innerHTML = `
                <div style="font-size: 30px;">✋</div>
                <div style="font-size: 16px; margin-top: 5px;">이동 중</div>
            `;
            div.style.cssText = `
                position: fixed;
                bottom: 150px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                color: white;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 20px;
                border-radius: 20px;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(div);
            
            setTimeout(() => {
                div.style.opacity = '1';
            }, 10);
            
        } else if (!show && indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => {
                indicator.remove();
            }, 300);
        }
    }

    onPinchEnd(handIndex) {
        const handLabel = handIndex === 0 ? "왼손" : "오른손";
        console.log(`${handLabel} 핀치 종료`);
    }

    returnToOriginalModel(direction) {
        console.log(`${direction} 원래 모델로 복귀`);
        
        // 해당 _28 모델의 세션 위치 리셋
        const modelKey = `${direction}_28`;
        this.sessionCameraPositions[modelKey] = { x: 0, y: 0, z: 1.5 };
        this.sessionZoomLevels[modelKey] = 1.0;
        
        // 모든 상태 리셋
        this.currentZoom = 1.0;
        this.isTwoHandsFisting = false;
        this.initialFistDistance = null;
        this.isPanning = false;
        this.panStartPosition = null;
        this.cameraStartPosition = null;
        
        // 인디케이터 제거
        this.showZoomIndicator(false);
        this.showPanningIndicator(false);
        
        // 현재 확대 모델 제거
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
        }
        
        // 원래 모델 추가
        if (this.models[direction]) {
            this.scene.add(this.models[direction]);
            this.currentModel = this.models[direction];
            this.isZoomed = false;
            this.zoomedDirection = null;
            
            // 카메라 즉시 초기 위치로
            this.camera.position.copy(this.initialCameraPosition);
            this.camera.fov = 75;
            this.camera.updateProjectionMatrix();
            
            document.getElementById('status').textContent = `${direction.toUpperCase()} 구역 기본 보기로 복귀`;
        }
    }

    resetCameraPosition(onComplete) {
        console.log('카메라 위치 리셋');
        
        const timeline = gsap.timeline({
            onComplete: onComplete
        });
        
        timeline.to(this.camera.position, {
            x: this.initialCameraPosition.x,
            y: this.initialCameraPosition.y,
            z: this.initialCameraPosition.z,
            duration: 1,
            ease: "power2.out"
        })
        // .to(this.camera.rotation, {
        //     x: 0,
        //     y: 0,
        //     z: 0,
        //     duration: 1,
        //     ease: "power2.out"
        // }, "<"); // "<" means start at the same time as previous animation
    }

    showMessage(text, duration = 2000) {
        // 기존 메시지 제거
        const existingMsg = document.getElementById('temp-message');
        if (existingMsg) existingMsg.remove();
        
        const message = document.createElement('div');
        message.id = 'temp-message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(message);
        
        // 페이드 인
        setTimeout(() => {
            message.style.opacity = '1';
        }, 10);
        
        // 페이드 아웃 및 제거
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, duration);
    }

    createPinchStartEffect(handIndex, gestureInfo) {
        if (!gestureInfo.pinchPosition) {
            console.error('핀치 위치가 없습니다!');
            return;
        }
        
        // 3D 좌표로 변환
        const worldPos = this.convertToWorldPosition(gestureInfo.pinchPosition, handIndex);
        
        console.log(`핀치 이펙트 생성 - Hand ${handIndex}`);
        console.log(`정규화 좌표: x=${gestureInfo.pinchPosition.x}, y=${gestureInfo.pinchPosition.y}`);
        console.log(`월드 좌표: x=${worldPos.x.toFixed(2)}, y=${worldPos.y.toFixed(2)}, z=${worldPos.z.toFixed(2)}`);
        
        // 메인 이펙트 그룹
        const effectGroup = new THREE.Group();
        effectGroup.position.copy(worldPos);
        
        // 1. 작은 중심 글로우 구체 (1/5 크기)
        const glowGeometry = new THREE.SphereGeometry(0.06, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: handIndex === 0 ? 0x00aaff : 0xff4444,
            transparent: true,
            opacity: 1.0
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        effectGroup.add(glowSphere);
        
        // 2. 포인트 라이트 (강도도 줄임)
        const pointLight = new THREE.PointLight(
            handIndex === 0 ? 0x00aaff : 0xff4444,
            1,
            2
        );
        effectGroup.add(pointLight);
        
        // 3. 확장 링 이펙트
        this.createExpandingRings(effectGroup, handIndex);
        
        // 4. 파티클 버스트
        this.createParticleBurst(effectGroup, handIndex);
        
        // 씬에 추가
        this.scene.add(effectGroup);
        console.log('이펙트 그룹이 씬에 추가됨');
        
        // 이펙트 애니메이션
        this.animatePinchEffect(effectGroup, glowSphere, pointLight);
        
        // 사운드 이펙트
        this.playPinchSound(gestureInfo.pinchStrength);
    }

    createExpandingRings(parentGroup, handIndex) {
        const ringCount = 3;
        const baseColor = handIndex === 0 ? 0x00aaff : 0xff4444;
        
        for (let i = 0; i < ringCount; i++) {
            const ringGeometry = new THREE.RingGeometry(0.02, 0.04, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: baseColor,
                transparent: true,
                opacity: 1.0 - i * 0.2,
                side: THREE.DoubleSide,
                emissive: baseColor,
                emissiveIntensity: 1
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.lookAt(this.camera.position);
            
            // 시간차 확장 애니메이션 (1/5 크기)
            gsap.to(ring.scale, {
                x: 1 + i * 0.4,
                y: 1 + i * 0.4,
                z: 1,
                duration: 1.0,
                delay: i * 0.1,
                ease: "power2.out"
            });
            
            gsap.to(ring.material, {
                opacity: 0,
                duration: 1.0,
                delay: i * 0.1,
                ease: "power2.out",
                onComplete: () => {
                    parentGroup.remove(ring);
                    ring.geometry.dispose();
                    ring.material.dispose();
                }
            });
            
            parentGroup.add(ring);
        }
    }

    createParticleBurst(parentGroup, handIndex) {
        const particleCount = 30;
        const baseColor = handIndex === 0 ? 0x00aaff : 0xff4444;
        
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.004, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: baseColor,
                transparent: true,
                opacity: 1,
                emissive: baseColor,
                emissiveIntensity: 2
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // 랜덤 방향 벡터 (속도도 줄임)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 0.06 + Math.random() * 0.06;
            
            const velocity = new THREE.Vector3(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed,
                Math.cos(phi) * speed
            );
            
            particle.userData = { velocity: velocity };
            parentGroup.add(particle);
            
            // 파티클 애니메이션
            this.animateParticle(particle, parentGroup);
        }
    }

    animateParticle(particle, parentGroup) {
        const animate = () => {
            if (!particle.parent) return;
            
            // 위치 업데이트
            particle.position.add(particle.userData.velocity);
            
            // 중력 효과 (줄임)
            particle.userData.velocity.y -= 0.001;
            
            // 페이드 아웃
            particle.material.opacity -= 0.02;
            
            if (particle.material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                parentGroup.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            }
        };
        
        animate();
    }

    animatePinchEffect(effectGroup, glowSphere, pointLight) {
        // 글로우 구체 펄스 애니메이션 (작은 스케일)
        gsap.to(glowSphere.scale, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });
        
        // 포인트 라이트 강도 애니메이션
        if (pointLight) {
            gsap.to(pointLight, {
                intensity: 0,
                duration: 1,
                ease: "power2.out"
            });
        }
        
        // 전체 그룹 페이드 아웃
        setTimeout(() => {
            const fadeOut = () => {
                effectGroup.children.forEach(child => {
                    if (child.material && child.material.opacity > 0) {
                        child.material.opacity -= 0.05;
                    }
                });
                
                if (effectGroup.children.some(child => child.material && child.material.opacity > 0)) {
                    requestAnimationFrame(fadeOut);
                } else {
                    this.scene.remove(effectGroup);
                    this.cleanupGroup(effectGroup);
                }
            };
            
            fadeOut();
        }, 1000);
    }

    showDebugMarker(normalizedPosition, handIndex) {
        // 화면상에 핀치 위치 표시 (디버깅용)
        const marker = document.createElement('div');
        marker.style.cssText = `
            position: fixed;
            left: ${normalizedPosition.x * window.innerWidth}px;
            top: ${normalizedPosition.y * window.innerHeight}px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${handIndex === 0 ? '#00aaff' : '#ff4444'};
            border: 2px solid white;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(marker);
        
        // 1초 후 제거
        setTimeout(() => {
            document.body.removeChild(marker);
        }, 1000);
    }

    createHapticFeedback(handIndex) {
        // 화면 가장자리에 시각적 피드백
        const feedbackDiv = document.createElement('div');
        feedbackDiv.style.cssText = `
            position: fixed;
            ${handIndex === 0 ? 'left' : 'right'}: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 5px;
            height: 100px;
            background: ${handIndex === 0 ? '#00aaff' : '#ff4444'};
            opacity: 0;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(feedbackDiv);
        
        // 플래시 애니메이션
        gsap.to(feedbackDiv, {
            opacity: 0.8,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                document.body.removeChild(feedbackDiv);
            }
        });
    }

    updateContinuousPinchEffect(handIndex, gestureInfo, landmarks) {
        if (!gestureInfo.pinchPosition) return;
        
        // 3D 좌표로 변환
        const worldPos = this.convertToWorldPosition(gestureInfo.pinchPosition, handIndex);
        
        // 작은 글로우 효과 (1/5 크기)
        const glowGeometry = new THREE.SphereGeometry(0.02 * gestureInfo.pinchStrength, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: handIndex === 0 ? 0x00aaff : 0xff4444,
            transparent: true,
            opacity: gestureInfo.pinchStrength * 0.5,
            emissive: handIndex === 0 ? 0x00aaff : 0xff4444,
            emissiveIntensity: 1
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(worldPos);
        
        this.scene.add(glow);
        
        // 빠른 페이드 아웃
        setTimeout(() => {
            this.scene.remove(glow);
            glow.geometry.dispose();
            glow.material.dispose();
        }, 100);
    }

    playPinchSound(strength) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 강도에 따른 주파수 변화
            const baseFreq = 600;
            const targetFreq = baseFreq + (strength * 400);
            
            oscillator.frequency.setValueAtTime(targetFreq, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1 * strength, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('오디오 재생 실패:', error);
        }
    }

    cleanupGroup(group) {
        group.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (event) => {
            if (this.isExpanded) {
                this.resetView();
            }
        });
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'r' || event.key === 'R') {
                this.resetView();
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 핀치 상태에 따른 UI 업데이트
        this.updatePinchIndicators();
        
        this.renderer.render(this.scene, this.camera);
    }

    updatePinchIndicators() {
        // 양손의 핀치 상태를 화면에 표시
        const leftIndicator = document.getElementById('left-hand-indicator');
        const rightIndicator = document.getElementById('right-hand-indicator');
        
        if (!leftIndicator || !rightIndicator) {
            // 인디케이터 생성
            this.createHandIndicators();
            return;
        }
        
        // 왼손 상태
        if (this.handStates[0].isVisible) {
            leftIndicator.style.display = 'block';
            leftIndicator.style.opacity = this.handStates[0].isPinching ? '1' : '0.3';
            leftIndicator.style.transform = `scale(${1 + this.handStates[0].pinchStrength * 0.5})`;
        } else {
            leftIndicator.style.display = 'none';
        }
        
        // 오른손 상태
        if (this.handStates[1].isVisible) {
            rightIndicator.style.display = 'block';
            rightIndicator.style.opacity = this.handStates[1].isPinching ? '1' : '0.3';
            rightIndicator.style.transform = `scale(${1 + this.handStates[1].pinchStrength * 0.5})`;
        } else {
            rightIndicator.style.display = 'none';
        }

        // 줌 상태 표시 (_28 모델일 때만)
        if (this.isZoomed && this.isTwoHandsPinching) {
            const zoomIndicator = document.getElementById('zoom-indicator');
            if (!zoomIndicator) {
                const indicator = document.createElement('div');
                indicator.id = 'zoom-indicator';
                indicator.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 24px;
                    color: white;
                    background: rgba(0,0,0,0.7);
                    padding: 10px 20px;
                    border-radius: 20px;
                    pointer-events: none;
                    z-index: 1000;
                `;
                document.body.appendChild(indicator);
            }
            
            const zoomPercent = Math.round(this.currentZoom * 100);
            document.getElementById('zoom-indicator').textContent = `줌: ${zoomPercent}%`;
        } else {
            const zoomIndicator = document.getElementById('zoom-indicator');
            if (zoomIndicator) {
                zoomIndicator.remove();
            }
        }
        // 현재 모드 표시
        const modeIndicator = document.getElementById('mode-indicator');
        if (!modeIndicator) {
            const indicator = document.createElement('div');
            indicator.id = 'mode-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 5px 15px;
                border-radius: 15px;
                font-size: 14px;
                z-index: 100;
            `;
            document.body.appendChild(indicator);
        }
        
        const indicator = document.getElementById('mode-indicator');
        if (indicator) {
            if (this.isZoomed) {
                indicator.textContent = `${this.currentDirection.toUpperCase()}_28 모드`;
                indicator.style.borderColor = '#ffff00';
            } else if (this.currentDirection !== 'center') {
                indicator.textContent = `${this.currentDirection.toUpperCase()} 모드`;
                indicator.style.borderColor = '#ffffff';
            } else {
                indicator.textContent = '중앙 모드';
                indicator.style.borderColor = '#808080';
            }
        }

        // _28 모델 상태 표시
        if (this.isZoomed) {
            const controlsInfo = document.getElementById('controls-info');
            if (!controlsInfo) {
                const info = document.createElement('div');
                info.id = 'controls-info';
                info.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    text-align: center;
                    z-index: 100;
                `;
                info.innerHTML = `
                    <div>👆 핀치 드래그: 이동 | 👊 양손 주먹: 줌 | ✌️ V: 돌아가기</div>
                `;
                document.body.appendChild(info);
            }
        } else {
            const controlsInfo = document.getElementById('controls-info');
            if (controlsInfo) controlsInfo.remove();
        }
    }

    createHandIndicators() {
        // 왼손 인디케이터
        const leftIndicator = document.createElement('div');
        leftIndicator.id = 'left-hand-indicator';
        leftIndicator.innerHTML = '✋';
        leftIndicator.style.cssText = `
            position: fixed;
            left: 20px;
            bottom: 20px;
            font-size: 40px;
            color: #00aaff;
            opacity: 0.3;
            transition: all 0.2s ease;
            user-select: none;
            pointer-events: none;
            z-index: 100;
        `;
        
        // 오른손 인디케이터
        const rightIndicator = document.createElement('div');
        rightIndicator.id = 'right-hand-indicator';
        rightIndicator.innerHTML = '✋';
        rightIndicator.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            font-size: 40px;
            color: #ff4444;
            opacity: 0.3;
            transition: all 0.2s ease;
            user-select: none;
            pointer-events: none;
            z-index: 100;
            transform: scaleX(-1);
        `;
        
        document.body.appendChild(leftIndicator);
        document.body.appendChild(rightIndicator);
    }

    resetView() {
        console.log('뷰 리셋 시작');
        
        this.isExpanded = false;
        this.selectedSeason = null;
        this.selectedConstellation = null;
        this.isZoomed = false;
        this.zoomedDirection = null;
        document.getElementById('interaction-mode').textContent = 'waiting';
        document.getElementById('selected-season').textContent = '없음';
        
        // 중앙 모델로 복귀
        this.switchModel('center');
        
        // 카메라를 초기 위치로 완전히 복원
        gsap.to(this.camera.position, {
            x: this.initialCameraPosition.x,
            y: this.initialCameraPosition.y,
            z: this.initialCameraPosition.z,
            duration: 1.5,
            ease: "power2.out"
        });
        
        // 카메라 회전도 초기화
        gsap.to(this.camera.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.5,
            ease: "power2.out"
        });
        
        document.getElementById('status').textContent = '리셋 완료! 손을 카메라 앞에 위치시키세요.';
    }

    createQuadrantGuide() {
    // 화면 4분할 가이드 오버레이
        const guide = document.createElement('div');
        guide.id = 'quadrant-guide';
        guide.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        
        // 각 사분면 라벨 - 대각선 위치로 변경
        const quadrants = [
            { position: 'top: 10%; left: 10%;', text: 'EAST (동): 봄', color: '#4ae24a' },      // 좌상단
            { position: 'top: 10%; right: 10%;', text: 'NORTH (북): 겨울', color: '#e24a4a' },  // 우상단
            { position: 'bottom: 10%; right: 10%;', text: 'WEST (서): 가을', color: '#4a90e2' }, // 우하단
            { position: 'bottom: 10%; left: 10%;', text: 'SOUTH (남): 여름', color: '#e2a54a' }  // 좌하단
        ];
        
        quadrants.forEach(q => {
            const label = document.createElement('div');
            label.style.cssText = `
                position: absolute;
                ${q.position}
                color: ${q.color};
                font-size: 16px;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                opacity: 0.8;
                background: rgba(0,0,0,0.5);
                padding: 5px 10px;
                border-radius: 5px;
            `;
            label.textContent = q.text;
            guide.appendChild(label);
        });
        
        // X자 대각선 (빨간색)
        const diagonal1 = document.createElement('div');
        diagonal1.style.cssText = `
            position: absolute;
            top: 0;
            left: 50%;
            width: 2px;
            height: 141.42%; /* sqrt(2) * 100% */
            background: rgba(255, 0, 0, 0.5);
            transform: translate(-50%, -20.71%) rotate(45deg);
            transform-origin: center;
        `;
        guide.appendChild(diagonal1);
        
        const diagonal2 = document.createElement('div');
        diagonal2.style.cssText = `
            position: absolute;
            top: 0;
            left: 50%;
            width: 2px;
            height: 141.42%;
            background: rgba(255, 0, 0, 0.5);
            transform: translate(-50%, -20.71%) rotate(-45deg);
            transform-origin: center;
        `;
        guide.appendChild(diagonal2);
        
        document.body.appendChild(guide);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 애플리케이션 시작
window.addEventListener('load', () => {
    window.constellationApp = new ConstellationExperience();
    window.constellationApp.init();
});