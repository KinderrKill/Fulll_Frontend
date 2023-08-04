import { EditModeContextType } from '@/utils/types';
import { createContext, useState } from 'react';

export const EditModeContextSchema = createContext<EditModeContextType | undefined>(undefined);

function EditModeContext({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = useState<boolean>(false);

  function toggleEditMode(): void {
    setEditMode((prevValue) => !prevValue);
  }

  return (
    <EditModeContextSchema.Provider value={{ editMode, toggleEditMode }}>{children}</EditModeContextSchema.Provider>
  );
}

export default EditModeContext;
