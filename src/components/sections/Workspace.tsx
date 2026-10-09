"use client";
import { r2Asset } from "@/lib/site-images";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
  useInView,
  type PanInfo,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { siteImages } from "@/lib/site-images";
import {
  LayoutGrid,
  Users,
  FileText,
  Settings as SettingsIcon,
  Mail,
  Server,
  Network,
  ShieldCheck,
  Database,
  Headset,
  UserCog,
  Briefcase,
  Download,
  Moon,
  Bell,
  Lock,
  Globe2,
  MessageSquare,
  Send,
  ArrowUpRight,
  X,
  Minus,
  Maximize2,
  Minimize2,
  type LucideIcon,
} from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand";
import { workspaceFolders, type WorkspaceFolder, type WorkspaceItem } from "@/data/workspace";

const ICONS: Record<string, LucideIcon> = {
  layoutGrid: LayoutGrid,
  users: Users,
  fileText: FileText,
  settings: SettingsIcon,
  mail: Mail,
  server: Server,
  network: Network,
  shieldCheck: ShieldCheck,
  database: Database,
  headset: Headset,
  userCog: UserCog,
  briefcase: Briefcase,
  download: Download,
  moon: Moon,
  bell: Bell,
  lock: Lock,
  globe2: Globe2,
  messageSquare: MessageSquare,
  send: Send,
};

const FOLDER_CLIP =
  "polygon(0 22%, 10% 22%, 16% 6%, 46% 6%, 52% 22%, 100% 22%, 100% 100%, 0 100%)";

const TASKBAR_HEIGHT = 44;

export default function Workspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [minimizedIds, setMinimizedIds] = useState<Set<string>>(new Set());
  const [maximizedIds, setMaximizedIds] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(() => new Date());
  const [booted, setBooted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const screenRef = useRef<HTMLDivElement>(null);
  const clickTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const screenInView = useInView(screenRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!screenInView) return;
    const bootTimer = setTimeout(() => setBooted(true), 1300);
    return () => clearTimeout(bootTimer);
  }, [screenInView]);

  useEffect(() => {
    if (!booted) return;
    const showTimer = setTimeout(() => setShowToast(true), 3500);
    const hideTimer = setTimeout(() => setShowToast(false), 9500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [booted]);

  const bringToFront = (id: string) =>
    setOpenIds((prev) => [...prev.filter((x) => x !== id), id]);

  const openFolder = (id: string) => {
    setSelectedId(id);
    setMinimizedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setOpenIds((prev) => (prev.includes(id) ? [...prev.filter((x) => x !== id), id] : [...prev, id]));
  };

  const closeFolder = (id: string) => {
    setOpenIds((prev) => prev.filter((x) => x !== id));
    setMinimizedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setMaximizedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleMinimize = (id: string) => {
    setMinimizedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    bringToFront(id);
  };

  const toggleMaximize = (id: string) => {
    setMaximizedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    bringToFront(id);
  };

  const handleTaskbarClick = (id: string) => {
    if (minimizedIds.has(id)) {
      toggleMinimize(id);
      return;
    }
    if (openIds[openIds.length - 1] === id) {
      toggleMinimize(id);
      return;
    }
    bringToFront(id);
    setSelectedId(id);
  };

  const handleFolderActivate = (id: string) => {
    setSelectedId(id);
    const existing = clickTimers.current.get(id);
    if (existing) {
      clearTimeout(existing);
      clickTimers.current.delete(id);
      openFolder(id);
    } else {
      const timer = setTimeout(() => clickTimers.current.delete(id), 300);
      clickTimers.current.set(id, timer);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setSelectedId(null);
  };

  const handleToastClick = () => {
    setShowToast(false);
    openFolder("messages");
  };

  const formattedNow = `${now.toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} · ${now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#29B9F2]/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-100 w-100 translate-x-1/3 translate-y-1/3 rounded-full bg-[#25D9C7]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#29B9F2]">
            Your Digital Workspace
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Everything About Vectrae, One Desktop Away
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Double-click a folder to open it, drag windows around, minimize or maximize them,
            just like the computer on your desk.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl" data-aos="zoom-in" data-aos-delay="100">
          <div className="relative rounded-[2rem] border border-white/10 bg-neutral-900 p-3 shadow-2xl sm:p-4">
            <div className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/10" />

            <div
              ref={screenRef}
              onClick={handleBackgroundClick}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] bg-black"
            >
              <Image
                src={siteImages.workspaceWallpaper}
                alt=""
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 960px, 100vw"
                className="pointer-events-none object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/55" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

              <div className="pointer-events-none absolute left-1/3 top-0 h-40 w-40 -translate-y-1/2 rounded-full bg-[#25D9C7]/20 blur-[80px]" />
              <div className="pointer-events-none absolute bottom-0 right-1/4 h-40 w-40 translate-y-1/2 rounded-full bg-[#29B9F2]/20 blur-[80px]" />

              <div className="relative flex h-full flex-col px-4 pb-14 pt-4 sm:px-8 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={r2Asset("/logo.png")}
                        alt="Vectrae"
                        width={140}
                        height={29}
                        className="h-4 w-auto sm:h-5"
                        priority
                      />
                      <span className="rounded border border-white/15 px-1 py-px text-[8px] font-semibold uppercase tracking-widest text-white/60">
                        OS
                      </span>
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40">
                      Enterprise. Simplified.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">
                      Welcome, <span className="text-[#29B9F2]">Guest</span>
                    </p>
                    <p className="text-[10px] text-white/40" suppressHydrationWarning>
                      {formattedNow}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-semibold text-white sm:text-3xl">
                    Welcome to your{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: BRAND_GRADIENT }}
                    >
                      Vectrae Workspace
                    </span>
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-xs text-white/50 sm:max-w-md sm:text-sm">
                    Double-click a folder to explore our products, people, and support, all in
                    one place.
                  </p>

                  <div className="mt-6 flex flex-wrap items-start justify-center gap-6 sm:mt-10 sm:gap-10">
                    {workspaceFolders.map((folder) => {
                      const Icon = ICONS[folder.icon];
                      const isSelected = selectedId === folder.id;
                      return (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFolderActivate(folder.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openFolder(folder.id);
                            }
                          }}
                          className="group flex w-20 cursor-pointer flex-col items-center gap-2 outline-none sm:w-24"
                        >
                          <span
                            className={`relative flex h-16 w-18 items-center justify-center border transition duration-200 sm:h-20 sm:w-24 ${
                              isSelected
                                ? "border-white/25 bg-black/85"
                                : "border-white/10 bg-black/65 group-hover:border-white/20 group-hover:bg-black/80"
                            }`}
                            style={{
                              clipPath: FOLDER_CLIP,
                              boxShadow: isSelected ? `0 0 28px ${folder.accent}55` : undefined,
                            }}
                          >
                            <Icon
                              className="h-7 w-7 translate-y-1.5 sm:h-9 sm:w-9 sm:translate-y-2"
                              style={{ color: folder.accent }}
                            />
                          </span>
                          <span
                            className={`text-xs sm:text-sm ${
                              isSelected ? "text-white" : "text-white/70"
                            }`}
                          >
                            {folder.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {openIds.map((id, index) => {
                  const folder = workspaceFolders.find((f) => f.id === id);
                  if (!folder) return null;
                  return (
                    <WorkspaceWindow
                      key={id}
                      folder={folder}
                      index={index}
                      isFocused={openIds[openIds.length - 1] === id}
                      isMinimized={minimizedIds.has(id)}
                      isMaximized={maximizedIds.has(id)}
                      screenRef={screenRef}
                      onClose={() => closeFolder(id)}
                      onMinimize={() => toggleMinimize(id)}
                      onMaximize={() => toggleMaximize(id)}
                      onFocus={() => bringToFront(id)}
                    />
                  );
                })}
              </AnimatePresence>

              {openIds.length > 0 && (
                <div
                  className="absolute inset-x-0 bottom-0 z-200 flex items-center justify-center gap-1.5 border-t border-white/10 bg-white/[0.03] px-3 py-2 backdrop-blur-md sm:gap-2"
                  style={{ height: TASKBAR_HEIGHT }}
                >
                  {openIds.map((id) => {
                    const folder = workspaceFolders.find((f) => f.id === id);
                    if (!folder) return null;
                    const Icon = ICONS[folder.icon];
                    const focused = openIds[openIds.length - 1] === id && !minimizedIds.has(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleTaskbarClick(id)}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
                          focused
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:bg-white/5 hover:text-white/80"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: folder.accent }} />
                        <span className="hidden sm:inline">{folder.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <AnimatePresence>
                {showToast && (
                  <motion.button
                    type="button"
                    onClick={handleToastClick}
                    initial={{ opacity: 0, x: 40, y: -10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-3 top-3 z-150 flex w-64 items-start gap-2.5 rounded-xl border border-white/15 bg-neutral-900/95 p-3 text-left shadow-2xl backdrop-blur-xl sm:right-4 sm:top-4 sm:w-72"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#29B9F2]/15 text-[#29B9F2]">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-white">Sales Team</span>
                        <span className="shrink-0 text-[9px] uppercase tracking-wide text-white/40">
                          now
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-white/60">
                        Thanks for reaching out, let&apos;s schedule a walkthrough.
                      </span>
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {!booted && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 z-300 flex flex-col items-center justify-center gap-5 bg-black"
                  >
                    <div className="pointer-events-none absolute h-48 w-48 rounded-full bg-[#29B9F2]/15 blur-[70px]" />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: [0.75, 1, 0.75], scale: [0.97, 1, 0.97] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <Image
                        src={r2Asset("/logo.png")}
                        alt="Vectrae"
                        width={280}
                        height={58}
                        className="h-9 w-auto sm:h-11"
                        priority
                      />
                    </motion.div>

                    <div className="relative h-1 w-40 overflow-hidden rounded-full bg-white/10 sm:w-48">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.15, ease: "easeInOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundImage: BRAND_GRADIENT }}
                      />
                    </div>

                    <p className="text-[10px] uppercase tracking-widest text-white/40">
                      Starting Vectrae OS…
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className="mx-auto h-8 w-28 bg-gradient-to-b from-neutral-800 to-neutral-900 sm:h-10 sm:w-32"
            style={{ clipPath: "polygon(35% 0,65% 0,80% 100%,20% 100%)" }}
          />
          <div className="mx-auto h-3 w-56 rounded-full bg-neutral-800 sm:h-4 sm:w-64" />
          <div className="mx-auto mt-2 h-3 w-40 rounded-full bg-black/40 blur-md" />
        </div>
      </div>
    </section>
  );
}

function WorkspaceWindow({
  folder,
  index,
  isFocused,
  isMinimized,
  isMaximized,
  screenRef,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: {
  folder: WorkspaceFolder;
  index: number;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  screenRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}) {
  const controls = useDragControls();
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const Icon = ICONS[folder.icon];
  const zIndex = 40 + index;

  const [size, setSize] = useState({ width: 340, height: 380 });
  const [snapEdge, setSnapEdge] = useState<"left" | "right" | null>(null);
  const [hoverEdge, setHoverEdge] = useState<"left" | "right" | null>(null);
  const preSnapPos = useRef({ x: 0, y: 0 });
  const resizeStart = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (isMaximized) {
      dragX.set(0);
      dragY.set(0);
    }
  }, [isMaximized, dragX, dragY]);

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    onFocus();
    if (snapEdge) {
      setSnapEdge(null);
      dragX.set(preSnapPos.current.x);
      dragY.set(preSnapPos.current.y);
    }
    controls.start(e);
  };

  const handleDrag = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const rect = screenRef.current?.getBoundingClientRect();
    if (!rect) return;
    const threshold = 32;
    if (info.point.x - rect.left < threshold) setHoverEdge("left");
    else if (rect.right - info.point.x < threshold) setHoverEdge("right");
    else setHoverEdge(null);
  };

  const handleDragEnd = () => {
    if (hoverEdge) {
      preSnapPos.current = { x: dragX.get(), y: dragY.get() };
      dragX.set(0);
      dragY.set(0);
      setSnapEdge(hoverEdge);
    }
    setHoverEdge(null);
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onFocus();
    resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height };
    const handleMove = (ev: PointerEvent) => {
      if (!resizeStart.current) return;
      const dx = ev.clientX - resizeStart.current.x;
      const dy = ev.clientY - resizeStart.current.y;
      setSize({
        width: Math.min(640, Math.max(280, resizeStart.current.width + dx)),
        height: Math.min(560, Math.max(220, resizeStart.current.height + dy)),
      });
    };
    const handleUp = () => {
      resizeStart.current = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const isFreeFloating = !isMaximized && !snapEdge;

  const style: React.CSSProperties = isMaximized
    ? { position: "absolute", top: 0, left: 0, right: 0, bottom: TASKBAR_HEIGHT, zIndex }
    : snapEdge
    ? {
        position: "absolute",
        top: 0,
        bottom: TASKBAR_HEIGHT,
        left: snapEdge === "left" ? 0 : "50%",
        right: snapEdge === "left" ? "50%" : 0,
        zIndex,
      }
    : {
        position: "absolute",
        top: `calc(50% - ${size.height / 2}px + ${index * 18}px)`,
        left: `calc(50% - ${size.width / 2}px + ${index * 18}px)`,
        width: size.width,
        height: size.height,
        zIndex,
        pointerEvents: isMinimized ? "none" : "auto",
      };

  return (
    <>
      {hoverEdge && (
        <div
          className="pointer-events-none absolute rounded-lg border-2 border-dashed"
          style={{
            top: 8,
            bottom: TASKBAR_HEIGHT + 8,
            left: hoverEdge === "left" ? 8 : "50%",
            right: hoverEdge === "left" ? "50%" : 8,
            borderColor: folder.accent,
            backgroundColor: `${folder.accent}22`,
            zIndex: 90,
          }}
        />
      )}
      <motion.div
        drag={!isMaximized}
        dragControls={controls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.04}
        dragConstraints={screenRef}
        onPointerDown={onFocus}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isMinimized ? 0 : 1, scale: isMinimized ? 0.85 : 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{ ...style, x: dragX, y: dragY }}
        className={`flex flex-col overflow-hidden border bg-neutral-900/95 shadow-2xl backdrop-blur-xl transition-[border-radius] duration-200 ${
          isMaximized || snapEdge ? "rounded-none" : "rounded-xl"
        } ${isFocused ? "border-white/25" : "border-white/10"}`}
      >
        <div
          onPointerDown={handleHeaderPointerDown}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          className={`flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2 ${
            isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Close"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="group/dot flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#ff5f57] transition hover:brightness-110"
            >
              <X
                className="h-2 w-2 text-[#4d0000] opacity-0 transition-opacity group-hover/dot:opacity-100"
                strokeWidth={3}
              />
            </button>
            <button
              type="button"
              aria-label="Minimize"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="group/dot flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#febc2e] transition hover:brightness-110"
            >
              <Minus
                className="h-2 w-2 text-[#7a4b00] opacity-0 transition-opacity group-hover/dot:opacity-100"
                strokeWidth={4}
              />
            </button>
            <button
              type="button"
              aria-label={isMaximized ? "Restore" : "Maximize"}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="group/dot flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#28c840] transition hover:brightness-110"
            >
              {isMaximized ? (
                <Minimize2
                  className="h-1.5 w-1.5 text-[#0a4d16] opacity-0 transition-opacity group-hover/dot:opacity-100"
                  strokeWidth={4}
                />
              ) : (
                <Maximize2
                  className="h-1.5 w-1.5 text-[#0a4d16] opacity-0 transition-opacity group-hover/dot:opacity-100"
                  strokeWidth={4}
                />
              )}
            </button>
          </div>
          <Icon className="ml-1.5 h-3.5 w-3.5" style={{ color: folder.accent }} />
          <span className="text-xs font-medium text-white/80">{folder.label}</span>
        </div>

        <div
          className="flex-1 space-y-2 overflow-y-auto p-3"
          style={{ maxHeight: isFreeFloating ? size.height - 46 : undefined }}
        >
          {folder.items.map((item, i) => (
            <WorkspaceRow key={i} item={item} />
          ))}
        </div>

        {isFreeFloating && !isMinimized && (
          <div
            onPointerDown={handleResizePointerDown}
            className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
            style={{
              backgroundImage:
                "linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.35) 46%, transparent 46%, transparent 60%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.35) 66%, transparent 66%)",
            }}
          />
        )}
      </motion.div>
    </>
  );
}

function WorkspaceRow({ item }: { item: WorkspaceItem }) {
  const Icon = ICONS[item.icon] ?? FileText;
  const hasToggle = item.toggleDefault !== undefined;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-white/10 hover:bg-white/[0.04]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-white">{item.title}</h4>
          {item.tag && (
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-white/40">
              {item.tag}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-white/50">{item.description}</p>
        {item.action && (
          <Link
            href={item.action.href}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundImage: BRAND_GRADIENT }}
            className="mt-2 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-black transition hover:opacity-90"
          >
            {item.action.label}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {hasToggle && <ToggleSwitch defaultOn={item.toggleDefault} />}
    </div>
  );
}

function ToggleSwitch({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOn((v) => !v);
      }}
      className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${
        on ? "bg-[#25D9C7]" : "bg-white/15"
      }`}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow"
        animate={{ x: on ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
