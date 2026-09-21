process.env['AXC_LOCAL_RUNTIME'] = '1';
process.env['AXC_ENVIRONMENT'] ??= 'local';
await import('./index.ts');
