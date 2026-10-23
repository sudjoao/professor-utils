import { ChevronDown } from 'lucide-react';

import { FAQ_ITEMS } from '@/features/help/faq';

export const FaqList = () => (
  <ul className="space-y-3">
    {FAQ_ITEMS.map(({ question, answer }) => (
      <li key={question}>
        <details className="group rounded-xl border-2 bg-card">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-lg font-medium [&::-webkit-details-marker]:hidden">
            {question}
            <ChevronDown
              className="size-5 shrink-0 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="space-y-2 px-4 pb-4">{answer}</div>
        </details>
      </li>
    ))}
  </ul>
);
