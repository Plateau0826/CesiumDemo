<template>
    <div class="dashboard">
        <header class="dash-header">
            <div class="dash-header__brand">
                <span class="dash-header__icon" aria-hidden="true" />
                <div>
                    <h1 class="dash-header__title">小区强降雨内涝风险态势</h1>
                    <p class="dash-header__sub">演示场景 · 示意数据 · 非实测预报</p>
                </div>
            </div>
            <div class="dash-header__tag">实时态势</div>
        </header>

        <div class="dash-body">
            <aside class="dash-col dash-col--left">
                <section class="card">
                    <h2 class="card__title">
                        <span class="card__dot" />风险概览
                    </h2>
                    <div class="stat-grid">
                        <div class="stat-cell">
                            <span class="stat-cell__label">当前水位海拔</span>
                            <span class="stat-cell__value accent">{{ currentWaterElevation.toFixed(2) }}<small>m</small></span>
                        </div>
                        <div class="stat-cell">
                            <span class="stat-cell__label">建筑总数</span>
                            <span class="stat-cell__value">{{ totalBuildingCount }}</span>
                        </div>
                        <div class="stat-cell">
                            <span class="stat-cell__label">安全</span>
                            <span class="stat-cell__value ok">{{ safeBuildingCount }}</span>
                        </div>
                        <div class="stat-cell">
                            <span class="stat-cell__label">预警</span>
                            <span class="stat-cell__value warning">{{ warningBuildingCount }}</span>
                        </div>
                        <div class="stat-cell stat-cell--wide">
                            <span class="stat-cell__label">受灾（红色）</span>
                            <span class="stat-cell__value danger">{{ disasterBuildingCount }}</span>
                        </div>
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">
                        <span class="card__dot" />内涝水深趋势（示意）
                    </h2>
                    <div class="spark-wrap">
                        <div class="spark-y">水深</div>
                        <div class="spark-chart" :style="sparkStyle" />
                        <div class="spark-x">0h —— 24h（相对演示）</div>
                    </div>
                </section>

              

                <section class="card">
                    <h2 class="card__title">
                        <span class="card__dot" />情景推演
                    </h2>
                    <div class="row row--tight">
                        <span>水位调节</span>
                        <span class="val">{{ waterRank.toFixed(0) }} m</span>
                    </div>
                    <input type="range" min="0" max="60" step="1" v-model.number="waterRank" class="range-accent" />
                    <div class="btns">
                        <button type="button" class="btn-primary" @click="toggleSituationPlay">
                            {{ situationPlaying ? '暂停' : '播放' }}
                        </button>
                        <button type="button" class="btn-ghost" @click="resetSituation">重置</button>
                    </div>
                </section>

              
            </aside>

            <main class="dash-map">
                <div id="cesiumContainer" class="cesium-host" />
                <div class="map-legend">
                    <span class="map-legend__title">建筑风险</span>
                    <span class="map-legend__item"><i class="dot dot--ok" />正常</span>
                    <span class="map-legend__item"><i class="dot dot--warn" />预警</span>
                    <span class="map-legend__item"><i class="dot dot--danger" />受灾</span>
                </div>
                <div class="map-strip">
                    <span class="map-strip__label">示意指标</span>
                    <span class="map-strip__pill">汇水区水位 <strong>{{ currentWaterElevation.toFixed(1) }} m</strong></span>
                    <span class="map-strip__pill">强降雨覆盖 <strong>{{ weatherIntensity.toFixed(0) }}%</strong></span>
                    <span class="map-strip__pill">红色楼栋 <strong>{{ disasterBuildingCount }}</strong></span>
                </div>
            </main>

            <aside class="dash-col dash-col--right">
                <section class="card">
                    <h2 class="card__title">
                        <span class="card__dot" />降雨预报（示意）
                    </h2>
                    <ul class="forecast">
                        <li v-for="(d, i) in forecastDemo" :key="i" class="forecast__row">
                            <span class="forecast__day">{{ d.day }}</span>
                            <span class="forecast__icon" :class="'forecast__icon--' + d.type">{{ d.icon }}</span>
                            <span class="forecast__temp">{{ d.temp }}</span>
                        </li>
                    </ul>
                </section>

                <section class="card">
                    <h2 class="card__title">
                        <span class="card__dot" />监测与泵站（示意）
                    </h2>
                    <ul class="equip-list">
                        <li class="equip-list__row">
                            <span class="equip-list__name">雨量站</span>
                            <span class="equip-list__status ok">在线 {{ equipRainOnline }}/10</span>
                        </li>
                        <li class="equip-list__row">
                            <span class="equip-list__name">电子水位计</span>
                            <span class="equip-list__status ok">在线 {{ equipLevelOnline }}/8</span>
                        </li>
                        <li class="equip-list__row">
                            <span class="equip-list__name">排涝泵站</span>
                            <span :class="['equip-list__status', pumpStatusClass]">{{ pumpStatusText }}</span>
                        </li>
                    </ul>
                    <div class="online-bar">
                        <div class="online-bar__track">
                            <div class="online-bar__fill" :style="{ width: equipmentOnlineRate + '%' }" />
                        </div>
                        <span class="online-bar__label">设备在线率 {{ equipmentOnlineRate.toFixed(0) }}%</span>
                    </div>
                </section>

                <section class="card card--grow">
                    <h2 class="card__title">
                        <span class="card__dot" />风险告警
                    </h2>
                    <ul class="alert-list">
                        <li v-for="(a, idx) in riskAlerts" :key="idx" :class="['alert-list__item', 'alert-list__item--' + a.level]">
                            <span class="alert-list__dot" />
                            <div class="alert-list__body">
                                <div class="alert-list__title">{{ a.title }}</div>
                                <div class="alert-list__meta">{{ a.time }} · {{ a.desc }}</div>
                            </div>
                        </li>
                    </ul>
                </section>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import { onMounted, shallowRef, onUnmounted, ref, computed } from 'vue';



Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMTM4YzM3NC02ZDQ0LTQwODItOTM3Yi05NzI3NzkwMzRjYWEiLCJpZCI6NDA2NDI1LCJpYXQiOjE3NzM5NzAwMTB9.9-lwr3Tc055SuJTNoofqB0VMncZgd61HOU_TTUQKhSU';

// 使用 shallowRef 避免 Vue 对 Cesium 实例进行深度响应式追踪（性能优化）
const viewerRef = shallowRef<Cesium.Viewer | null>(null);
const situationPlaying = ref(false);
const pointtest = { lon: 117.273426, lat: 31.877276, height: 0 }
let situationPlayTimer: ReturnType<typeof setInterval> | null = null;
const waterLevel = ref(0);
const buildingStats = ref<Array<{ gHeight: number; bHeight: number }>>([]);
const weatherAutoByWater = ref(true);
const weatherManualIntensity = ref(60);
const weatherIntensity = computed(() =>
    weatherAutoByWater.value ? waterLevel.value : weatherManualIntensity.value
);

function classifyBuildingByWater(
    currentWater: number,
    groundHeight: number,
    buildingHeight: number
) {
    const floodedDepth = currentWater - groundHeight;
    const heightPercent = floodedDepth / buildingHeight;
    if (floodedDepth <= 0.2) return 'safe';
    if (heightPercent <= 0.8) return 'warning';
    return 'danger';
}

const currentWaterElevation = computed(() => waterLevel.value);
const warningBuildingCount = computed(() =>
    buildingStats.value.reduce((acc, item) => {
        return acc + (classifyBuildingByWater(waterLevel.value, item.gHeight, item.bHeight) === 'warning' ? 1 : 0);
    }, 0)
);
const disasterBuildingCount = computed(() =>
    buildingStats.value.reduce((acc, item) => {
        return acc + (classifyBuildingByWater(waterLevel.value, item.gHeight, item.bHeight) === 'danger' ? 1 : 0);
    }, 0)
);

const waterRank = computed({
    get: () => waterLevel.value,
    set: (v: number) => {
        stopSituationPlay();
        waterLevel.value = v;
    }
});

const totalBuildingCount = computed(() => buildingStats.value.length);
const safeBuildingCount = computed(() =>
    buildingStats.value.reduce((acc, item) => {
        return acc + (classifyBuildingByWater(waterLevel.value, item.gHeight, item.bHeight) === 'safe' ? 1 : 0);
    }, 0),
);

const sparkStyle = computed(() => {
    const t = Cesium.Math.clamp(waterLevel.value / 60, 0, 1);
    const h = 28 + t * 62;
    return {
        background: `linear-gradient(180deg, transparent ${100 - h}%, rgba(43, 140, 255, 0.25) ${100 - h}%, rgba(56, 189, 248, 0.75) 100%)`,
    };
});

const forecastDemo = [
    { day: '今日', icon: '雨', type: 'rain', temp: '22~28℃' },
    { day: '明日', icon: '阴', type: 'cloud', temp: '21~27℃' },
    { day: '后天', icon: '多云', type: 'cloud', temp: '20~26℃' },
] as const;

const equipmentOnlineRate = computed(() => {
    const stress = Cesium.Math.clamp(weatherIntensity.value / 100, 0, 1);
    return 96 - stress * 18;
});

const equipRainOnline = computed(() => {
    const stress = Cesium.Math.clamp(weatherIntensity.value / 100, 0, 1);
    return Math.min(10, 7 + Math.round((1 - stress) * 3));
});

const equipLevelOnline = computed(() => {
    const stress = Cesium.Math.clamp(weatherIntensity.value / 100, 0, 1);
    return Math.min(8, 6 + Math.round((1 - stress) * 2));
});

const pumpStatusText = computed(() => {
    if (weatherIntensity.value > 70 || waterLevel.value > 40) return '强排运行';
    if (weatherIntensity.value > 35 || waterLevel.value > 20) return '间歇运行';
    return '待机';
});

const pumpStatusClass = computed(() => {
    if (weatherIntensity.value > 70 || waterLevel.value > 40) return 'warn';
    if (weatherIntensity.value > 35 || waterLevel.value > 20) return 'ok';
    return 'muted';
});

const riskAlerts = computed(() => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const list: Array<{ level: string; title: string; time: string; desc: string }> = [];

    if (disasterBuildingCount.value > 0) {
        list.push({
            level: 'danger',
            title: '重度内涝风险',
            time: timeStr,
            desc: `${disasterBuildingCount.value} 栋建筑淹没超过阈值（示意）`,
        });
    }
    if (warningBuildingCount.value > 0) {
        list.push({
            level: 'warning',
            title: '内涝深度上升',
            time: timeStr,
            desc: `${warningBuildingCount.value} 栋处于黄色预警`,
        });
    }
    if (waterLevel.value > 35) {
        list.push({
            level: 'warning',
            title: '汇水区水位偏高',
            time: timeStr,
            desc: '建议加强强排与重点路段巡查（示意）',
        });
    }
    if (weatherIntensity.value > 75) {
        list.push({
            level: 'warning',
            title: '强降雨持续',
            time: timeStr,
            desc: '降雨强度偏高，请关注低洼区域（示意）',
        });
    }
    if (list.length === 0) {
        list.push({
            level: 'ok',
            title: '态势平稳',
            time: timeStr,
            desc: '当前无明显内涝告警（演示数据）',
        });
    }
    return list.slice(0, 6);
});

const fenceDegrees = [
    117.273126, 31.876976, // 西南 (经度减, 纬度减)
    117.281726, 31.876976, // 东南 (经度加, 纬度减)
    117.281726, 31.882076, // 东北 (经度加, 纬度加)
    117.273126, 31.882076, // 西北 (经度减, 纬度加)
    117.273126, 31.876976  // 闭合
];
let fenceTime = 0.0;
let weatherTime = 0.0;
let removePreRenderListener: (() => void) | null = null;
let clickHandler: Cesium.ScreenSpaceEventHandler | null = null;
let darkMaskLayer: Cesium.ImageryLayer | null = null;
let weatherStage: Cesium.PostProcessStage | null = null;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function waitForTerrainReady(
    viewer: Cesium.Viewer,
    maxAttempts = 22,
    intervalMs = 220
) {
    // 多帧让 WebGL / 地形队列先跑起来
    for (let f = 0; f < 3; f++) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }

    // 多个探针：中心 + 建筑网格四角，避免单点碰巧无瓦片
    const probes = [
        Cesium.Cartographic.fromDegrees(pointtest.lon, pointtest.lat),
        Cesium.Cartographic.fromDegrees(pointtest.lon, pointtest.lat + 9 * 0.0005),
        Cesium.Cartographic.fromDegrees(pointtest.lon + 16 * 0.0005, pointtest.lat),
        Cesium.Cartographic.fromDegrees(pointtest.lon + 16 * 0.0005, pointtest.lat + 9 * 0.0005),
    ];

    for (let i = 0; i < maxAttempts; i++) {
        try {
            const sampled = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, probes);
            const ok = sampled.every(
                (c) => c.height != null && Number.isFinite(c.height),
            );
            if (ok) return;
        } catch {
            /* 重试 */
        }
        await sleep(intervalMs);
    }
    throw new Error('地形尚未就绪：超过最大重试次数');
}

/** 首次失败后延迟重试生成建筑（避免瓦片尚未到位） */
async function retryCreateNeighborhoodWhenReady(viewer: Cesium.Viewer, rounds: number) {
    for (let round = 0; round < rounds; round++) {
        await sleep(900 + round * 700);
        if (buildingStats.value.length > 0) return;
        try {
            await waitForTerrainReady(viewer, 15, 260);
            await createSimpleNeighborhood(viewer);
            if (buildingStats.value.length > 0) return;
        } catch {
            /* 下一轮 */
        }
    }
}

/** 分批采样 + 重试；失败格点用 sampleTerrain 粗采样兜底 */
async function sampleHeightsBatched(
    viewer: Cesium.Viewer,
    cartographics: Cesium.Cartographic[],
    batchSize = 45,
    batchRetries = 4,
): Promise<Cesium.Cartographic[]> {
    const provider = viewer.terrainProvider;
    const out: Cesium.Cartographic[] = [];

    for (let start = 0; start < cartographics.length; start += batchSize) {
        const slice = cartographics.slice(start, start + batchSize);
        let batch: Cesium.Cartographic[] | null = null;

        for (let r = 0; r < batchRetries; r++) {
            try {
                batch = await Cesium.sampleTerrainMostDetailed(provider, slice);
                const allValid = batch.every(
                    (c) => c.height != null && Number.isFinite(c.height),
                );
                if (allValid) break;
            } catch {
                batch = null;
            }
            await sleep(200 + r * 120);
        }

        if (batch && batch.every((c) => c.height != null && Number.isFinite(c.height))) {
            out.push(...batch);
            continue;
        }

        // 兜底：较低精度但更容易成功
        try {
            const fallback = await Cesium.sampleTerrain(provider, 11, slice);
            out.push(...fallback);
        } catch {
            for (const c of slice) {
                const copy = Cesium.Cartographic.clone(c);
                copy.height = copy.height ?? 0;
                out.push(copy);
            }
        }
    }

    return out;
}

const initCesium = async () => {
    // 声明一个窗口
    const viewer = new Cesium.Viewer("cesiumContainer", {
        terrain: await Cesium.Terrain.fromWorldTerrain({
            requestWaterMask: true,      // 识别水域（为后面做水面做准备）
            requestVertexNormals: true   // 开启光照，让山脊和河岸有阴影
        }),
        baseLayerPicker: false,       // 建议关闭，防止用户切换掉地形
        animation: false,        // 左下角动画控件
  timeline: false,         // 时间轴

  geocoder: false,         // 搜索框
  homeButton: false,       // home按钮
  sceneModePicker: false,  // 2D/3D切换
  navigationHelpButton: false, // 帮助按钮
  fullscreenButton: false, // 全屏按钮
  infoBox: false,          // 信息框（如果你不用）
  selectionIndicator: false // 选中标识
    });
    viewerRef.value = viewer;
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // 先对准演示区，促使该区域地形瓦片优先加载（再采样更稳）
    try {
        const target = Cesium.Cartesian3.fromDegrees(117.277214, 31.877036, 400);
        const cameraOffset = new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(-45),
            1000,
        );
        viewer.camera.lookAt(target, cameraOffset);
    } catch {
        /* ignore */
    }
    await sleep(400);

    try {
        await waitForTerrainReady(viewer);
        await createSimpleNeighborhood(viewer);
    } catch (error) {
        console.warn('地形就绪检查失败，稍后重试建筑生成:', error);
        void retryCreateNeighborhoodWhenReady(viewer, 3);
    }
    addElectronicFence(viewer);
    addGlobalDarkMask(viewer);
    addWaterLevel(viewer);
    addWeatherEffect(viewer);
}

function toggleSituationPlay() {
    if (situationPlaying.value) {
        stopSituationPlay();
        return;
    }
    situationPlaying.value = true;
    situationPlayTimer = setInterval(() => {
        waterLevel.value += 0.5;
        if (waterLevel.value >= 60) {
            stopSituationPlay();
        }
    }, 120);
}

function resetSituation() {
    stopSituationPlay();
    waterLevel.value = 0;
}

function stopSituationPlay() {
    if (situationPlayTimer != null) {
        clearInterval(situationPlayTimer);
        situationPlayTimer = null;
    }
    situationPlaying.value = false;
}

// 1) 注册一个自定义材质：竖向扫描线（下 -> 上）
const DYNAMIC_FENCE_TYPE = 'DynamicFence';
class DynamicFenceMaterialProperty {
    private _definitionChanged = new Cesium.Event();
    color: Cesium.Color;
    speed: number;
    lineWidth: number;
    glow: number;

    constructor(options: { color: Cesium.Color; speed: number; lineWidth: number; glow: number }) {
        this.color = options.color;
        this.speed = options.speed;
        this.lineWidth = options.lineWidth;
        this.glow = options.glow;
    }

    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(_time: Cesium.JulianDate) {
        return DYNAMIC_FENCE_TYPE;
    }

    getValue(_time: Cesium.JulianDate, result?: Record<string, unknown>) {
        const out = result ?? {};
        out.color = this.color;
        out.time = fenceTime;
        out.speed = this.speed;
        out.lineWidth = this.lineWidth;
        out.glow = this.glow;
        return out;
    }

    equals(other: unknown) {
        return this === other;
    }
}



function registerFenceMaterial() {
    const materialAny = Cesium.Material as unknown as {
        DynamicFenceRegistered?: boolean;
        _materialCache: {
            addMaterial: (type: string, config: unknown) => void;
        };
    };
    if (materialAny.DynamicFenceRegistered) return; // 防止重复注册
    materialAny.DynamicFenceRegistered = true;

    const source = `
        uniform vec4 color;
        uniform float time;
        uniform float speed;
        uniform float lineWidth;
        uniform float glow;
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            // st.t: 0(底部) -> 1(顶部)
            float t = fract(st.t - time * speed);
            // 扫描线：在 t 接近 1.0 时最亮
            float scan = smoothstep(1.0 - lineWidth, 1.0, t);
            // 轻微底色渐变（底部更暗，顶部更亮）
            float baseGrad = mix(0.35, 0.75, st.t);
            vec3 base = color.rgb * baseGrad;
            vec3 glowColor = color.rgb * (1.0 + glow) * scan;
            material.diffuse = base + glowColor;
            material.alpha = max(color.a * 0.35, color.a * (0.25 + scan * 0.9));
            return material;
        }
    `;
    materialAny._materialCache.addMaterial(DYNAMIC_FENCE_TYPE, {
        fabric: {
            type: DYNAMIC_FENCE_TYPE,
            uniforms: {
                color: Cesium.Color.CYAN.withAlpha(0.65),
                time: 0.0,
                speed: 1.9,     // 流光速度
                lineWidth: 0.12, // 扫描线宽度
                glow: 1.2        // 发光强度
            },
            source
        },
        translucent: () => true
    });
}

// 2) 添加电子围栏（用 Entity + wall，不再用 WallGeometry）
const addElectronicFence = (viewer: Cesium.Viewer) => {
    registerFenceMaterial();
    // 你原来的 fenceDegrees 是经纬度数组，这里先转 Cartesian3
    const positions = Cesium.Cartesian3.fromDegreesArray(fenceDegrees);
    // 估算顶高（相对地面）
    const fenceHeight = 100.0; // 可调：围栏高度
    const minHeights = new Array(positions.length).fill(0.5); // 略抬高避免贴地闪烁
    const maxHeights = new Array(positions.length).fill(fenceHeight);
    const dynamicMaterial = new DynamicFenceMaterialProperty({
        color: Cesium.Color.fromCssColorString('#39e5ff').withAlpha(0.75),
        speed: 0.5,
        lineWidth: 0.5,
        glow: 1.4
    });
    // 围栏墙体
    viewer.entities.add({
        name: '电子围栏-动态扫描',
        wall: {
            positions,
            minimumHeights: minHeights,
            maximumHeights: maxHeights,
            material: dynamicMaterial as unknown as Cesium.MaterialProperty,
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString('#76f2ff'),
            outlineWidth: 10
        }
    });
    // 顶部线，增强科技感
    viewer.entities.add({
        name: '电子围栏-顶部线',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                117.273126, 31.876976, fenceHeight,
                117.281726, 31.876976, fenceHeight,
                117.281726, 31.882076, fenceHeight,
                117.273126, 31.882076, fenceHeight,
                117.273126, 31.876976, fenceHeight
            ]),
            width: 5,
            material: Cesium.Color.fromCssColorString('#8cf7ff').withAlpha(0.9)
        }
    });
    // 每帧更新时间，让扫描线上移
    const preRenderCallback = () => {
        fenceTime += 0.013; // 约 60fps 步进
        weatherTime += 0.01;
        if (weatherStage) {
            const uniforms = weatherStage.uniforms as unknown as {
                u_time: number;
                u_rainIntensity: number;
            };
            uniforms.u_time = weatherTime;
            uniforms.u_rainIntensity = Cesium.Math.clamp(weatherIntensity.value / 100, 0, 1);
        }
    };
    viewer.scene.preRender.addEventListener(preRenderCallback);
    // 保存移除函数，组件卸载时调用
    removePreRenderListener = () => {
        viewer.scene.preRender.removeEventListener(preRenderCallback);
    };
};


const createSimpleNeighborhood = async (viewer: Cesium.Viewer) => {
    if (!viewer.terrainProvider) {
        console.error("地形尚未加载，无法计算建筑高度");
        return;
    }

    // 重试时先清掉旧楼栋，避免重复 Entity
    const existing = viewer.entities.values;
    const removeList: Cesium.Entity[] = [];
    for (let i = 0; i < existing.length; i++) {
        const e = existing[i];
        if (e?.name?.startsWith('楼栋-')) removeList.push(e);
    }
    removeList.forEach((e) => viewer.entities.remove(e));

    const pointData: { lon: number; lat: number; bHeight: number }[] = [];
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 10; j++) {
            const lon = pointtest.lon + i * 0.0005;
            const lat = pointtest.lat + j * 0.0005;
            pointData.push({ lon, lat, bHeight: 50 + Math.random() * 20 });
        }
    }

    const cartographics = pointData.map((p) => Cesium.Cartographic.fromDegrees(p.lon, p.lat));

    try {
        const updatedPositions = await sampleHeightsBatched(viewer, cartographics);
        buildingStats.value = [];

        updatedPositions.forEach((pos, index) => {
            const data = pointData[index];
            const rawH = pos.height;
            const gHeight =
                rawH != null && Number.isFinite(rawH) ? rawH : 0;
            const bHeight = data?.bHeight ?? 0;
            buildingStats.value.push({ gHeight, bHeight });

            viewer.entities.add({
                name: `楼栋-${index}`,
                position: Cesium.Cartesian3.fromDegrees(
                    data?.lon ?? 0,
                    data?.lat ?? 0,
                    gHeight + bHeight / 2,
                ),
                box: {
                    dimensions: new Cesium.Cartesian3(20, 20, bHeight),
                    material: new Cesium.ColorMaterialProperty(
                        new Cesium.CallbackProperty(() => {
                            const currentWater = waterLevel.value;
                            const level = classifyBuildingByWater(currentWater, gHeight, bHeight);
                            if (level === 'safe') return Cesium.Color.CYAN.withAlpha(0.6);
                            if (level === 'warning') return Cesium.Color.YELLOW.withAlpha(0.7);
                            return Cesium.Color.RED.withAlpha(0.8);
                        }, false),
                    ),
                    outline: true,
                    outlineColor: Cesium.Color.BLACK,
                },
            });
        });

        console.log(`${buildingStats.value.length} 栋建筑已添加`);
    } catch (error) {
        console.error("请求地形高度失败:", error);
    }
};



const addGlobalDarkMask = (viewer: Cesium.Viewer) => {
    // 全局暗色遮罩：用单张全球影像，围栏内挖透明洞
    const width = 4096;
    const height = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1) 先铺满全局暗色
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0,0,0,0.58)';
    ctx.fillRect(0, 0, width, height);

    // 2) 把围栏经纬度投到画布坐标，挖透明洞
    const project = (lon: number, lat: number) => {
        const x = ((lon + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        return { x, y };
    };

    const ring: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < fenceDegrees.length; i += 2) {
        const lon = fenceDegrees[i];
        const lat = fenceDegrees[i + 1];
        if (lon == null || lat == null) continue;
        ring.push(project(lon, lat));
    }

    // 洞内全透明
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    if (ring.length > 0) {
        ctx.moveTo(ring[0]!.x, ring[0]!.y);
        for (let i = 1; i < ring.length; i++) {
            ctx.lineTo(ring[i]!.x, ring[i]!.y);
        }
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    // 3) 在洞边缘加一圈柔光过渡，视觉更自然
    if (ring.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ring[0]!.x, ring[0]!.y);
        for (let i = 1; i < ring.length; i++) {
            ctx.lineTo(ring[i]!.x, ring[i]!.y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    const provider = new Cesium.SingleTileImageryProvider({
        url: canvas.toDataURL('image/png'),
        rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
        tileWidth: width,
        tileHeight: height,
    });

    darkMaskLayer = viewer.imageryLayers.addImageryProvider(provider);
    darkMaskLayer.alpha = 1.0;
};


const addWaterLevel = (viewer: Cesium.Viewer) => {
    viewer.entities.add({
        name: '水位',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                117.273126, 31.876976,
                117.281726, 31.876976,
                117.281726, 31.882076,
                117.273126, 31.882076
            ]),
            // 关键：拉伸高度绑定 Vue 变量
            extrudedHeight: new Cesium.CallbackProperty(() => {
                return waterLevel.value;
            }, false),
            // 底部高度
            height: 0.1,
            // 水的材质：半透明深蓝色
            material: new Cesium.ImageMaterialProperty({
                image: `${import.meta.env.BASE_URL}波光粼粼的水面纹理.png`,
                repeat: new Cesium.Cartesian2(1, 1),
                transparent: false,
                color: Cesium.Color.AZURE.withAlpha(0.7)
            }),
            outline: false
        }
    })
}

const addWeatherEffect = (viewer: Cesium.Viewer) => {
    // 仅加后处理，不改 terrain/imagery，避免影响地形加载与高度采样
    weatherStage = new Cesium.PostProcessStage({
        name: 'rain-post-effect',
        fragmentShader: `
            uniform sampler2D colorTexture;
            in vec2 v_textureCoordinates;
            uniform float u_time;
            uniform float u_rainIntensity;

            float hash(vec2 p){
                p = fract(p * vec2(123.34, 456.21));
                p += dot(p, p + 45.32);
                return fract(p.x * p.y);
            }

            void main() {
                vec2 uv = v_textureCoordinates;
                vec4 base = texture(colorTexture, uv);

                // 阴天压暗（强度随雨量提升）
                float darken = mix(1.0, 0.72, u_rainIntensity);
                vec3 color = base.rgb * darken;

                // 简化雨线：斜向条纹+时间偏移
                vec2 rainUV = uv * vec2(45.0, 90.0);
                rainUV.y += u_time * 20.0;
                rainUV.x += u_time * 10.0;

                float n = hash(floor(rainUV));
                float stripe = smoothstep(0.6, 1.0, fract(rainUV.y + n));
                float rain = stripe * u_rainIntensity * 0.32;

                // 冷色调雨雾叠加
                color += vec3(0.35, 0.45, 0.55) * rain;

                out_FragColor = vec4(color, base.a);
            }
        `,
        uniforms: {
            u_time: 0.0,
            u_rainIntensity: Cesium.Math.clamp(weatherIntensity.value / 100, 0, 1),
        },
    });
    viewer.scene.postProcessStages.add(weatherStage);
};

onMounted(() => {
    initCesium();
});

onUnmounted(() => {
    if (removePreRenderListener) {
        removePreRenderListener();
        removePreRenderListener = null;
    }
    if (viewerRef.value && darkMaskLayer) {
        viewerRef.value.imageryLayers.remove(darkMaskLayer, true);
        darkMaskLayer = null;
    }
    if (viewerRef.value && weatherStage) {
        viewerRef.value.scene.postProcessStages.remove(weatherStage);
        weatherStage = null;
    }
    clickHandler?.destroy();
    clickHandler = null;
    viewerRef.value?.destroy();
    viewerRef.value = null;
});
</script>

<style scoped>
.dashboard {
    --bg: #0c0f14;
    --bg-elev: #141a22;
    --card: #1a222d;
    --border: rgba(43, 140, 255, 0.22);
    --accent: #2b8cff;
    --accent-soft: rgba(43, 140, 255, 0.35);
    --text: #e8eef5;
    --muted: #8b98a8;
    --ok: #3dd68c;
    --warn: #ffc64d;
    --danger: #ff5f56;

    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
}

.dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: linear-gradient(180deg, #121820 0%, #0c0f14 100%);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}

.dash-header__brand {
    display: flex;
    align-items: center;
    gap: 14px;
}

.dash-header__icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), #38bdf8);
    box-shadow: 0 0 20px var(--accent-soft);
}

.dash-header__title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.dash-header__sub {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--muted);
}

.dash-header__tag {
    font-size: 12px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: var(--accent);
    background: rgba(43, 140, 255, 0.08);
}

.dash-body {
    flex: 1;
    display: flex;
    gap: 12px;
    padding: 12px;
    min-height: 0;
}

.dash-col {
    width: min(300px, 28vw);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-x: hidden;
    overflow-y: auto;
}

.dash-col--right {
    width: min(300px, 28vw);
}

.dash-map {
    flex: 1;
    min-width: 0;
    position: relative;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: var(--bg-elev);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35), inset 0 0 40px rgba(43, 140, 255, 0.04);
    overflow: hidden;
}

.cesium-host {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

.map-legend {
    position: absolute;
    left: 14px;
    top: 14px;
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 14px;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(12, 15, 20, 0.82);
    border: 1px solid var(--border);
    backdrop-filter: blur(8px);
    font-size: 12px;
    pointer-events: none;
}

.map-legend__title {
    color: var(--muted);
    margin-right: 4px;
}

.map-legend__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}
.dot--ok {
    background: var(--ok);
    box-shadow: 0 0 8px rgba(61, 214, 140, 0.5);
}
.dot--warn {
    background: var(--warn);
}
.dot--danger {
    background: var(--danger);
}

.map-strip {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(12, 15, 20, 0.85);
    border: 1px solid var(--border);
    font-size: 12px;
}

.map-strip__label {
    color: var(--muted);
    margin-right: 4px;
}

.map-strip__pill {
    padding: 4px 10px;
    border-radius: 8px;
    background: rgba(43, 140, 255, 0.1);
    border: 1px solid rgba(43, 140, 255, 0.2);
}
.map-strip__pill strong {
    color: #7ec8ff;
    font-weight: 600;
}

.card {
    background: var(--card);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 12px 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.card--compact {
    padding-bottom: 10px;
}

.card--grow {
    flex: 1;
    min-height: 140px;
    display: flex;
    flex-direction: column;
}

.card__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
}

.card__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent-soft);
}

.stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.stat-cell {
    padding: 10px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-cell--wide {
    grid-column: 1 / -1;
}

.stat-cell__label {
    display: block;
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 4px;
}

.stat-cell__value {
    font-size: 1.15rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
}

.stat-cell__value small {
    font-size: 0.7rem;
    font-weight: 500;
    margin-left: 2px;
    color: var(--muted);
}

.stat-cell__value.accent {
    color: #7ec8ff;
}
.stat-cell__value.ok {
    color: var(--ok);
}
.stat-cell__value.warning {
    color: var(--warn);
}
.stat-cell__value.danger {
    color: var(--danger);
}

.spark-wrap {
    position: relative;
    padding-left: 28px;
}

.spark-y {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
}

.spark-chart {
    height: 72px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
}

.spark-x {
    margin-top: 6px;
    font-size: 10px;
    color: var(--muted);
    text-align: center;
}

.rain-bar-wrap {
    margin-top: 4px;
}

.rain-bar {
    height: 8px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.35);
    overflow: hidden;
    margin-bottom: 8px;
}

.rain-bar__fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent), #38bdf8);
    box-shadow: 0 0 12px var(--accent-soft);
    transition: width 0.2s ease;
}

.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-bottom: 8px;
}

.row--tight {
    margin-bottom: 6px;
}

.val {
    font-variant-numeric: tabular-nums;
    color: #7ec8ff;
    font-weight: 600;
}

.check-line {
    cursor: pointer;
}

.chk {
    accent-color: var(--accent);
}

.range-accent {
    width: 100%;
    margin: 0 0 10px;
    accent-color: var(--accent);
}

.btns {
    display: flex;
    gap: 8px;
}

.btn-primary {
    flex: 1;
    padding: 9px 12px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(180deg, #3b8eef 0%, #2563b8 100%);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(43, 140, 255, 0.35);
}

.btn-primary:hover {
    filter: brightness(1.06);
}

.btn-ghost {
    flex: 1;
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.04);
    color: var(--text);
    font-size: 13px;
    cursor: pointer;
}

.btn-ghost:hover {
    background: rgba(255, 255, 255, 0.08);
}

.forecast {
    list-style: none;
    margin: 0;
    padding: 0;
}

.forecast__row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 13px;
}

.forecast__row:last-child {
    border-bottom: none;
}

.forecast__day {
    width: 40px;
    color: var(--muted);
    font-size: 12px;
}

.forecast__icon {
    width: 32px;
    text-align: center;
    font-size: 14px;
}

.forecast__temp {
    margin-left: auto;
    color: #94a3b8;
    font-size: 12px;
}

.equip-list {
    list-style: none;
    margin: 0 0 10px;
    padding: 0;
}

.equip-list__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.equip-list__row:last-child {
    border-bottom: none;
}

.equip-list__name {
    color: var(--muted);
}

.equip-list__status {
    font-weight: 600;
}
.equip-list__status.ok {
    color: var(--ok);
}
.equip-list__status.warn {
    color: var(--warn);
}
.equip-list__status.muted {
    color: var(--muted);
}

.online-bar__track {
    height: 6px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.35);
    overflow: hidden;
}

.online-bar__fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--ok), #22d3ee);
    transition: width 0.25s ease;
}

.online-bar__label {
    display: block;
    margin-top: 6px;
    font-size: 11px;
    color: var(--muted);
}

.alert-list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    flex: 1;
    max-height: 400px;
}

.alert-list__item {
    display: flex;
    gap: 10px;
    padding: 10px 8px;
    border-radius: 8px;
    margin-bottom: 6px;
    background: rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 12px;
}

.alert-list__item--danger {
    border-color: rgba(255, 95, 86, 0.35);
    background: rgba(255, 95, 86, 0.08);
}

.alert-list__item--warning {
    border-color: rgba(255, 198, 77, 0.3);
    background: rgba(255, 198, 77, 0.06);
}

.alert-list__item--ok {
    border-color: rgba(61, 214, 140, 0.25);
}

.alert-list__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 4px;
    flex-shrink: 0;
    background: var(--muted);
}

.alert-list__item--danger .alert-list__dot {
    background: var(--danger);
}
.alert-list__item--warning .alert-list__dot {
    background: var(--warn);
}
.alert-list__item--ok .alert-list__dot {
    background: var(--ok);
}

.alert-list__title {
    font-weight: 600;
    margin-bottom: 4px;
}

.alert-list__meta {
    color: var(--muted);
    font-size: 11px;
    line-height: 1.35;
}

@media (max-width: 1024px) {
    .dash-body {
        flex-direction: column;
    }
    .dash-col,
    .dash-col--right {
        width: 100%;
        max-height: 40vh;
    }
    .dash-map {
        min-height: 42vh;
        order: -1;
    }
}
</style>