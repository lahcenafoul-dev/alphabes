import Link from "next/link";
import type { Metadata } from "next";
import { phonicsSkills } from "@/lib/phonics-data";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const BASE_URL = "https://alphabes.com";

const title = "Phonics for Kids: Letter Sounds, CVC Words & Reading Skills";
const description =
  "Help children build early reading skills with phonics practice, letter sounds, beginning sounds, CVC words, blending activities, and printable phonics resources.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${BASE_URL}/phonics` },
  openGraph: { title, description, url: `${BASE_URL}/phonics` },
};

type RoadmapStep = { n: number; title: string; blurb: string; href?: string };

const roadmap: RoadmapStep[] = [
  { n: 1, title: "Letter Recognition", blurb: "Recognize uppercase and lowercase letters.", href: "/worksheets/letter-recognition" },
  { n: 2, title: "Letter Sounds", blurb: "Connect common letters with their sounds.", href: "/phonics/letter-sounds" },
  { n: 3, title: "Beginning Sounds", blurb: "Identify the first sound in familiar words.", href: "/phonics/beginning-sounds" },
  { n: 4, title: "Short Vowels", blurb: "Practice short vowel sounds in simple words.", href: "/phonics/short-vowels" },
  { n: 5, title: "CVC Words", blurb: "Read simple consonant-vowel-consonant words.", href: "/phonics/cvc-words" },
  { n: 6, title: "Blending", blurb: "Combine individual sounds to read a word.", href: "/phonics/blending" },
  { n: 7, title: "Word Families", blurb: "Notice common patterns such as -at, -ig, and -un.", href: "/phonics/word-families" },
  { n: 8, title: "More Advanced Patterns", blurb: "Introduce more letter combinations when ready." },
];

const activityLinks = [
  { title: "Beginning Sound Game", href: "/games/beginning-sound" },
  { title: "Match Letter and Picture", href: "/games/match-letter-picture" },
  { title: "Alphabet Quiz", href: "/games/alphabet-quiz" },
  { title: "Beginning Sound Sort", href: "/activities" },
  { title: "CVC Word Practice", href: "/worksheets/cvc-words" },
];

const worksheetLinks = [
  { title: "Beginning Sounds Worksheets", href: "/worksheets/beginning-sounds-practice" },
  { title: "CVC Word Worksheets", href: "/worksheets/cvc-words" },
  { title: "Letter & Picture Matching", href: "/worksheets/letter-picture-matching" },
  { title: "Phonics Practice Worksheets", href: "/worksheets/phonics" },
  { title: "Writing Practice", href: "/worksheets/alphabet-writing-practice" },
  { title: "Letter Coloring", href: "/worksheets/letter-coloring" },
];

const faqItems = [
  {
    question: "What is phonics for kids?",
    answer:
      "Phonics is the skill of connecting letters and letter combinations to the sounds they make in spoken words, so a child can sound out words instead of only memorizing them by sight.",
  },
  {
    question: "When should children start learning phonics?",
    answer:
      "Most children begin simple phonics, like letter sounds, around age 4 to 5, once they're already comfortable recognizing letter names and shapes.",
  },
  {
    question: "What should children learn before phonics?",
    answer:
      "Letter recognition comes first. A child who can reliably name uppercase and lowercase letters is ready to start connecting those letters to sounds.",
  },
  {
    question: "What are CVC words?",
    answer:
      "CVC stands for consonant-vowel-consonant, describing short words like cat, dog, or sun. Their simple, consistent pattern makes them a common starting point for reading.",
  },
  {
    question: "How can I practice phonics at home?",
    answer:
      "Keep sessions short and focus on one or two sounds at a time: say the sound clearly, point out words that start with it, and practice blending a few simple words together.",
  },
  {
    question: "What is the difference between phonics and letter recognition?",
    answer:
      "Letter recognition is knowing what a letter looks like and its name. Phonics goes a step further, connecting that letter to the sound it makes and using that sound to read words.",
  },
  {
    question: "How does blending help children read?",
    answer:
      "Blending teaches a child to say individual sounds smoothly one after another, like /c/ /a/ /t/, until they hear the whole word, which is the core skill behind sounding out new words.",
  },
];

export default function PhonicsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Phonics", url: `${BASE_URL}/phonics` },
  ]);

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}/phonics`,
  };

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Phonics for Kids",
    description,
    url: `${BASE_URL}/phonics`,
    educationalLevel: "Preschool-Kindergarten",
    learningResourceType: "Lesson",
    teaches: "Letter sounds, beginning sounds, CVC words, blending, and early reading skills",
    typicalAgeRange: "4-6",
    isAccessibleForFree: true,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li aria-current="page" className="font-bold">Phonics</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Phonics for Kids: Letter Sounds, CVC Words &amp; Early Reading Skills
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          Phonics helps children connect letters and letter patterns with the sounds they
          represent, turning the alphabet into a tool for reading real words.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="#skills"
            className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
          >
            Explore Phonics Skills
          </Link>
          <Link
            href="/worksheets/phonics"
            className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
          >
            Browse Phonics Worksheets
          </Link>
        </div>
      </header>

      {/* What Is Phonics */}
      <section className="mt-16 max-w-3xl" aria-labelledby="what-heading">
        <h2 id="what-heading" className="text-3xl font-bold">What Is Phonics?</h2>
        <p className="mt-3 text-chalkboard/70">
          Phonics teaches children how letters and letter combinations represent the sounds heard
          in spoken words. Instead of memorizing every word by sight, a child learns to break a
          word into sounds and blend them back together, which is what makes unfamiliar words
          readable.
        </p>
        <p className="mt-3 text-chalkboard/70">
          Phonics works best alongside listening, speaking, reading, and writing practice, not as
          a skill on its own. Hearing a sound, saying it, seeing its letter, and writing that
          letter all reinforce the same connection from a few different angles.
        </p>
      </section>

      {/* Phonics Skills Roadmap */}
      <section className="mt-16" id="skills" aria-labelledby="roadmap-heading">
        <h2 id="roadmap-heading" className="text-3xl font-bold">Phonics Skills Roadmap</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Phonics skills build on each other in roughly this order, though every child moves at
          their own pace.
        </p>
        <ol className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {roadmap.map((step) => {
            const cardContent = (
              <>
                <span className="letter-block bg-crayon-purple flex h-10 w-10 items-center justify-center text-base" aria-hidden="true">
                  {step.n}
                </span>
                <p className="mt-3 font-display font-bold text-sm">{step.title}</p>
                <p className="mt-1 text-xs text-chalkboard/70">{step.blurb}</p>
              </>
            );
            return (
              <li key={step.n}>
                {step.href ? (
                  <Link
                    href={step.href}
                    className="block h-full rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div className="block h-full rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block">
                    {cardContent}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Letter Sounds */}
      <section className="mt-16 bg-crayon-blue/10 rounded-block p-8" aria-labelledby="sounds-heading">
        <h2 id="sounds-heading" className="text-3xl font-bold">Learn Letter Sounds</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Every consonant has a fairly consistent sound, while vowels usually have a short sound
          and a long sound. Children build this skill by listening to a letter's sound, saying it
          back clearly, and matching it to letters they already recognize.
        </p>
        <p className="mt-3 text-chalkboard/70 max-w-2xl">
          Practice a few letters at a time on their own pages, for example{" "}
          <Link href="/alphabet/a" className="font-bold underline">Letter A</Link>,{" "}
          <Link href="/alphabet/b" className="font-bold underline">Letter B</Link>, or{" "}
          <Link href="/alphabet/m" className="font-bold underline">Letter M</Link>.
        </p>
        <Link
          href="/phonics/letter-sounds"
          className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Practice Letter Sounds
        </Link>
      </section>

      {/* Beginning Sounds */}
      <section className="mt-16" aria-labelledby="beginning-heading">
        <h2 id="beginning-heading" className="text-3xl font-bold">Beginning Sounds</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Beginning-sound practice asks a child to listen for the very first sound in a word,
          separate from naming the letter itself.
        </p>
        <ul className="mt-4 flex flex-wrap gap-4 text-chalkboard/80 font-display font-bold">
          <li>sun → /s/</li>
          <li>ball → /b/</li>
          <li>cat → /k/</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/worksheets/beginning-sounds-practice" className="font-display font-bold text-crayon-blue hover:underline">
            Beginning Sounds Worksheets →
          </Link>
          <Link href="/games/beginning-sound" className="font-display font-bold text-crayon-blue hover:underline">
            Play the Beginning Sound Game →
          </Link>
        </div>
      </section>

      {/* Short Vowels */}
      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="vowels-heading">
        <h2 id="vowels-heading" className="text-3xl font-bold">Short Vowel Sounds</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Most early words use the short sound of a vowel rather than the long, letter-name sound.
          Getting comfortable with these five short sounds unlocks most CVC words.
        </p>
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {[
            { l: "a", word: "apple" },
            { l: "e", word: "bed" },
            { l: "i", word: "pig" },
            { l: "o", word: "hot" },
            { l: "u", word: "sun" },
          ].map((v) => (
            <li key={v.l} className="rounded-block bg-paper border border-chalkboard/10 p-3">
              <Link href={`/alphabet/${v.l}`} className="font-display font-bold text-lg text-crayon-blue hover:underline">
                {v.l.toUpperCase()}
              </Link>
              <p className="mt-1 text-sm text-chalkboard/70">{v.word}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/phonics/short-vowels"
            className="inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Practice Short Vowels
          </Link>
          <Link href="/phonics/long-vowels" className="font-display font-bold text-crayon-blue hover:underline self-center">
            Ready for long vowel sounds? →
          </Link>
        </div>
      </section>

      {/* CVC Words */}
      <section className="mt-16" aria-labelledby="cvc-heading">
        <h2 id="cvc-heading" className="text-3xl font-bold">CVC Words for Beginners</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          CVC stands for consonant-vowel-consonant: a word shaped like{" "}
          <span className="font-display font-bold">c-a-t</span>. Words like cat, dog, sun, hat,
          bed, and pig are usually a child's first readable words, since sounding out three
          consistent letters is more manageable than a long or irregular word.
        </p>
        <Link
          href="/worksheets/cvc-words"
          className="mt-6 inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Explore CVC Word Worksheets
        </Link>
      </section>

      {/* Blending */}
      <section className="mt-16 bg-crayon-green/10 rounded-block p-8" aria-labelledby="blending-heading">
        <h2 id="blending-heading" className="text-3xl font-bold">Practice Sound Blending</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Blending means saying individual sounds one after another, smoothly enough that they
          form a word: <span className="font-display font-bold">/m/ + /a/ + /p/ → map</span>.
          Children usually practice blending once they're confident with individual letter sounds.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/phonics/blending"
            className="inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Practice Sound Blending
          </Link>
          <Link href="/phonics/segmenting" className="font-display font-bold text-crayon-blue hover:underline self-center">
            Try it in reverse: segmenting →
          </Link>
        </div>
      </section>

      {/* Word Families */}
      <section className="mt-16" aria-labelledby="families-heading">
        <h2 id="families-heading" className="text-3xl font-bold">Simple Word Families</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          A word family is a group of words that share an ending pattern, changing only the first
          sound. Noticing the pattern makes new words faster to sound out.
        </p>
        <ul className="mt-4 space-y-2 text-chalkboard/80">
          <li>
            <span className="font-display font-bold">-at:</span>{" "}
            <Link href="/worksheets/cvc-word-cat" className="underline">cat</Link>,{" "}
            <Link href="/worksheets/cvc-word-hat" className="underline">hat</Link>, bat, mat
          </li>
          <li>
            <span className="font-display font-bold">-ig:</span>{" "}
            <Link href="/worksheets/cvc-word-pig" className="underline">pig</Link>, big, dig, wig
          </li>
          <li>
            <span className="font-display font-bold">-un:</span>{" "}
            <Link href="/worksheets/cvc-word-sun" className="underline">sun</Link>, bun, run, fun
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/phonics/word-families"
            className="inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Explore Word Family Practice
          </Link>
        </div>
      </section>

      {/* Phonics for Preschool */}
      <section className="mt-16 bg-crayon-purple/10 rounded-block p-8" aria-labelledby="preschool-heading">
        <h2 id="preschool-heading" className="text-3xl font-bold">Phonics for Preschool</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Preschool phonics stays mostly oral: listening to sounds, saying a letter's sound out
          loud, and noticing the beginning sound of a familiar word. Matching sounds to pictures
          and simple tracing add a hands-on layer without pushing full reading yet. Our{" "}
          <Link href="/preschool" className="font-bold underline">
            Preschool Learning Hub
          </Link>{" "}
          brings these ideas together across the whole site.
        </p>
        <Link
          href="/activities"
          className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Explore Preschool Phonics Activities
        </Link>
      </section>

      {/* Phonics for Kindergarten */}
      <section className="mt-16 bg-crayon-purple/10 rounded-block p-8" aria-labelledby="kindergarten-heading">
        <h2 id="kindergarten-heading" className="text-3xl font-bold">Phonics for Kindergarten</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          By kindergarten, most children are ready to combine letter-sound knowledge with short
          vowels, CVC words, and blending to start decoding simple text. Word families and
          repeated CVC practice build the speed needed for early reading. See our{" "}
          <Link href="/kindergarten" className="font-bold underline">
            Kindergarten Learning Hub
          </Link>{" "}
          for sight words and writing practice alongside phonics.
        </p>
        <Link
          href="/worksheets/cvc-words"
          className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Explore Kindergarten Phonics Worksheets
        </Link>
      </section>

      {/* Fun Phonics Activities */}
      <section className="mt-16" aria-labelledby="activities-heading">
        <h2 id="activities-heading" className="text-3xl font-bold">Fun Phonics Activities</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activityLinks.map((a) => (
            <Link
              key={a.href + a.title}
              href={a.href}
              className="rounded-block border border-chalkboard/10 p-5 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors font-display font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
            >
              {a.title}
            </Link>
          ))}
        </div>
        <Link
          href="/games"
          className="mt-6 inline-block rounded-block bg-crayon-blue text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Play More Phonics Games
        </Link>
      </section>

      {/* Free Phonics Worksheets */}
      <section className="mt-16" aria-labelledby="worksheets-heading">
        <h2 id="worksheets-heading" className="text-3xl font-bold">Free Phonics Worksheets</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          AlphaBes has printable practice for every phonics skill on this page, from beginning
          sounds through CVC words. Preview any worksheet on screen, then print or download it.
        </p>
        <ul className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {worksheetLinks.map((w) => (
            <li key={w.href}>
              <Link
                href={w.href}
                className="block rounded-block border border-chalkboard/10 p-4 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
              >
                <span className="font-display font-bold text-sm">{w.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/worksheets"
          className="mt-6 inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Explore All Worksheets
        </Link>
      </section>

      {/* How to Practice Phonics at Home */}
      <section className="mt-16" aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-3xl font-bold">How to Practice Phonics at Home</h2>
        <ol className="mt-6 space-y-4 list-decimal list-inside text-chalkboard/80">
          <li>Practice a few sounds at a time instead of the whole alphabet at once.</li>
          <li>Say the sound clearly, without adding an extra "uh" sound to the end.</li>
          <li>Use familiar words and pictures so the sound has something to attach to.</li>
          <li>Ask your child to identify the beginning sound in everyday words.</li>
          <li>
            Practice blending short words with{" "}
            <Link href="/phonics/blending" className="font-bold underline">
              simple blending exercises
            </Link>
            .
          </li>
          <li>Keep sessions short and positive — a few minutes is enough at this age.</li>
          <li>Review previously learned sounds regularly instead of only moving forward.</li>
        </ol>
        <p className="mt-6 text-chalkboard/70">
          For more ideas, see our guide on{" "}
          <Link href="/blog/how-to-practice-phonics-at-home" className="font-bold underline">
            how to practice phonics at home
          </Link>
          .
        </p>
      </section>

      {/* Simple Phonics Learning Path (compact recap) */}
      <section className="mt-16 bg-crayon-blue/10 rounded-block p-8" aria-labelledby="path-heading">
        <h2 id="path-heading" className="text-3xl font-bold">A Simple Phonics Learning Path</h2>
        <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3 font-display font-bold text-chalkboard/80">
          {roadmap.map((step, i) => (
            <li key={step.n} className="flex items-center gap-2">
              <span className="rounded-full bg-paper border border-chalkboard/15 px-3 py-1 text-sm">
                {step.title}
              </span>
              {i < roadmap.length - 1 && <span aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">
          Frequently Asked Questions About Phonics
        </h2>
        <dl className="mt-6 space-y-6">
          {faqItems.map((item) => (
            <div key={item.question}>
              <dt className="font-display font-bold text-lg">{item.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Existing 4-skill grid, preserved */}
      <section className="mt-16" aria-labelledby="all-skills-heading">
        <h2 id="all-skills-heading" className="text-3xl font-bold">All Phonics Skill Pages</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          {phonicsSkills.map((skill) => (
            <Link
              key={skill.slug}
              href={`/phonics/${skill.slug}`}
              className="rounded-block border border-chalkboard/10 p-6 shadow-block hover:shadow-blockHover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
            >
              <h3 className="font-display font-bold text-xl">{skill.title}</h3>
              <p className="mt-2 text-sm text-chalkboard/70">{skill.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-16 bg-chalkboard text-paper rounded-block p-10 text-center">
        <h2 className="text-3xl font-bold">Ready to Start Phonics?</h2>
        <p className="mt-2 text-paper/70 max-w-xl mx-auto">
          Start with letter sounds, or jump straight to printable phonics worksheets.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/phonics/letter-sounds"
            className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Start with Letter Sounds
          </Link>
          <Link
            href="/worksheets/phonics"
            className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition-colors"
          >
            Browse Phonics Worksheets
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
