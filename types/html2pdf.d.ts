declare module "html2pdf.js" {
  // Minimal typing to satisfy TypeScript for runtime usage in this project.
  type Html2PdfInstance = {
    from: (element: Element | string) => Html2PdfInstance
    set: (options: any) => Html2PdfInstance
    save: () => void
  }

  declare const html2pdf: (options?: any) => Html2PdfInstance
  export default html2pdf
}
