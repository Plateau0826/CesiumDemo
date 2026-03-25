/**
 * P3 态势驱动 · 演示配置（可替换为接口 JSON）
 */

export const demoSituationConfig = {
  /** 相对地形采样谷底，水面最低抬升（m） */
  waterRiseMinOffsetM: 0.25,
  /** 相对谷底，s=1 时最大抬升（m），椭球高示意 */
  waterRiseMaxOffsetM: 15,
  /** 播放时每帧增加的 s */
  playStepPerTick: 0.0035,
  playIntervalMs: 48,
  /** 未取到地形采样时的参考椭球高（m） */
  fallbackTerrainFloorM: 52,
} as const;

/** 平滑缓动 0~1 */
export function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function waterLevelFromSituation(
  terrainFloorEllipsoidM: number,
  situationS: number,
  cfg: typeof demoSituationConfig = demoSituationConfig,
): number {
  const e = smoothstep01(situationS);
  return (
    terrainFloorEllipsoidM +
    cfg.waterRiseMinOffsetM +
    (cfg.waterRiseMaxOffsetM - cfg.waterRiseMinOffsetM) * e
  );
}

/** 与态势同步的示意时间轴（小时），纯展示 */
export function simulatedHours(situationS: number, totalHours = 24): number {
  return Math.min(totalHours, Math.max(0, situationS * totalHours));
}
