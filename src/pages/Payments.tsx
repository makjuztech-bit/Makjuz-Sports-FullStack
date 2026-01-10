import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Upload, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useData } from '@/contexts/DataContext';

export default function Payments() {
    const { projects } = useData();
    const [activeTab, setActiveTab] = useState('sales');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        // Mock upload logic
        if (e.target.files && e.target.files.length > 0) {
            alert(`Uploaded ${type}: ${e.target.files[0].name}`);
        }
    };

    const generateOverallInvoice = () => {
        const doc = new jsPDF();

        // Add Logo (Mocking with text for now as we don't have a real logo file path)
        doc.setFontSize(22);
        doc.setTextColor(40, 100, 255); // Blue color
        doc.text("ARENA BUILD", 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("123 Construction Ave, Builders City", 20, 26);
        doc.text("Phone: +91 98765 43210 | Email: accounts@arenabuild.com", 20, 31);

        // Invoice Header
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text("OVERALL PAYMENT INVOICE", 140, 20);

        doc.setFontSize(10);
        doc.text(`Invoice No: INV-${Math.floor(Math.random() * 10000)}`, 140, 28);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 34);

        // Line
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        // Table Data
        const tableData = projects.map(p => [
            p.name,
            p.status,
            `Rs. ${p.budget.toLocaleString()}`,
            `Rs. ${p.spent.toLocaleString()}`,
            `Rs. ${(p.budget - p.spent).toLocaleString()}`
        ]);

        // Footer Total
        const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
        const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

        autoTable(doc, {
            startY: 50,
            head: [['Project Name', 'Status', 'Total Budget', 'Amount Spent', 'Balance']],
            body: [
                ...tableData,
                ['Total', '', `Rs. ${totalBudget.toLocaleString()}`, `Rs. ${totalSpent.toLocaleString()}`, `Rs. ${(totalBudget - totalSpent).toLocaleString()}`]
            ],
            headStyles: { fillColor: [40, 100, 255] },
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
            theme: 'grid'
        });

        // Save
        doc.save('overall-payments-invoice.pdf');
    };

    const UploadSection = ({ title, type }: { title: string, type: string }) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Upload detailed {title.toLowerCase()} documents here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <Label htmlFor={`upload-${type}`} className="cursor-pointer">
                        <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                            Choose PDF File
                        </span>
                        <Input
                            id={`upload-${type}`}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, title)}
                        />
                    </Label>
                    <p className="mt-2 text-sm text-muted-foreground">PDF files only (Max 5MB)</p>
                </div>

                <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Recent Uploads</h4>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md max-w-sm">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-red-500" />
                            <span className="text-sm">example-{type}.pdf</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Download className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Payments"
                description="Manage invoices, quotations, and payment records"
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
                    <TabsTrigger value="sales">Sales Invoice</TabsTrigger>
                    <TabsTrigger value="performa">Performa Invoice</TabsTrigger>
                    <TabsTrigger value="challan">Delivery Challan</TabsTrigger>
                    <TabsTrigger value="quotation">Quotation</TabsTrigger>
                    <TabsTrigger value="overall">Overall Payments</TabsTrigger>
                </TabsList>

                <TabsContent value="sales">
                    <UploadSection title="Sales Invoice" type="sales" />
                </TabsContent>

                <TabsContent value="performa">
                    <UploadSection title="Performa Invoice" type="performa" />
                </TabsContent>

                <TabsContent value="challan">
                    <UploadSection title="Delivery Challan" type="challan" />
                </TabsContent>

                <TabsContent value="quotation">
                    <UploadSection title="Quotation" type="quotation" />
                </TabsContent>

                <TabsContent value="overall">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Payments Summary</CardTitle>
                            <CardDescription>Generate and download consolidated payment reports.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3 mb-8">
                                {projects.map(p => (
                                    <Card key={p.id} className="bg-muted/50 border-none">
                                        <CardContent className="p-4">
                                            <p className="text-sm font-medium text-muted-foreground mb-1">{p.name}</p>
                                            <p className="text-2xl font-bold">₹{p.spent.toLocaleString()}</p>
                                            <div className="flex justify-between mt-2 text-xs">
                                                <span>Budget: ₹{p.budget.toLocaleString()}</span>
                                                <span className={p.spent > p.budget ? "text-destructive" : "text-success"}>
                                                    {Math.round((p.spent / p.budget) * 100)}%
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-center p-8 bg-muted/20 rounded-lg border border-dashed">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                        <DollarSign className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Generate Payment Invoice</h3>
                                        <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                                            Download a professional PDF invoice summarizing all project payments, balances, and statuses.
                                        </p>
                                    </div>
                                    <Button onClick={generateOverallInvoice} className="gap-2">
                                        <Download className="w-4 h-4" />
                                        Download Invoice PDF
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
