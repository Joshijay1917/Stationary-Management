"use client";

import { useRef, useState } from "react";
import { Transaction } from "@/store/sales-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

interface InvoiceDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDialog({ transaction, open, onOpenChange }: InvoiceDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Print Logic
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice_${transaction?.invoiceNumber || "000"}`,
  });

  // PDF Download Logic
  const handleDownloadPDF = async () => {
    if (!printRef.current || !transaction) return;
    setDownloading(true);

    try {
      // 1. Convert the HTML div to a high-res PNG
      const imgData = await toPng(printRef.current, {
        pixelRatio: 2, // High resolution
        backgroundColor: "#ffffff",
        cacheBust: true,
      });
      
      // 2. Calculate proportions
      const tempPdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = tempPdf.internal.pageSize.getWidth(); // 210mm
      const imgProps = tempPdf.getImageProperties(imgData);
      
      // 3. Add 10mm margins for a professional look
      const margin = 10;
      const printWidth = pdfWidth - margin * 2;
      const printHeight = (imgProps.height * printWidth) / imgProps.width;
      
      // 4. Create standard PDF but with dynamic height so nothing is ever cut off!
      const finalPdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, Math.max(297, printHeight + margin * 2)] 
        // 297mm is standard A4 height. If receipt is longer, it expands dynamically.
      });
      
      finalPdf.addImage(imgData, "PNG", margin, margin, printWidth, printHeight);
      finalPdf.save(`Invoice_${transaction.invoiceNumber}.pdf`);

      toast.success("PDF Downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = () => {
    if (transaction) {
      const details = `Invoice: ${transaction.invoiceNumber}\nTotal: ₹${transaction.totalAmount}\nItems: ${transaction.items.length}`;
      navigator.clipboard.writeText(details);
      toast.success("Invoice details copied to clipboard");
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Invoice Details</DialogTitle>
          <div className="flex items-center gap-1 pr-6">
            <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy Quick Details">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handlePrint()} title="Print Invoice">
              <Printer className="h-4 w-4 text-blue-500" />
            </Button>
            <Button variant="default" size="icon" onClick={handleDownloadPDF} disabled={downloading} title="Download PDF">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* The Printable Area */}
        <div className="p-1 max-h-[60vh] overflow-y-auto print:max-h-none print:overflow-visible">
          <div 
            ref={printRef} 
            className="p-6 rounded-sm shadow-sm print:shadow-none print:p-0"
            style={{ backgroundColor: "#ffffff", color: "#000000", fontFamily: "sans-serif", width: "100%" }}
          >
            <style type="text/css" media="print">
              {`
                @page { size: auto; margin: 15mm; }
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                tr { page-break-inside: avoid; break-inside: avoid; }
                table { page-break-inside: auto; }
              `}
            </style>
            
            {/* Header */}
            <div className="text-center pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
              <h2 className="text-xl font-bold uppercase">QuickBill POS</h2>
              <p className="text-xs" style={{ color: "#6b7280" }}>123 Street Name, City, Country</p>
              <p className="text-xs" style={{ color: "#6b7280" }}>Phone: +91 98765 43210</p>
            </div>

            {/* Invoice Info */}
            <div className="flex justify-between py-4 text-sm" style={{ borderBottom: "1px solid #e5e7eb" }}>
              <div>
                <p className="text-xs" style={{ color: "#6b7280" }}>Invoice No:</p>
                <p className="font-semibold">{transaction.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: "#6b7280" }}>Date:</p>
                <p className="font-semibold">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </p>
                <p className="text-xs" style={{ color: "#6b7280" }}>
                  {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-4 min-h-[150px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <th className="pb-2 font-semibold" style={{ color: "#4b5563" }}>Item</th>
                    <th className="pb-2 font-semibold text-center" style={{ color: "#4b5563" }}>Qty</th>
                    <th className="pb-2 font-semibold text-right" style={{ color: "#4b5563" }}>Price</th>
                    <th className="pb-2 font-semibold text-right" style={{ color: "#4b5563" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td className="py-2" style={{ color: "#1f2937" }}>{item.product.shortName}</td>
                      <td className="py-2 text-center" style={{ color: "#1f2937" }}>{item.quantity}</td>
                      <td className="py-2 text-right" style={{ color: "#1f2937" }}>₹{item.product.price}</td>
                      <td className="py-2 text-right font-medium whitespace-nowrap" style={{ color: "#1f2937" }}>
                        ₹{item.product.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / Totals */}
            <div className="flex justify-end pt-4" style={{ borderTop: "1px solid #e5e7eb" }}>
              <div className="w-48 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#6b7280" }}>Subtotal</span>
                  <span style={{ color: "#000000" }}>₹{transaction.totalAmount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span style={{ color: "#000000" }}>Total</span>
                  <span style={{ color: "#000000" }}>₹{transaction.totalAmount}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-8 text-xs" style={{ color: "#9ca3af" }}>
              <p>Thank you for shopping with us!</p>
              <p>Generated by QuickBill POS</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
