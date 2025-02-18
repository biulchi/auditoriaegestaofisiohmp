import { Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";

export function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="border-b bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
      <div className="container flex h-20 items-center">
        {/* Logo and Title Section - Left */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative h-12 w-12 bg-white rounded-lg flex items-center justify-center">
              <Stethoscope className="h-7 w-7 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">
                SISTEMA DE AUDITORIA E GESTÃO HMP
              </span>
              <span className="text-sm font-medium text-white/90">
                FISIOTERAPIA
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Center */}
        <div className="flex items-center justify-center gap-6 flex-1">
          {useAuth().userRole === "admin" && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/audit")}
                className="text-white hover:bg-white/10 hover:text-white text-base font-medium px-6"
              >
                AUDITORIA
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/physio")}
                className="text-white hover:bg-white/10 hover:text-white text-base font-medium px-6"
              >
                GESTÃO DE INDICADORES
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            onClick={() => navigate("/timesheet")}
            className="text-white hover:bg-white/10 hover:text-white text-base font-medium px-6"
          >
            PONTO ELETRÔNICO
          </Button>
        </div>

        {/* Logout Button - Right */}
        <div className="flex justify-end flex-1">
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-white hover:bg-white/10 hover:text-white text-base font-medium px-6"
          >
            SAIR
          </Button>
        </div>
      </div>
    </div>
  );
}
