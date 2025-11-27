export function Stats() {
  const stats = [
    { value: "85%", label: "Higher callback rate" },
    { value: "10s", label: "Analysis time" },
    { value: "50K+", label: "Resumes optimized" },
    { value: "4.9", label: "User rating" },
  ]

  return (
    <section className="border-y border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
