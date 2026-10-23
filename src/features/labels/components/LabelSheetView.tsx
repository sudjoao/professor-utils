import { getNameFontSize } from '@/features/labels/services/buildLabelSheets';
import type { LabelContent, LabelModel } from '@/features/labels/types';
import { cn } from '@/lib/utils';

type LabelSheetViewProps = {
  sheet: (LabelContent | null)[];
  model: LabelModel;
  isPrint?: boolean;
};

const mm = (value: number) => `${value}mm`;

/** One A4 sheet of labels, drawn at real size (in millimeters) for printing. */
export const LabelSheetView = ({ sheet, model, isPrint = false }: LabelSheetViewProps) => (
  <div
    className={cn('relative bg-white text-black', isPrint ? 'print-page' : 'shadow-sm')}
    style={{ width: '210mm', height: '297mm' }}
  >
    {sheet.map((label, index) => {
      const column = index % model.columns;
      const row = Math.floor(index / model.columns);

      return (
        <div
          key={index}
          className={cn(
            'absolute flex flex-col items-center justify-center overflow-hidden px-[3mm] text-center',
            model.cutLines && 'border border-dashed border-gray-400',
            !isPrint && !model.cutLines && 'outline outline-gray-200',
          )}
          style={{
            left: mm(model.left + column * (model.width + model.gapX)),
            top: mm(model.top + row * (model.height + model.gapY)),
            width: mm(model.width),
            height: mm(model.height),
          }}
        >
          {label && (
            <>
              <p
                className="font-sans leading-tight font-bold"
                style={{ fontSize: `${getNameFontSize(label.name, model)}pt` }}
              >
                {label.name}
              </p>
              {label.details.map((detail) => (
                <p key={detail} className="font-sans text-[9pt] leading-tight">
                  {detail}
                </p>
              ))}
            </>
          )}
        </div>
      );
    })}
  </div>
);
