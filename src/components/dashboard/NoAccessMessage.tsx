
import React from 'react';

const NoAccessMessage: React.FC = () => {
  return (
    <div className="text-center py-12 glass-morphism p-8 rounded-lg mx-auto max-w-md">
      <h3 className="text-lg font-semibold mb-2 text-gradient">Sem Acesso às Máquinas Virtuais</h3>
      <p className="text-muted-foreground">
        Você não tem acesso a nenhuma máquina virtual no momento. Por favor, entre em contato com um administrador para solicitar acesso.
      </p>
    </div>
  );
};

export default NoAccessMessage;
