import { useMemo } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Target,
  TrendingUp,
  CircleAlert,
} from "lucide-react";

function formatDuration(minutes) {
  const total = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(total / 60);
  const mins = total % 60;

  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
}

function formatTime(time) {
  if (!time) return "—";
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function MetricCard({ icon: Icon, label, value, note, tone = "navy" }) {
  return (
    <article className="insight-metric">
      <div className="insight-metric-top">
        <span className={`insight-metric-icon ${tone}`}>
          <Icon size={18} strokeWidth={1.8} />
        </span>
        <span className="insight-metric-label">{label}</span>
      </div>
      <div className="insight-metric-value">{value}</div>
      <div className="insight-metric-note">{note}</div>
    </article>
  );
}

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="insight-section-heading">
      <div>
        {eyebrow && <div className="section-kicker">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {Icon && (
        <span className="insight-section-icon">
          <Icon size={19} strokeWidth={1.8} />
        </span>
      )}
    </div>
  );
}

export default function Insights({ tasks = [], language = "en" }) {
  const ml = language === "ml";

  const copy = ml
    ? {
        eyebrow: "നിങ്ങളുടെ പുരോഗതി",
        title: "Insights",
        subtitle: "നിങ്ങളുടെ ടാസ്കുകളും സമയവും എങ്ങനെ ക്രമീകരിച്ചിരിക്കുന്നു എന്ന് മനസ്സിലാക്കൂ.",
        total: "ആകെ ടാസ്കുകൾ",
        completed: "പൂർത്തിയാക്കി",
        pending: "ബാക്കിയുള്ളവ",
        planned: "ആസൂത്രിത സമയം",
        completion: "പൂർത്തീകരണ പുരോഗതി",
        completionDesc: "നിങ്ങളുടെ ടാസ്കുകളുടെ നിലവിലെ നില",
        complete: "പൂർത്തിയാക്കി",
        remaining: "ബാക്കി",
        categories: "വിഭാഗങ്ങൾ",
        categoriesDesc: "ഓരോ വിഭാഗത്തിലെയും ടാസ്കുകളുടെ പുരോഗതി",
        schedule: "സമയ വിതരണം",
        scheduleDesc: "നിങ്ങളുടെ ടാസ്കുകൾ ദിവസത്തിലെ ഏത് സമയത്താണ് ക്രമീകരിച്ചിരിക്കുന്നത്",
        morning: "രാവിലെ",
        afternoon: "ഉച്ചയ്ക്ക്",
        evening: "വൈകുന്നേരം",
        night: "രാത്രി",
        priority: "മുൻഗണനാ വിതരണം",
        priorityDesc: "നിങ്ങളുടെ ബാക്കിയുള്ള ടാസ്കുകളുടെ മുൻഗണന",
        high: "ഉയർന്നത്",
        medium: "ഇടത്തരം",
        low: "കുറഞ്ഞത്",
        noTasks: "ഇവിടെ തുടങ്ങാം",
        noTasksDesc: "ആദ്യം കുറച്ച് ടാസ്കുകൾ ചേർക്കൂ. നിങ്ങളുടെ യഥാർത്ഥ പുരോഗതി ഇവിടെ കാണാം.",
        noCategory: "വിഭാഗമില്ല",
        tasks: "ടാസ്കുകൾ",
        ofTotal: "ആകെ ടാസ്കുകളിൽ",
        plannedTime: "ആസൂത്രണം ചെയ്ത ആകെ സമയം",
        timeNote: "എല്ലാ സേവ് ചെയ്ത ടാസ്കുകളും",
        remainingTime: "ബാക്കിയുള്ള സമയം",
        focus: "പ്രധാന കണ്ടെത്തലുകൾ",
        focusDesc: "നിലവിലെ ടാസ്ക് ലിസ്റ്റിൽ നിന്ന്",
        highPending: "ഉയർന്ന മുൻഗണനയുള്ള ബാക്കി ടാസ്കുകൾ",
        categoryCount: "സജീവ വിഭാഗങ്ങൾ",
        allDone: "എല്ലാ ടാസ്കുകളും പൂർത്തിയാക്കി!",
        allDoneDesc: "നിങ്ങളുടെ നിലവിലെ ടാസ്ക് ലിസ്റ്റിൽ ഇനി ഒന്നും ബാക്കിയില്ല.",
        startProgress: "നിങ്ങളുടെ ആദ്യ ടാസ്ക് ചേർക്കുമ്പോൾ പുരോഗതി ഇവിടെ കാണാം.",
      }
    : {
        eyebrow: "YOUR PRODUCTIVITY",
        title: "Insights",
        subtitle: "A clearer picture of your tasks, planned time, and progress.",
        total: "Total tasks",
        completed: "Completed",
        pending: "Remaining",
        planned: "Planned time",
        completion: "Completion overview",
        completionDesc: "Your current progress across saved tasks",
        complete: "Completed",
        remaining: "Remaining",
        categories: "Category breakdown",
        categoriesDesc: "Where your tasks are organised",
        schedule: "Time distribution",
        scheduleDesc: "When your tasks are scheduled throughout the day",
        morning: "Morning",
        afternoon: "Afternoon",
        evening: "Evening",
        night: "Night",
        priority: "Priority breakdown",
        priorityDesc: "Priority levels across unfinished tasks",
        high: "High",
        medium: "Medium",
        low: "Low",
        noTasks: "Your insights start here",
        noTasksDesc: "Add a few tasks first. Your real progress will appear here automatically.",
        noCategory: "Uncategorised",
        tasks: "tasks",
        ofTotal: "of all tasks",
        plannedTime: "Total scheduled time",
        timeNote: "Across all saved tasks",
        remainingTime: "Time left to plan",
        focus: "Useful signals",
        focusDesc: "Based on your current task list",
        highPending: "High-priority tasks remaining",
        categoryCount: "Active categories",
        allDone: "Everything is complete",
        allDoneDesc: "There are no unfinished tasks in your current list.",
        startProgress: "Your progress will appear here as you add tasks.",
      };

  const stats = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const total = safeTasks.length;
    const completed = safeTasks.filter((task) => task.done).length;
    const pendingTasks = safeTasks.filter((task) => !task.done);
    const totalMinutes = safeTasks.reduce(
      (sum, task) => sum + (Number(task.duration) || 0),
      0
    );
    const pendingMinutes = pendingTasks.reduce(
      (sum, task) => sum + (Number(task.duration) || 0),
      0
    );
    const completionRate = total
      ? Math.round((completed / total) * 100)
      : 0;

    const categoryMap = {};
    safeTasks.forEach((task) => {
      const name = task.category || (ml ? "മറ്റുള്ളവ" : "Other");
      if (!categoryMap[name]) {
        categoryMap[name] = { total: 0, completed: 0, minutes: 0 };
      }
      categoryMap[name].total += 1;
      categoryMap[name].minutes += Number(task.duration) || 0;
      if (task.done) categoryMap[name].completed += 1;
    });

    const categories = Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        ...data,
        percent: data.total
          ? Math.round((data.completed / data.total) * 100)
          : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const priorityMap = {
      High: pendingTasks.filter((task) => task.priority === "High").length,
      Medium: pendingTasks.filter((task) => task.priority === "Medium").length,
      Low: pendingTasks.filter((task) => task.priority === "Low").length,
    };

    const timeBuckets = [
      { key: "morning", label: copy.morning, start: 5, end: 12, count: 0, minutes: 0 },
      { key: "afternoon", label: copy.afternoon, start: 12, end: 17, count: 0, minutes: 0 },
      { key: "evening", label: copy.evening, start: 17, end: 21, count: 0, minutes: 0 },
      { key: "night", label: copy.night, start: 21, end: 29, count: 0, minutes: 0 },
    ];

    safeTasks.forEach((task) => {
      const hour = Number((task.time || "17:00").split(":")[0]);
      const bucket = timeBuckets.find(
        (item) => hour >= item.start && hour < item.end
      ) || timeBuckets[0];
      bucket.count += 1;
      bucket.minutes += Number(task.duration) || 0;
    });

    const topCategory = [...categories].sort((a, b) => b.total - a.total)[0];

    return {
      total,
      completed,
      pending: total - completed,
      totalMinutes,
      pendingMinutes,
      completionRate,
      categories,
      priorityMap,
      timeBuckets,
      topCategory,
      highPending: priorityMap.High,
    };
  }, [tasks, ml, copy]);

  if (stats.total === 0) {
    return (
      <section className="ordo-insights-page">
        <header className="insights-hero">
          <div className="insights-hero-copy">
            <span className="insights-eyebrow">
              <span className="insights-live-dot" />
              {copy.eyebrow}
            </span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <div className="insights-hero-art" aria-hidden="true">
            <div className="insights-art-ring ring-one" />
            <div className="insights-art-ring ring-two" />
            <div className="insights-art-center"><Activity size={25} /></div>
          </div>
        </header>

        <div className="insights-empty-state">
          <div className="insights-empty-illustration">
            <BarChart3 size={30} strokeWidth={1.6} />
            <span />
            <span />
            <span />
          </div>
          <h2>{copy.noTasks}</h2>
          <p>{copy.noTasksDesc}</p>
          <div className="insights-empty-footnote">
            <Target size={15} />
            {copy.startProgress}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ordo-insights-page">
      <header className="insights-hero">
        <div className="insights-hero-copy">
          <span className="insights-eyebrow">
            <span className="insights-live-dot" />
            {copy.eyebrow}
          </span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <div className="insights-hero-art" aria-hidden="true">
          <div className="insights-art-ring ring-one" />
          <div className="insights-art-ring ring-two" />
          <div className="insights-art-center"><Activity size={25} /></div>
        </div>
      </header>

      <div className="insights-metrics-grid">
        <MetricCard
          icon={ListTodo}
          label={copy.total}
          value={stats.total}
          note={`${stats.categories.length} ${copy.categoryCount.toLowerCase()}`}
          tone="navy"
        />
        <MetricCard
          icon={CheckCircle2}
          label={copy.completed}
          value={stats.completed}
          note={`${stats.completionRate}% ${copy.ofTotal}`}
          tone="sage"
        />
        <MetricCard
          icon={Clock3}
          label={copy.planned}
          value={formatDuration(stats.totalMinutes)}
          note={copy.timeNote}
          tone="coral"
        />
        <MetricCard
          icon={CalendarDays}
          label={copy.remaining}
          value={stats.pending}
          note={formatDuration(stats.pendingMinutes)}
          tone="lavender"
        />
      </div>

      <div className="insights-main-grid">
        <article className="insights-card insights-completion-card">
          <SectionHeading
            eyebrow="PROGRESS"
            title={copy.completion}
            description={copy.completionDesc}
            icon={TrendingUp}
          />

          <div className="insights-completion-layout">
            <div
              className="insights-donut"
              style={{ "--completion": `${stats.completionRate}%` }}
              role="img"
              aria-label={`${stats.completionRate}% completed`}
            >
              <div className="insights-donut-inner">
                <strong>{stats.completionRate}%</strong>
                <span>{copy.complete}</span>
              </div>
            </div>

            <div className="insights-completion-details">
              <div className="insights-legend-row">
                <span className="insights-legend-mark completed-mark" />
                <span>{copy.complete}</span>
                <strong>{stats.completed}</strong>
              </div>
              <div className="insights-legend-row">
                <span className="insights-legend-mark pending-mark" />
                <span>{copy.remaining}</span>
                <strong>{stats.pending}</strong>
              </div>
              <div className="insights-completion-foot">
                {stats.pending === 0 ? (
                  <><CheckCircle2 size={16} />{copy.allDone}</>
                ) : (
                  <><CircleAlert size={16} />{stats.highPending} {copy.high.toLowerCase()} · {copy.highPending.toLowerCase()}</>
                )}
              </div>
            </div>
          </div>

          <div className="insights-wide-progress">
            <div className="insights-wide-progress-label">
              <span>{copy.complete}</span>
              <strong>{stats.completed} / {stats.total}</strong>
            </div>
            <div className="insights-progress-track">
              <div
                className="insights-progress-fill"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </article>

        <article className="insights-card">
          <SectionHeading
            eyebrow="SCHEDULE"
            title={copy.schedule}
            description={copy.scheduleDesc}
            icon={Clock3}
          />

          <div className="insights-time-list">
            {stats.timeBuckets.map((bucket) => {
              const percent = stats.total
                ? Math.round((bucket.count / stats.total) * 100)
                : 0;

              return (
                <div className="insights-time-row" key={bucket.key}>
                  <div className="insights-time-row-top">
                    <span>{bucket.label}</span>
                    <strong>{bucket.count}</strong>
                  </div>
                  <div className="insights-time-track">
                    <div
                      className={`insights-time-fill ${bucket.key}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="insights-time-foot">
                    {formatDuration(bucket.minutes)}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="insights-card">
          <SectionHeading
            eyebrow="DISTRIBUTION"
            title={copy.categories}
            description={copy.categoriesDesc}
            icon={BarChart3}
          />

          {stats.categories.length === 0 ? (
            <p className="insights-muted">{copy.noCategory}</p>
          ) : (
            <div className="insights-category-list">
              {stats.categories.map((category) => (
                <div className="insights-category-item" key={category.name}>
                  <div className="insights-category-heading">
                    <div className="insights-category-name">
                      <span className="insights-category-dot" />
                      <strong>{category.name}</strong>
                    </div>
                    <span>{category.completed}/{category.total}</span>
                  </div>
                  <div className="insights-progress-track">
                    <div
                      className="insights-progress-fill category-fill"
                      style={{ width: `${category.percent}%` }}
                    />
                  </div>
                  <div className="insights-category-foot">
                    <span>{category.total} {copy.tasks}</span>
                    <span>{formatDuration(category.minutes)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="insights-card">
          <SectionHeading
            eyebrow="PRIORITIES"
            title={copy.priority}
            description={copy.priorityDesc}
            icon={Target}
          />

          <div className="insights-priority-list">
            {[
              { key: "High", label: copy.high, className: "high", count: stats.priorityMap.High },
              { key: "Medium", label: copy.medium, className: "medium", count: stats.priorityMap.Medium },
              { key: "Low", label: copy.low, className: "low", count: stats.priorityMap.Low },
            ].map((item) => {
              const percent = stats.pending
                ? Math.round((item.count / stats.pending) * 100)
                : 0;

              return (
                <div className="insights-priority-row" key={item.key}>
                  <div className="insights-priority-top">
                    <span className={`insights-priority-badge ${item.className}`}>
                      {item.label}
                    </span>
                    <strong>{item.count}</strong>
                  </div>
                  <div className="insights-priority-track">
                    <div
                      className={`insights-priority-fill ${item.className}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="insights-priority-note">
            <div className="insights-note-icon"><Activity size={17} /></div>
            <div>
              <strong>{copy.focus}</strong>
              <p>{copy.focusDesc}. {stats.highPending} {copy.highPending.toLowerCase()}.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
