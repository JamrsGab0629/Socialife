// Reusable, dependency-free SVG chart renderers.
// Both functions take an <svg> element plus a { labels, values } dataset
// and draw directly into it using a shared viewBox coordinate system.

const VB_W = 480;
const VB_H = 220;
const PAD = { top: 14, right: 10, bottom: 22, left: 10 };

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function scaleY(value, min, max, top, bottom) {
  if (max === min) return bottom;
  return bottom - ((value - min) / (max - min)) * (bottom - top);
}

export function renderLineChart(svg, data, { areaFill = true } = {}) {
  if (!svg || !data || !data.values?.length) return;
  svg.setAttribute("viewBox", `0 0 ${VB_W} ${VB_H}`);
  svg.innerHTML = "";

  const { labels, values } = data;
  const top = PAD.top;
  const bottom = VB_H - PAD.bottom;
  const left = PAD.left;
  const right = VB_W - PAD.right;
  const min = Math.min(...values, 0);
  const max = Math.max(...values) * 1.08 || 1;
  const step = (right - left) / (values.length - 1 || 1);

  // gridlines
  for (let i = 0; i <= 3; i++) {
    const y = top + ((bottom - top) / 3) * i;
    svg.appendChild(svgEl("line", { x1: left, y1: y, x2: right, y2: y, class: "chart-gridline" }));
  }

  if (areaFill) {
    const defs = svgEl("defs");
    const grad = svgEl("linearGradient", { id: "areaGradient", x1: "0", y1: "0", x2: "0", y2: "1" });
    grad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "var(--color-primary)", "stop-opacity": "0.35" }));
    grad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "var(--color-primary)", "stop-opacity": "0" }));
    defs.appendChild(grad);
    svg.appendChild(defs);
  }

  const points = values.map((v, i) => [left + i * step, scaleY(v, min, max, top, bottom)]);
  const linePath = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");

  if (areaFill) {
    const areaPath = `${linePath} L${points[points.length - 1][0]},${bottom} L${points[0][0]},${bottom} Z`;
    svg.appendChild(svgEl("path", { d: areaPath, class: "chart-area" }));
  }

  svg.appendChild(svgEl("path", { d: linePath, class: "chart-line" }));

  points.forEach(([x, y], i) => {
    svg.appendChild(
      svgEl("circle", {
        cx: x,
        cy: y,
        r: i === points.length - 1 ? 4 : 2.6,
        class: i === points.length - 1 ? "chart-dot--end" : "chart-dot"
      })
    );
  });

  labels.forEach((label, i) => {
    svg.appendChild(
      svgEl("text", { x: left + i * step, y: VB_H - 6, class: "chart-axis-label", "text-anchor": "middle" })
    ).textContent = label;
  });
}

export function renderBarChart(svg, data) {
  if (!svg || !data || !data.values?.length) return;
  svg.setAttribute("viewBox", `0 0 ${VB_W} ${VB_H}`);
  svg.innerHTML = "";

  const { labels, values } = data;
  const top = PAD.top;
  const bottom = VB_H - PAD.bottom;
  const left = PAD.left;
  const right = VB_W - PAD.right;
  const max = Math.max(...values) * 1.15 || 1;
  const n = values.length;
  const gap = 10;
  const barWidth = (right - left - gap * (n - 1)) / n;

  for (let i = 0; i <= 3; i++) {
    const y = top + ((bottom - top) / 3) * i;
    svg.appendChild(svgEl("line", { x1: left, y1: y, x2: right, y2: y, class: "chart-gridline" }));
  }

  values.forEach((v, i) => {
    const x = left + i * (barWidth + gap);
    const y = scaleY(v, 0, max, top, bottom);
    const h = bottom - y;
    svg.appendChild(
      svgEl("rect", { x, y, width: barWidth, height: Math.max(h, 2), rx: 4, class: "chart-bar" })
    );
    svg.appendChild(
      svgEl("text", { x: x + barWidth / 2, y: VB_H - 6, class: "chart-axis-label", "text-anchor": "middle" })
    ).textContent = labels[i];
  });
}
