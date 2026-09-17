import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, BadgeCheck, Clock, CalendarDays } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SERVICES = ["Roofing", "Bathroom Remodeling", "Kitchen Remodeling", "Painting", "Concrete", "Landscaping", "HVAC", "Windows & Doors", "Flooring", "Pools", "Home Services", "Other"];
const REVENUE = ["$1M – $2M", "$2M – $5M", "$5M – $10M", "$10M – $25M", "$25M+", "Under $1M"];
const TIMES = ["10:00 AM", "2:00 PM", "4:00 PM"];

const GUARANTEES = [
  { icon: ShieldCheck, text: "No long-term contracts" },
  { icon: BadgeCheck, text: "100% done-for-you" },
  { icon: Clock, text: "Campaigns live in ~7 days" },
];

const EMPTY = {
  owner_name: "", company_name: "", email: "", phone: "",
  service_offered: "", annual_revenue: "", city: "", website: "", notes: "",
  preferred_date: "", preferred_time: "",
};

const inputCls =
  "bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-0";

const selectContentCls = "z-[100] border-white/10 !bg-[#0b0b0f] text-white shadow-2xl";

// Next 4 available weekdays (Mon–Fri), starting tomorrow, up to 4 days out.
function getBookingDays() {
  const out = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 6 && out.length < 4; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5) out.push(d);
  }
  return out.map((d) => ({
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    full: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }),
  }));
}

export const AppointmentForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const days = getBookingDays();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setVal = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const goStep2 = () => {
    if (["owner_name", "company_name", "email", "phone"].find((k) => !form[k].trim())) {
      toast.error("Please complete your contact details.");
      return;
    }
    setStep(2);
  };

  const goStep3 = () => {
    if (["service_offered", "annual_revenue"].find((k) => !form[k].trim())) {
      toast.error("Please select your service and revenue.");
      return;
    }
    setStep(3);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.preferred_date || !form.preferred_time) {
      toast.error("Please pick a day and time for your call.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/leads`, form);
      setDone(true);
      toast.success("Request received. We'll be in touch shortly.");
      setForm(EMPTY);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pillBtn = "flex items-center justify-center gap-2 rounded-full bg-[#285EE0] px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_50px_-10px_rgba(40,94,224,0.9)] transition-transform duration-300 hover:scale-[1.02] hover:bg-[#1f4fc4] disabled:opacity-60";
  const backBtn = "flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10 sm:w-auto";

  return (
    <section id="apply" className="relative overflow-hidden py-24 sm:py-32" data-testid="apply-section">
      <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-[500px]" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-brand/15 blur-[150px]" />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading
          chapter="07"
          kicker="Apply"
          title={<>Ready to become the go-to<br />contractor in your market?</>}
          subtitle="Tell us about your business, then lock in your strategy call."
          align="center"
        />

        <Reveal className="mt-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8" data-testid="risk-reversal">
            {GUARANTEES.map((g) => (
              <div key={g.text} className="flex items-center gap-2 text-sm text-white/70">
                <g.icon className="h-4 w-4 text-brand-accent" />
                {g.text}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10">
          {done ? (
            <div className="rounded-3xl border border-brand/30 bg-gradient-to-b from-brand/[0.12] to-transparent p-12 text-center" data-testid="apply-success">
              <CheckCircle2 className="mx-auto h-14 w-14 text-brand-accent" />
              <h3 className="mt-6 font-display text-3xl uppercase tracking-tight text-white">Request received</h3>
              <p className="mx-auto mt-3 max-w-md text-white/60">
                Thanks for applying. We'll confirm your strategy call shortly and send the details to your email.
              </p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:p-10"
              data-testid="appointment-form"
            >
              {/* Progress */}
              <div className="mb-8" data-testid="form-step-indicator">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-white/50">
                  <span className={step >= 1 ? "text-brand-accent" : ""}>1 · Details</span>
                  <span className={step >= 2 ? "text-brand-accent" : ""}>2 · Business</span>
                  <span className={step >= 3 ? "text-brand-accent" : ""}>3 · Book</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-brand-accent transition-all duration-500"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {step === 1 && (
                <div data-testid="form-step-1">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Owner Name" required>
                      <Input data-testid="input-owner-name" className={inputCls} value={form.owner_name} onChange={set("owner_name")} placeholder="John Smith" />
                    </Field>
                    <Field label="Company Name" required>
                      <Input data-testid="input-company-name" className={inputCls} value={form.company_name} onChange={set("company_name")} placeholder="Smith Roofing Co." />
                    </Field>
                    <Field label="Email" required>
                      <Input data-testid="input-email" type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="john@company.com" />
                    </Field>
                    <Field label="Phone Number" required>
                      <Input data-testid="input-phone" className={inputCls} value={form.phone} onChange={set("phone")} placeholder="(555) 123-4567" />
                    </Field>
                  </div>
                  <button type="button" onClick={goStep2} data-testid="form-continue-button" className={`mt-8 w-full ${pillBtn}`}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div data-testid="form-step-2">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Service Offered" required>
                      <Select value={form.service_offered} onValueChange={setVal("service_offered")}>
                        <SelectTrigger data-testid="select-service" className={inputCls}>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent className={selectContentCls}>
                          {SERVICES.map((s) => (
                            <SelectItem key={s} value={s} className="focus:bg-brand/20 focus:text-white">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Annual Revenue" required>
                      <Select value={form.annual_revenue} onValueChange={setVal("annual_revenue")}>
                        <SelectTrigger data-testid="select-revenue" className={inputCls}>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent className={selectContentCls}>
                          {REVENUE.map((r) => (
                            <SelectItem key={r} value={r} className="focus:bg-brand/20 focus:text-white">{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="City">
                      <Input data-testid="input-city" className={inputCls} value={form.city} onChange={set("city")} placeholder="Dallas, TX" />
                    </Field>
                    <Field label="Website">
                      <Input data-testid="input-website" className={inputCls} value={form.website} onChange={set("website")} placeholder="https://" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Additional Notes">
                        <Textarea
                          data-testid="input-notes"
                          className="min-h-[110px] rounded-xl border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-0"
                          value={form.notes}
                          onChange={set("notes")}
                          placeholder="Anything we should know about your goals?"
                        />
                      </Field>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => setStep(1)} data-testid="form-back-button" className={backBtn}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button type="button" onClick={goStep3} data-testid="form-continue-2-button" className={`flex-1 ${pillBtn}`}>
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div data-testid="form-step-3">
                  <div className="mb-6 flex items-center gap-2 text-sm text-white/70">
                    <CalendarDays className="h-4 w-4 text-brand-accent" />
                    Choose a day &amp; time for your strategy call
                  </div>

                  <p className="text-xs uppercase tracking-[0.16em] text-white/50">Select a day</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {days.map((d, i) => {
                      const selected = form.preferred_date === d.full;
                      return (
                        <button
                          key={d.full}
                          type="button"
                          data-testid={`book-date-${i + 1}`}
                          onClick={() => setForm((f) => ({ ...f, preferred_date: d.full }))}
                          className={`flex flex-col items-center rounded-2xl border px-3 py-4 transition-colors ${
                            selected ? "border-[#285EE0] bg-[#285EE0]/15" : "border-white/10 bg-white/[0.03] hover:border-white/25"
                          }`}
                        >
                          <span className={`text-xs uppercase tracking-[0.16em] ${selected ? "text-brand-accent" : "text-white/50"}`}>{d.weekday}</span>
                          <span className="mt-1 font-display text-lg uppercase tracking-tight text-white">{d.date}</span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-8 text-xs uppercase tracking-[0.16em] text-white/50">Select a time</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {TIMES.map((t, i) => {
                      const selected = form.preferred_time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          data-testid={`book-time-${i + 1}`}
                          onClick={() => setForm((f) => ({ ...f, preferred_time: t }))}
                          className={`rounded-2xl border px-3 py-4 text-sm font-semibold transition-colors ${
                            selected ? "border-[#285EE0] bg-[#285EE0]/15 text-white" : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>

                  {form.preferred_date && form.preferred_time && (
                    <p className="mt-6 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-center text-sm text-white/80" data-testid="booking-summary">
                      Your call: <span className="font-semibold text-white">{form.preferred_date}</span> at{" "}
                      <span className="font-semibold text-white">{form.preferred_time}</span>
                    </p>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => setStep(2)} data-testid="form-back-2-button" className={backBtn}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button type="submit" disabled={loading} data-testid="submit-lead-button" className={`flex-1 ${pillBtn}`}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Request Strategy Call <ArrowRight className="h-4 w-4" /></>}
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-4 text-center text-xs text-white/40">
                No obligation. We'll only reach out if we can genuinely help you grow.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
};

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-2">
    <Label className="text-xs uppercase tracking-[0.16em] text-white/50">
      {label} {required && <span className="text-brand-accent">*</span>}
    </Label>
    {children}
  </div>
);

export default AppointmentForm;
