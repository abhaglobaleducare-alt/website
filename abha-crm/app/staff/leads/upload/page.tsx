'use client';

import Link from 'next/link';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';

interface PreviewRow {
  'Full Name': string;
  Phone: string;
  'Parent Phone'?: string;
  Email?: string;
  City?: string;
  'NEET Score'?: number;
  Source?: string;
  Error?: string;
}

export default function LeadsUploadPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [errors, setErrors] = useState<{ row: number; error: string }[]>([]);

  const downloadTemplate = () => {
    const template = [
      {
        'Full Name': 'Priya Patil',
        Phone: '+91 9876543210',
        'Parent Phone': '+91 9876543211',
        Email: 'priya@example.com',
        City: 'Kolhapur',
        State: 'Maharashtra',
        'NEET Score': 450,
        'NEET Year': 2026,
        Interest: 'mbbs_abroad_georgia',
        'Preferred Country': 'Georgia',
        Source: 'walk-in',
        Notes: 'Interested in EEU',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    XLSX.writeFile(workbook, 'leads_template.xlsx');
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('');
    setPreview([]);
    setErrors([]);
    setSelectedFile(file);
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const validRows = [];
      const errorsList: { row: number; error: string }[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const fullName = String(row['Full Name'] ?? row['full_name'] ?? '').trim();
        const phone = String(row['Phone'] ?? row['phone'] ?? '').trim();

        if (!fullName || !phone) {
          errorsList.push({ row: i + 2, error: 'Missing Full Name or Phone' });
          continue;
        }

        validRows.push({
          'Full Name': fullName,
          Phone: phone,
          'Parent Phone': String(row['Parent Phone'] ?? row['parent_phone'] ?? '').trim(),
          Email: String(row['Email'] ?? row['email'] ?? '').trim(),
          City: String(row['City'] ?? row['city'] ?? '').trim(),
          State: String(row['State'] ?? row['state'] ?? '').trim(),
          'NEET Score': Number(row['NEET Score'] ?? row['neet_score'] ?? 0) || undefined,
          Source: String(row['Source'] ?? row['source'] ?? 'excel_upload').trim(),
        });
      }

      setPreview(validRows);
      setErrors(errorsList);
      setStatus(`${validRows.length} valid rows ready to upload.`);
    } catch {
      setStatus('Failed to parse Excel file.');
    }

    setLoading(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || preview.length === 0) {
      setStatus('No valid rows to upload.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('/api/leads/bulk', {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    setLoading(false);

    if (json.ok) {
      setStatus(`Successfully imported ${json.inserted} leads!`);
      setPreview([]);
      setSelectedFile(null);
    } else {
      setStatus(json.error ?? 'Upload failed.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Lead Management</p>
            <h1 className="mt-2 text-3xl font-semibold">Bulk lead upload</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Import multiple leads from an Excel file. Download the template to get started.
            </p>
          </div>
          <Link href="/staff/leads">
            <Button variant="ghost">Back to leads</Button>
          </Link>
        </header>

        <Card>
          <h2 className="text-xl font-semibold">Upload leads</h2>

          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={downloadTemplate} variant="ghost">
                Download template
              </Button>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Select file (.xlsx)
                <input
                  type="file"
                  accept=".xlsx"
                  className="sr-only"
                  onChange={handleFileSelect}
                  disabled={loading}
                />
              </label>
            </div>

            {errors.length > 0 && (
              <div className="rounded-3xl border border-red-700 bg-red-500/10 p-4 text-sm text-red-200">
                <p className="font-semibold">Errors found:</p>
                {errors.map((err, i) => (
                  <p key={i}>
                    Row {err.row}: {err.error}
                  </p>
                ))}
              </div>
            )}

            {preview.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  Preview ({preview.length} rows ready to upload):
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-700">
                      <tr>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Phone</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">City</th>
                        <th className="px-3 py-2 text-left">NEET Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-b border-slate-800">
                          <td className="px-3 py-2">{row['Full Name']}</td>
                          <td className="px-3 py-2">{row.Phone}</td>
                          <td className="px-3 py-2 text-slate-400">{row.Email || '-'}</td>
                          <td className="px-3 py-2 text-slate-400">{row.City || '-'}</td>
                          <td className="px-3 py-2 text-slate-400">{row['NEET Score'] || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {preview.length > 10 && (
                  <p className="text-xs text-slate-400">...and {preview.length - 10} more rows</p>
                )}

                <div className="flex flex-wrap gap-3">
                  {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
                  <Button onClick={handleUpload} disabled={loading}>
                    {loading ? 'Uploading…' : 'Confirm & Import'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
