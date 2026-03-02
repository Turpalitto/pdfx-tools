export const metadata = {
  title: "Terms of Service | PDF X",
  description: "Условия использования сервиса PDF X.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-[940px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-6">Terms of Service</h1>
      <div className="space-y-4 text-sm leading-7 text-[#bbb]">
        <p>
          Используя PDF X, вы соглашаетесь с этими условиями. Сервис предоставляется «как есть», без гарантий
          непрерывной или безошибочной работы.
        </p>
        <p>
          Вы несете ответственность за законность и содержание файлов, которые обрабатываете через сервис.
        </p>
        <p>
          Запрещено использовать PDF X для незаконной деятельности, распространения вредоносного контента или нарушения
          прав третьих лиц.
        </p>
        <p>
          Мы можем изменять функциональность и условия сервиса. Актуальная версия условий публикуется на этой странице.
        </p>
        <p>
          Платные функции (PRO) могут регулироваться дополнительными условиями платежного провайдера и политикой
          возвратов, указанной при оформлении подписки.
        </p>
        <p>
          По вопросам: <a className="text-[#ffdc50]" href="mailto:contact@pdfx.tools">contact@pdfx.tools</a>.
        </p>
      </div>
    </div>
  );
}