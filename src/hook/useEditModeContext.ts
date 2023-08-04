import { useContext } from 'react';
import { EditModeContextSchema } from './../component/context/editModeContext';

export default function useEditModeContext() {
  const context = useContext(EditModeContextSchema);

  if (context === undefined) throw new Error('EditModeContextSchema is not defined!');

  return context;
}
