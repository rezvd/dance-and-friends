import alexeyPhoto from "@/assets/teachers/alexey-malovechkin.jpg";
import ilyaPhoto from "@/assets/teachers/ilya-ponivanov.jpg";
import sofiaPhoto from "@/assets/teachers/sofia-bill.jpg";
import vadimPhoto from "@/assets/teachers/vadim-ryabenko.jpg";
import yuliaPhoto from "@/assets/teachers/yulia-nikiforova.jpg";

import "./teachers-page.css";

type Teacher = {
  name: string;
  description: string;
  photo: string;
};

const teachers: Teacher[] = [
  {
    name: "Вадим Рябенко",
    photo: vadimPhoto,
    description:
      "Вадим катается на **фестивали** чаще всех нас вместе взятых и не пропускает ни одного занятия, поэтому у него всегда найдётся **новая фигура**, идея или вариация, которой можно поделиться",
  },
  {
    name: "Софья Билль",
    photo: sofiaPhoto,
    description:
      "Софа танцует с 2021 года и сейчас уверенно чувствует себя в **обеих ролях**, поэтому может объяснить **тонкости** взаимодействия и с точки зрения лидера, и с точки зрения фолловера",
  },
  {
    name: "Илья Пониванов",
    photo: ilyaPhoto,
    description:
      "Илья особенно ценит в танце **диалог** — когда оба партнёра могут предлагать свои идеи, — и любит обыгрывать музыкальные **акценты**, и это всегда чувствуется в танце с ним",
  },
  {
    name: "Алексей Маловечкин",
    photo: alexeyPhoto,
    description:
      "Лёша — тот самый человек, который **привёз свинг** в Омск. И спустя все эти годы он продолжает активно развиваться, преподавать, ездить на фестивали и занимать места на **соревнованиях** в других городах",
  },
  {
    name: "Юлия Никифорова",
    photo: yuliaPhoto,
    description:
      "Юля — символ омского блюза, его преданный фанат и главный борец за **хорошую технику**. С ней вы сначала забудете, как ходить, а потом **научитесь** заново",
  },
];

export function TeachersPage() {
  return (
    <div className="teachers-page">
      <header className="teachers-page__hero">
        <div className="teachers-page__hero-inner">
          <h1>Наши преподаватели</h1>
        </div>
      </header>

      <section className="teachers-page__grid" aria-label="Преподаватели">
        {teachers.map((teacher) => (
          <article className="teacher-card" key={teacher.name}>
            <div className="teacher-card__photo">
              <img src={teacher.photo} alt={teacher.name} />
            </div>
            <div className="teacher-card__content">
              <h2>{teacher.name}</h2>
              <p>{renderHighlightedText(teacher.description)}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function renderHighlightedText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong className="teacher-card__highlight" key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}
