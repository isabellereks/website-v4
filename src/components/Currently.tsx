export default function Currently() {
  return (
    <div id="currently" className="space-y-4 scroll-mt-20">
      <p className="pt-4 text-sm font-medium text-neutral-400">
        Currently
      </p>

      <p>
        Right now, I&apos;m{" "}
        <s className="text-neutral-400 hover:text-[#AD606E] hover:animate-pulse transition-colors cursor-default">in class</s>{" "}
        building side projects on Twitter and running the{" "}
        <a href="https://www.instagram.com/seattlejunkjournalclub/" className="underline underline-offset-2 text-neutral-800 hover:text-neutral-500 transition-colors">
          Seattle Junk Journal Club
        </a>
        . I&apos;m also getting back into writing on{" "}
        <a href="https://isabellereksopuro.substack.com/" className="underline underline-offset-2 text-neutral-800 hover:text-neutral-500 transition-colors">
          Substack
        </a>
        .
      </p>

      <p>
        I&apos;m campaigning for reproductive justice and forming a sexual
        assault task force with{" "}
        <a href="https://www.advocatesforyouth.org/" className="underline underline-offset-2 text-neutral-800 hover:text-neutral-500 transition-colors">
          Advocates for Youth
        </a>{" "}
        in Washington, D.C. and Seattle, WA.
      </p>

      <p>
        In my spare time, I lead the student ambassador program at the{" "}
        <a href="https://aaylc.org" className="underline underline-offset-2 text-neutral-800 hover:text-neutral-500 transition-colors">
          Asian American Youth Leadership Conference
        </a>{" "}
        for 600+ students.
      </p>
    </div>
  );
}
