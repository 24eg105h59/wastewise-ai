export const downloadAuditReport = (inventory: any[], wasteRecords: any[] = [], businessName = 'HD Bakers') => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const timeStr = today.toLocaleTimeString();

  const getDaysDiff = (dateStr: string) => {
    if (!dateStr) return 999;
    const d = new Date(dateStr);
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 3600 * 24));
  };

  const expiredItems = inventory.filter(i => getDaysDiff(i.expiryDate) < 0);
  const criticalItems = inventory.filter(i => {
    const diff = getDaysDiff(i.expiryDate);
    return diff >= 0 && diff <= 3;
  });
  const upcomingItems = inventory.filter(i => {
    const diff = getDaysDiff(i.expiryDate);
    return diff > 3 && diff <= 7;
  });

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.price || 150)), 0);
  const totalWasteLoss = wasteRecords.reduce((sum, r) => sum + (r.estimatedValue || 0), 0);

  let csv = `WASTEWISE AI - EXECUTIVE FOOD SAFETY & INVENTORY AUDIT REPORT\r\n`;
  csv += `Organization:,"${businessName}"\r\n`;
  csv += `Generated Date:,"${dateStr} ${timeStr}"\r\n`;
  csv += `Audit Status:,"COMPLIANT & ACTIVE"\r\n\r\n`;

  csv += `EXECUTIVE SUMMARY METRICS\r\n`;
  csv += `Metric,Value\r\n`;
  csv += `Total Active Products Monitored,${inventory.length}\r\n`;
  csv += `Estimated Active Inventory Value,₹${totalValue.toLocaleString()}\r\n`;
  csv += `Expired Items Requiring Immediate Disposal,${expiredItems.length}\r\n`;
  csv += `Urgent Items Expiring Within 72 Hours (Critical FEFO),${criticalItems.length}\r\n`;
  csv += `Items Expiring Within 4-7 Days (Warning),${upcomingItems.length}\r\n`;
  csv += `Historical Recorded Waste Loss,₹${totalWasteLoss.toLocaleString()}\r\n\r\n`;

  csv += `LIVE INVENTORY AUDIT SHEET\r\n`;
  csv += `Product Name,Brand,Category,Quantity,Unit,Unit Price (₹),Total Value (₹),Expiry Date,Days Remaining,Risk Level,Storage Location\r\n`;

  inventory.forEach(item => {
    const days = getDaysDiff(item.expiryDate);
    const daysLabel = days < 0 ? `EXPIRED (${Math.abs(days)}d ago)` : `${days} days`;
    const itemVal = item.quantity * (item.price || 150);
    const cat = item.category?.name || 'Uncategorized';
    const store = item.storageLocation?.name || 'Main Storage';
    const cleanName = (item.name || '').replace(/"/g, '""');
    const cleanBrand = (item.brand || 'Unknown').replace(/"/g, '""');
    const expDate = item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : 'N/A';

    csv += `"${cleanName}","${cleanBrand}","${cat}",${item.quantity},"${item.unit || 'units'}",${item.price || 150},${itemVal},"${expDate}","${daysLabel}","${item.riskLevel || 'LOW'}","${store}"\r\n`;
  });

  if (wasteRecords.length > 0) {
    csv += `\r\nHISTORICAL WASTE & DISPOSAL LOG\r\n`;
    csv += `Discarded Product,Quantity,Reason,Estimated Loss (₹),Logged Date,Notes\r\n`;
    wasteRecords.forEach(w => {
      const pName = (w.product?.name || 'Unknown Product').replace(/"/g, '""');
      const logDate = w.createdAt ? new Date(w.createdAt).toISOString().split('T')[0] : 'N/A';
      const cleanReason = (w.reason || 'Expired').replace(/"/g, '""');
      const cleanNotes = (w.notes || '').replace(/"/g, '""');
      csv += `"${pName}",${w.quantity},"${cleanReason}",${w.estimatedValue || 0},"${logDate}","${cleanNotes}"\r\n`;
    });
  }

  // Trigger file download in browser
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `WasteWise_Audit_Report_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
