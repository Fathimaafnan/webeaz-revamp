"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_OFFICES, type OfficeLocationData } from "@/lib/fallback-content";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { feature } from "topojson-client";
import styles from "./GlobeLocations.module.css";

/**
 * GLOBAL PRESENCE — the EQSoft interactive Earth section.
 *
 * Faithful reproduction of https://www.eqsoftonline.com/ 's globe: the same
 * bare Three.js earth (blue-marble texture, topology bump map, country
 * borders, atmosphere glow), the same camera-orbit rotation driven by a
 * GSAP ScrollTrigger pin, the same SVG map-pin overlay, and the same
 * wheel / arrow-key / touch-swipe / dot navigation.
 *
 * Only the four EQSoft offices have been swapped for WebEaz's three
 * offices. Everything else — structure, styling, motion and interaction —
 * mirrors the reference section.
 */

type Location = {
  code: string;
  lat: number;
  lng: number;
  watermark: string;
  flag: string;
  flagAlt: string;
  name: string;
  hub: string;
  company: string;
  address: string[];
  email: string;
  mobile: string;
  /** Exact Google Maps embed used by this office on webeaz.com/contact-us */
  mapEmbed: string;
  /** Map preview image cropped from that exact Contact Us page map */
  mapImage: string;
  /** Full Google Maps destination built from that embed's coordinates */
  mapUrl: string;
};

const computePhi = (lat: number) => ((90 - lat) * Math.PI) / 180;
const computeTheta = (lng: number) => ((0 - lng) * Math.PI) / 180;
const CAM_ALT = 2.9;
const RADIUS = 1;

function getDynamicFov(aspect: number) {
  const baseFov = 42;
  return aspect < 1 ? Math.min(baseFov / aspect, 80) : baseFov;
}

export default function GlobeLocations({ offices = DEFAULT_OFFICES }: { offices?: OfficeLocationData[] }) {
  // Keep the exact internal shape the animation code already uses.
  const locations: Location[] = useMemo(
    () => offices.map((o) => ({
      code: o.code, lat: o.lat, lng: o.lng, watermark: o.watermark,
      flag: o.flagUrl, flagAlt: o.flagAlt, name: o.name, hub: o.regionLabel,
      company: o.company, address: o.addressLines, email: o.email, mobile: o.mobile,
      mapEmbed: o.mapEmbedUrl, mapImage: o.mapImageUrl, mapUrl: o.mapUrl,
    })),
    [offices],
  );
  const locationsKey = JSON.stringify(locations);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinHostRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const navigateRef = useRef<(idx: number) => void>(() => {});

  useEffect(() => {
    const wrapper = wrapperRef.current!;
    const container = containerRef.current!;
    const pinHost = pinHostRef.current!;
    const watermarkEl = watermarkRef.current;
    if (!wrapper || !container || !pinHost) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let earthMesh: THREE.Mesh | null = null;
    let animFrameId = 0;
    let pinSVG: SVGSVGElement | null = null;
    let pinGroup: SVGGElement | null = null;
    let pinAnimTimeout = 0;
    let watermarkTimeout = 0;
    let pinTrigger: ScrollTrigger | null = null;
    let disposed = false;

    // Hover map preview tied to the red marker
    let mapPreview: HTMLAnchorElement | null = null;
    let mapPreviewImage: HTMLImageElement | null = null;
    let previewTimer = 0;
    let refreshTimer = 0;
    let previewShown = false;
    let lastPointerType = "mouse";

    let currentPhi = computePhi(locations[0].lat);
    let currentTheta = computeTheta(locations[0].lng);
    let targetPhi = currentPhi;
    let targetTheta = currentTheta;

    // ---------------------------------------------------------------
    // UI updates
    // ---------------------------------------------------------------
    function updateUI() {
      const loc = locations[activeRef.current];
      if (watermarkEl) {
        watermarkEl.style.opacity = "0";
        clearTimeout(watermarkTimeout);
        watermarkTimeout = window.setTimeout(() => {
          if (disposed || !watermarkEl) return;
          watermarkEl.textContent = loc.watermark;
          watermarkEl.style.opacity = "0.03";
        }, 220);
      }
    }

    function navigate(idx: number) {
      idx = Math.max(0, Math.min(locations.length - 1, idx));
      if (idx === activeRef.current) return;
      activeRef.current = idx;
      setActive(idx);
      updateUI();
      rotateGlobeToActive();
    }
    navigateRef.current = navigate;

    function scrollToSlide(idx: number) {
      if (!pinTrigger) {
        navigate(idx);
        return;
      }
      const targetProgress = (idx + 0.5) / locations.length;
      const target = pinTrigger.start + targetProgress * (pinTrigger.end - pinTrigger.start);
      window.scrollTo({ top: target, behavior: "smooth" });
    }

    // ---------------------------------------------------------------
    // NOTE: there is deliberately no wheel / touch / keyboard handler
    // here. Those handlers used to call preventDefault() and trap the
    // page inside this section. Location changes are now driven purely
    // by natural scroll progress (see setupScrollPin) and the dots, so
    // vertical wheel and touch scrolling always move the page freely.
    // ---------------------------------------------------------------
    // Three.js globe (bare three.js, exactly like the reference)
    // ---------------------------------------------------------------
    // ---------------------------------------------------------------
    function initGlobe() {
      const W = container.clientWidth || 500;
      const H = container.clientHeight || 500;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      const aspect = W / H;
      camera = new THREE.PerspectiveCamera(getDynamicFov(aspect), aspect, 0.1, 1000);

      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const sun = new THREE.DirectionalLight(0xffffff, 1.1);
      sun.position.set(5, 3, 5);
      scene.add(sun);

      const geo = new THREE.SphereGeometry(RADIUS, 64, 64);
      const mat = new THREE.MeshPhongMaterial({
        specular: new THREE.Color(0x222222),
        shininess: 14,
        transparent: true,
        opacity: 0,
      });
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      loader.load("/globe/earth-blue-marble.jpg", (tex) => {
        if (disposed) return;
        mat.map = tex;
        mat.needsUpdate = true;
        let start: number | null = null;
        const fadeIn = (timestamp: number) => {
          if (disposed) return;
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / 600, 1);
          mat.opacity = progress;
          if (progress < 1) requestAnimationFrame(fadeIn);
          else mat.transparent = false;
        };
        requestAnimationFrame(fadeIn);
      });
      loader.load("/globe/earth-topology.png", (tex) => {
        if (disposed) return;
        mat.bumpMap = tex;
        mat.bumpScale = 0.04;
        mat.needsUpdate = true;
      });
      earthMesh = new THREE.Mesh(geo, mat);
      scene.add(earthMesh);

      const atmMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0xccd8e8),
        transparent: true,
        opacity: 0.13,
        side: THREE.FrontSide,
      });
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 1.025, 64, 64), atmMat));

      loadBorders();
      buildPinOverlay();
      showPinForActive();

      currentPhi = computePhi(locations[0].lat);
      currentTheta = computeTheta(locations[0].lng);
      targetPhi = currentPhi;
      targetTheta = currentTheta;

      const renderLoop = () => {
        animFrameId = requestAnimationFrame(renderLoop);
        const LERP = 0.048;
        currentPhi += (targetPhi - currentPhi) * LERP;
        currentTheta += (targetTheta - currentTheta) * LERP;

        const r = CAM_ALT + RADIUS;
        camera.position.set(
          r * Math.sin(currentPhi) * Math.cos(currentTheta),
          r * Math.cos(currentPhi),
          r * Math.sin(currentPhi) * Math.sin(currentTheta)
        );
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        updatePinPosition();
      };
      renderLoop();

      window.addEventListener("resize", onResize);
    }

    function onResize() {
      if (!camera || !renderer) return;
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (!W || !H) return;
      camera.aspect = W / H;
      camera.fov = getDynamicFov(W / H);
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      if (pinSVG) pinSVG.setAttribute("viewBox", `0 0 ${W} ${H}`);
    }

    function rotateGlobeToActive() {
      const loc = locations[activeRef.current];
      targetPhi = computePhi(loc.lat);
      targetTheta = computeTheta(loc.lng);
      showPinForActive();
    }

    function loadBorders() {
      fetch("/globe/countries-110m.json")
        .then((r) => r.json())
        .then((world) => {
          if (disposed || !scene) return;
          const fc = feature(world as never, (world as never as { objects: { countries: never } }).objects.countries) as unknown as {
            features: { geometry: { type: string; coordinates: number[][][] | number[][][][] } }[];
          };
          const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.22,
          });
          fc.features.forEach((f) => {
            const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
            (polys as number[][][][]).forEach((poly) =>
              poly.forEach((ring) => {
                const pts: number[] = [];
                ring.forEach(([lng, lat]) => {
                  const phi = ((90 - lat) * Math.PI) / 180;
                  const theta = computeTheta(lng);
                  const r = RADIUS * 1.003;
                  pts.push(
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.cos(phi),
                    r * Math.sin(phi) * Math.sin(theta)
                  );
                });
                if (pts.length < 6) return;
                const g = new THREE.BufferGeometry();
                g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
                scene.add(new THREE.LineSegments(g, material));
              })
            );
          });
        })
        .catch(() => {
          /* borders are cosmetic, fail silently (same as reference) */
        });
    }

    // ---------------------------------------------------------------
    // SVG map-pin overlay — identical to the reference
    // ---------------------------------------------------------------
    const NS = "http://www.w3.org/2000/svg";

    // ---------------------------------------------------------------
    // Map preview — shows the exact map embed from the Contact Us page
    // for whichever office the red marker currently represents.
    // ---------------------------------------------------------------
    function openMapPreview() {
      clearTimeout(previewTimer);
      if (!mapPreview) return;
      const loc = locations[activeRef.current];
      // Small local image cropped from the exact Contact Us page map.
      if (mapPreviewImage && mapPreviewImage.getAttribute("src") !== loc.mapImage) {
        mapPreviewImage.setAttribute("src", loc.mapImage);
      }
      mapPreview.href = loc.mapUrl;
      mapPreview.setAttribute("aria-label", `Open ${loc.name} office map in a new tab`);
      mapPreview.classList.add(styles.mapPreviewOpen);
      previewShown = true;
    }

    function hideMapPreview() {
      clearTimeout(previewTimer);
      if (!mapPreview) return;
      mapPreview.classList.remove(styles.mapPreviewOpen);
      previewShown = false;
    }

    // Small delay lets the pointer travel from the marker to the preview.
    function closeMapPreview() {
      clearTimeout(previewTimer);
      previewTimer = window.setTimeout(() => {
        if (!disposed) hideMapPreview();
      }, 260);
    }

    function buildPinOverlay() {
      const W = container.clientWidth || 500;
      const H = container.clientHeight || 500;
      pinSVG = document.createElementNS(NS, "svg");
      pinSVG.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:10;";
      pinSVG.setAttribute("viewBox", `0 0 ${W} ${H}`);

      const style = document.createElementNS(NS, "style");
      style.textContent = `
        @keyframes pinDrop {
          0%   { transform: translateY(-16px) scale(0.8); opacity: 0; }
          55%  { transform: translateY(4px)  scale(2.24); opacity: 1; }
          75%  { transform: translateY(-3px) scale(1.92); }
          100% { transform: translateY(0)    scale(2.0);  opacity: 1; }
        }
        @keyframes pinBob {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes pulse1 { 0% { r:5; opacity:0.7; } 100% { r:38; opacity:0; } }
        @keyframes pulse2 { 0% { r:5; opacity:0.4; } 100% { r:38; opacity:0; } }
        .pin-drop {
          transform-origin: 24px 44px;
          animation: pinDrop 0.52s cubic-bezier(.4,0,.2,1) both,
                     pinBob 2.2s ease-in-out 0.56s infinite;
        }
        .pin-pulse-1 { animation: pulse1 1.7s ease-out infinite; }
        .pin-pulse-2 { animation: pulse2 1.7s ease-out 0.55s infinite; }
      `;
      pinSVG.appendChild(style);

      pinGroup = document.createElementNS(NS, "g");
      pinGroup.style.display = "none";

      const ring1 = document.createElementNS(NS, "circle");
      ring1.setAttribute("class", "pin-pulse-1");
      ring1.setAttribute("cx", "12");
      ring1.setAttribute("cy", "22");
      ring1.setAttribute("r", "5");
      ring1.setAttribute("fill", "none");
      ring1.setAttribute("stroke", "#dc2626");
      ring1.setAttribute("stroke-width", "1.5");

      const ring2 = document.createElementNS(NS, "circle");
      ring2.setAttribute("class", "pin-pulse-2");
      ring2.setAttribute("cx", "12");
      ring2.setAttribute("cy", "22");
      ring2.setAttribute("r", "5");
      ring2.setAttribute("fill", "none");
      ring2.setAttribute("stroke", "#dc2626");
      ring2.setAttribute("stroke-width", "1");

      const icon = document.createElementNS(NS, "g");
      icon.setAttribute("class", "pin-drop");
      icon.setAttribute("transform", "scale(2)");
      // Re-enable pointer events on the marker itself (the SVG root keeps
      // pointer-events:none so the rest of the globe stays non-interactive).
      icon.style.pointerEvents = "auto";
      icon.style.cursor = "pointer";
      icon.addEventListener("pointerdown", (e) => {
        lastPointerType = (e as PointerEvent).pointerType || "mouse";
      });
      icon.addEventListener("pointerenter", (e) => {
        if ((e as PointerEvent).pointerType === "mouse") openMapPreview();
      });
      icon.addEventListener("pointerleave", (e) => {
        if ((e as PointerEvent).pointerType === "mouse") closeMapPreview();
      });
      // Tap-to-show on touch devices; mouse hover already handles desktop.
      icon.addEventListener("click", () => {
        if (lastPointerType === "mouse") return;
        if (previewShown) hideMapPreview();
        else openMapPreview();
      });

      const body = document.createElementNS(NS, "path");
      body.setAttribute(
        "d",
        "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      );
      body.setAttribute("fill", "#dc2626");
      body.setAttribute("opacity", "0.88");

      const inner = document.createElementNS(NS, "circle");
      inner.setAttribute("cx", "12");
      inner.setAttribute("cy", "9");
      inner.setAttribute("r", "2.8");
      inner.setAttribute("fill", "white");
      inner.setAttribute("opacity", "0.9");

      icon.appendChild(ring1);
      icon.appendChild(ring2);
      icon.appendChild(body);
      icon.appendChild(inner);
      pinGroup.appendChild(icon);
      pinSVG.appendChild(pinGroup);
      pinHost.style.position = "relative";
      pinHost.appendChild(pinSVG);

      // The preview is a link wrapping the Contact Us page's exact map
      // embed; clicking it opens the full map in a new tab.
      mapPreview = document.createElement("a");
      mapPreview.className = styles.mapPreview;
      mapPreview.target = "_blank";
      mapPreview.rel = "noopener noreferrer";
      mapPreviewImage = document.createElement("img");
      mapPreviewImage.className = styles.mapPreviewImage;
      mapPreviewImage.alt = "Office map preview";
      mapPreview.appendChild(mapPreviewImage);
      mapPreview.addEventListener("mouseenter", () => clearTimeout(previewTimer));
      mapPreview.addEventListener("mouseleave", closeMapPreview);
      pinHost.appendChild(mapPreview);
    }

    function showPinForActive() {
      if (!pinGroup) return;
      // A location change swaps the marker's office, so close any preview
      // that belonged to the previous one.
      hideMapPreview();
      pinGroup.style.display = "none";
      clearTimeout(pinAnimTimeout);
      pinAnimTimeout = window.setTimeout(() => {
        if (disposed || !pinGroup) return;
        const icon = pinGroup.querySelector(".pin-drop") as SVGGElement | null;
        if (icon) {
          icon.style.animation = "none";
          void (icon as unknown as HTMLElement).offsetWidth;
          icon.style.animation = "";
        }
        pinGroup.style.display = "";
      }, 280);
    }

    function updatePinPosition() {
      if (!pinGroup || !camera || !renderer) return;
      const loc = locations[activeRef.current];
      const phi = computePhi(loc.lat);
      const theta = computeTheta(loc.lng);
      const px = RADIUS * Math.sin(phi) * Math.cos(theta);
      const py = RADIUS * Math.cos(phi);
      const pz = RADIUS * Math.sin(phi) * Math.sin(theta);

      const cx = Math.sin(currentPhi) * Math.cos(currentTheta);
      const cy = Math.cos(currentPhi);
      const cz = Math.sin(currentPhi) * Math.sin(currentTheta);

      const dot = px * cx + py * cy + pz * cz;
      if (dot < 0.08) {
        pinGroup.style.opacity = "0";
        pinGroup.style.pointerEvents = "none";
        hideMapPreview();
        return;
      }
      pinGroup.style.opacity = String(Math.min(1, (dot - 0.08) / 0.15));
      pinGroup.style.pointerEvents = "auto";

      const vec = new THREE.Vector3(px, py, pz);
      vec.project(camera);
      const W = renderer.domElement.clientWidth || container.clientWidth;
      const H = renderer.domElement.clientHeight || container.clientHeight;
      const sx = ((vec.x + 1) / 2) * W;
      const sy = ((1 - vec.y) / 2) * H;
      pinGroup.setAttribute("transform", `translate(${sx - 24}, ${sy - 44})`);

      // Keep the preview just above the marker, clamped inside the panel.
      if (mapPreview) {
        const pw = 220;
        const ph = 150;
        const left = Math.max(8, Math.min(W - pw - 8, sx - pw / 2));
        let top = sy - 44 - ph - 10;
        if (top < 8) top = sy + 26;
        top = Math.max(8, Math.min(H - ph - 8, top));
        mapPreview.style.left = `${left}px`;
        mapPreview.style.top = `${top}px`;
      }
    }

    // ---------------------------------------------------------------
    // Scroll-driven animation sequence — same as the EQSoft reference:
    // the section is pinned for exactly one viewport per location, and
    // scroll progress drives the camera through every location stage.
    // The pin is finite (3 viewports), so normal scrolling resumes as
    // soon as the sequence completes. No wheel/touch handler intercepts
    // the page, so it can never get trapped or jump.
    // ---------------------------------------------------------------
    function refreshScrollPin() {
      if (!disposed) ScrollTrigger.refresh();
    }

    // Keep scroll progress in sync even when the browser's scroll events are
    // throttled or emitted outside GSAP's own listener.
    function onScrollUpdate() {
      if (!disposed && pinTrigger) pinTrigger.update();
    }

    function setupScrollPin() {
      if (typeof window === "undefined") return;
      gsap.registerPlugin(ScrollTrigger);
      pinTrigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: () => "+=" + window.innerHeight * locations.length,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const segment = 1 / locations.length;
          const idx = Math.min(locations.length - 1, Math.floor(self.progress / segment));
          if (idx !== activeRef.current) navigate(idx);
        },
      });
      ScrollTrigger.refresh();
      // CMS-loaded images above this section can settle after mount; refresh
      // once everything has loaded so the pin start/end stay accurate.
      window.addEventListener("load", refreshScrollPin);
      window.addEventListener("scroll", onScrollUpdate, { passive: true });
      refreshTimer = window.setTimeout(refreshScrollPin, 1500);
    }

    initGlobe();
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => onResize())
      : null;
    resizeObserver?.observe(container);
    setupScrollPin();
    if (watermarkEl) {
      watermarkTimeout = window.setTimeout(() => {
        if (!disposed && watermarkEl) watermarkEl.style.opacity = "0.03";
      }, 400);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(animFrameId);
      clearTimeout(pinAnimTimeout);
      clearTimeout(watermarkTimeout);
      clearTimeout(previewTimer);
      clearTimeout(refreshTimer);
      window.removeEventListener("load", refreshScrollPin);
      window.removeEventListener("scroll", onScrollUpdate);
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
      if (pinTrigger) {
        pinTrigger.kill(true);
        pinTrigger = null;
      }
      if (pinSVG && pinSVG.parentNode) pinSVG.parentNode.removeChild(pinSVG);
      if (mapPreview && mapPreview.parentNode) mapPreview.parentNode.removeChild(mapPreview);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (scene) {
        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
          if (material) {
            (Array.isArray(material) ? material : [material]).forEach((m) => {
              const pm = m as THREE.MeshPhongMaterial;
              if (pm.map) pm.map.dispose();
              if (pm.bumpMap) pm.bumpMap.dispose();
              m.dispose();
            });
          }
        });
      }
      earthMesh = null;
    };
  }, [locationsKey]);

  return (
    <section className={styles.wrapper} id="globe-section" ref={wrapperRef} aria-label="Our global offices">
      {/* Large faded watermark */}
      <div className={styles.watermark} ref={watermarkRef} aria-hidden="true">
        {locations[0].watermark}
      </div>

      {/* Left panel — office info slides */}
      <div className={styles.leftPanel}>
        {locations.map((loc, i) => (
          <div
            key={loc.code}
            className={`${styles.slide} ${i === active ? styles.slideActive : ""}`}
            data-country={loc.code}
            data-index={i}
            aria-hidden={i !== active}
          >
            <div className={styles.countryCode}>{loc.code}</div>
            <div className={styles.activeRegionRow}>
              <span className={styles.regionLine} />
              <span className={styles.activeRegionLabel}>Active Region</span>
            </div>
            <h2 className={styles.countryNameLarge}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={loc.flag} alt={loc.flagAlt} className={styles.countryFlagLg} />
              {loc.name}
              <span className={styles.countryDot}>.</span>
            </h2>
            <p className={styles.locationHub}>{loc.hub}</p>
            <div className={styles.countryDesc}>
              <p>
                {loc.company}
                <br />
                {loc.address.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
                Email: <a href={`mailto:${loc.email}`}>{loc.email}</a>
                <br />
                Mobile: <a href={`tel:${loc.mobile.replace(/\s/g, "")}`}>{loc.mobile}</a>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right panel — the Earth */}
      <div className={styles.rightPanel} ref={pinHostRef}>
        <div className={styles.container} ref={containerRef} />
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.progressArea}>
          <div className={styles.progressDots}>
            {locations.map((loc, i) => (
              <button
                key={loc.code}
                type="button"
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                onClick={() => navigateRef.current(i)}
                aria-label={loc.name}
                aria-current={i === active}
              />
            ))}
          </div>
          <div className={styles.counter} aria-live="polite">
            0{active + 1} / 0{locations.length}
          </div>
        </div>
      </div>
    </section>
  );
}
