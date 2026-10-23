'use client';

import { useMemo, useState } from 'react';

import { StepCard } from '@/components/StepCard';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { useClassDraft } from '@/features/classroom/hooks/useClassDraft';
import { getStudentNames } from '@/features/classroom/services/classForm';
import { DrawStudentCard } from '@/features/draw/components/DrawStudentCard';
import { GroupsCard } from '@/features/draw/components/GroupsCard';
import { PresentStudentsField } from '@/features/draw/components/PresentStudentsField';

const TOTAL_STEPS = 4;

export const DrawForm = () => {
  const { classDraft, splitChanges } = useClassDraft();
  const [absentNames, setAbsentNames] = useState<string[]>([]);
  const studentNames = useMemo(() => getStudentNames(classDraft), [classDraft]);
  const presentNames = studentNames.filter((name) => !absentNames.includes(name));

  const toggleAbsent = (name: string) =>
    setAbsentNames((current) =>
      current.includes(name) ? current.filter((absent) => absent !== name) : [...current, name],
    );

  return (
    <div className="space-y-6">
      <ClassroomCard
        step={1}
        totalSteps={TOTAL_STEPS}
        values={classDraft}
        studentNames={studentNames}
        optionalFields={['classroomName', 'subject', 'teacherName']}
        errors={[]}
        onChange={(changes) => splitChanges(changes)}
      />

      <StepCard step={2} totalSteps={TOTAL_STEPS} title="Quem veio hoje">
        <PresentStudentsField
          studentNames={studentNames}
          absentNames={absentNames.filter((name) => studentNames.includes(name))}
          onToggle={toggleAbsent}
          onMarkAll={() => setAbsentNames([])}
        />
      </StepCard>

      <DrawStudentCard step={3} totalSteps={TOTAL_STEPS} presentNames={presentNames} />
      <GroupsCard
        step={4}
        totalSteps={TOTAL_STEPS}
        presentNames={presentNames}
        classroomName={classDraft.classroomName}
      />
    </div>
  );
};
