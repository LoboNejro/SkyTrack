import React from 'react';

export default function NotesTest() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Página de Prueba - Notas</h1>
      <p className="text-muted-foreground">
        Si puedes ver esto, entonces el problema no es con el routing básico.
      </p>
      <div className="bg-red-100 p-4 rounded">
        <p>Esta es una página de prueba para diagnosticar el problema con las notas.</p>
      </div>
    </div>
  );
}
