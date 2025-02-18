import { Menu, Stethoscope } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";

export function Header() {
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="border-b bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
      <div className="container px-4">
        <div className="flex h-20 items-center justify-between lg:justify-start lg:gap-8">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative h-12 w-12 bg-white rounded-lg flex items-center justify-center">
              <Stethoscope className="h-7 w-7 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm lg:text-lg font-bold tracking-tight">
                SISTEMA DE AUDITORIA E GESTÃO HMP
              </span>
              <span className="text-xs lg:text-sm font-medium text-white/90">
                FISIOTERAPIA
              </span>
            </div>
          </div>

          {/* Menu Mobile Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between flex-1">
            <div className="flex items-center gap-6">
              {userRole === "admin" && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/audit")}
                    className="text-white hover:bg-white/10 hover:text-white text-base font-medium"
                  >
                    AUDITORIA
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/physio")}
                    className="text-white hover:bg-white/10 hover:text-white text-base font-medium"
                  >
                    GESTÃO DE INDICADORES
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                onClick={() => navigate("/timesheet")}
                className="text-white hover:bg-white/10 hover:text-white text-base font-medium"
              >
                PONTO ELETRÔNICO
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-white hover:bg-white/10 hover:text-white text-base font-medium"
            >
              SAIR
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <div className="flex flex-col h-full bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 bg-white rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">HMP</span>
                  <span className="text-sm text-white/90">FISIOTERAPIA</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4">
              <div className="flex flex-col gap-2">
                {userRole === "admin" && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/audit");
                        setMenuOpen(false);
                      }}
                      className="justify-start text-white hover:bg-white/10 h-12 text-base font-medium"
                    >
                      AUDITORIA
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/physio");
                        setMenuOpen(false);
                      }}
                      className="justify-start text-white hover:bg-white/10 h-12 text-base font-medium"
                    >
                      GESTÃO DE INDICADORES
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/timesheet");
                    setMenuOpen(false);
                  }}
                  className="justify-start text-white hover:bg-white/10 h-12 text-base font-medium"
                >
                  PONTO ELETRÔNICO
                </Button>
              </div>
            </nav>

            <div className="p-4 border-t border-white/10">
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate("/");
                  setMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/10 h-12 text-base font-medium"
              >
                SAIR
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
