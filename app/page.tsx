"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BriefcaseBusiness, CalendarDays, ChevronRight, Clock3, Globe2, Languages, MapPin, Moon, Search, SlidersHorizontal, Sun } from "lucide-react"

const searchSchema = z.object({
  job: z.string().min(2, "Enter a job title or keyword"),
  source: z.enum(["all", "indeed", "seek"]),
  location: z.string().min(2, "Enter a location"),
})

type SearchValues = z.infer<typeof searchSchema>

type Job = {
  id: number
  title: string
  company: string
  location: string
  source: "Indeed" | "Seek"
  posted: string
  postedLabel: string
  contact: string
  description: string
  coordinates: string
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "Atlassian",
    location: "Sydney, NSW",
    source: "Indeed",
    posted: "2024-06-14",
    postedLabel: "2 hours ago",
    contact: "Mia Chen · Talent Partner",
    description: "Shape simple, thoughtful experiences for teams around the world. You will partner with product and engineering to define end-to-end workflows.",
    coordinates: "-33.8688,151.2093",
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "Canva",
    location: "Sydney, NSW",
    source: "Seek",
    posted: "2024-06-13",
    postedLabel: "Yesterday",
    contact: "Jordan Williams · Engineering Lead",
    description: "Build fast, accessible product experiences with React and TypeScript while helping a collaborative team raise the bar for frontend quality.",
    coordinates: "-33.8731,151.2064",
  },
  {
    id: 3,
    title: "Growth Marketing Manager",
    company: "SafetyCulture",
    location: "Remote · Australia",
    source: "Indeed",
    posted: "2024-06-12",
    postedLabel: "2 days ago",
    contact: "Ava Patel · People & Culture",
    description: "Lead experiments across acquisition and activation. Bring a sharp customer lens and a love of turning insight into measurable growth.",
    coordinates: "-33.8568,151.2153",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "WiseTech Global",
    location: "Melbourne, VIC",
    source: "Seek",
    posted: "2024-06-11",
    postedLabel: "3 days ago",
    contact: "Noah Smith · Hiring Manager",
    description: "Turn complex operational data into clear decisions for a global logistics platform. SQL, dashboards, and curious thinking are key.",
    coordinates: "-37.8136,144.9631",
  },
]

const sourceOptions = [
  { value: "all", label: "All sources" },
  { value: "indeed", label: "Indeed" },
  { value: "seek", label: "Seek" },
]

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(true)
  const [submitted, setSubmitted] = useState<SearchValues | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [language, setLanguage] = useState<"EN" | "VI">("EN")
  const [darkMode, setDarkMode] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { job: "", source: "all", location: "" },
  })
  const activeSource = watch("source")

  const filteredJobs = useMemo(() => {
    if (!submitted || submitted.source === "all") return jobs
    const source = submitted.source === "indeed" ? "Indeed" : "Seek"
    return jobs.filter((job) => job.source === source)
  }, [submitted])

  const onSubmit = (values: SearchValues) => {
    setSubmitted(values)
    setDialogOpen(false)
    setSelectedJob(null)
  }

  const copy = language === "EN" ? {
    eyebrow: "INTELLIGENT JOB DISCOVERY",
    title: "Find your next opportunity",
    subtitle: "Search across trusted job boards and explore every role on one clear map.",
    job: "Job title or keyword",
    location: "Location",
    search: "Search jobs",
    results: "Search results",
    newest: "Newest first",
    map: "Map view",
    mapText: "Google Maps preview",
    mapHint: "Your interactive map will appear here once Google Maps is connected.",
    selected: "Selected opportunity",
    contact: "Contact",
    description: "Job description",
    posted: "Posted",
    refine: "Refine search",
    noResults: "No roles found for this source.",
  } : {
    eyebrow: "KHÁM PHÁ CƠ HỘI THÔNG MINH",
    title: "Tìm cơ hội tiếp theo",
    subtitle: "Tìm kiếm trên các trang tuyển dụng uy tín và khám phá mọi vị trí trên một bản đồ rõ ràng.",
    job: "Tên công việc hoặc từ khóa",
    location: "Vị trí",
    search: "Tìm việc",
    results: "Kết quả tìm kiếm",
    newest: "Mới nhất",
    map: "Bản đồ",
    mapText: "Bản xem trước Google Maps",
    mapHint: "Bản đồ tương tác sẽ xuất hiện ở đây sau khi kết nối Google Maps.",
    selected: "Cơ hội đã chọn",
    contact: "Liên hệ",
    description: "Mô tả công việc",
    posted: "Ngày đăng",
    refine: "Điều chỉnh tìm kiếm",
    noResults: "Không tìm thấy vị trí nào từ nguồn này.",
  }

  return (
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
      <main className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"><BriefcaseBusiness /></div>
              <div><p className="text-sm font-semibold tracking-tight">Pathway</p><p className="text-[11px] text-muted-foreground">Job search, mapped.</p></div>
            </div>
            {submitted && <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5"><Search /> {submitted.job}</Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5"><MapPin /> {submitted.location}</Badge>
              <Badge variant="outline" className="px-3 py-1.5">{sourceOptions.find((source) => source.value === submitted.source)?.label}</Badge>
            </div>}
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "EN" ? "VI" : "EN")} aria-label="Switch language"><Languages /> {language}</Button>
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">{darkMode ? <Sun /> : <Moon />}</Button>
              {submitted && <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}><SlidersHorizontal /> <span className="hidden sm:inline">{copy.refine}</span></Button>}
            </div>
          </div>
          {submitted && <div className="flex items-center gap-2 overflow-x-auto border-t px-5 py-2 md:hidden"><Badge variant="secondary">{submitted.job}</Badge><Badge variant="secondary">{submitted.location}</Badge></div>}
        </header>

        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 lg:grid-cols-[360px_1fr]">
          <aside className="border-b bg-muted/20 lg:min-h-[calc(100vh-81px)] lg:border-b-0 lg:border-r">
            <div className="flex items-end justify-between px-5 pb-4 pt-6"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">{copy.results}</h1></div><span className="text-xs text-muted-foreground">{copy.newest}</span></div>
            <Separator />
            <div className="flex max-h-[calc(100vh-180px)] flex-col overflow-y-auto p-3">
              {filteredJobs.length ? filteredJobs.map((job, index) => <button key={job.id} onClick={() => setSelectedJob(job)} className={`group w-full rounded-xl p-4 text-left transition-colors hover:bg-accent ${selectedJob?.id === job.id ? "bg-accent ring-1 ring-primary/25" : ""}`}>
                <div className="flex items-start justify-between gap-3"><div><div className="mb-2 flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">0{index + 1}</span><Badge variant="outline" className="text-[10px]">{job.source}</Badge></div><h2 className="font-medium leading-snug">{job.title}</h2><p className="mt-1 text-sm text-muted-foreground">{job.company}</p></div><ChevronRight className="mt-1 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin />{job.location}</span><span>{job.postedLabel}</span></div>
              </button>) : <p className="p-5 text-sm text-muted-foreground">{copy.noResults}</p>}
            </div>
          </aside>

          <section className="relative flex min-h-[calc(100vh-81px)] flex-col overflow-hidden bg-muted/10 p-4 sm:p-6">
            <div className={`relative overflow-hidden rounded-2xl border bg-slate-200 shadow-sm dark:bg-slate-900 ${selectedJob ? "h-56 shrink-0" : "min-h-[calc(100vh-129px)] flex-1"}`}>
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:42px_42px] dark:opacity-20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_40%,rgba(34,197,190,.25),transparent_24%),radial-gradient(circle_at_70%_30%,rgba(59,130,246,.18),transparent_26%)]" />
              <div className="absolute left-[22%] top-[34%] size-4 rounded-full border-4 border-primary bg-background shadow-lg" /><div className="absolute left-[65%] top-[48%] size-4 rounded-full border-4 border-primary bg-background shadow-lg" /><div className="absolute left-[46%] top-[64%] size-4 rounded-full border-4 border-primary bg-background shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center"><div className="max-w-sm rounded-2xl border bg-background/85 p-6 text-center shadow-xl backdrop-blur-md"><div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Globe2 /></div><p className="font-medium">{copy.mapText}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy.mapHint}</p></div></div>
              <Badge className="absolute left-4 top-4 gap-1.5 bg-background/90 text-foreground shadow-sm hover:bg-background/90"><MapPin /> {copy.map}</Badge>
            </div>
            {selectedJob && <Card className="mt-4 border-0 shadow-sm"><CardHeader className="pb-4"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2"><Badge>{selectedJob.source}</Badge><span className="text-xs text-muted-foreground">{copy.selected}</span></div><CardTitle className="text-2xl">{selectedJob.title}</CardTitle><CardDescription className="mt-1 flex items-center gap-1.5 text-sm"><BriefcaseBusiness /> {selectedJob.company} <span className="text-border">·</span> <MapPin /> {selectedJob.location}</CardDescription></div><Button variant="outline" size="sm" onClick={() => setSelectedJob(null)}>Close</Button></div></CardHeader><CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-[190px_1fr]"><div className="flex flex-wrap gap-4 text-sm"><div><p className="mb-1 text-xs text-muted-foreground">{copy.contact}</p><p className="font-medium">{selectedJob.contact}</p></div><div><p className="mb-1 text-xs text-muted-foreground">{copy.posted}</p><p className="flex items-center gap-1.5 font-medium"><CalendarDays />{selectedJob.posted}</p></div></div><div><p className="mb-1 text-xs text-muted-foreground">{copy.description}</p><p className="text-sm leading-6 text-muted-foreground">{selectedJob.description}</p></div></CardContent></Card>}
          </section>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-[540px]">
            <div className="relative overflow-hidden bg-slate-950 px-6 pb-5 pt-7 text-white"><div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(125,211,252,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.12)_1px,transparent_1px)] [background-size:34px_34px]" /><div className="relative"><DialogHeader><p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">Pathway · {copy.eyebrow}</p><DialogTitle className="text-3xl tracking-tight text-white">{copy.title}</DialogTitle><DialogDescription className="max-w-md text-slate-300">{copy.subtitle}</DialogDescription></DialogHeader></div></div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
              <div className="flex flex-col gap-2"><Label htmlFor="job">{copy.job}</Label><Input id="job" placeholder="e.g. Product Designer" {...register("job")} aria-invalid={!!errors.job} />{errors.job && <p className="text-xs text-destructive">{errors.job.message}</p>}</div>
              <div className="flex flex-col gap-2"><Label>{language === "EN" ? "Search source" : "Nguồn tìm kiếm"}</Label><ToggleGroup type="single" value={activeSource} onValueChange={(value) => value && setValue("source", value as SearchValues["source"])} className="grid grid-cols-3 rounded-lg bg-muted p-1"><ToggleGroupItem value="all">All</ToggleGroupItem><ToggleGroupItem value="indeed">Indeed</ToggleGroupItem><ToggleGroupItem value="seek">Seek</ToggleGroupItem></ToggleGroup></div>
              <div className="flex flex-col gap-2"><Label htmlFor="location">{copy.location}</Label><div className="relative"><MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input id="location" className="pl-9" placeholder="e.g. Sydney, NSW or remote" {...register("location")} aria-invalid={!!errors.location} /></div>{errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}</div>
              <Button type="submit" size="lg" className="mt-1 w-full">{copy.search}<Search /></Button>
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground"><Clock3 /> Results are sorted by newest posting</p>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
