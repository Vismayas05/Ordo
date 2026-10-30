import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Settings,
  Plus,
  Search,
  Clock3,
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
import OrdoLogo from "./components/OrdoLogo.jsx";

import {
  calculateScheduleCascade,
  applyDominoShift,
} from "./services/stressEngine.js";
import {
  getStoredProfile,
} from "./services/personaConfig.js";
import {
  startStressAlarmLoop,
  stopStressAlarm,
} from "./services/alarmSound.js";

const STORAGE_KEY = "ordo-tasks";
const SETTINGS_KEY = "ordo-settings";

// 3 clean, essential navigation tabs
const NAV = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Schedule", icon: CalendarDays },
  { label: "Insights", icon: BarChart3 },
];

const DURATIONS = [15, 30, 45, 60, 90, 120];

// Simple, direct text without long conjunctions or wordy fluff
const TEXT = {
  en: {
    Overview: "Overview",
    "My Schedule": "My Schedule",
    Insights: "Insights",
    Settings: "Settings",
    workspace: "WORKSPACE",
    search: "Search tasks...",
    newTask: "New Task",
    welcome: "Today's Schedule",
    subtitle: "Tasks and time tracking with alert cues.",
    tasks: "Tasks",
    total: "total",
    remaining: "remaining",
    completed: "Completed",
    marked: "Done",
    timeRemaining: "Time Left",
    planned: "Planned",
    completion: "Progress",
    progress: "Completion rate",
    yourPlan: "SCHEDULE",
    yourProgress: "ANALYTICS",
    yourSchedule: "Today's Tasks",
    allTasks: "Schedule",
    upcoming: "Upcoming",
    summary: "Summary",
    organised: "Organized by start time.",
    unfinished: "Pending tasks.",
    taskCompletion: "Completion",
    viewAll: "View All",
    plannedTime: "Planned time",
    highPriority: "High priority",
    remainingTasks: "Remaining",
    noMatches: "No matching tasks",
    nothingUpcoming: "Nothing upcoming",
    startHere: "No tasks yet",
    searchTip: "Try a different search term.",
    firstTask: "Add your first task to start planning.",
    createFirst: "Add Task",
    addAnother: "Add Task",
    current: "CURRENT TASK",
    inProgress: "IN PROGRESS",
    upNext: "UP NEXT",
    timeOver: "Overdue",
    timeLeft: "Time Remaining",
    untilEnd: "Until end",
    reviewNext: "Next task",
    scheduleAlert: "Schedule alert",
    noAuto: "Decide when to shift tasks.",
    nextComing: "Next task starts soon.",
    caughtUp: "All tasks done",
    nothingScheduled: "No tasks scheduled",
    noRemaining: "No unfinished tasks.",
    addToSee: "Add a task to start.",
    createTask: "Create Task",
    progressOver: "Progress",
    completedOf: "completed.",
    footer: "ORDO // ALERT SCHEDULER",
    refine: "EDIT TASK",
    makeHappen: "NEW TASK",
    editTask: "Edit Task",
    createTitle: "Create Task",
    updateDetails: "Update task details.",
    nextStep: "Add task to schedule.",
    taskName: "Task Name",
    taskPlaceholder: "What needs to be done?",
    startTime: "Start Time",
    duration: "Duration",
    priority: "Priority",
    category: "Category",
    cancel: "Cancel",
    saveChanges: "Save",
    create: "Add Task",
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
    voiceLabel: "Voice alerts",
    notificationLabel: "Browser notifications",
    settingsTitle: "Preferences",
    settingsDescription: "Sound, notification, and language preferences.",
    voiceOn: "Sound on",
    voiceOff: "Sound muted",
    enableNotifications: "Enable notifications",
    notificationReady: "Notifications enabled.",
    permissionDenied: "Notifications blocked.",
    unavailable: "Notifications unavailable.",
    startReminder: "Time for",
    endReminder: "Time ended for",
    taskStarting: "Starting now.",
    endAlert: "Time ended.",
    conflictTitle: "Overlap detected",
    conflictDescription: "Adjust times to avoid overlap.",
    moveAfter: "Move to",
    keepSchedule: "Keep",
    moved: "Rescheduled.",
    noConflicts: "No overlaps.",
    alerts: "Overlaps",
    languageHint: "Choose interface language.",
    english: "English",
    malayalam: "മലയാളം",
    priorityLabel: "Priority",
  },
  ml: {
    Overview: "അവലോകനം",
    "My Schedule": "ഷെഡ്യൂൾ",
    Insights: "വിശകലനം",
    Settings: "ക്രമീകരണങ്ങൾ",
    workspace: "വർക്ക്സ്പേസ്",
    search: "തിരയുക...",
    newTask: "പുതിയ ടാസ്ക്",
    welcome: "ഇന്നത്തെ ഷെഡ്യൂൾ",
    subtitle: "ടാസ്കുകളും സമയക്രമവും.",
    tasks: "ടാസ്കുകൾ",
    total: "ആകെ",
    remaining: "ബാക്കി",
    completed: "പൂർത്തിയായി",
    marked: "പൂർത്തിയായവ",
    timeRemaining: "ബാക്കി സമയം",
    planned: "ആസൂത്രണം",
    completion: "പുരോഗതി",
    progress: "നിരക്ക്",
    yourPlan: "ഷെഡ്യൂൾ",
    yourProgress: "വിശകലനം",
    yourSchedule: "ഇന്നത്തെ ടാസ്കുകൾ",
    allTasks: "എല്ലാം",
    upcoming: "വരാനിരിക്കുന്നവ",
    summary: "സംഗ്രഹം",
    organised: "സമയക്രമം.",
    unfinished: "ബാക്കിയുള്ളവ.",
    taskCompletion: "പൂർത്തീകരണം",
    viewAll: "എല്ലാം കാണുക",
    plannedTime: "ആസൂത്രിത സമയം",
    highPriority: "ഉയർന്ന മുൻഗണന",
    remainingTasks: "ബാക്കി",
    noMatches: "കണ്ടെത്തിയില്ല",
    nothingUpcoming: "ടാസ്കുകളില്ല",
    startHere: "തുടങ്ങാം",
    searchTip: "മറ്റൊരു വാക്ക് നൽകൂ.",
    firstTask: "ആദ്യ ടാസ്ക് ചേർക്കൂ.",
    createFirst: "ടാസ്ക് ചേർക്കുക",
    addAnother: "ടാസ്ക് ചേർക്കുക",
    current: "നിലവിലെ ടാസ്ക്",
    inProgress: "പുരോഗമിക്കുന്നു",
    upNext: "അടുത്തത്",
    timeOver: "സമയം കഴിഞ്ഞു",
    timeLeft: "ബാക്കി സമയം",
    untilEnd: "അവസാനിക്കാൻ",
    reviewNext: "അടുത്ത ടാസ്ക്",
    scheduleAlert: "ഷെഡ്യൂൾ അലർട്ട്",
    noAuto: "മാറ്റങ്ങൾ നിങ്ങൾ തീരുമാനിക്കൂ.",
    nextComing: "അടുത്ത ടാസ്ക് ഉടൻ തുടങ്ങും.",
    caughtUp: "എല്ലാം കഴിഞ്ഞു!",
    nothingScheduled: "ടാസ്കുകളൊന്നുമില്ല",
    noRemaining: "ബാക്കി ടാസ്കുകളില്ല.",
    addToSee: "ടാസ്ക് ചേർക്കൂ.",
    createTask: "ടാസ്ക് ഉണ്ടാക്കുക",
    progressOver: "പുരോഗതി",
    completedOf: "പൂർത്തിയായി.",
    footer: "ORDO // ALERT SCHEDULER",
    refine: "തിരുത്തുക",
    makeHappen: "പുതിയത്",
    editTask: "ടാസ്ക് തിരുത്തുക",
    createTitle: "ടാസ്ക് ഉണ്ടാക്കുക",
    updateDetails: "വിവരങ്ങൾ നൽകൂ.",
    nextStep: "ഷെഡ്യൂളിൽ ചേർക്കൂ.",
    taskName: "പേര്",
    taskPlaceholder: "എന്താണ് ചെയ്യേണ്ടത്?",
    startTime: "സമയം",
    duration: "ദൈർഘ്യം",
    priority: "മുൻഗണന",
    category: "വിഭാഗം",
    cancel: "റദ്ദാക്കുക",
    saveChanges: "സൂക്ഷിക്കുക",
    create: "ചേർക്കുക",
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
    voiceLabel: "ശബ്ദ അലർട്ടുകൾ",
    notificationLabel: "അറിയിപ്പുകൾ",
    settingsTitle: "ക്രമീകരണങ്ങൾ",
    settingsDescription: "ശബ്ദം, അറിയിപ്പുകൾ, ഭാഷ എന്നിവ തിരഞ്ഞെടുക്കൂ.",
    voiceOn: "ശബ്ദം ഓൺ",
    voiceOff: "ശബ്ദം ഓഫ്",
    enableNotifications: "അറിയിപ്പുകൾ നൽകുക",
    notificationReady: "അറിയിപ്പുകൾ സജ്ജമാണ്.",
    permissionDenied: "അനുമതി നൽകണം.",
    unavailable: "ലഭ്യമല്ല.",
    startReminder: "തുടങ്ങാൻ സമയം",
    endReminder: "സമയം അവസാനിച്ചു",
    taskStarting: "ഇപ്പോൾ തുടങ്ങുന്നു.",
    endAlert: "സമയം കഴിഞ്ഞു.",
    conflictTitle: "സമയങ്ങൾ തമ്മിൽ മുട്ടുന്നു",
    conflictDescription: "സമയങ്ങൾ മാറ്റാം.",
    moveAfter: "മാറ്റുക",
    keepSchedule: "നിലനിർത്തുക",
    moved: "മാറ്റി.",
    noConflicts: "മുട്ടുന്നില്ല.",
    alerts: "പരിശോധന",
    languageHint: "ഭാഷ തിരഞ്ഞെടുക്കൂ.",
    english: "English",
    malayalam: "മലയാളം",
    priorityLabel: "മുൻഗണന",
  },
};

function getDefaultTime() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(Math.floor(d.getMinutes() / 5) * 5).padStart(2, "0");
  return `${h}:${m}`;
}

function readTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const tasks = JSON.parse(raw);
    if (!Array.isArray(tasks)) return [];

    // Filter out old prototype mock tasks so users start clean
    const cleanTasks = tasks.filter(
      (task) =>
        task?.id &&
        task?.title &&
        !["task-1", "task-2", "task-3", "task-4"].includes(task.id)
    );

    return cleanTasks.map((task) => ({
      ...task,
      duration: Number(task.duration) || 30,
      priority: ["Low", "Medium", "High"].includes(task.priority) ? task.priority : "Medium",
      category: task.category || "Work",
      time: task.time || getDefaultTime(),
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
  const [filterMode, setFilterMode] = useState("all"); // all, pending, done
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(getDefaultTime);
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

  // Real-time schedule cascade & stress calculation
  const cascadeInfo = useMemo(() => {
    return calculateScheduleCascade(tasks, now, profile);
  }, [tasks, now, profile]);

  // Play procedural stress alarm when a task overruns
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

  // Task-time voice announcements
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
        });
      });
    };

    checkReminders();
    const timer = window.setInterval(checkReminders, 1000);
    return () => window.clearInterval(timer);
  }, [tasks, settings.voice, language, t]);

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
      if (filterMode === "pending") return !task.done;
      if (filterMode === "done") return task.done;
      return true;
    });
  }, [sortedTasks, search, filterMode]);

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const totalMinutes = tasks
    .filter((task) => !task.done)
    .reduce((sum, task) => sum + Number(task.duration || 0), 0);

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
    setToast(language === "ml" ? "അലാറം പുതുക്കി." : "Alarm profile updated.");
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
    setTime(getDefaultTime());
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
    setTime(task.time || getDefaultTime());
    setDuration(String(task.duration || 30));
    setPriority(task.priority || "Medium");
    setCategory(task.category || "Work");
    setShowForm(true);
  }

  function clearAllTasks() {
    if (window.confirm("Clear all tasks and start fresh?")) {
      setTasks([]);
      stopStressAlarm();
      setToast(language === "ml" ? "എല്ലാം നീക്കം ചെയ്തു." : "All tasks cleared.");
    }
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
      setToast(language === "ml" ? "ടാസ്ക് ചേർത്തു." : "Task added.");
    }

    setShowForm(false);
    resetForm();
  }

  function selectNav(label) {
    setActiveNav(label);
    setMobileMenu(false);
    setSearch("");
  }

  function handleDominoShift() {
    const shiftMin = cascadeInfo.overrunMinutes || 15;
    const targetTaskId = cascadeInfo.overdueTask?.id;
    if (!targetTaskId) return;

    const updated = applyDominoShift(tasks, targetTaskId, shiftMin);
    setTasks(updated);
    stopStressAlarm();
    setToast(
      language === "ml"
        ? `ഷെഡ്യൂൾ +${shiftMin} മിനിറ്റ് മാറ്റി.`
        : `Schedule auto-shifted by +${shiftMin}m.`
    );
  }

  function handleMarkDoneAndAdvance() {
    if (!cascadeInfo.overdueTask) return;
    const overdueId = cascadeInfo.overdueTask.id;
    setTasks((old) => old.map((t) => (t.id === overdueId ? { ...t, done: true } : t)));
    stopStressAlarm();
    setToast(language === "ml" ? "ടാസ്ക് പൂർത്തിയായി!" : "Task completed!");
  }

  function handleSnooze() {
    setSnoozeUntil(Date.now() + 5 * 60000);
    stopStressAlarm();
    setToast(language === "ml" ? "5 മിനിറ്റ് സ്നൂസ് ചെയ്തു." : "Snoozed for 5 minutes.");
  }

  function handleToggleMute() {
    if (!isAudioMuted) {
      stopStressAlarm();
    }
    setIsAudioMuted(!isAudioMuted);
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
      : activeNav === "My Schedule"
      ? "My Schedule"
      : activeNav === "Insights"
      ? "Insights"
      : t("settingsTitle");

  return (
    <div className={`app-shell ${language === "ml" ? "language-ml" : ""}`}>
      {/* Background canvas */}
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
          <OrdoLogo />
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
              {label === "My Schedule" && <span className="nav-count">{tasks.length}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar bottom: only Settings */}
        <div className="sidebar-bottom">
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
            <Menu size={20} />
          </button>

          <div className="breadcrumb">
            Ordo <span>/</span> <strong>{t(activeNav)}</strong>
          </div>

          <div className="topbar-actions">
            {/* Live Stress Status Pill */}
            <div
              className={`top-stress-pill ${
                cascadeInfo.stressScore >= 75
                  ? "stress-pill-critical"
                  : cascadeInfo.stressScore >= 35
                  ? "stress-pill-warning"
                  : "stress-pill-calm"
              }`}
            >
              <span>●</span>
              <span>
                {cascadeInfo.stressScore >= 75
                  ? `STRESS: ${cascadeInfo.stressScore}%`
                  : cascadeInfo.stressScore >= 35
                  ? `PRESSURE: ${cascadeInfo.stressScore}%`
                  : `FLOW: ${cascadeInfo.stressScore}%`}
              </span>
            </div>

            {/* Persona Customizer Pill */}
            <button
              className="persona-top-badge"
              onClick={() => setShowProfileModal(true)}
              title="Customize alarm tone and cushion"
            >
              <Zap size={13} />
              <span>{profile.customName || "My Ordo"}</span>
              <strong>{profile.soundFreq}Hz</strong>
            </button>

            {/* Search Box */}
            <label className="search-box">
              <Search size={15} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("search")}
                aria-label={t("search")}
              />
            </label>

            {/* Language Switch */}
            <button
              className="icon-button"
              title={t("language")}
              aria-label={t("language")}
              onClick={() => setPreference("language", language === "en" ? "ml" : "en")}
            >
              <Languages size={17} />
            </button>

            {/* Single Mute/Sound Toggle */}
            <button
              className="icon-button"
              title={settings.voice && !isAudioMuted ? "Mute sound" : "Enable sound"}
              aria-label={settings.voice && !isAudioMuted ? "Mute sound" : "Enable sound"}
              onClick={() => {
                if (settings.voice && !isAudioMuted) {
                  setIsAudioMuted(true);
                  stopStressAlarm();
                } else {
                  setIsAudioMuted(false);
                  setPreference("voice", true);
                }
              }}
            >
              {settings.voice && !isAudioMuted ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          </div>
        </header>

        <div className="page-content">
          {/* Stress Alarm HUD Banner (triggers when a task runs late) */}
          {cascadeInfo.overdueTask && (
            <StressCascadeBanner
              cascadeInfo={cascadeInfo}
              onDominoShift={handleDominoShift}
              onMarkDoneAndAdvance={handleMarkDoneAndAdvance}
              onSnooze={handleSnooze}
              isMuted={isAudioMuted || !settings.voice}
              onToggleMute={handleToggleMute}
            />
          )}

          {activeNav !== "Insights" && (
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
                  <Plus size={17} /> {t("newTask")}
                </button>
              )}
            </section>
          )}

          {activeNav === "Settings" ? (
            /* SETTINGS VIEW */
            <section className="panel settings-panel">
              <div className="section-kicker">{t("Settings").toUpperCase()}</div>
              <h2>{t("settingsTitle")}</h2>
              <p>{t("settingsDescription")}</p>

              <div className="settings-option">
                <div>
                  <strong>Acoustic Alarm & Cushion</strong>
                  <span>Set your frequency, sound pattern, and grace period.</span>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => setShowProfileModal(true)}
                >
                  <Sliders size={15} /> Customize Alarm
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
                  <strong>Sound Alerts</strong>
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

              <div className="settings-option">
                <div>
                  <strong>Clear All Tasks</strong>
                  <span>Remove all tasks and reset schedule.</span>
                </div>
                <button
                  className="secondary-button"
                  style={{ color: "var(--neon-rose)", borderColor: "var(--border-neon-rose)" }}
                  onClick={clearAllTasks}
                >
                  <Trash2 size={15} /> Clear Tasks
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
                        <AlertTriangle size={19} />
                      </div>
                      <div className="conflict-copy">
                        <strong>{t("conflictTitle")}</strong>
                        <p>
                          {first.title} · {timeLabel(first.time, language)} — {second.title} ·{" "}
                          {timeLabel(second.time, language)}
                        </p>
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
                  <CircleCheck size={17} />
                  <span>{t("noConflicts")}</span>
                </div>
              )}
            </section>
          ) : activeNav === "Insights" ? (
            /* INSIGHTS VIEW */
            <Insights tasks={tasks} language={language} />
          ) : (
            /* OVERVIEW & MY SCHEDULE VIEW */
            <>
              <section className="stats-grid">
                <article className="stat-card">
                  <div className="stat-top">
                    <span>{t("tasks")}</span>
                    <span className="stat-icon">
                      <CalendarDays size={17} />
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
                      <CircleCheck size={17} />
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
                      <Clock3 size={17} />
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
                    <span>STRESS LEVEL</span>
                    <span className="stat-icon rose-icon">
                      <ShieldAlert size={17} />
                    </span>
                  </div>
                  <div className="stat-number">
                    {cascadeInfo.stressScore}
                    <span className="stat-unit">%</span>
                  </div>
                  <div className="stat-foot">
                    {cascadeInfo.overdueTask ? `+${cascadeInfo.overrunMinutes}m Overrun` : "Optimal"}
                  </div>
                </article>
              </section>

              {tasks.length === 0 && (
                <div
                  className="panel"
                  style={{
                    marginBottom: "20px",
                    background: "linear-gradient(135deg, rgba(0, 194, 255, 0.1) 0%, rgba(255, 0, 127, 0.06) 100%)",
                    border: "1px solid var(--border-cerulean)",
                    padding: "22px 24px",
                  }}
                >
                  <div className="section-kicker">GET STARTED</div>
                  <h2 style={{ fontSize: "20px", margin: "6px 0", color: "#fff" }}>
                    No Tasks Yet
                  </h2>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      margin: "0 0 16px",
                      maxWidth: "520px",
                    }}
                  >
                    Add tasks to organize your day. If a task takes longer than planned, Ordo rings an alert.
                  </p>
                  <div>
                    <button className="primary-button" onClick={openNewTask}>
                      <Plus size={16} /> Add Task
                    </button>
                  </div>
                </div>
              )}

              <section className="content-grid">
                {/* Main Schedule Panel */}
                <article className="panel schedule-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="section-kicker">
                        {activeNav === "My Schedule" ? "FULL TIMELINE" : t("yourPlan")}
                      </div>
                      <h2>{activeNav === "My Schedule" ? "All Tasks" : t("yourSchedule")}</h2>
                    </div>

                    {/* Filter Pills */}
                    {activeNav === "My Schedule" && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        {["all", "pending", "done"].map((mode) => (
                          <button
                            key={mode}
                            className={`secondary-button ${filterMode === mode ? "setting-selected" : ""}`}
                            style={{ minHeight: "30px", padding: "0 10px", fontSize: "11px", textTransform: "capitalize" }}
                            onClick={() => setFilterMode(mode)}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    )}
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
                        <CalendarDays size={26} />
                        <strong>{search ? t("noMatches") : t("startHere")}</strong>
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
                              {task.done ? <CircleCheck size={20} /> : <Circle size={20} />}
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
                              <Pencil size={13} />
                            </button>
                            <button
                              className="icon-button task-delete"
                              aria-label={`${t("delete")} ${task.title}`}
                              title={t("delete")}
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {tasks.length > 0 && (
                    <button className="add-task-link" onClick={openNewTask}>
                      <Plus size={15} /> {t("addAnother")}
                    </button>
                  )}
                </article>

                {/* Right Column: Active Task Card */}
                <div className="right-column">
                  <article className="panel next-panel">
                    <div className="section-kicker">
                      {cascadeInfo.overdueTask
                        ? "ALERT: TIME OVER"
                        : currentTask
                        ? t("inProgress")
                        : t("upNext")}
                    </div>

                    {cascadeInfo.overdueTask ? (
                      <>
                        <h2 className="next-title" style={{ color: "var(--neon-rose)" }}>
                          {cascadeInfo.overdueTask.title}
                        </h2>
                        <div className="next-time">
                          <Clock3 size={14} />
                          {timeLabel(cascadeInfo.overdueTask.time, language)}
                          <span>·</span>
                          {cascadeInfo.overdueTask.duration} min planned
                        </div>
                        <div className="live-countdown countdown-overdue">
                          <div className="countdown-label">TIME OVER PLAN</div>
                          <strong>+{countdown(now - taskEnd(cascadeInfo.overdueTask))}</strong>
                          <span>Next task pushed forward</span>
                        </div>
                        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                          <button
                            className="action-btn btn-domino"
                            style={{ flex: 1 }}
                            onClick={handleDominoShift}
                          >
                            <FastForward size={14} /> Auto-Shift
                          </button>
                          <button
                            className="action-btn btn-advance"
                            style={{ flex: 1 }}
                            onClick={handleMarkDoneAndAdvance}
                          >
                            <Check size={14} /> Done
                          </button>
                        </div>
                      </>
                    ) : currentTask ? (
                      <>
                        <h2 className="next-title">{currentTask.title}</h2>
                        <div className="next-time">
                          <Clock3 size={14} />
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
                          <Clock3 size={14} />
                          {t("startTime")}: {timeLabel(nextTask.time, language)}
                          <span>·</span>
                          {nextTask.duration} min
                        </div>
                        <div className="next-divider" />
                        <div className="next-tip">
                          <Clock3 size={15} />
                          <span>{t("nextComing")}</span>
                        </div>
                      </>
                    ) : (
                      <div className="all-done">
                        <CircleCheck size={26} />
                        <h3>{tasks.length ? t("caughtUp") : t("nothingScheduled")}</h3>
                        <p>{tasks.length ? t("noRemaining") : t("addToSee")}</p>
                        <button className="secondary-button" onClick={openNewTask}>
                          <Plus size={14} /> {t("createTask")}
                        </button>
                      </div>
                    )}
                  </article>
                </div>
              </section>
            </>
          )}

          <footer className="page-footer">
            <span>ORDO</span>
            <span>{t("footer")}</span>
          </footer>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="ordo-toast" role="status">
          <CircleCheck size={15} />
          {toast}
        </div>
      )}

      {/* Acoustic Alarm & Persona Modal */}
      {showProfileModal && (
        <OrdoProfileModal
          profile={profile}
          onUpdateProfile={handleProfileUpdate}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Task Modal */}
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
                <X size={18} />
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
                  {["Work", "Study", "Personal", "Health", "Project", "Other"].map(
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
                {editingId ? <Check size={16} /> : <Plus size={16} />}
                {editingId ? t("saveChanges") : t("create")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
