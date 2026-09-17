"use client";

import { useEffect, useRef } from "react";

const PLAY_ICON_SVG = `<svg width="68" height="48" viewBox="0 0 68 48" aria-hidden="true"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00" fill-opacity="0.8"/><path d="M45 24 27 14v20" fill="#fff"/></svg>`;

/**
 * 리치텍스트 본문(`dangerouslySetInnerHTML`) 렌더러 — Webflow 원본 HTML을 그대로 쓰되,
 * 유튜브 영상 `<figure data-rt-type="video">`만 마운트 후 자체 포스터(맥스레스 썸네일 + 재생버튼)로
 * 교체한다. 표준 `youtube.com/embed` iframe이 재생 전 내부적으로 480p 이하 썸네일을 박스 크기로 늘려
 * 보여줘 실제 표시 폭(700px+)에서 뿌옇게 보이는 문제(2026-09-17 발견) 때문 — 클릭 시에만 실제 iframe을
 * 심어 고화질 썸네일 + 지연 로딩 두 가지를 함께 얻는다.
 */
export function RichTextContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const figures = container.querySelectorAll<HTMLElement>(
      'figure[data-rt-type="video"]',
    );

    figures.forEach((figure) => {
      const iframe = figure.querySelector("iframe");
      const videoId = iframe
        ?.getAttribute("src")
        ?.match(/embed\/([^?/]+)/)?.[1];
      if (!videoId) return;

      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", "영상 재생");
      button.className =
        "absolute inset-0 h-full w-full cursor-pointer border-0 p-0";

      const img = document.createElement("img");
      img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      img.alt = "";
      img.className = "h-full w-full object-cover";
      img.onerror = () => {
        img.onerror = null;
        img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      };
      button.appendChild(img);

      const playIcon = document.createElement("div");
      playIcon.className =
        "pointer-events-none absolute inset-0 flex items-center justify-center";
      playIcon.innerHTML = PLAY_ICON_SVG;
      button.appendChild(playIcon);

      button.addEventListener("click", () => {
        const player = document.createElement("iframe");
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        player.className = "h-full w-full";
        player.style.border = "0";
        player.allow =
          "accelerate-compute; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        player.allowFullscreen = true;
        figure.replaceChildren(player);
      });

      figure.replaceChildren(button);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
