import { useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

type TripTheme =
  | 'adventure' | 'beach' | 'cultural' | 'luxury' | 'backpacking'
  | 'family' | 'honeymoon' | 'road_trip' | 'food' | 'nightlife'
  | 'shopping' | 'wildlife' | 'wellness' | 'photography' | 'religious'
  | 'educational' | 'business'

type TripRequest = {
  destination: string
  start_date: string
  end_date: string
  budget: number
  budget_level: 'budget' | 'mid_range' | 'luxury'
  travelers: number
  traveler_type: 'solo' | 'couple' | 'family' | 'friends' | 'business'
  themes: TripTheme[]
  interests: { name: string; interest_level: number }[]
  preferred_accommodation_types: string[]
  preferred_transportation: string[]
  dietary_restrictions: string[]
  accessibility_needs: string[]
  special_requests?: string
}

type TripDayPlan = {
  date: string
  activities: { time: string; name: string; duration: number; cost: number; location?: string }[]
  estimated_cost: number
}

type TripPlanResponse = {
  id: string
  destination: string
  start_date: string
  end_date: string
  total_estimated_cost: number
  daily_plans: TripDayPlan[]
  summary: string
  created_at: string
  updated_at: string
}

const allThemes: { key: TripTheme; label: string }[] = [
  { key: 'adventure', label: 'Adventure' },
  { key: 'beach', label: 'Beach' },
  { key: 'cultural', label: 'Cultural' },
  { key: 'luxury', label: 'Luxury' },
  { key: 'backpacking', label: 'Backpacking' },
  { key: 'family', label: 'Family' },
  { key: 'honeymoon', label: 'Honeymoon' },
  { key: 'road_trip', label: 'Road trip' },
  { key: 'food', label: 'Food' },
  { key: 'nightlife', label: 'Nightlife' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'wildlife', label: 'Wildlife' },
  { key: 'wellness', label: 'Wellness' },
  { key: 'photography', label: 'Photography' },
  { key: 'religious', label: 'Religious' },
  { key: 'educational', label: 'Educational' },
  { key: 'business', label: 'Business' },
]

const interestOptions = [
  'Museums',
  'Hiking',
  'Food tours',
  'Beaches',
  'Nightlife',
  'Shopping',
]

const accommodationOptions = ['Hotel', 'Hostel', 'Apartment', 'B&B']
const transportOptions = ['Public transit', 'Taxi/Rideshare', 'Rental car', 'Bicycle', 'Walking']

export const TripPlannerPage = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<TripPlanResponse | null>(null)

  const [form, setForm] = useState<TripRequest>({
    destination: '',
    start_date: '',
    end_date: '',
    budget: 1500,
    budget_level: 'mid_range',
    travelers: 2,
    traveler_type: 'couple',
    themes: [],
    interests: [],
    preferred_accommodation_types: [],
    preferred_transportation: [],
    dietary_restrictions: [],
    accessibility_needs: [],
    special_requests: '',
  })

  const updateField = (key: keyof TripRequest, value: any) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  // Build helper maps for interests
  const interestsMap = useMemo(() => {
    const map = new Map<string, number>()
    form.interests.forEach((i) => map.set(i.name, i.interest_level))
    return map
  }, [form.interests])

  const setInterest = (name: string, level: number) => {
    setForm((f) => {
      const existing = f.interests.find((i) => i.name === name)
      let interests
      if (existing) {
        interests = f.interests.map((i) => (i.name === name ? { ...i, interest_level: level } : i))
      } else {
        interests = [...f.interests, { name, interest_level: level }]
      }
      return { ...f, interests }
    })
  }

  const toggleListValue = (key: keyof TripRequest, value: string) => {
    setForm((f) => {
      const arr = new Set<string>(f[key] as string[])
      if (arr.has(value)) arr.delete(value)
      else arr.add(value)
      return { ...f, [key]: Array.from(arr) }
    })
  }

  const toggleTheme = (th: TripTheme) => {
    setForm((f) => ({
      ...f,
      themes: f.themes.includes(th) ? f.themes.filter(t => t !== th) : [...f.themes, th]
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.destination || !form.start_date || !form.end_date) {
      toast({ title: 'Missing info', description: 'Please fill destination and dates', variant: 'destructive' })
      return
    }
    setLoading(true)
    setPlan(null)
    try {
      const res = await api.post<TripPlanResponse>('/trips/plan', form)
      setPlan(res.data)
      toast({ title: 'Trip planned', description: 'Your AI itinerary is ready!' })
    } catch (err: any) {
      // Offline fallback if backend is unreachable
      const isConnRefused = (err?.message?.includes('Network Error') || String(err).includes('ERR_CONNECTION'))
      if (isConnRefused) {
        const mock = buildLocalMockPlan(form)
        setPlan(mock)
        toast({ title: 'Offline demo', description: 'Backend not reachable. Showing a local mock itinerary.' })
      } else {
        const msg = err?.response?.data?.detail || 'Failed to plan trip'
        toast({ title: 'Error', description: String(msg), variant: 'destructive' })
      }
    } finally {
      setLoading(false)
    }
  }

  const quickFillAndGenerate = async () => {
    const demo: TripRequest = {
      destination: 'Paris',
      start_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
      end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
      budget: 1800,
      budget_level: 'mid_range',
      travelers: 2,
      traveler_type: 'couple',
      themes: ['food', 'cultural', 'photography'],
      interests: [
        { name: 'Museums', interest_level: 4 },
        { name: 'Food tours', interest_level: 5 },
        { name: 'Shopping', interest_level: 3 },
      ],
      preferred_accommodation_types: ['Hotel', 'Apartment'],
      preferred_transportation: ['Public transit', 'Walking'],
      dietary_restrictions: [],
      accessibility_needs: [],
      special_requests: 'Prefer central neighborhoods and iconic viewpoints',
    }
    setForm(demo)
    setLoading(true)
    setPlan(null)
    try {
      const res = await api.post<TripPlanResponse>('/trips/plan', demo)
      setPlan(res.data)
      toast({ title: 'Demo trip planned', description: 'A sample itinerary has been generated.' })
    } catch (err: any) {
      const isConnRefused = (err?.message?.includes('Network Error') || String(err).includes('ERR_CONNECTION'))
      if (isConnRefused) {
        const mock = buildLocalMockPlan(demo)
        setPlan(mock)
        toast({ title: 'Offline demo', description: 'Backend not reachable. Showing a local mock itinerary.' })
      } else {
        const msg = err?.response?.data?.detail || 'Failed to plan demo trip'
        toast({ title: 'Error', description: String(msg), variant: 'destructive' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Plan your trip</h1>
      <p className="text-muted-foreground mt-1">Fill in your preferences and let AI build an itinerary.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Planner form */}
        <form onSubmit={onSubmit} className="space-y-6 lg:col-span-1">
          <div>
            <label className="block text-sm font-medium">Destination</label>
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="e.g., Paris"
              value={form.destination}
              onChange={(e) => updateField('destination', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.start_date}
                onChange={(e) => updateField('start_date', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.end_date}
                onChange={(e) => updateField('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Budget ($)</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.budget}
                onChange={(e) => updateField('budget', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Budget Level</label>
              <select
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.budget_level}
                onChange={(e) => updateField('budget_level', e.target.value)}
              >
                <option value="budget">Budget</option>
                <option value="mid_range">Mid-range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Travelers</label>
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.travelers}
                onChange={(e) => updateField('travelers', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Traveler Type</label>
              <select
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.traveler_type}
                onChange={(e) => updateField('traveler_type', e.target.value)}
              >
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Special Requests</label>
              <input
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Dietary, accessibility, highlights..."
                value={form.special_requests}
                onChange={(e) => updateField('special_requests', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Themes</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {allThemes.map((t) => {
                const active = form.themes.includes(t.key)
                return (
                  <button
                    type="button"
                    key={t.key}
                    onClick={() => toggleTheme(t.key)}
                    className={[
                      'rounded-full border px-3 py-1 text-sm transition-colors',
                      active ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'
                    ].join(' ')}
                    aria-pressed={active}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Interests</label>
            <div className="mt-2 space-y-3">
              {interestOptions.map((name) => (
                <div key={name} className="grid grid-cols-5 items-center gap-3">
                  <span className="col-span-2 text-sm">{name}</span>
                  <input
                    className="col-span-3"
                    type="range"
                    min={1}
                    max={5}
                    value={interestsMap.get(name) ?? 3}
                    onChange={(e) => setInterest(name, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Accommodation</label>
              <div className="mt-2 space-y-2">
                {accommodationOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.preferred_accommodation_types.includes(opt)}
                      onChange={() => toggleListValue('preferred_accommodation_types', opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Transportation</label>
              <div className="mt-2 space-y-2">
                {transportOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.preferred_transportation.includes(opt)}
                      onChange={() => toggleListValue('preferred_transportation', opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Planning…' : 'Generate Plan'}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={quickFillAndGenerate}>
              {loading ? 'Please wait…' : 'Quick Fill Demo'}
            </Button>
            {!loading && plan && (
              <span className="text-sm text-muted-foreground">Re-run after adjusting fields to refine your plan.</span>
            )}
          </div>
        </form>

        {/* Itinerary preview */}
        <div className="rounded-lg border p-4 lg:col-span-1">
          {!plan && (
            <div className="text-sm text-muted-foreground">
              The AI itinerary will appear here after you submit the form.
            </div>
          )}
          {plan && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Itinerary</h2>
                <p className="text-sm text-muted-foreground mt-1">{plan.summary}</p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Destination:</span> {plan.destination}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Dates:</span> {plan.start_date} → {plan.end_date}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Total Est. Cost:</span> ${plan.total_estimated_cost.toFixed(2)}
                </p>
              </div>

              <div className="space-y-4">
                {plan.daily_plans.map((d) => (
                  <div key={d.date} className="rounded-md border p-3">
                    <h3 className="font-medium">{d.date}</h3>
                    <div className="mt-3">
                      <ol className="relative border-l pl-4">
                        {d.activities.map((a, idx) => (
                          <li key={`${d.date}-${idx}`} className="mb-4 ml-2">
                            <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border bg-background" />
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-muted-foreground mr-2">{a.time}</span>
                                <span className="font-medium">{a.name}</span>
                                {a.location ? <span className="text-muted-foreground ml-2">@ {a.location}</span> : null}
                              </div>
                              <div className="text-muted-foreground">${a.cost.toFixed(2)}</div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="mt-2 text-right text-sm">
                      <span className="font-medium">Day Est. Cost:</span> ${d.estimated_cost.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assistant Panel (local stub) */}
        <div className="rounded-lg border p-4 lg:col-span-1">
          <h2 className="text-lg font-semibold">AI Assistant (Preview)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This local assistant suggests ideas based on your current inputs. We’ll wire a real LLM next.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <AssistantSuggestions form={form} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AssistantSuggestions({ form }: { form: TripRequest }) {
  const suggestions = useMemo(() => {
    const tips: string[] = []
    if (!form.destination) tips.push('Add a destination to get tailored attraction picks and transit tips.')
    if (!form.start_date || !form.end_date) tips.push('Pick your dates so we can estimate daily pacing and costs.')
    if (form.budget < 500) tips.push('Your budget is tight. Consider hostels or apartments and public transit.')
    if (form.themes.includes('food')) tips.push('Book popular food tours early to avoid sold-out time slots.')
    if (form.themes.includes('beach')) tips.push('Pack reef-safe sunscreen and check local beach flags for safety.')
    if (form.traveler_type === 'family') tips.push('Add playgrounds/museums with kids sections to balance the day.')
    if (form.preferred_transportation.includes('Rental car')) tips.push('Verify parking availability near your accommodations.')
    if (form.special_requests?.toLowerCase().includes('wheelchair')) tips.push('Filter activities by wheelchair accessibility badges.')
    if (tips.length === 0) tips.push('Looks good! Submit to generate your AI itinerary, then refine themes and interests.')
    return tips
  }, [form])

  return (
    <ul className="list-disc space-y-2 pl-5">
      {suggestions.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>
  )
}
