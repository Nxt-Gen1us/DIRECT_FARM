import { fieldNotes } from "../../data/sustain";

export function StoryStrip() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {fieldNotes.map((n) => (
        <article key={n.id} className="overflow-hidden rounded-[1.25rem] border border-line bg-card">
          <img src={n.image} alt="" className="h-40 w-full object-cover" />
          <div className="p-5">
            <h3 className="font-display text-xl text-ink">{n.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{n.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
