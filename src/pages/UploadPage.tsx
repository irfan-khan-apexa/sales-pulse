import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FileMapping {
  sourceColumn: string;
  targetField: string;
}

const TARGET_FIELDS = [
  { value: 'outlet_id', label: 'Outlet ID' },
  { value: 'outlet_name', label: 'Outlet Name' },
  { value: 'dsr_id', label: 'DSR ID' },
  { value: 'sku_id', label: 'SKU ID' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'date', label: 'Date' },
  { value: 'channel', label: 'Channel' },
  { value: 'ignore', label: '-- Ignore --' },
];

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [mappings, setMappings] = useState<FileMapping[]>([]);

  // Mock CSV columns detected
  const mockColumns = ['Store Code', 'Store Name', 'Salesman ID', 'Product SKU', 'Qty Sold', 'Amount', 'Transaction Date', 'Trade Channel'];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.[0]?.type === 'text/csv' || files?.[0]?.name.endsWith('.csv')) {
      setSelectedFile(files[0]);
      initializeMappings();
      setShowMappingDialog(true);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      setSelectedFile(files[0]);
      initializeMappings();
      setShowMappingDialog(true);
    }
  };

  const initializeMappings = () => {
    // Auto-suggest mappings based on column names
    const autoMappings: FileMapping[] = mockColumns.map(col => {
      let target = 'ignore';
      const colLower = col.toLowerCase();
      
      if (colLower.includes('store') && colLower.includes('code')) target = 'outlet_id';
      else if (colLower.includes('store') && colLower.includes('name')) target = 'outlet_name';
      else if (colLower.includes('salesman') || colLower.includes('dsr')) target = 'dsr_id';
      else if (colLower.includes('sku') || colLower.includes('product')) target = 'sku_id';
      else if (colLower.includes('qty') || colLower.includes('quantity')) target = 'quantity';
      else if (colLower.includes('amount') || colLower.includes('revenue')) target = 'revenue';
      else if (colLower.includes('date')) target = 'date';
      else if (colLower.includes('channel')) target = 'channel';
      
      return { sourceColumn: col, targetField: target };
    });
    
    setMappings(autoMappings);
  };

  const updateMapping = (sourceColumn: string, targetField: string) => {
    setMappings(prev => 
      prev.map(m => m.sourceColumn === sourceColumn ? { ...m, targetField } : m)
    );
  };

  const handleUpload = async () => {
    setUploadStatus('processing');
    
    // Simulate upload processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploadStatus('success');
    setShowMappingDialog(false);
    
    toast({
      title: 'Upload successful',
      description: 'File has been accepted for processing. Data will be available shortly.',
    });
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setMappings([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Data</h1>
        <p className="text-muted-foreground">
          Import sales data, outlet information, or DSR updates via CSV files
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Drag and drop your CSV file or click to browse. Maximum file size: 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadStatus === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload Successful
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {selectedFile?.name} has been accepted for processing. 
                The data will be validated and available in your dashboard shortly.
              </p>
              <Button onClick={resetUpload}>Upload Another File</Button>
            </div>
          ) : (
            <div
              className={cn(
                'relative border-2 border-dashed rounded-lg transition-colors',
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50',
                'cursor-pointer'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center py-12">
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full mb-4 transition-colors',
                  dragActive ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <Upload className={cn(
                    'h-6 w-6',
                    dragActive ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
                
                <p className="text-foreground font-medium mb-1">
                  {dragActive ? 'Drop your file here' : 'Drag & drop your CSV file'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse from your computer
                </p>
                
                <Button variant="outline" size="sm">
                  Select File
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload History / Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supported File Formats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Sales Data', description: 'Daily/weekly sales transactions', columns: 'outlet_id, sku_id, quantity, revenue, date' },
              { name: 'Outlet Master', description: 'Outlet information updates', columns: 'outlet_id, name, address, channel, dsr_id' },
              { name: 'DSR Updates', description: 'Territory and assignment changes', columns: 'dsr_id, name, phone, territory_id' },
            ].map((format, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{format.name}</p>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Required: {format.columns}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'sales_jan_2024.csv', date: '2 hours ago', status: 'success', rows: 1234 },
                { name: 'outlet_master_update.csv', date: 'Yesterday', status: 'success', rows: 89 },
                { name: 'weekly_report.csv', date: '3 days ago', status: 'error', rows: 0 },
              ].map((upload, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      upload.status === 'success' ? 'bg-success/10' : 'bg-destructive/10'
                    )}>
                      {upload.status === 'success' 
                        ? <CheckCircle className="h-4 w-4 text-success" />
                        : <AlertCircle className="h-4 w-4 text-destructive" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{upload.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {upload.date} • {upload.rows > 0 ? `${upload.rows} rows` : 'Failed'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Column Mapping Dialog */}
      <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Map CSV Columns</DialogTitle>
            <DialogDescription>
              Match your CSV columns to the required data fields. We've auto-detected some mappings for you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4 max-h-[400px] overflow-y-auto">
            {mappings.map((mapping, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{mapping.sourceColumn}</p>
                  <p className="text-xs text-muted-foreground">CSV Column</p>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                
                <div className="flex-1">
                  <Select
                    value={mapping.targetField}
                    onValueChange={(value) => updateMapping(mapping.sourceColumn, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_FIELDS.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={uploadStatus === 'processing'}
              className="gap-2"
            >
              {uploadStatus === 'processing' ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  Upload File
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
