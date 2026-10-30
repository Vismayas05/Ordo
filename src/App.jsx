import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BarChart3,
  Settings,
  Plus,
  Search,
  Clock3,
  ArrowUpRight,
  CircleCheck,
  Circle,
  Menu,
  X,
  Trash2,
  Pencil,
  AlertTriangle,
  Check,
  Volume2,
  VolumeX,
  Languages,
  CalendarClock,
  FastForward,
  Sliders,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

import Insights from "./pages/Insights.jsx";
import BackgroundCanvas from "./components/BackgroundCanvas.jsx";
import StressCascadeBanner from "./components/StressCascadeBanner.jsx";
import OrdoProfileModal from "./components/OrdoProfileModal.jsx";
import ScheduleCascadeVisualizer from "./components/ScheduleCascadeVisualizer.jsx";

import {
  calculateScheduleCascade,
  applyDominoShift,
  applyBufferCompression,
} from "./services/stressEngine.js";
import {
  getStoredProfile,
  saveProfile,
} from "./services/personaConfig.js";
import {
  startStressAlarmLoop,
  stopStressAlarm,
  playTonePreview,
} from "./services/alarmSound.js";

const STORAGE_KEY = "ordo-tasks";
const SETTINGS_KEY = "ordo-settings";

const NAV = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Domino Cascade", icon: FastForward },
  { label: "My schedule", icon: CalendarDays },
  { label: "My tasks", icon: CheckSquare },
  { label: "Insights", icon: BarChart3 },
];

const DURATIONS = [15, 30, 45, 60, 90, 120];

const TEXT = {
  en: {
    Overview: "Overview",
    "Domino Cascade": "Domino Cascade",
    "My schedule": "My schedule",
    "My tasks": "My tasks",
    Insights: "Insights",
    Settings: "Settings",
    workspace: "ORDO WORKSPACE",
    search: "Search tasks...",
    newTask: "New task",
    welcome: "Order & Flow, Engineered.",
    subtitle: "Your personal schedule rhythm. Overdue focus triggers a stress alarm showing downstream ripple impact.",
    tasks: "Tasks",
    total: "total",
    remaining: "remaining",
    completed: "Completed",
    marked: "Tasks marked complete",
    timeRemaining: "Time remaining",
    planned: "Planned unfinished time",
    completion: "Completion",
    progress: "Your task completion rate",
    yourPlan: "YOUR DAY FLOW",
    yourProgress: "YOUR PROGRESS",
    yourSchedule: "Today's Schedule Chain",
    allTasks: "All Tasks",
    upcoming: "Upcoming Cascade",
    summary: "Progress summary",
    organised: "Chronological schedule with domino ripple awareness.",
    unfinished: "Active tasks in timeline order.",
    taskCompletion: "Flow progress",
    viewAll: "View all",
    plannedTime: "Planned task time",
    highPriority: "High-priority tasks",
    remainingTasks: "Remaining tasks",
    noMatches: "No matching tasks",
    nothingUpcoming: "Nothing upcoming",
    startHere: "Your day starts here",
    searchTip: "Try a different search term.",
    firstTask: "Add your first task to start your schedule.",
    createFirst: "Create your first task",
    addAnother: "Add another task",
    current: "CURRENT TASK",
    inProgress: "IN PROGRESS",
    upNext: "UP NEXT",
    timeOver: "Over planned time",
    timeLeft: "Time remaining",
    untilEnd: "Until planned end",
    reviewNext: "Review next task",
    scheduleAlert: "Schedule pressure detected",
    noAuto: "Ordo lets you decide when to domino shift or trim buffers.",
    nextComing: "Your next task is coming up. Transition smoothly.",
    caughtUp: "All caught up!",
    nothingScheduled: "Nothing scheduled yet",
    noRemaining: "No unfinished tasks remain.",
    addToSee: "Add a task to start your day.",
    createTask: "Create a task",
    progressOver: "Progress over perfection",
    completedOf: "tasks completed. Momentum maintained.",
    footer: "ORDO // DYNAMIC SCHEDULE & ACOUSTIC CASCADE ALARM",
    refine: "REFINE TASK",
    makeHappen: "SCHEDULE TASK",
    editTask: "Edit task",
    createTitle: "Create a task",
    updateDetails: "Update the parameters for this task.",
    nextStep: "Give your next step a planned place in your day.",
    taskName: "Task name",
    taskPlaceholder: "What are you working on?",
    startTime: "Start time",
    duration: "Duration",
    priority: "Priority",
    category: "Category",
    cancel: "Cancel",
    saveChanges: "Save changes",
    create: "Create task",
    Personal: "Personal",
    Study: "Study",
    Work: "Work",
    Health: "Health",
    Project: "Project",
    Other: "Other",
    Low: "Low",
    Medium: "Medium",
    High: "High",
    markComplete: "Mark complete",
    markIncomplete: "Mark incomplete",
    delete: "Delete task",
    edit: "Edit task",
    language: "Language",
    voiceLabel: "Voice Announcements",
    notificationLabel: "Browser notifications",
    settingsTitle: "Preferences & Acoustics",
    settingsDescription: "Configure your distinct acoustic alarms, domino tolerances, and language.",
    voiceOn: "Voice reminders on",
    voiceOff: "Voice reminders off",
    enableNotifications: "Enable notifications",
    notificationReady: "Browser notifications enabled.",
    permissionDenied: "Notifications blocked in browser settings.",
    unavailable: "Browser notifications unavailable.",
    startReminder: "Time to begin",
    endReminder: "Planned time ended for",
    taskStarting: "Starting now.",
    endAlert: "Reached planned end time.",
    conflictTitle: "Schedule overlap detected",
    conflictDescription: "Domino shift suggested to eliminate overlap.",
    moveAfter: "Shift to",
    keepSchedule: "Keep schedule",
    moved: "Schedule updated.",
    noConflicts: "No schedule overlaps detected.",
    alerts: "Schedule Overlaps",
    languageHint: "Choose interface language.",
    english: "English",
    malayalam: "മലയാളം",
    priorityLabel: "Priority",
  },
  ml: {
    Overview: "അവലോകനം",
    "Domino Cascade": "ഡൊമിനോ കാസ്കേഡ്",
    "My schedule": "ഷെഡ്യൂൾ",
    "My tasks": "ടാസ്കുകൾ",
    Insights: "വിശകലനം",
    Settings: "ക്രമീകരണങ്ങൾ",
    workspace: "ഓർഡോ വർക്ക്സ്പേസ്",
    search: "ടാസ്കുകൾ തിരയുക...",
    newTask: "പുതിയ ടാസ്ക്",
    welcome: "ശ്രദ്ധയും സമയവും കൈവിടാതെ.",
    subtitle: "നിങ്ങളുടെ വ്യക്തിഗത ഷെഡ്യൂൾ. ഒരു ടാസ്ക് വൈകിയാൽ അടുത്തതിനെ ബാധിക്കുന്ന സമ്മർദ്ദ അലാറം ഓർഡോ നൽകുന്നു.",
    tasks: "ടാസ്കുകൾ",
    total: "ആകെ",
    remaining: "ബാക്കി",
    completed: "പൂർത്തിയാക്കി",
    marked: "പൂർത്തിയാക്കിയവ",
    timeRemaining: "ബാക്കിയുള്ള സമയം",
    planned: "ബാക്കിയുള്ള ആസൂത്രിത സമയം",
    completion: "പൂർത്തീകരണം",
    progress: "ടാസ്ക് പുരോഗതി",
    yourPlan: "ഇന്നത്തെ ഫ്ലോ",
    yourProgress: "നിങ്ങളുടെ പുരോഗതി",
    yourSchedule: "ഷെഡ്യൂൾ ടൈംലൈൻ",
    allTasks: "എല്ലാ ടാസ്കുകളും",
    upcoming: "വരാനിരിക്കുന്നവ",
    summary: "പുരോഗതി സംഗ്രഹം",
    organised: "സമയക്രമത്തിലുള്ള ഷെഡ്യൂൾ.",
    unfinished: "പൂർത്തിയാക്കാനുള്ള ടാസ്കുകൾ.",
    taskCompletion: "പൂർത്തീകരണ നിരക്ക്",
    viewAll: "എല്ലാം കാണുക",
    plannedTime: "ആസൂത്രിത സമയം",
    highPriority: "ഉയർന്ന മുൻഗണനയുള്ളവ",
    remainingTasks: "ബാക്കിയുള്ളവ",
    noMatches: "കണ്ടെത്തിയില്ല",
    nothingUpcoming: "വരാനിരിക്കുന്നവയില്ല",
    startHere: "ഇവിടെ തുടങ്ങാം",
    searchTip: "മറ്റൊരു വാക്ക് ഉപയോഗിക്കൂ.",
    firstTask: "ആദ്യ ടാസ്ക് ചേർക്കൂ.",
    createFirst: "ആദ്യ ടാസ്ക് സൃഷ്ടിക്കുക",
    addAnother: "മറ്റൊരു ടാസ്ക് ചേർക്കുക",
    current: "നിലവിലെ ടാസ്ക്",
    inProgress: "പുരോഗമിക്കുന്നു",
    upNext: "അടുത്തത്",
    timeOver: "സമയം കഴിഞ്ഞു",
    timeLeft: "ബാക്കിയുള്ള സമയം",
    untilEnd: "തീരാൻ ബാക്കി",
    reviewNext: "അടുത്ത ടാസ്ക് കാണുക",
    scheduleAlert: "ഷെഡ്യൂൾ സമ്മർദ്ദം കണ്ടെത്തി",
    noAuto: "ഓർഡോ സ്വയം മാറ്റില്ല, നിങ്ങൾക്ക് അനുയോജ്യമായ മാറ്റം വരുത്താം.",
    nextComing: "അടുത്ത ടാസ്ക് ഉടൻ ആരംഭിക്കും.",
    caughtUp: "എല്ലാം പൂർത്തിയായി!",
    nothingScheduled: "ഒന്നും ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല",
    noRemaining: "പൂർത്തിയാക്കാനുള്ള ടാസ്കുകളില്ല.",
    addToSee: "തുടങ്ങാൻ ഒരു ടാസ്ക് ചേർക്കൂ.",
    createTask: "ടാസ്ക് ഉണ്ടാക്കുക",
    progressOver: "പൂർണ്ണതയേക്കാൾ പുരോഗതി",
    completedOf: "ടാസ്കുകൾ പൂർത്തിയായി.",
    footer: "ORDO // DYNAMIC SCHEDULE & ACOUSTIC CASCADE ALARM",
    refine: "തിരുത്തുക",
    makeHappen: "തുടങ്ങാം",
    editTask: "ടാസ്ക് തിരുത്തുക",
    createTitle: "ടാസ്ക് സൃഷ്ടിക്കുക",
    updateDetails: "വിവരങ്ങൾ പുതുക്കുക.",
    nextStep: "അടുത്ത ഘട്ടത്തിന് സമയം നൽകൂ.",
    taskName: "ടാസ്കിന്റെ പേര്",
    taskPlaceholder: "എന്താണ് ചെയ്യേണ്ടത്?",
    startTime: "ആരംഭ സമയം",
    duration: "ദൈർഘ്യം",
    priority: "മുൻഗണന",
    category: "വിഭാഗം",
    cancel: "റദ്ദാക്കുക",
    saveChanges: "മാറ്റങ്ങൾ സൂക്ഷിക്കുക",
    create: "സൃഷ്ടിക്കുക",
    Personal: "വ്യക്തിപരം",
    Study: "പഠനം",
    Work: "ജോലി",
    Health: "ആരോഗ്യം",
    Project: "പ്രോജക്റ്റ്",
    Other: "മറ്റുള്ളവ",
    Low: "കുറഞ്ഞത്",
    Medium: "ഇടത്തരം",
    High: "ഉയർന്നത്",
    markComplete: "പൂർത്തിയാക്കുക",
    markIncomplete: "മാറ്റുക",
    delete: "നീക്കം ചെയ്യുക",
    edit: "തിരുത്തുക",
    language: "ഭാഷ",
    voiceLabel: "ശബ്ദ ഓർമ്മപ്പെടുത്തലുകൾ",
    notificationLabel: "അറിയിപ്പുകൾ",
    settingsTitle: "മുൻഗണനകളും അലാറവും",
    settingsDescription: "നിങ്ങളുടെ ശബ്ദ അലാറവും കാസ്കേഡ് സമയവും ക്രമീകരിക്കൂ.",
    voiceOn: "ശബ്ദം ഓൺ",
    voiceOff: "ശബ്ദം ഓഫ്",
    enableNotifications: "അറിയിപ്പുകൾ നൽകുക",
    notificationReady: "അറിയിപ്പുകൾ സജ്ജമാണ്.",
    permissionDenied: "ബ്രൗസറിൽ അറിയിപ്പുകൾ അനുവദിക്കണം.",
    unavailable: "ലഭ്യമല്ല.",
    startReminder: "തുടങ്ങാൻ സമയം",
    endReminder: "സമയം അവസാനിച്ചു",
    taskStarting: "ഇപ്പോൾ തുടങ്ങുന്നു.",
    endAlert: "സമയം പൂർത്തിയായി.",
    conflictTitle: "സമയങ്ങൾ തമ്മിൽ മുട്ടുന്നു",
    conflictDescription: "നിർദ്ദേശിച്ച സമയത്തേക്ക് മാറ്റാം.",
    moveAfter: "മാറ്റുക",
    keepSchedule: "നിലനിർത്തുക",
    moved: "ഷെഡ്യൂൾ പുതുക്കി.",
    noConflicts: "സമയങ്ങൾ തമ്മിൽ മുട്ടുന്നില്ല.",
    alerts: "ഷെഡ്യൂൾ പരിശോധന",
    languageHint: "ഭാഷ തിരഞ്ഞെടുക്കൂ.",
    english: "English",
    malayalam: "മലയാളം",
    priorityLabel: "മുൻഗണന",
  },
};

function readTasks() {
  try {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(tasks) || tasks.length === 0) {
      // Provide an intelligent initial baseline matching the current time
      const nowH = new Date().getHours();
      const pad = (n) => String(n).padStart(2, "0");
      const t1 = `${pad(Math.max(0, nowH - 1))}:00`;
      const t2 = `${pad(nowH)}:00`;
      const t3 = `${pad((nowH + 1) % 24)}:15`;
      const t4 = `${pad((nowH + 2) % 24)}:30`;

      return [
        {
          id: "task-1",
          title: "Deep Architecture & Refactor",
          time: t1,
          duration: 45,
          priority: "High",
          category: "Work",
          done: false,
          createdAt: Date.now() - 3600000,
        },
        {
          id: "task-2",
          title: "Stress Alarm Acoustic Synthesis",
          time: t2,
          duration: 45,
          priority: "High",
          category: "Project",
          done: false,
          createdAt: Date.now() - 1800000,
        },
        {
          id: "task-3",
          title: "Schedule Domino Impact Review",
          time: t3,
          duration: 30,
          priority: "Medium",
          category: "Work",
          done: false,
          createdAt: Date.now(),
        },
        {
          id: "task-4",
          title: "Mindful Decompression & Evening Buffer",
          time: t4,
          duration: 45,
          priority: "Low",
          category: "Personal",
          done: false,
          createdAt: Date.now(),
        },
      ];
    }
    return tasks
      .filter((task) => task?.id && task?.title)
      .map((task) => ({
        ...task,
        duration: Number(task.duration) || 30,
        priority: ["Low", "Medium", "High"].includes(task.priority) ? task.priority : "Medium",
        category: task.category || "Personal",
        time: task.time || "17:00",
        done: Boolean(task.done),
      }));
  } catch {
    return [];
  }
}

function readSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return {
      language: saved.language === "ml" ? "ml" : "en",
      voice: saved.voice !== false,
      notifications: saved.notifications === true,
    };
  } catch {
    return { language: "en", voice: true, notifications: false };
  }
}

function taskStart(task, base = new Date()) {
  const [hours, minutes] = (task.time || "00:00").split(":").map(Number);
  const date = new Date(base);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date.getTime();
}

function taskEnd(task, base = new Date()) {
  return taskStart(task, base) + Number(task.duration || 30) * 60000;
}

function timeLabel(time, language) {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h || 0, m || 0, 0, 0);
  return new Intl.DateTimeFormat(language === "ml" ? "ml-IN" : "en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function countdown(ms) {
  const seconds = Math.floor(Math.abs(ms) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function dayLabel(date, language) {
  return new Intl.DateTimeFormat(language === "ml" ? "ml-IN" : "en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function speak(message, language) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = language === "ml" ? "ml-IN" : "en-IN";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [settings, setSettings] = useState(readSettings);
  const [profile, setProfile] = useState(getStoredProfile);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("30");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Work");
  const [now, setNow] = useState(Date.now());
  const [toast, setToast] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState(0);

  const spoken = useRef(new Set());
  const alarmPlayingRef = useRef(false);

  const language = settings.language;
  const t = (key) => TEXT[language]?.[key] || TEXT.en[key] || key;

  // Persist tasks and settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Tick clock every second
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Calculate schedule cascade & stress index in real-time
  const cascadeInfo = useMemo(() => {
    return calculateScheduleCascade(tasks, now, profile);
  }, [tasks, now, profile]);

  // Trigger procedural stress audio alarm loop when stress escalates
  useEffect(() => {
    const isOverdue = Boolean(cascadeInfo.overdueTask);
    const isStressAlarm = cascadeInfo.stressState === "stress-alarm" || cascadeInfo.stressState === "critical";
    const isSnoozed = now < snoozeUntil;

    if (isOverdue && isStressAlarm && !isSnoozed && !isAudioMuted && settings.voice) {
      if (!alarmPlayingRef.current) {
        alarmPlayingRef.current = true;
        startStressAlarmLoop(
          {
            baseFreq: profile.soundFreq,
            wave: profile.soundWave,
            type: profile.soundType,
          },
          cascadeInfo.stressScore,
          profile.soundVolume || 0.7
        );
      }
    } else {
      if (alarmPlayingRef.current) {
        alarmPlayingRef.current = false;
        stopStressAlarm();
      }
    }

    return () => {
      if (alarmPlayingRef.current) {
        alarmPlayingRef.current = false;
        stopStressAlarm();
      }
    };
  }, [
    cascadeInfo.overdueTask,
    cascadeInfo.stressState,
    cascadeInfo.stressScore,
    now,
    snoozeUntil,
    isAudioMuted,
    settings.voice,
    profile,
  ]);

  // Task-time announcements
  useEffect(() => {
    const checkReminders = () => {
      const current = Date.now();
      const base = new Date(current);
      const today = base.toDateString();

      tasks.forEach((task) => {
        if (task.done) return;

        const start = taskStart(task, base);
        const end = taskEnd(task, base);
        const events = [
          { key: `${today}-${task.id}-start`, at: start, kind: "start" },
          { key: `${today}-${task.id}-end`, at: end, kind: "end" },
        ];

        events.forEach((event) => {
          if (current < event.at || current - event.at > 1800) return;
          if (spoken.current.has(event.key)) return;
          spoken.current.add(event.key);

          const message =
            event.kind === "start"
              ? `${task.title}. ${t("taskStarting")}`
              : `${task.title}. ${t("endAlert")}`;

          if (settings.voice) speak(message, language);

          if (
            settings.notifications &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(
                event.kind === "start"
                  ? `${t("startReminder")} ${task.title}`
                  : `${t("endReminder")} ${task.title}`,
                {
                  body: event.kind === "start" ? t("taskStarting") : t("endAlert"),
                  icon: "/ordo-logo.png",
                }
              );
            } catch {
              // Notification fallback
            }
          }
        });
      });
    };

    checkReminders();
    const timer = window.setInterval(checkReminders, 1000);
    return () => window.clearInterval(timer);
  }, [tasks, settings.voice, settings.notifications, language, t]);

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title)),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedTasks.filter((task) => {
      const match =
        task.title.toLowerCase().includes(query) || task.category.toLowerCase().includes(query);
      if (!match) return false;
      if (activeNav === "My schedule") return !task.done;
      return true;
    });
  }, [sortedTasks, search, activeNav]);

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const totalMinutes = tasks
    .filter((task) => !task.done)
    .reduce((sum, task) => sum + Number(task.duration || 0), 0);
  const allMinutes = tasks.reduce((sum, task) => sum + Number(task.duration || 0), 0);

  const currentTask = cascadeInfo.inProgressTask;
  const nextTask = useMemo(
    () =>
      sortedTasks
        .filter((task) => !task.done && taskStart(task) > now)
        .sort((a, b) => taskStart(a) - taskStart(b))[0] || null,
    [sortedTasks, now]
  );

  const conflicts = useMemo(() => {
    const active = tasks.filter((task) => !task.done).sort((a, b) => taskStart(a) - taskStart(b));
    const found = [];
    for (let i = 0; i < active.length - 1; i += 1) {
      if (taskEnd(active[i]) > taskStart(active[i + 1])) {
        found.push({ first: active[i], second: active[i + 1] });
      }
    }
    return found;
  }, [tasks]);

  function setPreference(key, value) {
    setSettings((old) => ({ ...old, [key]: value }));
  }

  function handleProfileUpdate(updatedProfile) {
    setProfile(updatedProfile);
    setToast(language === "ml" ? "പ്രൊഫൈലും അലാറവും പുതുക്കി." : "Ordo profile and acoustic alarm updated!");
  }

  function toggleTask(id) {
    setTasks((old) => old.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id) {
    setTasks((old) => old.filter((task) => task.id !== id));
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setTime("17:00");
    setDuration("30");
    setPriority("Medium");
    setCategory("Work");
  }

  function openNewTask() {
    resetForm();
    setShowForm(true);
  }

  function openEditTask(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setTime(task.time || "17:00");
    setDuration(String(task.duration || 30));
    setPriority(task.priority || "Medium");
    setCategory(task.category || "Work");
    setShowForm(true);
  }

  function saveTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const data = {
      title: cleanTitle,
      time,
      duration: Number(duration),
      priority,
      category,
    };

    if (editingId) {
      setTasks((old) => old.map((task) => (task.id === editingId ? { ...task, ...data } : task)));
      setToast(language === "ml" ? "ടാസ്ക് പുതുക്കി." : "Task updated.");
    } else {
      setTasks((old) => [
        ...old,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ...data,
          done: false,
          createdAt: Date.now(),
        },
      ]);
      setToast(language === "ml" ? "പുതിയ ടാസ്ക് ചേർത്തു." : "Task added to your schedule.");
    }

    setShowForm(false);
    resetForm();
  }

  function selectNav(label) {
    setActiveNav(label);
    setMobileMenu(false);
    setSearch("");
  }

  // Quick Action Domino Resolvers
  function handleDominoShift(targetId, extraMin) {
    const shiftMin = extraMin || cascadeInfo.overrunMinutes || 15;
    const targetTaskId = targetId || cascadeInfo.overdueTask?.id;
    if (!targetTaskId) return;

    const updated = applyDominoShift(tasks, targetTaskId, shiftMin);
    setTasks(updated);
    stopStressAlarm();
    setToast(
      language === "ml"
        ? `ഷെഡ്യൂൾ +${shiftMin} മിനിറ്റ് മുന്നോട്ട് ക്രമീകരിച്ചു.`
        : `Domino shift applied: upcoming tasks moved +${shiftMin}m forward.`
    );
  }

  function handleCompressBuffers(targetId, extraMin) {
    const recoverMin = extraMin || cascadeInfo.overrunMinutes || 15;
    const targetTaskId = targetId || cascadeInfo.overdueTask?.id;
    if (!targetTaskId) return;

    const updated = applyBufferCompression(tasks, targetTaskId, recoverMin);
    setTasks(updated);
    stopStressAlarm();
    setToast(
      language === "ml"
        ? `ബഫർ സമയം ക്രമീകരിച്ച് മാറ്റിവെച്ചു.`
        : `Slack buffers compressed by ${recoverMin}m to protect your day's finish line.`
    );
  }

  function handleMarkDoneAndAdvance() {
    if (!cascadeInfo.overdueTask) return;
    const overdueId = cascadeInfo.overdueTask.id;
    setTasks((old) => old.map((t) => (t.id === overdueId ? { ...t, done: true } : t)));
    stopStressAlarm();
    setToast(
      language === "ml"
        ? "ടാസ്ക് പൂർത്തിയാക്കി അടുത്തതിലേക്ക് മുന്നേറി!"
        : "Task completed! Advanced to next priority."
    );
  }

  function handleSnooze() {
    setSnoozeUntil(Date.now() + 5 * 60000);
    stopStressAlarm();
    setToast(
      language === "ml"
        ? "5 മിനിറ്റത്തേക്ക് സ്നൂസ് ചെയ്തു."
        : "Stress alarm snoozed for 5 minutes."
    );
  }

  function handleToggleMute() {
    if (!isAudioMuted) {
      stopStressAlarm();
    }
    setIsAudioMuted(!isAudioMuted);
  }

  function testUserSound() {
    playTonePreview({
      baseFreq: profile.soundFreq,
      wave: profile.soundWave,
      type: profile.soundType,
    });
    setToast(`Playing acoustic tone: ${profile.soundFreq} Hz (${profile.soundWave})`);
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setToast(t("unavailable"));
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPreference("notifications", true);
      setToast(t("notificationReady"));
    } else {
      setPreference("notifications", false);
      setToast(t("permissionDenied"));
    }
  }

  const heading =
    activeNav === "Overview"
      ? t("welcome")
      : activeNav === "Domino Cascade"
      ? "Domino Cascade Simulator"
      : activeNav === "My schedule"
      ? t("upcoming")
      : activeNav === "My tasks"
      ? t("allTasks")
      : activeNav === "Insights"
      ? t("yourProgress")
      : t("settingsTitle");

  return (
    <div className={`app-shell ${language === "ml" ? "language-ml" : ""}`}>
      {/* Dynamic Animated Jet Black Background Canvas with Cerulean & Neon Rose nodes */}
      <BackgroundCanvas
        stressScore={cascadeInfo.stressScore}
        stressState={cascadeInfo.stressState}
      />

      {mobileMenu && (
        <button
          className="mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo-wrap">
            <img src="/ordo-logo.png" alt="Ordo" className="brand-logo" />
            <span className="brand-badge">PRO</span>
          </div>
          <button
            className="icon-button mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobileMenu(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">{t("workspace")}</div>
        <nav className="nav-list">
          {NAV.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activeNav === label ? "nav-active" : ""}`}
              onClick={() => selectNav(label)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{t(label)}</span>
              {label === "My tasks" && <span className="nav-count">{tasks.length}</span>}
              {label === "Domino Cascade" && cascadeInfo.overdueTask && (
                <span className="nav-count" style={{ background: "rgba(255,0,127,0.2)", color: "#ff007f", borderColor: "rgba(255,0,127,0.4)" }}>
                  +{cascadeInfo.overrunMinutes}m
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar bottom: personalized Ordo profile preview & settings */}
        <div className="sidebar-bottom">
          <div
            className="sidebar-profile-card"
            onClick={() => setShowProfileModal(true)}
            title="Click to customize your unique acoustic alarm and persona"
          >
            <div className="profile-card-top">
              <strong>{profile.customName || profile.title || "My Ordo"}</strong>
              <span className="profile-fingerprint-pill">{profile.uniqueId || "ORDO-7492"}</span>
            </div>
            <p className="profile-card-desc">
              {profile.soundFreq} Hz · {profile.soundType} · {profile.delayToleranceMin}m cushion
            </p>
          </div>

          <button
            className={`nav-item ${activeNav === "Settings" ? "nav-active" : ""}`}
            onClick={() => selectNav("Settings")}
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>{t("Settings")}</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-button"
            aria-label="Open navigation"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Ordo <span>/</span> <strong>{t(activeNav)}</strong>
          </div>

          <div className="topbar-actions">
            {/* Live Stress Meter Pill */}
            <div
              className={`top-stress-pill ${
                cascadeInfo.stressScore >= 75
                  ? "stress-pill-critical"
                  : cascadeInfo.stressScore >= 35
                  ? "stress-pill-warning"
                  : "stress-pill-calm"
              }`}
              title="Live Stress Level based on task overruns and downstream impact"
            >
              <span>●</span>
              <span>
                {cascadeInfo.stressScore >= 75
                  ? `STRESS: ${cascadeInfo.stressScore}% CRITICAL`
                  : cascadeInfo.stressScore >= 35
                  ? `STRESS: ${cascadeInfo.stressScore}% SQUEEZE`
                  : `FLOW: ${cascadeInfo.stressScore}% OPTIMAL`}
              </span>
            </div>

            {/* Persona Quick Button */}
            <button
              className="persona-top-badge"
              onClick={() => setShowProfileModal(true)}
              title="Tune your unique alarm sound and delay tolerance"
            >
              <Zap size={14} />
              <span>{profile.customName || "My Ordo"}</span>
              <strong>{profile.soundFreq}Hz</strong>
            </button>

            {/* Test Alarm Sound */}
            <button
              className="icon-button"
              title="Listen to my unique acoustic alarm"
              aria-label="Test alarm sound"
              onClick={testUserSound}
            >
              <Volume2 size={18} />
            </button>

            {/* Search Box */}
            <label className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("search")}
                aria-label={t("search")}
              />
              <kbd>⌕</kbd>
            </label>

            {/* Language Switch */}
            <button
              className="icon-button"
              title={t("language")}
              aria-label={t("language")}
              onClick={() => setPreference("language", language === "en" ? "ml" : "en")}
            >
              <Languages size={18} />
            </button>

            {/* Voice toggle */}
            <button
              className="icon-button"
              title={settings.voice ? t("voiceOn") : t("voiceOff")}
              aria-label={settings.voice ? t("voiceOff") : t("voiceOn")}
              onClick={() => setPreference("voice", !settings.voice)}
            >
              {settings.voice ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </header>

        <div className="page-content">
          {/* Stress Alarm HUD Banner (when a task is overdue or stress is elevated) */}
          {cascadeInfo.overdueTask && activeNav === "Overview" && (
            <StressCascadeBanner
              cascadeInfo={cascadeInfo}
              onDominoShift={() => handleDominoShift()}
              onCompressBuffers={() => handleCompressBuffers()}
              onMarkDoneAndAdvance={handleMarkDoneAndAdvance}
              onSnooze={handleSnooze}
              isMuted={isAudioMuted}
              onToggleMute={handleToggleMute}
              language={language}
            />
          )}

          {activeNav !== "Insights" && activeNav !== "Domino Cascade" && (
            <section className="welcome-row">
              <div>
                <div className="eyebrow">
                  <span className="status-dot" />
                  {dayLabel(new Date(now), language).toUpperCase()}
                </div>
                <h1>{heading}</h1>
                <p className="welcome-subtitle">
                  {activeNav === "Settings" ? t("settingsDescription") : t("subtitle")}
                </p>
              </div>
              {activeNav !== "Settings" && (
                <button className="primary-button" onClick={openNewTask}>
                  <Plus size={18} /> {t("newTask")}
                </button>
              )}
            </section>
          )}

          {/* DEDICATED DOMINO CASCADE SIMULATOR VIEW */}
          {activeNav === "Domino Cascade" ? (
            <ScheduleCascadeVisualizer
              tasks={tasks}
              now={now}
              cascadeInfo={cascadeInfo}
              onDominoShift={handleDominoShift}
              onCompressBuffers={handleCompressBuffers}
              language={language}
            />
          ) : activeNav === "Settings" ? (
            /* SETTINGS VIEW */
            <section className="panel settings-panel">
              <div className="section-kicker">{t("Settings").toUpperCase()}</div>
              <h2>{t("settingsTitle")}</h2>
              <p>{t("settingsDescription")}</p>

              {/* Persona Acoustic Profile Trigger */}
              <div className="settings-option">
                <div>
                  <strong>Personalized Ordo Signature</strong>
                  <span>Every user has a different sound frequency and delay tolerance.</span>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => setShowProfileModal(true)}
                >
                  <Sliders size={16} /> Customize Acoustic Signature
                </button>
              </div>

              <div className="settings-option">
                <div>
                  <strong>{t("language")}</strong>
                  <span>{t("languageHint")}</span>
                </div>
                <div className="settings-language">
                  <button
                    className={`secondary-button ${language === "en" ? "setting-selected" : ""}`}
                    onClick={() => setPreference("language", "en")}
                  >
                    {t("english")}
                  </button>
                  <button
                    className={`secondary-button ${language === "ml" ? "setting-selected" : ""}`}
                    onClick={() => setPreference("language", "ml")}
                  >
                    {t("malayalam")}
                  </button>
                </div>
              </div>

              <div className="settings-option">
                <div>
                  <strong>{t("voiceLabel")} & Stress Audio Alarms</strong>
                  <span>{settings.voice ? t("voiceOn") : t("voiceOff")}</span>
                </div>
                <button
                  className={`toggle-switch ${settings.voice ? "toggle-on" : ""}`}
                  role="switch"
                  aria-checked={settings.voice}
                  onClick={() => setPreference("voice", !settings.voice)}
                >
                  <span />
                </button>
              </div>

              <div className="settings-option">
                <div>
                  <strong>{t("notificationLabel")}</strong>
                  <span>
                    {settings.notifications
                      ? t("notificationReady")
                      : t("enableNotifications")}
                  </span>
                </div>
                <button
                  className={`toggle-switch ${settings.notifications ? "toggle-on" : ""}`}
                  role="switch"
                  aria-checked={settings.notifications}
                  onClick={enableNotifications}
                >
                  <span />
                </button>
              </div>

              <div className="section-kicker">{t("alerts").toUpperCase()}</div>
              {conflicts.length ? (
                conflicts.map(({ first, second }) => {
                  const suggestedDate = new Date(taskEnd(first));
                  const suggested = `${String(suggestedDate.getHours()).padStart(2, "0")}:${String(
                    suggestedDate.getMinutes()
                  ).padStart(2, "0")}`;
                  return (
                    <div className="conflict-alert" key={`${first.id}-${second.id}`}>
                      <div className="conflict-icon">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="conflict-copy">
                        <strong>{t("conflictTitle")}</strong>
                        <p>
                          {first.title} · {timeLabel(first.time, language)} — {second.title} ·{" "}
                          {timeLabel(second.time, language)}
                        </p>
                        <span>{t("conflictDescription")}</span>
                        <div className="conflict-actions">
                          <button
                            className="secondary-button"
                            onClick={() => {
                              setTasks((old) =>
                                old.map((t) => (t.id === second.id ? { ...t, time: suggested } : t))
                              );
                              setToast(t("moved"));
                            }}
                          >
                            <CalendarClock size={15} /> {t("moveAfter")}{" "}
                            {timeLabel(suggested, language)}
                          </button>
                          <button
                            className="text-button"
                            onClick={() => setToast(t("noConflicts"))}
                          >
                            {t("keepSchedule")}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-conflicts">
                  <CircleCheck size={18} />
                  <span>{t("noConflicts")}</span>
                </div>
              )}
            </section>
          ) : activeNav === "Insights" ? (
            /* INSIGHTS VIEW */
            <Insights tasks={tasks} language={language} />
          ) : (
            /* OVERVIEW / MY SCHEDULE / MY TASKS VIEW */
            <>
              <section className="stats-grid">
                <article className="stat-card">
                  <div className="stat-top">
                    <span>{t("tasks")}</span>
                    <span className="stat-icon">
                      <CheckSquare size={18} />
                    </span>
                  </div>
                  <div className="stat-number">
                    {tasks.length}
                    <span className="stat-unit"> {t("total")}</span>
                  </div>
                  <div className="stat-foot">{pending} {t("remaining")}</div>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span>{t("completed")}</span>
                    <span className="stat-icon rose-icon">
                      <CircleCheck size={18} />
                    </span>
                  </div>
                  <div className="stat-number">
                    {completed}
                    <span className="stat-unit"> / {tasks.length}</span>
                  </div>
                  <div className="stat-foot">{t("marked")}</div>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span>{t("timeRemaining")}</span>
                    <span className="stat-icon">
                      <Clock3 size={18} />
                    </span>
                  </div>
                  <div className="stat-number">
                    {Math.floor(totalMinutes / 60)}
                    <span className="stat-unit">h </span>
                    {totalMinutes % 60}
                    <span className="stat-unit">m</span>
                  </div>
                  <div className="stat-foot">{t("planned")}</div>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span>STRESS PRESSURE</span>
                    <span className="stat-icon rose-icon">
                      <ShieldAlert size={18} />
                    </span>
                  </div>
                  <div className="stat-number">
                    {cascadeInfo.stressScore}
                    <span className="stat-unit">%</span>
                  </div>
                  <div className="stat-foot">
                    {cascadeInfo.overdueTask ? `+${cascadeInfo.overrunMinutes}m Overrun` : "Timeline Optimal"}
                  </div>
                </article>
              </section>

              <section className="content-grid">
                {/* Main Schedule / Task Table Panel */}
                <article className="panel schedule-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="section-kicker">
                        {activeNav === "Insights" ? t("yourProgress") : t("yourPlan")}
                      </div>
                      <h2>
                        {activeNav === "My tasks"
                          ? t("allTasks")
                          : activeNav === "My schedule"
                          ? t("upcoming")
                          : t("yourSchedule")}
                      </h2>
                      <p>{activeNav === "My schedule" ? t("unfinished") : t("organised")}</p>
                    </div>
                    <button className="text-button" onClick={() => selectNav("Domino Cascade")}>
                      Domino Simulator <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="progress-section">
                    <div className="progress-label">
                      <span>{t("taskCompletion")}</span>
                      <strong>{progress}%</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="task-list">
                    {visibleTasks.length === 0 ? (
                      <div className="empty-state">
                        <CalendarDays size={28} />
                        <strong>
                          {search
                            ? t("noMatches")
                            : activeNav === "My schedule"
                            ? t("nothingUpcoming")
                            : t("startHere")}
                        </strong>
                        <span>{search ? t("searchTip") : t("firstTask")}</span>
                        {!search && (
                          <button className="secondary-button" onClick={openNewTask}>
                            <Plus size={15} /> {t("createFirst")}
                          </button>
                        )}
                      </div>
                    ) : (
                      visibleTasks.map((task) => {
                        const end = taskEnd(task);
                        const isCurrent = !task.done && now >= taskStart(task) && now < end;
                        const isOverdue = !task.done && now >= end;
                        return (
                          <div
                            className={`task-row ${task.done ? "task-done" : ""}`}
                            key={task.id}
                          >
                            <button
                              className="task-check"
                              aria-label={task.done ? t("markIncomplete") : t("markComplete")}
                              onClick={() => toggleTask(task.id)}
                            >
                              {task.done ? <CircleCheck size={21} /> : <Circle size={21} />}
                            </button>
                            <div className="task-main">
                              <div className="task-title">{task.title}</div>
                              <div className="task-meta">
                                <span>{timeLabel(task.time, language)}</span>
                                <span className="meta-separator">·</span>
                                <span>{task.duration} min</span>
                                <span className="category-pill">{t(task.category)}</span>
                                {isCurrent && (
                                  <span className="task-status status-running">
                                    {t("inProgress")}
                                  </span>
                                )}
                                {isOverdue && (
                                  <span className="task-status status-overdue">
                                    {t("timeOver")} (+{Math.floor((now - end) / 60000)}m)
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className={`priority priority-${task.priority.toLowerCase()}`}>
                              {t(task.priority)}
                            </span>
                            <button
                              className="icon-button task-action"
                              aria-label={`${t("edit")} ${task.title}`}
                              title={t("edit")}
                              onClick={() => openEditTask(task)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="icon-button task-delete"
                              aria-label={`${t("delete")} ${task.title}`}
                              title={t("delete")}
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {tasks.length > 0 && (
                    <button className="add-task-link" onClick={openNewTask}>
                      <Plus size={16} /> {t("addAnother")}
                    </button>
                  )}
                </article>

                {/* Right Column: Live Focus Card */}
                <div className="right-column">
                  <article className="panel next-panel">
                    <div className="section-kicker">
                      {cascadeInfo.overdueTask
                        ? "CRITICAL STRESS ALERT"
                        : currentTask
                        ? t("inProgress")
                        : t("upNext")}
                    </div>

                    {cascadeInfo.overdueTask ? (
                      <>
                        <h2 className="next-title" style={{ color: "#ff007f" }}>
                          {cascadeInfo.overdueTask.title}
                        </h2>
                        <div className="next-time">
                          <Clock3 size={15} />
                          {timeLabel(cascadeInfo.overdueTask.time, language)}
                          <span>·</span>
                          {cascadeInfo.overdueTask.duration} min planned
                        </div>
                        <div className="live-countdown countdown-overdue">
                          <div className="countdown-label">OVERRUN DURATION</div>
                          <strong>+{countdown(now - taskEnd(cascadeInfo.overdueTask))}</strong>
                          <span>Pushing upcoming commitments downstream</span>
                        </div>
                        <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
                          <button
                            className="action-btn btn-domino"
                            style={{ flex: 1 }}
                            onClick={() => handleDominoShift()}
                          >
                            <FastForward size={15} /> Shift Day
                          </button>
                          <button
                            className="action-btn btn-advance"
                            style={{ flex: 1 }}
                            onClick={handleMarkDoneAndAdvance}
                          >
                            <Check size={15} /> Mark Done
                          </button>
                        </div>
                      </>
                    ) : currentTask ? (
                      <>
                        <h2 className="next-title">{currentTask.title}</h2>
                        <div className="next-time">
                          <Clock3 size={15} />
                          {timeLabel(currentTask.time, language)}
                          <span>·</span>
                          {currentTask.duration} min
                        </div>
                        <div className="live-countdown">
                          <div className="countdown-label">{t("timeLeft")}</div>
                          <strong>{countdown(taskEnd(currentTask) - now)}</strong>
                          <span>{t("untilEnd")}</span>
                        </div>
                      </>
                    ) : nextTask ? (
                      <>
                        <h2 className="next-title">{nextTask.title}</h2>
                        <div className="next-time">
                          <Clock3 size={15} />
                          {t("startTime")}: {timeLabel(nextTask.time, language)}
                          <span>·</span>
                          {nextTask.duration} min
                        </div>
                        <div className="next-divider" />
                        <div className="next-tip">
                          <Clock3 size={17} />
                          <span>{t("nextComing")}</span>
                        </div>
                      </>
                    ) : (
                      <div className="all-done">
                        <CircleCheck size={28} />
                        <h3>{tasks.length ? t("caughtUp") : t("nothingScheduled")}</h3>
                        <p>{tasks.length ? t("noRemaining") : t("addToSee")}</p>
                        <button className="secondary-button" onClick={openNewTask}>
                          <Plus size={15} /> {t("createTask")}
                        </button>
                      </div>
                    )}
                  </article>

                  {/* Acoustic Persona Quick Card */}
                  <article className="panel">
                    <div className="section-kicker">ACOUSTIC PROFILE</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 8px" }}>
                      <strong style={{ fontSize: "14px", color: "#fff" }}>{profile.customName || "My Ordo"}</strong>
                      <span className="profile-fingerprint-pill">{profile.uniqueId || "ORDO-7492"}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--text-subtle)", margin: "0 0 14px", lineHeight: "1.5" }}>
                      Custom {profile.soundFreq} Hz ({profile.soundWave}) tone with {profile.delayToleranceMin}m cushion before stress escalates.
                    </p>
                    <button
                      className="secondary-button"
                      style={{ width: "100%" }}
                      onClick={() => setShowProfileModal(true)}
                    >
                      <Sliders size={15} /> Customize Acoustic Alarm
                    </button>
                  </article>
                </div>
              </section>
            </>
          )}

          <footer className="page-footer">
            <span>ORDO / CASCADE STRESS ALERTS</span>
            <span>{t("footer")}</span>
          </footer>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="ordo-toast" role="status">
          <CircleCheck size={16} />
          {toast}
        </div>
      )}

      {/* Unique Ordo Profile / Acoustic Alarm Modal */}
      {showProfileModal && (
        <OrdoProfileModal
          profile={profile}
          onUpdateProfile={handleProfileUpdate}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Add / Edit Task Modal */}
      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
              resetForm();
            }
          }}
        >
          <form className="task-modal" onSubmit={saveTask}>
            <div className="modal-heading">
              <div>
                <div className="section-kicker">
                  {editingId ? t("refine") : t("makeHappen")}
                </div>
                <h2>{editingId ? t("editTask") : t("createTitle")}</h2>
                <p>{editingId ? t("updateDetails") : t("nextStep")}</p>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close form"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <X size={19} />
              </button>
            </div>
            <label className="form-label">
              {t("taskName")}
              <input
                autoFocus
                required
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t("taskPlaceholder")}
              />
            </label>
            <div className="form-row">
              <label className="form-label">
                {t("startTime")}
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </label>
              <label className="form-label">
                {t("duration")}
                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                >
                  {DURATIONS.map((minutes) => (
                    <option key={minutes} value={minutes}>
                      {minutes} minutes
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row">
              <label className="form-label">
                {t("priority")}
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                >
                  {["Low", "Medium", "High"].map((item) => (
                    <option key={item} value={item}>
                      {t(item)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-label">
                {t("category")}
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {["Study", "Work", "Personal", "Health", "Project", "Other"].map(
                    (item) => (
                      <option key={item} value={item}>
                        {t(item)}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                {t("cancel")}
              </button>
              <button type="submit" className="primary-button">
                {editingId ? <Check size={17} /> : <Plus size={17} />}
                {editingId ? t("saveChanges") : t("create")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
