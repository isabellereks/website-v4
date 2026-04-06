import { writingEntries } from "@/data/writing";

export default function Writing() {
  let lastYear = "";

  return (
    <div id="writing" className="mt-2 scroll-mt-20">
      <p className="pt-4 text-sm font-medium text-neutral-400 mb-1">
        Writing
      </p>

      <div>
        {writingEntries.map((entry, i) => {
          const showYear = entry.date !== lastYear;
          lastYear = entry.date;
          return (
            <a
              key={i}
              href={entry.url}
              className="block border-t border-neutral-100 py-3 grid grid-cols-[60px_1fr_auto] gap-3 items-baseline group"
            >
              <span className="text-sm text-neutral-300">
                {showYear ? entry.date : ""}
              </span>
              <span className="text-sm group-hover:text-neutral-500 transition-colors">
                {entry.title}
              </span>
              <span className="text-xs text-neutral-300">
                {entry.description}
              </span>
            </a>
          );
        })}
      </div>

      <a
        href="https://isabellereksopuro.substack.com/"
        className="inline-block text-xs text-neutral-400 hover:text-neutral-600 transition-colors mt-2 underline decoration-neutral-300"
      >
        Read more on Substack &rarr;
      </a>
    </div>
  );
}
