export function exportarCSV(datos: Record<string, unknown>[], nombre: string) {
    if (datos.length === 0) return;

    const headers = Object.keys(datos[0]);
    const filas = datos.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));

    const csv = [headers.join(','), ...filas].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportarPDF(elementId: string, nombre: string) {
    const contenido = document.getElementById(elementId);
    if ( !contenido ) return;

    const ventana = window.open('', '_blank');
    if (!ventana) return;

    ventana.document.write(`
        <html>
            <head>
                <title>${nombre}</title>
                 <style>
                    body { font-family: Poppins; padding: 20px; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                    th { background: linear-gradient(135deg, #f97316, #e53e6d); color: white; padding: 10px; text-align: left; font-size: 12px; }
                    td { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 12px; }
                    tr:nth-child(even) { background: #fafafa; }
                    h1 { color: #e53e6d; font-size: 20px; }
                    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>SIGELARED — ${nombre}</h1>
                <p style="color:#888; font-size:12px">Generado el ${new Date().toLocaleString('es-MX')}</p>
                    ${contenido.innerHTML}
            </body>
        </html>
    `);
    ventana.document.close();
    ventana.print();
}