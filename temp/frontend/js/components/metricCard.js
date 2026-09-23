import { icon } from "./icons.js";

// icon color keys: blue | green | red | amber
export function renderMetricCard({ label, value, icon: iconName, color = "blue", delta, compareText = "vs last month" }) {
  const isUp = typeof delta === "number" ? delta >= 0 : true;
  const deltaMarkup =
    typeof delta === "number"
      ? `<div class="metric-card__delta metric-card__delta--${isUp ? "up" : "down"}">
           ${icon(isUp ? "arrowUp" : "arrowDown")}
           <span>${isUp ? "+" : ""}${delta}%</span>
           <span class="metric-card__delta-compare">${compareText}</span>
         </div>`
      : `<div class="metric-card__skeleton"></div>`;

  return `
    <div class="metric-card">
      <div class="metric-card__top">
        <span class="metric-card__icon metric-card__icon--${color}">${icon(iconName)}</span>
        <span class="metric-card__label">${label}</span>
      </div>
      <div class="metric-card__value">${value}</div>
      ${deltaMarkup}
    </div>
  `;
}

export function renderMetricSkeleton(label, iconName, color) {
  return `
    <div class="metric-card">
      <div class="metric-card__top">
        <span class="metric-card__icon metric-card__icon--${color}">${icon(iconName)}</span>
        <span class="metric-card__label">${label}</span>
      </div>
      <div class="metric-card__skeleton"></div>
    </div>
  `;
}
