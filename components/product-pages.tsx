"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Check, Download, Mail, Plus, Search, Send, Trash2 } from "lucide-react";
import { SiteShell } from "./layout";
import { Button, Card, Field, Pill, Select, TextArea } from "./ui";
import { GeneratorPanel } from "./generator-panel";
import { RecipeCard } from "./recipe-card";
import { RecipeShowcase } from "./recipe-showcase";
import { babyProfiles, blogPosts, demoRecipes, familyMembers, pagePhotos } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import { FloatingPhoto, MetricCard, MomentStrip, Reveal } from "./motion";

const nutritionData = [
  { day: "Mon", protein: 72, iron: 64, fiber: 58 },
  { day: "Tue", protein: 82, iron: 70, fiber: 66 },
  { day: "Wed", protein: 78, iron: 88, fiber: 74 },
  { day: "Thu", protein: 92, iron: 76, fiber: 82 },
  { day: "Fri", protein: 74, iron: 68, fiber: 62 }
];

const pieData = [
  { name: "Protein", value: 34, color: "#78bea8" },
  { name: "Carbs", value: 39, color: "#f59b78" },
  { name: "Fats", value: 27, color: "#ffccb2" }
];

export function SimpleMarketingPage({ type }: { type: "pricing" | "blog" | "about" | "contact" | "login" | "register" | "forgot" }) {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {type === "pricing" && <Pricing />}
        {type === "blog" && <Blog />}
        {type === "about" && <About />}
        {type === "contact" && <Contact />}
        {type === "login" && <Auth mode="login" />}
        {type === "register" && <Auth mode="register" />}
        {type === "forgot" && <Auth mode="forgot" />}
      </main>
    </SiteShell>
  );
}

export function GeneratorPage() {
  return (
    <SiteShell>
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <Card className="h-fit">
          <h1 className="font-display text-3xl font-black">Family setup</h1>
          <div className="mt-5 grid gap-4">
            <Select aria-label="Baby profile">{babyProfiles.map((profile) => <option key={profile.id}>{profile.name} · {profile.age}</option>)}</Select>
            <Select aria-label="Difficulty"><option>Easy</option><option>Medium</option><option>Any</option></Select>
            <Select aria-label="Appliance"><option>Stovetop</option><option>Oven</option><option>Air fryer</option><option>Thermomix</option></Select>
            <Pill className="w-fit bg-[#e8f4ef]">Allergy-aware mode on</Pill>
          </div>
        </Card>
        <div className="grid gap-5">
          <FloatingPhoto src={pagePhotos.generator} title="Ingredient-first dinner ideas" caption="Start with what is already in the kitchen, then let Foody Fam split the meal safely." />
          <GeneratorPanel />
        </div>
      </main>
    </SiteShell>
  );
}

export function RecipesPage() {
  const [query, setQuery] = useState("");
  const recipes = demoRecipes.filter((recipe) => recipe.title.toLowerCase().includes(query.toLowerCase()) || recipe.tags.join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Recipe library</p>
            <h1 className="font-display text-5xl font-black">Saved for every age</h1>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-3.5 text-[#5c4a42]" size={18} />
            <Field className="pl-11" placeholder="Search recipes or tags" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.7fr]">
          <FloatingPhoto src={pagePhotos.recipes} title="Recipe cards with a purpose" caption="Every meal includes the shared base, the baby version, and the adult finish." />
          <Card className="grid content-center gap-4">
            <h2 className="font-display text-3xl font-black">Collections that match family life</h2>
            <div className="flex flex-wrap gap-2">
              {["Breakfast", "Dinner", "Baby", "Quick Meals", "Freezer Friendly", "BLW"].map((item) => <Pill key={item}>{item}</Pill>)}
            </div>
          </Card>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      </main>
    </SiteShell>
  );
}

export function RecipeDetailPage() {
  const [tab, setTab] = useState("Overview");
  const recipe = demoRecipes[0];
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <RecipeShowcase recipe={recipe} />
        <div className="mt-6 flex flex-wrap gap-2">
          {["Overview", "Instructions", "Nutrition", "Reviews"].map((item) => (
            <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>{item}</Button>
          ))}
        </div>
        <Card className="mt-5">
          {tab === "Overview" && <p className="text-lg font-bold leading-8 text-[#5c4a42]">A creamy one-pot dinner that separates cleanly into a salt-free baby portion and a bright, parmesan-finished adult plate.</p>}
          {tab === "Instructions" && <ol className="grid gap-3">{recipe.steps.map((step, index) => <li key={step} className="font-bold"><span className="text-[#78bea8]">{index + 1}.</span> {step}</li>)}</ol>}
          {tab === "Nutrition" && <NutritionCharts />}
          {tab === "Reviews" && <p className="font-bold text-[#5c4a42]">&ldquo;Healthy, easy and so much less stress at dinner time.&rdquo; - Emily, Mom of 3</p>}
        </Card>
      </main>
    </SiteShell>
  );
}

export function PlannerPage() {
  const planner = useAppStore((state) => state.planner);
  const setPlannerMeal = useAppStore((state) => state.setPlannerMeal);
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Weekly meal planner" title="One week, one calmer kitchen" />
        <div className="mt-8"><FloatingPhoto src={pagePhotos.planner} title="Drag the week into shape" caption="Swap meals by day and keep the family grocery list aligned automatically." /></div>
        <div className="mt-8 grid gap-4 lg:grid-cols-7">
          {planner.map((day) => (
            <Card key={day.day} className="grid content-between gap-4">
              <div>
                <p className="font-display text-xl font-black">{day.day}</p>
                <p className="mt-2 text-sm font-bold text-[#5c4a42]">{day.meal}</p>
              </div>
              <Select aria-label={`Choose meal for ${day.day}`} value={day.recipeId} onChange={(event) => setPlannerMeal(day.day, event.target.value)}>
                {demoRecipes.map((recipe) => <option key={recipe.id} value={recipe.id}>{recipe.title}</option>)}
              </Select>
            </Card>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}

export function ShoppingPage() {
  const shopping = useAppStore((state) => state.shopping);
  const toggleShoppingItem = useAppStore((state) => state.toggleShoppingItem);
  const categories = Array.from(new Set(shopping.map((item) => item.category)));
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <PageTitle eyebrow="Smart shopping list" title="One list for everyone" />
          <Button variant="secondary"><Download size={17} /> Export PDF</Button>
        </div>
        <div className="mt-8"><FloatingPhoto src={pagePhotos.shopping} title="Market-ready family list" caption="Categories stay clear so the weekly shop is fast, calm, and easy to share." /></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Card key={category}>
              <h2 className="font-display text-2xl font-black">{category}</h2>
              <div className="mt-4 grid gap-3">
                {shopping.filter((item) => item.category === category).map((item) => (
                  <button key={item.id} className="flex items-center gap-3 text-left font-bold" onClick={() => toggleShoppingItem(item.id)}>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${item.checked ? "border-[#78bea8] bg-[#78bea8] text-white" : "border-[#e9c7b7]"}`}>
                      {item.checked && <Check size={14} />}
                    </span>
                    <span className={item.checked ? "text-[#5c4a42]/55 line-through" : ""}>{item.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}

export function PantryPage() {
  const [item, setItem] = useState("");
  const pantry = useAppStore((state) => state.pantry);
  const addPantryItem = useAppStore((state) => state.addPantryItem);
  const removePantryItem = useAppStore((state) => state.removePantryItem);
  const owned = Math.min(92, 52 + pantry.length * 7);
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Pantry" title={`You already own ${owned}% of ingredients`} />
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <FloatingPhoto src={pagePhotos.pantry} title="Use what is already home" caption="Pantry matching reduces waste and makes AI suggestions feel immediately practical." />
          <MetricCard label="Pantry match" value={`${owned}%`} body="Foody Fam prioritizes meals that reuse ingredients already in your kitchen." />
        </div>
        <Card className="mt-8">
          <form className="flex gap-3" onSubmit={(event) => { event.preventDefault(); addPantryItem(item); setItem(""); }}>
            <Field placeholder="Add an ingredient" value={item} onChange={(event) => setItem(event.target.value)} />
            <Button type="submit"><Plus size={17} /> Add</Button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            {pantry.map((pantryItem) => (
              <button key={pantryItem} onClick={() => removePantryItem(pantryItem)}>
                <Pill className="gap-2 bg-[#e8f4ef]">{pantryItem}<Trash2 size={13} /></Pill>
              </button>
            ))}
          </div>
        </Card>
      </main>
    </SiteShell>
  );
}

export function NutritionPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Nutrition" title="Tiny details, clear choices" />
        <div className="mt-8"><FloatingPhoto src={pagePhotos.nutrition} title="Nutrition without spreadsheet energy" caption="Protein, iron, fiber, and vitamin signals are shown in plain family language." /></div>
        <div className="mt-8"><NutritionCharts /></div>
      </main>
    </SiteShell>
  );
}

export function AssistantPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const chat = useAppStore((state) => state.chat);
  const addChatMessage = useAppStore((state) => state.addChatMessage);

  async function send() {
    if (!text.trim()) return;
    const userText = text.trim();
    setText("");
    addChatMessage({ id: crypto.randomUUID(), role: "user", content: userText });
    setLoading(true);
    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const data = (await response.json()) as { message: string };
      addChatMessage({ id: crypto.randomUUID(), role: "assistant", content: data.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <main className="mx-auto grid max-w-5xl gap-5 px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="AI cooking assistant" title="Ask before dinner gets loud" />
        <FloatingPhoto src={pagePhotos.assistant} title="A calm helper in the kitchen" caption="Ingredient swaps, texture checks, leftovers, and allergy-aware answers stay one tap away." />
        <Card className="grid max-h-[620px] gap-4 overflow-hidden">
          <div className="scrollbar-soft grid max-h-[420px] gap-3 overflow-auto pr-2">
            {chat.map((message) => (
              <div key={message.id} className={`max-w-[82%] rounded-[22px] p-4 text-sm font-bold leading-6 ${message.role === "user" ? "ml-auto bg-[#78bea8] text-white" : "bg-white text-[#5c4a42]"}`}>
                {message.content}
              </div>
            ))}
            {loading && <div className="max-w-[82%] rounded-[22px] bg-white p-4 text-sm font-bold text-[#5c4a42]">Thinking through a family-safe answer...</div>}
          </div>
          <div className="flex gap-3">
            <Field placeholder="Can I replace broccoli? Can I freeze this?" value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void send(); }} />
            <Button onClick={() => void send()}><Send size={17} /> Send</Button>
          </div>
        </Card>
      </main>
    </SiteShell>
  );
}

export function ProfilesPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageTitle eyebrow="Profiles" title="Foody Fam remembers everyone" />
        <div className="mt-8"><MomentStrip /></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card>
            <h2 className="font-display text-2xl font-black">Baby profiles</h2>
            <div className="mt-4 grid gap-3">{babyProfiles.map((profile) => <Pill key={profile.id} className="w-fit">{profile.name} · {profile.age} · {profile.style} · {profile.allergies.join(", ") || "No allergies"}</Pill>)}</div>
          </Card>
          <Card>
            <h2 className="font-display text-2xl font-black">Family profiles</h2>
            <div className="mt-4 grid gap-3">{familyMembers.map((member) => <Pill key={member.id} className="w-fit">{member.name} · {member.role} · {member.preferences.join(", ")}</Pill>)}</div>
          </Card>
        </div>
      </main>
    </SiteShell>
  );
}

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const steps = ["Family members", "Baby age", "Allergies", "Diet", "Cuisines", "Appliances", "Done"];
  return (
    <SiteShell>
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <FloatingPhoto src={pagePhotos.onboarding} title="Set the table once" caption="Seven quick steps teach Foody Fam who eats, what to avoid, and what tools are in the kitchen." />
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Onboarding</p>
          <h1 className="mt-2 font-display text-4xl font-black">{steps[step]}</h1>
          <div className="mt-6 grid gap-4">
            {step < 6 ? (
              <>
                <Field placeholder={step === 0 ? "How many family members?" : "Tell us what matters"} />
                <div className="flex flex-wrap gap-2">
                  {["Egg allergy", "Vegetarian", "Air fryer", "Italian", "BLW", "Quick dinners"].map((item) => <Pill key={item}>{item}</Pill>)}
                </div>
                <Button onClick={() => setStep((value) => Math.min(6, value + 1))}>Continue</Button>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-[#5c4a42]">Your first weekly plan is ready. The dashboard will now personalize recipes for the whole family.</p>
                <Link href="/dashboard">
                  <Button onClick={() => completeOnboarding({ id: "new-baby", name: "Baby", age: "8 months", style: "Mixed", allergies: ["Egg"] })}>Open dashboard</Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      </main>
    </SiteShell>
  );
}

function NutritionCharts() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="min-h-[320px]">
        <h2 className="font-display text-2xl font-black">Weekly nutrient rhythm</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={nutritionData}>
              <CartesianGrid stroke="#ead8ce" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area dataKey="protein" stroke="#78bea8" fill="#78bea8" fillOpacity={0.24} />
              <Area dataKey="iron" stroke="#f59b78" fill="#f59b78" fillOpacity={0.18} />
              <Area dataKey="fiber" stroke="#5c4a42" fill="#5c4a42" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="min-h-[320px]">
        <h2 className="font-display text-2xl font-black">Today’s plate</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92}>
                {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function Pricing() {
  return (
    <div>
      <PageTitle eyebrow="Pricing" title="Simple, fair pricing" />
      <div className="mt-8"><FloatingPhoto src={pagePhotos.pricing} title="Start small, grow into premium" caption="The free plan proves the one-meal workflow before families unlock weekly automation." /></div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {[
          ["Free", "$0", ["5 recipes per week", "Basic recipes", "Shopping lists", "Nutrition info"]],
          ["Premium", "$6.99 / month", ["Unlimited recipes", "Meal planner", "PDF export", "Priority support"]]
        ].map(([name, price, points]) => (
          <Card key={name as string}>
            <h2 className="font-display text-3xl font-black">{name as string}</h2>
            <p className="mt-2 text-2xl font-black text-[#f59b78]">{price as string}</p>
            <ul className="mt-5 grid gap-3">{(points as string[]).map((point) => <li key={point} className="flex gap-2 font-bold"><Check className="text-[#78bea8]" size={18} />{point}</li>)}</ul>
            <Button className="mt-6 w-full" variant={name === "Premium" ? "coral" : "primary"}>{name === "Premium" ? "Start free trial" : "Get started"}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Blog() {
  return (
    <div>
      <PageTitle eyebrow="Blog" title="Tiny kitchens, big wins" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">{blogPosts.map((post, index) => <Reveal key={post} delay={index * 0.07}><Card className="overflow-hidden p-0"><Image src={[pagePhotos.blog, pagePhotos.pantry, pagePhotos.planner][index]} alt={post} width={700} height={420} className="h-48 w-full object-cover" /><div className="p-5"><h2 className="font-display text-2xl font-black">{post}</h2><p className="mt-3 text-sm font-bold leading-6 text-[#5c4a42]">Practical guidance for families who want dinner to feel easier, safer, and more repeatable.</p></div></Card></Reveal>)}</div>
    </div>
  );
}

function About() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <PageTitle eyebrow="About" title="Built for the dinner rush" />
      <FloatingPhoto src={pagePhotos.about} title="Designed around real families" caption="The product treats dinner as a workflow, not a recipe archive." />
      <Card className="lg:col-span-2"><p className="text-lg font-bold leading-8 text-[#5c4a42]">Foody Fam turns one shared cooking process into safe, age-aware plates for babies, kids, and adults. The product is intentionally centered on reducing duplicate cooking, duplicate planning, and duplicate grocery lists.</p></Card>
    </div>
  );
}

function Contact() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
      <PageTitle eyebrow="Contact" title="Tell us what dinner needs" />
      <FloatingPhoto src={pagePhotos.contact} title="Talk to the kitchen team" caption="Send feedback, feature ideas, or family meal challenges." />
      <Card className="grid gap-4">
        <Field placeholder="Name" />
        <Field placeholder="Email" />
        <TextArea placeholder="How can we help?" />
        <Button><Mail size={17} /> Send message</Button>
      </Card>
    </div>
  );
}

function Auth({ mode }: { mode: "login" | "register" | "forgot" }) {
  const setActiveUser = useAppStore((state) => state.setActiveUser);
  const title = mode === "login" ? "Welcome back" : mode === "register" ? "Create your Foody Fam" : "Reset your password";
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card className="grid gap-4">
        <h1 className="font-display text-4xl font-black">{title}</h1>
        <Field placeholder="Email" type="email" />
        {mode !== "forgot" && <Field placeholder="Password" type="password" />}
        <Link href={mode === "register" ? "/onboarding" : "/dashboard"}>
          <Button className="w-full" onClick={() => setActiveUser("Parent")}>{mode === "forgot" ? "Send reset link" : mode === "login" ? "Log in" : "Create account"}</Button>
        </Link>
        <Link href={mode === "login" ? "/register" : "/login"} className="text-center text-sm font-extrabold text-[#78bea8]">
          {mode === "login" ? "Create an account" : "Back to login"}
        </Link>
      </Card>
      <FloatingPhoto src={pagePhotos.auth} title="Your family food memory" caption="Profiles, pantry, saved meals, and planner choices stay ready for the next dinner." />
    </div>
  );
}

function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">{eyebrow}</p>
      <h1 className="mt-2 font-display text-balance text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
    </div>
  );
}
