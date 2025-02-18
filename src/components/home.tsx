import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold mb-8">
          SISTEMA DE AUDITORIA E GESTÃO HMP - FISIOTERAPIA
        </h1>
        <Button onClick={() => navigate("/audit")} size="lg">
          Acessar Sistema de Auditoria
        </Button>
      </div>
    </div>
  );
}

export default Home;
