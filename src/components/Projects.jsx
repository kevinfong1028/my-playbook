import { useState, useEffect, useRef, useCallback } from "react";
import { Github, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import SectionHead from "./SectionHead";
import { projects } from "../data/projects";

import dash01 from "../img/dash-01.png";
import dash02 from "../img/dash-02.png";
import shop01 from "../img/shop-01.png";
import shop02 from "../img/shop-02.png";
import shop03 from "../img/shop-03.png";
import shop04 from "../img/shop-04.png";
import shop05 from "../img/shop-05.png";
import shop06 from "../img/shop-06.png";
import shop07 from "../img/shop-07.png";
import shop08 from "../img/shop-08.png";
import shop09 from "../img/shop-09.png";
import shop10 from "../img/shop-10.png";

const PROJECT_SLIDES = {
	a: [
		{ id: 1, src: dash01, alt: "Dashboard 截圖 1" },
		{ id: 2, src: dash02, alt: "Dashboard 截圖 2" },
	],
	b: [
		{ id: 1, src: shop01, alt: "Shop 截圖 1" },
		{ id: 2, src: shop02, alt: "Shop 截圖 2" },
		{ id: 3, src: shop03, alt: "Shop 截圖 3" },
		{ id: 4, src: shop04, alt: "Shop 截圖 4" },
		{ id: 5, src: shop05, alt: "Shop 截圖 5" },
		{ id: 6, src: shop06, alt: "Shop 截圖 6" },
		{ id: 7, src: shop07, alt: "Shop 截圖 7" },
		{ id: 8, src: shop08, alt: "Shop 截圖 8" },
		{ id: 9, src: shop09, alt: "Shop 截圖 9" },
		{ id: 10, src: shop10, alt: "Shop 截圖 10" },
	],
};

function ImageSlider({ slides, onImageClick }) {
	const [current, setCurrent] = useState(0);

	if (!slides || slides.length === 0) {
		return (
			<div className="mb-6 flex aspect-video items-center justify-center rounded-lg border border-line">
				<span className="font-mono text-xs text-dim">{"// no screenshots yet"}</span>
			</div>
		);
	}

	const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
	const next = () => setCurrent((c) => (c + 1) % slides.length);

	return (
		<div className="relative mb-6 overflow-hidden rounded-lg border border-line">
			{/* track */}
			<div
				className="flex transition-transform duration-300 ease-in-out"
				style={{ transform: `translateX(-${current * 100}%)` }}
			>
				{slides.map((slide, i) => (
					<img
						key={slide.id}
						src={slide.src}
						alt={slide.alt}
						onClick={() => onImageClick(i)}
						className="aspect-video min-w-full shrink-0 cursor-pointer object-cover"
					/>
				))}
			</div>

			{/* arrows — 只在多張時顯示 */}
			{slides.length > 1 && (
				<>
					<button
						type="button"
						onClick={prev}
						className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white/80 transition-colors hover:bg-black/80 hover:text-white"
					>
						<ChevronLeft size={18} />
					</button>
					<button
						type="button"
						onClick={next}
						className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white/80 transition-colors hover:bg-black/80 hover:text-white"
					>
						<ChevronRight size={18} />
					</button>

					{/* dots */}
					<div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
						{slides.map((_, i) => (
							<button
								key={i}
								type="button"
								onClick={() => setCurrent(i)}
								className={`h-1.5 w-1.5 cursor-pointer rounded-full transition-colors ${
									i === current ? "bg-acc" : "bg-white/40 hover:bg-white/70"
								}`}
							/>
						))}
					</div>

					{/* counter */}
					<span className="absolute right-3 top-2 font-mono text-xs text-white/60">
						{current + 1} / {slides.length}
					</span>
				</>
			)}
		</div>
	);
}

// Track-based lightbox: 3 slots always in DOM, only trackX changes
// When navigating: animate track → wait → swap index → silent reset
// This prevents any image-swap jump during transition
function ImageLightbox({ slides, initialIndex, onClose }) {
	const [current, setCurrent] = useState(initialIndex);
	const [trackOffset, setTrackOffset] = useState(0); // extra px added to base
	const [animating, setAnimating] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const dragStartX = useRef(null);
	const locked = useRef(false); // prevent overlapping navigations
	const wasDragged = useRef(false); // suppress click-to-close after drag

	const prevIdx = (current - 1 + slides.length) % slides.length;
	const nextIdx = (current + 1) % slides.length;

	// slot width = 75vw; step between slots = 75vw (no gap in track)
	// base track translateX that centers the middle slot:
	//   middle slot center at (75 + 75/2)vw = 112.5vw from track left
	//   to sit at 50vw (viewport center): offset = 50 - 112.5 = -62.5vw
	// So: transform = translateX(calc(-62.5vw + {trackOffset}px))

	const DURATION = 340;

	const navigate = useCallback((dir) => {
		if (locked.current) return;
		locked.current = true;
		const slotPx = window.innerWidth * 0.75;
		setAnimating(true);
		setTrackOffset(dir === "next" ? -slotPx : slotPx);
		setTimeout(() => {
			// Swap index THEN reset without animation → seamless
			if (dir === "next") setCurrent((c) => (c + 1) % slides.length);
			else setCurrent((c) => (c - 1 + slides.length) % slides.length);
			setAnimating(false);
			setTrackOffset(0);
			locked.current = false;
		}, DURATION);
	}, []);

	// Mouse drag — attached to document so fast moves don't lose tracking
	useEffect(() => {
		const onMove = (e) => {
			if (!dragStartX.current || locked.current) return;
			const delta = e.clientX - dragStartX.current;
			if (Math.abs(delta) > 4) wasDragged.current = true;
			setTrackOffset(delta);
		};
		const onUp = (e) => {
			if (!dragStartX.current) return;
			const delta = e.clientX - dragStartX.current;
			dragStartX.current = null;
			setIsDragging(false);
			if (Math.abs(delta) > window.innerWidth * 0.12) {
				navigate(delta < 0 ? "next" : "prev");
			} else {
				// snap back
				setAnimating(true);
				setTrackOffset(0);
				setTimeout(() => setAnimating(false), DURATION);
			}
		};
		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onUp);
		return () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onUp);
		};
	}, [navigate]);

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") navigate("prev");
			if (e.key === "ArrowRight") navigate("next");
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onClose, navigate]);

	// Normalized drag progress for per-image visual interpolation
	const slotVw = 75;
	const progress = Math.max(-1, Math.min(1, trackOffset / (window.innerWidth * slotVw / 100)));
	const prevScale  = 0.85 + 0.15 * Math.max(0,  progress);
	const prevBright = 0.35 + 0.65 * Math.max(0,  progress);
	const nextScale  = 0.85 + 0.15 * Math.max(0, -progress);
	const nextBright = 0.35 + 0.65 * Math.max(0, -progress);
	const easing = `${DURATION}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;

	const handleClose = () => {
		if (wasDragged.current) { wasDragged.current = false; return; }
		onClose();
	};

	return (
		<div className="fixed inset-0 z-70 overflow-hidden" onClick={handleClose}>
			<div className="absolute inset-0 bg-black/92 backdrop-blur-sm" />

			{/* 3-slot track — 225vw wide, centered on slot 1 */}
			<div
				className="absolute inset-0 flex items-center"
				style={{
					width: "225vw",
					transform: `translateX(calc(-62.5vw + ${trackOffset}px))`,
					transition: animating ? `transform ${easing}` : "none",
					cursor: isDragging ? "grabbing" : "grab",
				}}
				onMouseDown={(e) => {
					if (locked.current) return;
					dragStartX.current = e.clientX;
					setIsDragging(true);
				}}
			>
				{/* prev slot */}
				<div className="flex h-full w-[75vw] shrink-0 items-center justify-center px-8">
					<img
						src={slides[prevIdx].src}
						alt={slides[prevIdx].alt}
						draggable={false}
						className="max-h-[80vh] max-w-full select-none rounded-lg object-contain shadow-xl"
						style={{
							transform: `scale(${prevScale})`,
							filter: `brightness(${prevBright})`,
							transition: animating ? `all ${easing}` : "none",
							pointerEvents: "none",
						}}
					/>
				</div>

				{/* current slot */}
				<div className="flex h-full w-[75vw] shrink-0 items-center justify-center px-8">
					<img
						src={slides[current].src}
						alt={slides[current].alt}
						draggable={false}
						onClick={(e) => e.stopPropagation()}
						className="max-h-[82vh] max-w-full select-none rounded-lg object-contain shadow-2xl"
					/>
				</div>

				{/* next slot */}
				<div className="flex h-full w-[75vw] shrink-0 items-center justify-center px-8">
					<img
						src={slides[nextIdx].src}
						alt={slides[nextIdx].alt}
						draggable={false}
						className="max-h-[80vh] max-w-full select-none rounded-lg object-contain shadow-xl"
						style={{
							transform: `scale(${nextScale})`,
							filter: `brightness(${nextBright})`,
							transition: animating ? `all ${easing}` : "none",
							pointerEvents: "none",
						}}
					/>
				</div>
			</div>

			{/* counter */}
			<span className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 font-mono text-xs text-white/50">
				{current + 1} / {slides.length}
			</span>

			{/* prev arrow */}
			<button
				type="button"
				onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
				className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
			>
				<ChevronLeft size={22} />
			</button>

			{/* next arrow */}
			<button
				type="button"
				onClick={(e) => { e.stopPropagation(); navigate("next"); }}
				className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
			>
				<ChevronRight size={22} />
			</button>

			{/* close */}
			<button
				type="button"
				onClick={(e) => { e.stopPropagation(); onClose(); }}
				aria-label="Close lightbox"
				className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
			>
				<X size={20} />
			</button>
		</div>
	);
}

function ProjectCard({ project, index, onOpen, delay = 0 }) {
	const [ref, shown] = useReveal();
	return (
		<article
			ref={ref}
			style={{
				transform: shown ? "none" : "translateY(40px)",
				opacity: shown ? 1 : 0,
				transition: `opacity .6s cubic-bezier(.2,.7,.3,1) ${delay}ms, transform .6s cubic-bezier(.2,.7,.3,1) ${delay}ms`,
			}}
			className="group relative flex flex-col gap-4 rounded-xl border border-line bg-panel p-6 hover:border-acc/60 hover:bg-panel2 hover:shadow-[0_18px_40px_-22px_rgba(170,204,0,0.45)]"
		>
			<div className="flex items-center justify-between">
				<span className="font-mono text-xs text-dim">{index}</span>
				<span className="font-mono text-xs text-dim transition-colors group-hover:text-acc">
					{"/* project */"}
				</span>
			</div>
			<h3 className="font-mono text-lg font-semibold text-fg transition-colors group-hover:text-acc">
				{project.title}
			</h3>
			<p className="flex-1 text-sm leading-relaxed text-mut">
				{project.description}
			</p>
			<div className="flex flex-wrap gap-2">
				{project.tags.map((tag) => (
					<span
						key={tag}
						className="rounded border border-line2 bg-ink px-2 py-1 font-mono text-xs text-acc"
					>
						{tag}
					</span>
				))}
			</div>
			<button
				type="button"
				onClick={() => onOpen(project)}
				className="group/btn mt-1 flex cursor-pointer items-center justify-between border-t border-line pt-4 font-mono text-sm text-mut transition-colors hover:text-acc"
			>
				<span>
					<span className="text-dim transition-colors group-hover/btn:text-acc">
						$
					</span>{" "}
					detail
				</span>
				<span className="transition-transform group-hover/btn:translate-x-1">
					→
				</span>
			</button>
		</article>
	);
}

function ProjectModal({ project, onClose }) {
	const [lightboxIndex, setLightboxIndex] = useState(null);
	const slides = PROJECT_SLIDES[project.id] ?? [];

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") {
				if (lightboxIndex !== null) setLightboxIndex(null);
				else onClose();
			}
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [onClose, lightboxIndex]);

	return (
		<>
			<div className="fixed inset-0 z-60 flex items-center justify-center p-4">
				<div
					className="modal-overlay absolute inset-0 bg-black/70 backdrop-blur-sm"
					onClick={onClose}
				/>
				<div className="modal-panel relative flex h-[70vh] w-[90vw] max-w-230 flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-2xl md:w-[60vw]">
					{/* title bar */}
					<div className="flex shrink-0 items-center justify-between border-b border-line bg-ink/60 px-5 py-3">
						<div className="flex items-center gap-2">
							<span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
							<span className="h-3 w-3 rounded-full bg-[#febc2e]" />
							<span className="h-3 w-3 rounded-full bg-acc" />
							<span className="ml-3 hidden font-mono text-xs text-dim sm:inline">
								~/projects/{project.id} — readme.md
							</span>
						</div>
						<button
							onClick={onClose}
							aria-label="Close"
							className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-dim transition-colors hover:bg-panel2 hover:text-acc"
						>
							<X size={18} />
						</button>
					</div>

					{/* scrollable body */}
					<div className="flex-1 overflow-y-auto p-6 sm:p-8">
						<ImageSlider slides={slides} onImageClick={setLightboxIndex} />
						<h3 className="mb-2 font-mono text-2xl font-bold text-fg">
							{project.title}
						</h3>
						<p className="mb-6 font-mono text-xs text-acc">
							&lt; {project.tags.join(" · ")} /&gt;
						</p>
						<p className="mb-7 leading-relaxed text-mut">{project.detail}</p>
						<div className="flex flex-wrap gap-3 border-t border-line pt-6">
							{project.github && (
								<a
									href={project.github}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-2 rounded-md bg-acc px-4 py-2 font-mono text-sm font-semibold text-ink transition-all hover:-translate-y-0.5"
								>
									<Github size={15} /> Code
								</a>
							)}
							{project.demo && (
								<a
									href={project.demo}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-2 rounded-md border border-line2 px-4 py-2 font-mono text-sm text-mut transition-colors hover:border-acc hover:text-acc"
								>
									<ExternalLink size={15} /> Demo
								</a>
							)}
						</div>
					</div>
				</div>
			</div>

			{lightboxIndex !== null && (
				<ImageLightbox
					slides={slides}
					initialIndex={lightboxIndex}
					onClose={() => setLightboxIndex(null)}
				/>
			)}
		</>
	);
}

export default function Projects() {
	const [active, setActive] = useState(null);
	return (
		<section
			id="projects"
			className="px-6 py-28"
		>
			<div className="mx-auto max-w-5xl">
				<SectionHead index="02">作品集</SectionHead>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((project, idx) => (
						<ProjectCard
							key={project.id}
							project={project}
							index={String(idx + 1).padStart(2, "0")}
							onOpen={setActive}
							delay={idx * 120}
						/>
					))}
				</div>
			</div>
			{active && (
				<ProjectModal
					project={active}
					onClose={() => setActive(null)}
				/>
			)}
		</section>
	);
}
