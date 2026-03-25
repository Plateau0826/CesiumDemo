/**
 * 紫蓬山沟谷演示区 · P2 静态业务图层（示意几何，非测绘成果）
 */

/** 汇水范围外轮廓（闭合多边形，经纬度交替） */
export const CATCHMENT_POLYGON_DEGREES = [
  117.0875, 31.7305, 117.091, 31.7145, 117.1065, 31.7148, 117.1112, 31.722, 117.1085, 31.7315, 117.098, 31.7335,
  117.0895, 31.732,
];

/**
 * 主沟道中心线（上游 → 下游示意），用于 Corridor 条带
 */
export const MAIN_CHANNEL_CENTERLINE_DEGREES = [
  117.093, 31.7272, 117.0952, 31.7248, 117.0978, 31.723, 117.1005, 31.7215, 117.1032, 31.7218, 117.105, 31.7235,
];

export interface DemoStation {
  lon: number;
  lat: number;
  name: string;
}

/** 示意监测站（仅图标与名称） */
export const DEMO_STATIONS: DemoStation[] = [
  { lon: 117.0955, lat: 31.7256, name: '雨量站（示意）' },
  { lon: 117.1014, lat: 31.722, name: '水位站（示意）' },
];
