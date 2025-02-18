import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const menuItems = ["Home", "Sobre", "Serviços", "Contato"];

const features = [
  {
    id: 1,
    title: "Atendimento 24h",
    content: "Suporte completo para todas suas necessidades",
    icon: "🏥",
  },
  {
    id: 2,
    title: "Equipe Especializada",
    content: "Profissionais altamente qualificados",
    icon: "👨‍⚕️",
  },
  {
    id: 3,
    title: "Tecnologia Avançada",
    content: "Equipamentos de última geração",
    icon: "🔬",
  },
];

const services = [
  {
    id: 1,
    title: "Consultas",
    content: "Atendimento personalizado com especialistas",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b",
  },
  {
    id: 2,
    title: "Exames",
    content: "Diagnósticos precisos e rápidos",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
  },
  {
    id: 3,
    title: "Tratamentos",
    content: "Soluções completas para sua saúde",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1b89",
  },
];

export function ResponsiveLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full md:w-[90%] lg:w-[80%] mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              HealthCare
            </h1>

            {/* Menu Desktop/Tablet */}
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className="text-lg"
                  onClick={() => console.log(item)}
                >
                  {item}
                </Button>
              ))}
            </nav>

            {/* Menu Mobile */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Menu Mobile Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="text-left text-lg font-bold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              HealthCare
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <Button
                key={item}
                variant="ghost"
                className="justify-start h-14 text-lg font-medium hover:bg-muted"
                onClick={() => {
                  console.log(item);
                  setMenuOpen(false);
                }}
              >
                {item}
              </Button>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <Button className="w-full" size="lg">
              Agende sua consulta
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-0" />
          <div className="w-full md:w-[90%] lg:w-[80%] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 py-12 md:py-24">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Cuidando da sua saúde com excelência
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Oferecemos os melhores serviços médicos com profissionais
                  altamente qualificados.
                </p>
                <Button size="lg" className="text-lg">
                  Agende sua consulta
                </Button>
              </div>
              <div className="flex-1">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133"
                  alt="Healthcare"
                  className="rounded-lg shadow-xl w-full max-w-[500px] mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-12">
          <div className="w-full md:w-[90%] lg:w-[80%] mx-auto p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card
                  key={feature.id}
                  className="bg-background hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12">
          <div className="w-full md:w-[90%] lg:w-[80%] mx-auto p-4 md:p-6 lg:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Nossos Serviços
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-muted/50 py-12">
          <div className="w-full md:w-[90%] lg:w-[80%] mx-auto p-4 md:p-6 lg:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Entre em Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <Phone className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Telefone</h3>
                    <p className="text-muted-foreground">(11) 1234-5678</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <Mail className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">
                      contato@healthcare.com
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <MapPin className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Endereço</h3>
                    <p className="text-muted-foreground">Rua Example, 123</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="w-full md:w-[90%] lg:w-[80%] mx-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
              <p className="text-muted-foreground">
                Cuidando da sua saúde com excelência e dedicação.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item}>
                    <Button variant="link" className="p-0 h-auto">
                      {item}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Telefone: (11) 1234-5678</li>
                <li>Email: contato@healthcare.com</li>
                <li>Endereço: Rua Example, 123</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2024 HealthCare. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
