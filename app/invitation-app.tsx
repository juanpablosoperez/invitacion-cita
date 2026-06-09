"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type InvitationData = {
  date: string;
  time: string;
  food: string[];
  plan: string;
  comments: string;
};

const funnyMessages = [
  "El gato acaba de bloquear esa opción 🐈",
  "No tan rápido, firulais está mirando 🐶",
  "¿Segura? Hay un michi decepcionado 🥺",
  "El botón No se fue a comprar churros 😌",
];

const planOptions = ["🎥 Cine modo crítica", "☕ Merienda chismosa", "🌅 Paseo con cara de turistas", "🎳 Bowling sin dignidad", "🎮 Arcade competitivo", "🎤 Karaoke vergonzoso", "🎨 Sorpresa absurda", "🐾 Plan con mascotas"];

const planFoodOptions: Record<string, string[]> = {
  "🎥 Cine modo crítica": ["🍿 Balde de pochoclos XXL", "🥤 Gaseosa tamaño sospechoso", "🍫 Chocolate escondido", "🌭 Panchito de película", "🧀 Nachos anti glamour", "🍦 Helado post créditos"],
  "☕ Merienda chismosa": ["🥐 Medialunas serias", "🍰 Torta para compartir o no", "☕ Café con espuma ridícula", "🧉 Mate con facturas", "🥞 Pancakes dramáticos", "🍪 Cookies nivel abuela"],
  "🌅 Paseo con cara de turistas": ["🥪 Sanguchitos de picnic", "🧃 Jugo como excursión escolar", "🍓 Frutillas aesthetic", "🥨 Algo para caminar y masticar", "🍦 Helado obligatorio", "🧀 Picadita portátil"],
  "🎳 Bowling sin dignidad": ["🍔 Hamburguesas de campeón", "🍟 Papas para culpar", "🍕 Pizza entre turnos", "🥤 Licuado de concentración", "🌮 Tacos anti strike", "🍗 Nuggets motivacionales"],
  "🎮 Arcade competitivo": ["🍕 Pizza gamer", "🍜 Ramen de jefe final", "🍔 Combo desbloqueable", "🧋 Bubble tea de energía", "🍫 Snacks para sobornar", "🌭 Panchos pixelados"],
  "🎤 Karaoke vergonzoso": ["🍹 Trago sin afinación", "🍟 Papas para el pánico", "🍕 Pizza para el público", "🍣 Sushi de diva", "🥟 Empanaditas de backstage", "🍰 Postre para olvidar"],
  "🎨 Sorpresa absurda": ["🎲 Lo que diga una moneda", "🥡 Delivery misterioso", "🍝 Pastas dramáticas", "🌮 Tacos de plot twist", "🍣 Sushi sorpresa", "🥗 Algo liviano para fingir control"],
  "🐾 Plan con mascotas": ["🦴 Snacks para el perrito", "🐟 Algo aprobado por michis", "🍕 Pizza humana", "🥐 Merienda de paseo", "🍦 Helado con supervisión canina", "🥩 Parrillita feliz"],
};

const stepTitles = ["Invitación", "Celebración", "Fecha", "Plan", "Opciones", "Detalle", "Cita"];

const initialData: InvitationData = {
  date: "",
  time: "",
  food: [],
  plan: "",
  comments: "",
};

export default function InvitationApp() {
  const [step, setStep] = useState<Step>(0);
  const [data, setData] = useState<InvitationData>(initialData);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [funnyMessage, setFunnyMessage] = useState("Intentá tocar el No si podés");
  const [acceptedBurst, setAcceptedBurst] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const progress = ((step + 1) / stepTitles.length) * 100;
  const yesScale = 1 + Math.min(noAttempts, 7) * 0.08;
  const noScale = Math.max(0.45, 1 - noAttempts * 0.08);
  const currentFoodOptions = data.plan ? planFoodOptions[data.plan] : [];

  const summaryText = useMemo(() => {
    return `Hola 🐶🐱\n\nAceptaste salir conmigo, quedó registrado por el comité de mascotas 😊\n\n📅 Fecha: ${formatDate(data.date)}\n\n🕒 Hora: ${data.time || "A confirmar"}\n\n🎯 Plan: ${data.plan || "A elegir"}\n\n🍽️ Opciones elegidas: ${data.food.join(", ") || "A elegir"}\n\n📝 Comentarios: ${data.comments || "Sin comentarios"}\n\nNos vemos pronto. Llevo buena onda y cero dignidad 💅`;
  }, [data]);

  useEffect(() => {
    return () => stopMusic();
  }, []);

  function updateData(nextData: Partial<InvitationData>) {
    setData((current) => ({ ...current, ...nextData }));
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, 6) as Step);
  }

  function escapeNoButton() {
    const nextAttempt = noAttempts + 1;
    const maxX = Math.min(140, window.innerWidth * 0.32);
    const maxY = Math.min(170, window.innerHeight * 0.22);
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;

    setNoAttempts(nextAttempt);
    setNoPosition({
      x: directionX * (40 + Math.random() * maxX),
      y: directionY * (30 + Math.random() * maxY),
    });
    setFunnyMessage(funnyMessages[nextAttempt % funnyMessages.length]);
  }

  function acceptInvitation() {
    setAcceptedBurst(true);
    window.setTimeout(() => {
      setAcceptedBurst(false);
      setStep(1);
    }, 1400);
  }

  function toggleFood(option: string) {
    updateData({
      food: data.food.includes(option) ? data.food.filter((item) => item !== option) : [...data.food, option],
    });
  }

  function playSoftNote(context: AudioContext, frequency: number, delay: number) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + delay + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + 0.95);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime + delay);
    oscillator.stop(context.currentTime + delay + 1);
  }

  function startMusic() {
    const context = new AudioContext();
    const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];
    audioRef.current = context;
    notes.forEach((note, index) => playSoftNote(context, note, index * 0.42));
    intervalRef.current = window.setInterval(() => {
      notes.forEach((note, index) => playSoftNote(context, note, index * 0.42));
    }, 3300);
    setIsMusicPlaying(true);
  }

  function stopMusic() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioRef.current) {
      void audioRef.current.close();
      audioRef.current = null;
    }
    setIsMusicPlaying(false);
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      stopMusic();
      return;
    }
    startMusic();
  }

  async function copyInvitation() {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/543496400943?text=${encodeURIComponent(summaryText)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className={darkMode ? "dark" : ""}>
      <div className="relative min-h-screen overflow-hidden bg-[#fffaf1] px-4 py-5 text-[#3b2415] transition-colors duration-700 dark:bg-[#111827] dark:text-[#fff7ed] sm:px-6">
        <FunnyBackground darkMode={darkMode} />
        <TopBar
          darkMode={darkMode}
          isMusicPlaying={isMusicPlaying}
          progress={progress}
          step={step}
          onToggleDark={() => setDarkMode((value) => !value)}
          onToggleMusic={toggleMusic}
        />
        <AnimatePresence>{acceptedBurst && <CelebrationBurst />}</AnimatePresence>

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-116px)] w-full max-w-4xl items-center justify-center py-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Screen key="intro">
                <div className="mx-auto max-w-xl text-center">
                  <EmojiBadge>🐶</EmojiBadge>
                  <h1 className="mt-6 text-4xl font-black tracking-tight text-rose-950 dark:text-rose-50 sm:text-6xl">¿Te gustaría salir conmigo?</h1>
                  <p className="mx-auto mt-4 max-w-md text-base leading-7 text-amber-800 dark:text-orange-100 sm:text-lg">Prometo una salida con buen humor, comentarios innecesarios y energía de perrito que vio una pelota.</p>
                  <motion.p animate={{ scale: [1, 1.04, 1] }} className="mt-7 min-h-7 text-sm font-bold text-red-400 sm:text-base">
                    {funnyMessage}
                  </motion.p>
                  <div className="relative mt-8 flex min-h-28 flex-wrap items-center justify-center gap-5">
                    <motion.button
                      whileHover={{ scale: yesScale + 0.05 }}
                      whileTap={{ scale: yesScale - 0.04 }}
                      animate={{ scale: yesScale }}
                      onClick={acceptInvitation}
                      className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-9 py-4 text-lg font-black text-white shadow-2xl shadow-amber-300/60 transition hover:brightness-105 dark:shadow-orange-950/50"
                    >
                      Sí, obvio 🐾
                    </motion.button>
                    <motion.button
                      onMouseEnter={escapeNoButton}
                      onFocus={escapeNoButton}
                      onTouchStart={escapeNoButton}
                      onClick={escapeNoButton}
                      animate={{ x: noPosition.x, y: noPosition.y, scale: noScale, rotate: noAttempts % 2 ? -6 : 6 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                      className="rounded-full border border-amber-200 bg-white/80 px-8 py-4 text-lg font-extrabold text-orange-600 shadow-xl shadow-amber-200/60 backdrop-blur transition dark:border-orange-800 dark:bg-white/10 dark:text-orange-100"
                    >
                      No, miau 😅
                    </motion.button>
                  </div>
                </div>
              </Screen>
            )}

            {step === 1 && (
              <Screen key="yes">
                <Card className="text-center">
                  <EmojiBadge>🐱</EmojiBadge>
                  <h2 className="mt-6 text-3xl font-black sm:text-5xl">¡Sabía que dirías que sí!</h2>
                  <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-amber-800 dark:text-orange-100">Ya estaba por mandarte un PowerPoint con gatitos tristes, menos mal que no hizo falta.</p>
                  <PrimaryButton onClick={nextStep}>Continuar 🐾</PrimaryButton>
                </Card>
              </Screen>
            )}

            {step === 2 && (
              <Screen key="date">
                <Card>
                  <EmojiBadge>📅</EmojiBadge>
                  <h2 className="mt-6 text-center text-3xl font-black sm:text-5xl">¿Cuándo estás libre?</h2>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Field label="Fecha">
                      <input value={data.date} onChange={(event) => updateData({ date: event.target.value })} type="date" className="input" />
                    </Field>
                    <Field label="Hora">
                      <input value={data.time} onChange={(event) => updateData({ time: event.target.value })} type="time" className="input" />
                    </Field>
                  </div>
                  <PrimaryButton disabled={!data.date || !data.time} onClick={nextStep}>Siguiente</PrimaryButton>
                </Card>
              </Screen>
            )}

            {step === 3 && (
              <Screen key="plan">
                <Card>
                  <EmojiBadge>🎲</EmojiBadge>
                  <h2 className="mt-6 text-center text-3xl font-black sm:text-5xl">Primero elegí el caos</h2>
                  <p className="mx-auto mt-3 max-w-lg text-center text-amber-800 dark:text-orange-100">Según el plan, aparecen opciones distintas. Tecnología de punta y un perro administrativo.</p>
                  <OptionGrid options={planOptions} selected={data.plan ? [data.plan] : []} onSelect={(option) => updateData({ plan: option, food: [] })} />
                  <PrimaryButton disabled={!data.plan} onClick={nextStep}>Continuar</PrimaryButton>
                </Card>
              </Screen>
            )}

            {step === 4 && (
              <Screen key="food">
                <Card>
                  <EmojiBadge>🍿</EmojiBadge>
                  <h2 className="mt-6 text-center text-3xl font-black sm:text-5xl">Opciones para este plan</h2>
                  <p className="mx-auto mt-3 max-w-lg text-center text-amber-800 dark:text-orange-100">Plan elegido: <span className="font-black">{data.plan}</span></p>
                  <OptionGrid options={currentFoodOptions} selected={data.food} onSelect={toggleFood} multiple />
                  <PrimaryButton disabled={data.food.length === 0} onClick={nextStep}>Continuar</PrimaryButton>
                </Card>
              </Screen>
            )}

            {step === 5 && (
              <Screen key="detail">
                <Card>
                  <EmojiBadge>🦴</EmojiBadge>
                  <h2 className="mt-6 text-center text-3xl font-black sm:text-5xl">Un último detalle...</h2>
                  <Field label="¿Hay algo que te gustaría hacer ese día?">
                    <textarea value={data.comments} onChange={(event) => updateData({ comments: event.target.value })} className="input min-h-36 resize-none" placeholder="Ej: quiero postre, no me hagas caminar 40 cuadras, llevá chistes mejores..." />
                  </Field>
                  <PrimaryButton onClick={nextStep}>Finalizar</PrimaryButton>
                </Card>
              </Screen>
            )}

            {step === 6 && (
              <Screen key="final">
                <Card className="text-center">
                  <EmojiBadge>🐾</EmojiBadge>
                  <h2 className="mt-6 text-4xl font-black sm:text-6xl">¡Es una cita! 🐶</h2>
                  <div className="mt-8 grid gap-3 text-left text-sm sm:text-base">
                    <SummaryRow label="📅 Fecha elegida" value={formatDate(data.date)} />
                    <SummaryRow label="🕒 Hora elegida" value={data.time || "A confirmar"} />
                    <SummaryRow label="🎯 Plan elegido" value={data.plan || "A elegir"} />
                    <SummaryRow label="🍽️ Opciones elegidas" value={data.food.join(", ") || "A elegir"} />
                    <SummaryRow label="📝 Comentarios" value={data.comments || "Sin comentarios"} />
                  </div>
                  <p className="mx-auto mt-7 max-w-md text-lg font-bold leading-8 text-orange-500">Contrato verbal firmado por un perro imaginario. Cancelar requiere presentar certificado de michi gruñón.</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <SecondaryButton onClick={copyInvitation}>{copied ? "Copiado 🐾" : "Copiar invitación"}</SecondaryButton>
                    <PrimaryButton compact onClick={shareWhatsApp}>Compartir por WhatsApp</PrimaryButton>
                  </div>
                </Card>
              </Screen>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

function TopBar({ darkMode, isMusicPlaying, progress, step, onToggleDark, onToggleMusic }: { darkMode: boolean; isMusicPlaying: boolean; progress: number; step: number; onToggleDark: () => void; onToggleMusic: () => void }) {
  return (
    <header className="relative z-20 mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/65 p-3 shadow-xl shadow-amber-200/50 backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-400">Invitación Especial</p>
          <p className="mt-1 text-sm font-bold text-amber-950 dark:text-orange-50">{stepTitles[step]}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleMusic} className="control-button" aria-label="Activar o pausar música">{isMusicPlaying ? "Pausar ♪" : "Play ♪"}</button>
          <button onClick={onToggleDark} className="control-button" aria-label="Cambiar modo de color">{darkMode ? "Luz" : "Noche"}</button>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-100 dark:bg-white/10">
        <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-rose-400" />
      </div>
    </header>
  );
}

function FunnyBackground({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-200/70 blur-3xl dark:bg-orange-900/30" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-100/90 blur-3xl dark:bg-amber-950/40" />
      <div className="absolute -left-24 bottom-16 h-72 w-72 rounded-full bg-pink-100/80 blur-3xl dark:bg-slate-700/30" />
      {Array.from({ length: 26 }).map((_, index) => (
        <span
          key={index}
          className="floating-critter absolute text-lg opacity-60"
          style={{
            left: `${(index * 37) % 100}%`,
            bottom: `-${10 + (index % 7) * 8}%`,
            animationDuration: `${9 + (index % 8)}s`,
            animationDelay: `${(index % 10) * 0.8}s`,
            filter: darkMode ? "drop-shadow(0 0 10px rgba(251, 146, 60, 0.35))" : "none",
          }}
        >
          {["🐶", "🐱", "🐾", "🦴", "🧶", "🍿"][index % 6]}
        </span>
      ))}
    </div>
  );
}

function CelebrationBurst() {
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {Array.from({ length: 48 }).map((_, index) => (
        <motion.span
          key={index}
          initial={{ x: "50vw", y: "55vh", scale: 0, rotate: 0 }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 85}vh`,
            scale: [0, 1.25, 0.7],
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.25, ease: "easeOut" }}
          className="absolute text-2xl sm:text-4xl"
        >
          {index % 5 === 0 ? "🎉" : index % 5 === 1 ? "🐶" : index % 5 === 2 ? "🐱" : index % 5 === 3 ? "🐾" : "✨"}
        </motion.span>
      ))}
    </motion.div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 26, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -24, scale: 0.98 }} transition={{ duration: 0.45, ease: "easeOut" }} className="w-full">
      {children}
    </motion.div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-2xl rounded-[2.2rem] border border-white/70 bg-white/78 p-6 shadow-2xl shadow-amber-200/70 backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/30 sm:p-10 ${className}`}>{children}</div>;
}

function EmojiBadge({ children }: { children: React.ReactNode }) {
  return <motion.div animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-white text-5xl shadow-2xl shadow-amber-200/70 dark:bg-white/10 dark:shadow-black/30">{children}</motion.div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-6 block text-left">
      <span className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-orange-400">{label}</span>
      {children}
    </label>
  );
}

function OptionGrid({ options, selected, multiple = false, onSelect }: { options: string[]; selected: string[]; multiple?: boolean; onSelect: (option: string) => void }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <motion.button
            key={option}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            animate={{ scale: active ? 1.04 : 1 }}
            onClick={() => onSelect(option)}
            className={`min-h-24 rounded-[1.4rem] border p-3 text-center text-sm font-black shadow-lg transition sm:text-base ${active ? "border-orange-400 bg-amber-100 text-orange-800 shadow-amber-300/60 dark:border-orange-300 dark:bg-orange-400/20 dark:text-orange-50" : "border-white/70 bg-white/70 text-amber-950 shadow-amber-100/70 hover:border-amber-200 dark:border-white/10 dark:bg-white/10 dark:text-orange-50"}`}
            aria-pressed={active}
          >
            {option}
            {multiple && active ? <span className="mt-2 block text-xs text-orange-500 dark:text-orange-200">Elegido por decreto</span> : null}
          </motion.button>
        );
      })}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled = false, compact = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; compact?: boolean }) {
  return (
    <motion.button whileHover={disabled ? undefined : { scale: 1.03 }} whileTap={disabled ? undefined : { scale: 0.97 }} disabled={disabled} onClick={onClick} className={`mt-8 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 font-black text-white shadow-xl shadow-amber-300/60 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 dark:shadow-orange-950/40 ${compact ? "px-5 py-4" : "px-8 py-4 text-lg"}`}>
      {children}
    </motion.button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick} className="mt-8 w-full rounded-full border border-amber-200 bg-white/75 px-5 py-4 font-black text-orange-600 shadow-xl shadow-amber-200/50 transition hover:bg-amber-50 dark:border-white/10 dark:bg-white/10 dark:text-orange-100 dark:hover:bg-white/15">{children}</motion.button>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-amber-100 bg-white/70 p-4 shadow-lg shadow-amber-100/50 dark:border-white/10 dark:bg-white/10 dark:shadow-black/10">
      <p className="font-black text-orange-500 dark:text-orange-200">{label}</p>
      <p className="mt-1 break-words text-amber-950 dark:text-orange-50">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "A confirmar";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
