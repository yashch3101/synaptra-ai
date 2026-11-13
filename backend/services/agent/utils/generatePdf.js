import PDFDocument from "pdfkit";

export const generatePdf = async (data) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            margin: 50,
            info: {
                Author: "Synaptra AI",
                Title: data.title,
                Creator: "Synaptra AI",
            }
        })

        const chunks = []

        doc.on("data", (chunk) => chunks.push(chunk))
        doc.on("end", () => resolve(Buffer.concat(chunks)))
        doc.on("error", (err) => reject(err))

        // Title
        doc.fontSize(28).text(data.title, { align: "center" }).fillColor("#111827")

        if (data.subtitle) {
            doc.moveDown(0.5)
        }

        // Subtitle
        doc.fontSize(12).text(data.subtitle, { align: "center" }).fillColor("#6B7280")
        doc.moveDown(2)

        // Sections
        data?.sections?.forEach(s => {
            doc.fontSize(18).text(s.heading).fillColor("#111827")
            doc.moveDown(0.5)

            s?.points?.forEach((p) => {
                doc.fontSize(12).text("• "+ p, { lineGap: 5 }).fillColor("#374151")
            })
            doc.moveDown()
        });

        // Footer

        doc.moveDown()

        doc.fontSize(10).text("Generate By Synaptra AI", { align: "center" }).fillColor("#9CA3AF")

        doc.end()

    })
}