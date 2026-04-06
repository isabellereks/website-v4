import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <div id="projects" className="mt-2 scroll-mt-20">
      <p className="pt-4 text-sm font-medium text-neutral-400 mb-1">
        Projects
      </p>

      <div>
        {projects.map((project) => (
          <div
            key={project.name}
            className="border-t border-neutral-100 py-3"
          >
            {project.url ? (
              <a
                href={project.url}
                className="text-sm underline underline-offset-2 text-neutral-800 hover:text-neutral-500 transition-colors"
              >
                {project.name}
              </a>
            ) : (
              <p className="text-sm">{project.name}</p>
            )}
            <p className="text-xs text-neutral-400 mt-0.5">
              {project.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
