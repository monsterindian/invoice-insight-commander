import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleInvoiceData } from "@/data/sampleInvoiceData";

const ITEMS_PER_PAGE = 20;

export const InvoiceDataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData = sampleInvoiceData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Invoice Data Table</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
          <span className="text-sm text-muted-foreground">
            {filteredData.length} total records
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Total Costs</TableHead>
                <TableHead>InputFileName</TableHead>
                <TableHead>InputFileDate</TableHead>
                <TableHead>DocuType</TableHead>
                <TableHead>InvNo</TableHead>
                <TableHead>CCY</TableHead>
                <TableHead>BillDate</TableHead>
                <TableHead>Invoice ICA</TableHead>
                <TableHead>Collection Method</TableHead>
                <TableHead>Service Code</TableHead>
                <TableHead>Service Code Description</TableHead>
                <TableHead>EventID</TableHead>
                <TableHead>EventDesc</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>QtyAmt</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Charge</TableHead>
                <TableHead>TaxCharge</TableHead>
                <TableHead>TotalCharge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    ${invoice.totalCosts.toFixed(2)}
                  </TableCell>
                  <TableCell>{invoice.inputFileName}</TableCell>
                  <TableCell>{invoice.billDate}</TableCell>
                  <TableCell>Invoice</TableCell>
                  <TableCell>{invoice.invNo}</TableCell>
                  <TableCell>{invoice.currency}</TableCell>
                  <TableCell>{invoice.billDate}</TableCell>
                  <TableCell>{invoice.invoiceICA}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      invoice.collectionMethod === 'AUTO' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {invoice.collectionMethod}
                    </span>
                  </TableCell>
                  <TableCell>SC{invoice.id.slice(-3)}</TableCell>
                  <TableCell>{invoice.serviceCodeDescription}</TableCell>
                  <TableCell>EV{invoice.id.slice(-3)}</TableCell>
                  <TableCell>{invoice.eventDesc}</TableCell>
                  <TableCell>{invoice.uom}</TableCell>
                  <TableCell>{invoice.qtyAmt.toFixed(2)}</TableCell>
                  <TableCell className={invoice.rate < 0 ? 'text-red-600' : ''}>
                    {invoice.rate.toFixed(4)}
                  </TableCell>
                  <TableCell>${invoice.charge.toFixed(2)}</TableCell>
                  <TableCell>${invoice.taxCharge.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">
                    ${invoice.totalCharge.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};