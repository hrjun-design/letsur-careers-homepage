"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

/**
 * 채용 공고 상세 근무지 네이버 지도 — 실서버(careers.letsur.ai/recruit/[slug]) 스크립트 이식(2026-10-14).
 * - 실서버 구조: 주소 → Geocoding(submodules=geocoder) → 지도 중심 이동 + 마커, 높이 200px,
 *   지도 위 투명 링크(`.map-view-link`, absolute inset 0)를 덮어 클릭 시 네이버 지도 장소 페이지 새 창.
 * - Client ID는 NCP Maps "letsur-recruit-map" Application(인사팀 발급). 등록 도메인은 Vercel 배포 링크와
 *   careers.letsur.ai 두 곳뿐이라 localhost에서는 인증 실패로 지도가 안 뜨는 게 정상.
 *   Client ID는 브라우저에 노출되는 공개값(도메인으로 제한) — Client Secret은 프론트에 절대 넣지 않음.
 */
const NAVER_MAP_CLIENT_ID =
  process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? "k7qmyg4tzt";

// 렛서 오피스는 실서버와 같은 장소 페이지로, 그 외 주소는 검색 결과로 연결
const OFFICE_ADDRESS_KEY = "테헤란로38길 8";
const OFFICE_PLACE_URL =
  "https://map.naver.com/v5/entry/place/1943326155?c=15,0,0,0,dh";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    naver?: any;
  }
}

export function NaverMap({ address }: { address: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(
    () => typeof window !== "undefined" && !!window.naver?.maps?.Service,
  );

  const placeUrl = address.includes(OFFICE_ADDRESS_KEY)
    ? OFFICE_PLACE_URL
    : `https://map.naver.com/p/search/${encodeURIComponent(address)}`;

  useEffect(() => {
    const naver = window.naver;
    if (!loaded || !mapRef.current || !naver?.maps?.Service) return;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(37.5665, 126.978),
      zoom: 16,
    });

    naver.maps.Service.geocode({ query: address }, (status: any, response: any) => {
      if (status !== naver.maps.Service.Status.OK) {
        console.error("주소를 찾을 수 없습니다.");
        return;
      }
      const result = response?.v2?.addresses?.[0];
      if (!result) return;
      const coord = new naver.maps.LatLng(parseFloat(result.y), parseFloat(result.x));
      map.setCenter(coord);
      new naver.maps.Marker({ position: coord, map, title: "렛서 오피스" });
    });

    return () => map.destroy();
  }, [loaded, address]);

  return (
    <div className="relative border-b border-[#e1e1e1] pb-[24px]">
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onReady={() => {
          // geocoder 서브모듈은 maps.js 로드 후 비동기로 따로 붙음 — onReady 시점엔 Service가 아직 없을 수 있어
          // 공식 콜백(onJSContentLoaded)까지 기다림 (2026-10-14 배포 직후 `reading 'geocode'` 크래시 원인)
          const maps = window.naver?.maps;
          if (!maps) return;
          if (maps.Service) setLoaded(true);
          else maps.onJSContentLoaded = () => setLoaded(true);
        }}
      />
      <div ref={mapRef} className="h-[200px] w-full" />
      <a
        href={placeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="네이버 지도에서 보기"
        className="absolute inset-0 z-[1]"
      />
    </div>
  );
}
