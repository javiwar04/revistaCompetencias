"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export default function RevistaUMG() {
  const contentRef = useRef<HTMLDivElement>(null)

  const handleExportPDF = async () => {
    if (!contentRef.current) return

    try {
      // Improved print approach with print-specific CSS and page splitting.
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        console.error("No se pudo abrir la ventana de impresión")
        return
      }

      const doc = printWindow.document
      doc.open()

      // Collect head nodes (links and styles) so Tailwind and global styles
      // are preserved in the print window.
      const headNodes = Array.from(document.head.querySelectorAll("link, style"))
        .map((n) => n.outerHTML)
        .join("\n")

      // Print-only styles to control paging and image handling. Adjust margins
      // and page size for A4 portrait. Use break-inside/avoid to prevent
      // unwanted splits inside cards/images.
      const printStyles = `
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          html, body { height: 100%; background: white; -webkit-print-color-adjust: exact; }
          body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
          .print-page { display: block; page-break-after: always; break-after: page; }
          .print-page:last-child { page-break-after: auto; }
          img { max-width: 100%; height: auto; page-break-inside: avoid; break-inside: avoid; }
          .card, .p-6, .p-8 { page-break-inside: avoid; break-inside: avoid; }
          .avoid-break { page-break-inside: avoid; break-inside: avoid; }
          /* Prevent tables or long text blocks from being split awkwardly */
          p, h1, h2, h3, h4, h5, h6 { orphans: 3; widows: 3; }
          /* Ensure background colors are printed */
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        </style>
      `

      // Clone the content so we can add helpers (classes) without mutating the
      // live DOM. We'll mark top-level child sections as pages so they print
      // sheet-by-sheet. This is a pragmatic approach — fine-tune later if you
      // want different page grouping.
      const container = document.createElement("div")
      const clone = contentRef.current.cloneNode(true) as HTMLElement
      // Add .print-page to top-level sections or immediate children
      Array.from(clone.children).forEach((child) => {
        // Only add to element nodes
        if (child.nodeType === Node.ELEMENT_NODE) {
          (child as HTMLElement).classList.add("print-page")
        }
      })
      container.appendChild(clone)

      doc.write(`<!doctype html><html><head><meta charset="utf-8">${headNodes}${printStyles}</head><body>`) 
      doc.write(container.innerHTML)
      doc.write("</body></html>")
      doc.close()

      // Wait for the new window to finish loading styles and images. Use
      // onload if available, otherwise fallback to a timeout.
      const doPrint = () => {
        try {
          printWindow.focus()
          printWindow.print()
        } catch (e) {
          console.error("Error during print:", e)
        }
      }

      if (printWindow.document.readyState === "complete") {
        // Give a short pause to ensure images/styles applied
        setTimeout(doPrint, 500)
      } else {
        printWindow.onload = () => setTimeout(doPrint, 500)
      }
    } catch (error) {
      console.error("[v0] Error exporting PDF via print():", error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <Button onClick={handleExportPDF} size="lg" className="shadow-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Exportar PDF
        </Button>
      </div>

      <div ref={contentRef}>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-background/70 to-background/80" />
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WLOJyqq5Hu6aOU0zXR0dyX9A9jrMQ4.png"
              alt="Arena de combate"
              fill
              className="object-cover opacity-40"
            />
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/universidad-mariano-galvez-de-guatemala-logo-removebg-preview-YU0Pqd2C8A0nNaTMx11xndqdCOoESZ.png"
              alt="Universidad Mariano Gálvez"
              width={180}
              height={180}
              className="mx-auto mb-8"
            />

            <Badge className="mb-6 text-lg px-6 py-2 bg-primary text-primary-foreground">3er Lugar 🏆</Badge>

            <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 text-balance">
              Competencias UMG
              <span className="block text-primary">2025</span>
            </h1>

            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 text-balance">
              La historia de <span className="text-accent font-bold">Giammattei</span>
            </p>

            <div className="flex gap-4 justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Robótica de Combate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Universidad Mariano Gálvez</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-5xl font-bold mb-8 text-center">Un día para recordar...</h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-12" />
            <p className="text-xl text-muted-foreground leading-relaxed text-center text-balance">
              En las Competencias UMG 2025, nuestro equipo alcanzó el tercer lugar con{" "}
              <span className="text-primary font-semibold">Giammattei</span>, un robot de combate diseñado y construido
              con dedicación, innovación y trabajo en equipo. Esta es la historia de nuestro viaje desde el concepto
              hasta la arena de batalla.
            </p>
          </div>
        </section>

        {/* El Proceso - Grid de Imágenes */}
        <section className="py-24 px-4 bg-muted">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-5xl font-bold mb-4 text-center">El Proceso de Construcción</h2>
            <p className="text-xl text-muted-foreground mb-16 text-center">
              Desde los primeros bocetos hasta los ajustes finales
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="overflow-hidden group">
                <div className="relative h-96 grid grid-cols-2 gap-2 p-2 bg-card">
                  <div className="relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GMfGWIA7xu9nKAytvn6EPdTOSWvKBX.png"
                      alt="Equipo trabajando en el robot"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WHNyOZCCeMdW4siKb4TzqAInIt7EBD.png"
                      alt="Soldando el robot"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Planificación Inicial</h3>
                  <p className="text-muted-foreground">
                    El equipo reunido discutiendo estrategias, diseñando prototipos y soldando componentes clave.
                  </p>
                </div>
              </Card>

              <Card className="overflow-hidden group">
                <div className="relative h-96">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-V7klFGh9T2rQsUc0iTV1cmJGf8ZAcf.png"
                    alt="Ajustes del robot"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Ensamblaje y Cableado</h3>
                  <p className="text-muted-foreground">
                    Trabajo detallado en la electrónica y conexiones del sistema de control.
                  </p>
                </div>
              </Card>

              <Card className="overflow-hidden group">
                <div className="relative h-96">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3K3Rq2jRpt73n3GkrzyCT2OvSNqDXR.png"
                    alt="Ajustes finales"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Ajustes Técnicos</h3>
                  <p className="text-muted-foreground">
                    Calibración precisa de los sistemas mecánicos y eléctricos del robot.
                  </p>
                </div>
              </Card>

              <Card className="overflow-hidden group">
                <div className="relative h-96">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-25%20at%207.19.27%20PM%20%281%29-3HaECj3TmZxD4E6bPnRyzmagehAEdY.jpeg"
                    alt="Robot en pruebas"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Pruebas Finales</h3>
                  <p className="text-muted-foreground">
                    Últimos ajustes antes de la competencia, asegurando el rendimiento óptimo.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Giammattei - El Robot */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-accent text-accent-foreground">El Guerrero</Badge>
                <h2 className="font-display text-6xl font-bold mb-6">Giammattei</h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Nuestro robot de combate, equipado con una poderosa sierra circular como arma principal. Diseñado con
                  un chasis robusto en colores naranja y negro, Giammattei combina potencia, agilidad y resistencia para
                  enfrentar a cualquier oponente en la arena.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="border-l-4 border-primary pl-4">
                    <div className="text-3xl font-bold text-primary mb-1">3er</div>
                    <div className="text-sm text-muted-foreground">Lugar Final</div>
                  </div>
                  <div className="border-l-4 border-accent pl-4">
                    <div className="text-3xl font-bold text-accent mb-1">2025</div>
                    <div className="text-sm text-muted-foreground">Competencia UMG</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Arma Principal</h4>
                      <p className="text-sm text-muted-foreground">
                        Sierra circular de alta velocidad para máximo daño
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Diseño Robusto</h4>
                      <p className="text-sm text-muted-foreground">Chasis reforzado para resistir impactos severos</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Control Preciso</h4>
                      <p className="text-sm text-muted-foreground">
                        Sistema de control avanzado para maniobras tácticas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                <Card className="relative overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0wZ0OlTvY10wGbCtxusfEvhEXf5nI8.png"
                    alt="Robot Giammattei"
                    width={800}
                    height={800}
                    className="w-full h-auto"
                  />
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Más imágenes del robot */}
        <section className="py-24 px-4 bg-muted">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-5xl font-bold mb-16 text-center">Giammattei en Acción</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="overflow-hidden group">
                <div className="relative h-80">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-fVYgFKkHzKYpvSjQJiMU50ZaIpIa5A.jpeg"
                    alt="Robot en el campo"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </Card>

              <Card className="overflow-hidden group md:col-span-2">
                <div className="relative h-80">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-25%20at%207.19.27%20PM%20%281%29-3HaECj3TmZxD4E6bPnRyzmagehAEdY.jpeg"
                    alt="Robot preparándose"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-5xl font-bold mb-4 text-center">En la Arena de Combate</h2>
            <p className="text-xl text-muted-foreground mb-16 text-center">
              Giammattei enfrentando a sus rivales con potencia y estrategia
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="overflow-hidden group">
                <div className="relative h-96">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pE5MkDy8Fg2IGTdjogIHaGiQgPNfAW.png"
                    alt="Robots en la arena"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Preparados para la Batalla</h3>
                  <p className="text-muted-foreground">
                    Los robots se posicionan en la arena, listos para el enfrentamiento.
                  </p>
                </div>
              </Card>

              <Card className="overflow-hidden group">
                <div className="relative h-96">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7OlSkmlzRtOKKEScrSsFIwm8ID0uxL.png"
                    alt="Combate intenso"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Acción Explosiva</h3>
                  <p className="text-muted-foreground">
                    Momentos de alta intensidad durante los combates más emocionantes.
                  </p>
                </div>
              </Card>

              <Card className="overflow-hidden group">
                <div className="relative h-96">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-OJcyRSRKdCOHwGVlpU22hfAVg3Vsyj.png"
                    alt="Giammattei en combate"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Giammattei en Acción</h3>
                  <p className="text-muted-foreground">Nuestro robot demostrando su poder y resistencia en la arena.</p>
                </div>
              </Card>

              <Card className="overflow-hidden group">
                <div className="relative h-96">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xfO4ECpThBqrmMJsVop5hWrR9vmvhG.png"
                    alt="Momento decisivo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Momentos Decisivos</h3>
                  <p className="text-muted-foreground">Cada segundo cuenta en la batalla por la victoria.</p>
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="relative h-[500px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ek6aM9sHYkhYmuK8ww0c371cqBzrC5.png"
                  alt="Vista general de la arena"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 bg-card">
                <h3 className="text-3xl font-bold mb-4">La Arena de Batalla</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Con el público expectante, cada combate fue una demostración de ingeniería, estrategia y
                  determinación. La energía en la arena era palpable mientras Giammattei luchaba por alcanzar el podio.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* El Equipo */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-5xl font-bold mb-4 text-center">El Equipo Ganador</h2>
            <p className="text-xl text-muted-foreground mb-16 text-center">La fuerza detrás de Giammattei</p>

            <Card className="overflow-hidden">
              <div className="relative h-[600px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-25%20at%207.19.27%20PM-BFuv5o5tfDUP0oirhvo11K4H4nF0nA.jpeg"
                  alt="Equipo UMG con sus diplomas"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 bg-card">
                <h3 className="text-3xl font-bold mb-4">Tercer Lugar - Competencias UMG 2025</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Nuestro equipo de la Universidad Mariano Gálvez celebrando el logro del tercer lugar en las
                  competencias de robótica. Meses de trabajo duro, dedicación y colaboración culminaron en este momento
                  de orgullo y satisfacción. Cada miembro del equipo aportó sus habilidades únicas para hacer realidad
                  este proyecto.
                </p>

                <div className="border-t border-border pt-8">
                  <h4 className="text-xl font-bold mb-6 text-center">Integrantes del Equipo</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Rudy Jaser Samuel Castellanos Lopez</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Hugo Yondani Corado Hernández</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Juan Marcos Castro Tolentino</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Evelyn Antonia Cardenas Borjas</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Victor Gabriel Madrid Barrios</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Victor Alejandro Ochoa Jacinto</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Javier Alfonso Guerra Vasquez</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Jose Fernando Esteban Aguirre Garcia</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="py-24 px-4 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 text-center border-t-4 border-primary">
                <div className="text-5xl font-bold text-primary mb-2">3°</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Lugar Final</div>
              </Card>

              <Card className="p-8 text-center border-t-4 border-primary">
                <div className="text-5xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Espíritu de Equipo</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Conclusión */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-5xl font-bold mb-8">Una Experiencia Inolvidable</h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-12" />
            <p className="text-xl text-muted-foreground leading-relaxed text-balance">
              Las Competencias UMG 2025 fueron más que una competencia: fueron una oportunidad para aprender, crecer y
              demostrar que con trabajo en equipo y dedicación, los límites son solo el comienzo. Giammattei no es solo
              un robot, es el símbolo de nuestro esfuerzo y pasión por la ingeniería.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="max-w-7xl mx-auto text-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/57-578520_nombre-de-la-universidad-mariano-galvez-hd-png-fjXsMmVgOBiPL069FmmD7f104Id3c0.png"
              alt="Universidad Mariano Gálvez"
              width={200}
              height={60}
              className="mx-auto mb-6 opacity-50"
            />
            <p className="text-muted-foreground">Universidad Mariano Gálvez - Competencias de Robótica 2025</p>
            <p className="text-sm text-muted-foreground mt-2">Tercer Lugar con Orgullo 🏆</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
