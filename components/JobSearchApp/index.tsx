"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";
import { SEARCH_SOURCES } from "@/lib/config";
import { cn } from "@/lib/utils";

type Locale = "en" | "vi";
type Job = {
  id: string;
  title: string;
  position: string;
  company: string;
  source: string;
  location: string;
  posted: string;
  description: string;
  contact: string;
  accent: string;
};
type FormValues = { title: string; source: string; location: string };

const schema = z.object({
  title: z
    .string()
    .min(1, "Enter a job title to search")
    .max(255, "Keep your job title under 255 characters"),
  source: z.string().min(1, "Choose a search source"),
  location: z.string().max(200, "Keep your location under 200 characters"),
});

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    position: "Senior Product Designer",
    company: "Canva",
    source: "Seek",
    location: "Sydney, NSW",
    posted: "2h ago",
    description:
      "Lead thoughtful product experiences from discovery through launch. You’ll work alongside product, engineering, and research to make complex workflows feel simple.",
    contact: "Maya Chen · maya@canva.com",
    accent: "bg-violet-500",
  },
  {
    id: "2",
    title: "Frontend Engineer",
    position: "Frontend Engineer",
    company: "Atlassian",
    source: "Indeed",
    location: "Sydney, NSW",
    posted: "5h ago",
    description:
      "Build fast, accessible interfaces used by millions of teams. Bring a strong eye for detail and a passion for elegant, maintainable systems.",
    contact: "Jordan Lee · jordan@atlassian.com",
    accent: "bg-sky-500",
  },
  {
    id: "3",
    title: "Product Manager",
    position: "Product Manager",
    company: "SafetyCulture",
    source: "Seek",
    location: "Surry Hills, NSW",
    posted: "1d ago",
    description:
      "Own the roadmap for a product that helps frontline teams work safer and smarter. You’ll turn customer insight into measurable outcomes.",
    contact: "Alex Morgan · alex@safetyculture.com",
    accent: "bg-amber-500",
  },
  {
    id: "4",
    title: "UX Researcher",
    position: "UX Researcher",
    company: "Commonwealth Bank",
    source: "Indeed",
    location: "Barangaroo, NSW",
    posted: "2d ago",
    description:
      "Shape the future of digital banking through generative and evaluative research. Partner with designers to make every interaction more human.",
    contact: "Sam Wilson · sam@cba.com.au",
    accent: "bg-emerald-500",
  },
  {
    id: "5",
    title: "Data Analyst",
    position: "Data Analyst",
    company: "Qantas",
    source: "Seek",
    location: "Mascot, NSW",
    posted: "3d ago",
    description:
      "Turn operational data into clear decisions across one of Australia’s most recognisable brands. SQL and storytelling are equally important here.",
    contact: "Taylor Ng · taylor@qantas.com",
    accent: "bg-rose-500",
  },
];

const copy = {
  en: {
    greeting: "Good morning, Alex",
    subtitle: "Find your next opportunity",
    search: "Search jobs",
    jobTitle: "Job title",
    jobPlaceholder: "e.g. Product Designer",
    source: "Search source",
    location: "Location",
    locationPlaceholder: "City, suburb, or postcode",
    submit: "Search jobs",
    all: "All sources",
    recent: "Recent searches",
    results: "jobs found",
    map: "Map integration coming soon",
    mapSub: "Your search results will appear here",
    jobs: "Jobs",
    filters: "Filters",
    sort: "Sort: newest",
    details: "Job details",
    back: "Back to map",
    posted: "Posted",
    contact: "Contact",
    apply: "View original listing",
    openSearch: "Edit search",
    hide: "Hide list",
    show: "Show list",
    noLocation: "Location not specified",
    description: "About the role",
  },
  vi: {
    greeting: "Chào buổi sáng, Alex",
    subtitle: "Tìm cơ hội tiếp theo của bạn",
    search: "Tìm việc",
    jobTitle: "Tên công việc",
    jobPlaceholder: "vd. Product Designer",
    source: "Nguồn tìm kiếm",
    location: "Vị trí",
    locationPlaceholder: "Thành phố, quận, mã bưu điện",
    submit: "Tìm việc",
    all: "Tất cả nguồn",
    recent: "Tìm kiếm gần đây",
    results: "việc làm",
    map: "Tích hợp bản đồ sắp ra mắt",
    mapSub: "Kết quả tìm kiếm sẽ hiển thị tại đây",
    jobs: "Việc làm",
    filters: "Bộ lọc",
    sort: "Sắp xếp: mới nhất",
    details: "Chi tiết công việc",
    back: "Quay lại bản đồ",
    posted: "Đăng",
    contact: "Liên hệ",
    apply: "Xem tin đăng gốc",
    openSearch: "Sửa tìm kiếm",
    hide: "Ẩn danh sách",
    show: "Hiện danh sách",
    noLocation: "Chưa có vị trí",
    description: "Về công việc",
  },
};

export function JobSearchApp() {
  const router = useRouter();
  const params = useSearchParams();
  const [locale, setLocale] = React.useState<Locale>("en");
  const [dialogOpen, setDialogOpen] = React.useState(!params.get("q"));
  const [listOpen, setListOpen] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | null>(
    params.get("jobId"),
  );
  const [detail, setDetail] = React.useState<Job | null>(
    params.get("jobId")
      ? (jobs.find((job) => job.id === params.get("jobId")) ?? null)
      : null,
  );
  const t = copy[locale];
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: params.get("q") ?? "",
      source: params.get("source") ?? "all",
      location: params.get("location") ?? "",
    },
  });

  React.useEffect(() => {
    const saved = window.localStorage.getItem(
      "job-search-locale",
    ) as Locale | null;
    if (saved === "en" || saved === "vi") setLocale(saved);
  }, []);
  const changeLocale = (next: Locale) => {
    setLocale(next);
    window.localStorage.setItem("job-search-locale", next);
  };
  const submit = (values: FormValues) => {
    const query = new URLSearchParams({ q: values.title });
    if (values.source !== "all") query.set("source", values.source);
    if (values.location) query.set("location", values.location);
    router.push(`/?${query.toString()}`);
    setSelectedId(null);
    setDetail(null);
    setDialogOpen(false);
  };
  const selectJob = (job: Job) => {
    setSelectedId(job.id);
    setDetail(job);
    const query = new URLSearchParams(window.location.search);
    query.set("jobId", job.id);
    router.push(`/?${query.toString()}`);
  };
  const openSearch = () => {
    form.reset({
      title: params.get("q") ?? "",
      source: params.get("source") ?? "all",
      location: params.get("location") ?? "",
    });
    setDialogOpen(true);
  };

  return (
    <main className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="map-canvas absolute inset-0" aria-label={t.map}>
        <div className="map-grid" />
        <div className="map-road map-road-one" />
        <div className="map-road map-road-two" />
        <div className="map-road map-road-three" />
        <div className="map-water" />
        {["22% 36%", "42% 27%", "63% 43%", "76% 31%", "56% 70%", "29% 67%"].map(
          (pos, index) => (
            <span
              key={index}
              className={cn(
                "map-pin",
                selectedId === String(index + 1) && "map-pin-active",
              )}
              style={{ left: pos.split(" ")[0], top: pos.split(" ")[1] }}
            />
          ),
        )}
        <div className="map-label map-label-one">Sydney CBD</div>
        <div className="map-label map-label-two">Barangaroo</div>
        <div className="map-label map-label-three">Surry Hills</div>
        <div className="map-badge">
          <Compass className="size-4" /> Sydney, Australia
        </div>
        <div className="map-placeholder">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="size-7" />
          </div>
          <p>{t.map}</p>
          <span>{t.mapSub}</span>
        </div>
      </div>

      <header className="app-header relative z-20 flex min-h-20 items-center justify-between border-b border-border/60 bg-background/80 px-5 backdrop-blur-xl lg:px-8">
        <div className="flex items-center gap-3">
          <div className="brand-mark">
            <BriefcaseBusiness className="size-5" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">Pop A Job</p>
            <p className="hidden text-[11px] text-muted-foreground sm:block">
              Job search, simplified.
            </p>
          </div>
        </div>
        {params.get("q") && (
          <button
            className="search-summary hidden items-center gap-3 rounded-xl border border-border/80 bg-card/70 px-4 py-2 text-left shadow-sm transition-colors hover:bg-accent sm:flex"
            onClick={openSearch}
          >
            <Search className="size-4 text-muted-foreground" />
            <span className="max-w-36 truncate text-sm font-medium">
              {params.get("q")}
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="max-w-32 truncate text-xs text-muted-foreground">
              {params.get("location") || t.all}
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="locale-switcher" role="group" aria-label="Language">
            <button
              className={cn(locale === "en" && "active")}
              onClick={() => changeLocale("en")}
            >
              EN
            </button>
            <button
              className={cn(locale === "vi" && "active")}
              onClick={() => changeLocale("vi")}
            >
              VI
            </button>
          </div>
          <ModeToggle />
        </div>
      </header>

      {params.get("q") && (
        <section className="relative z-10 flex items-center justify-between border-b border-border/40 bg-background/65 px-5 py-3 backdrop-blur-md lg:px-8">
          <div>
            <p className="text-sm font-medium">{t.greeting}</p>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {jobs.length} {t.results}
            </Badge>
            <Button size="sm" variant="outline" onClick={openSearch}>
              <SlidersHorizontal data-icon="inline-start" />
              {t.filters}
            </Button>
          </div>
        </section>
      )}

      {params.get("q") && !detail && (
        <section
          className={cn(
            "job-panel absolute left-4 top-28 z-10 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border/80 bg-background/90 shadow-2xl shadow-black/10 backdrop-blur-xl transition-transform",
            !listOpen && "-translate-x-[calc(100%-52px)]",
          )}
        >
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.jobs}</p>
                <p className="text-[11px] text-muted-foreground">
                  {jobs.length} {t.results}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t.hide}
                onClick={() => setListOpen(!listOpen)}
              >
                {listOpen ? <ChevronLeft /> : <ChevronRight />}
              </Button>
              {listOpen && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.openSearch}
                  onClick={openSearch}
                >
                  <SlidersHorizontal />
                </Button>
              )}
            </div>
          </div>
          {listOpen && (
            <>
              <div className="flex items-center justify-between px-4 py-2.5 text-[11px] text-muted-foreground">
                <span>{t.recent}</span>
                <span className="flex items-center gap-1">
                  <Clock3 className="size-3" /> {t.sort}
                </span>
              </div>
              <div className="max-h-[calc(100svh-235px)] overflow-y-auto px-2 pb-2">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    className={cn(
                      "job-card group w-full rounded-xl border border-transparent p-3 text-left transition-all hover:border-border hover:bg-accent/60",
                      selectedId === job.id &&
                        "border-primary/40 bg-primary/5 shadow-sm",
                    )}
                    onClick={() => selectJob(job)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white",
                          job.accent,
                        )}
                      >
                        {job.company.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {job.title}
                          </p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {job.posted}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {job.company} · {job.source}
                        </p>
                        <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="size-3" />
                          {job.location || t.noLocation}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {detail && (
        <section className="detail-panel absolute inset-x-4 top-28 z-10 mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-2xl shadow-black/10 backdrop-blur-xl lg:inset-x-auto lg:left-1/2 lg:w-[min(720px,calc(100vw-2rem))] lg:-translate-x-1/2">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDetail(null);
                setSelectedId(null);
                const query = new URLSearchParams(window.location.search);
                query.delete("jobId");
                router.push(`/?${query.toString()}`);
              }}
            >
              <ChevronLeft data-icon="inline-start" />
              {t.back}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close"
              onClick={() => setDetail(null)}
            >
              <X />
            </Button>
          </div>
          <div className="max-h-[calc(100svh-190px)] overflow-y-auto">
            <div className="p-6 pb-5">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white",
                    detail.accent,
                  )}
                >
                  {detail.company.slice(0, 1)}
                </div>
                <div>
                  <Badge variant="secondary">{detail.source}</Badge>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                    {detail.title}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {detail.company} · {detail.location}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="outline">
                  <Clock3 className="mr-1.5 size-3" />
                  {t.posted} {detail.posted}
                </Badge>
                <Badge variant="outline">
                  <MapPin className="mr-1.5 size-3" />
                  {detail.location}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="grid gap-6 p-6 sm:grid-cols-[1fr_190px]">
              <div>
                <h2 className="text-sm font-semibold">{t.description}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {detail.description}
                </p>
              </div>
              <Card className="h-fit bg-muted/40 shadow-none">
                <CardHeader className="gap-1 p-4">
                  <CardDescription>{t.contact}</CardDescription>
                  <CardTitle className="text-sm leading-6">
                    {detail.contact}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Button className="w-full" size="sm">
                    {t.apply}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[min(520px,calc(100vw-2rem))] gap-0 overflow-hidden p-0">
          <div className="bg-primary px-6 py-7 text-primary-foreground">
            <DialogHeader>
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
                <Search className="size-5" />
              </div>
              <DialogTitle className="text-2xl text-primary-foreground">
                {t.search}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/70">
                {t.subtitle}. Search across the best job boards in one place.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex flex-col gap-5 p-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="job-title">{t.jobTitle}</Label>
              <Input
                id="job-title"
                autoFocus
                placeholder={t.jobPlaceholder}
                {...form.register("title")}
                aria-invalid={!!form.formState.errors.title}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t.source}</Label>
              <div className="grid grid-cols-3 gap-2">
                {SEARCH_SOURCES.map((source) => (
                  <button
                    type="button"
                    key={source.id}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm transition-colors",
                      form.watch("source") === source.id
                        ? "border-primary bg-primary/10 font-medium text-primary"
                        : "border-border hover:bg-accent",
                    )}
                    onClick={() =>
                      form.setValue("source", source.id, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {source.id === "all" ? t.all : source.label}
                  </button>
                ))}
              </div>
              {form.formState.errors.source && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.source.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">
                {t.location}{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="location"
                placeholder={t.locationPlaceholder}
                {...form.register("location")}
                aria-invalid={!!form.formState.errors.location}
              />
              {form.formState.errors.location && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
            <Button type="submit" size="lg" className="mt-1 w-full">
              {t.submit}
              <Search data-icon="inline-end" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
